import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Simple email transport for demo purposes
// In production, use environment variables for sensitive data
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export async function GET(req: Request) {
    // Simple "secret" check to avoid unauthorized runs if this was public
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        // Find active subscriptions renewing in the next 7 days
        const upcomingSubscriptions = await prisma.subscription.findMany({
            where: {
                status: "active",
                renewalDate: {
                    gte: today,
                    lte: nextWeek,
                },
            },
            include: {
                user: true,
            },
        });

        const notificationsCreated = [];

        for (const sub of upcomingSubscriptions) {
            // Check if a notification for this renewal was already sent in the last 7 days
            const existingNotification = await prisma.notification.findFirst({
                where: {
                    userId: sub.userId,
                    subscriptionId: sub.id,
                    createdAt: {
                        gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
            });

            if (!existingNotification) {
                // Create in-app notification if preferred
                if (sub.user.appNotifications) {
                    const notification = await prisma.notification.create({
                        data: {
                            userId: sub.userId,
                            subscriptionId: sub.id,
                            type: "renewal",
                            message: `Your ${sub.name} subscription is renewing on ${sub.renewalDate.toLocaleDateString()} ($${sub.price}).`,
                            read: false,
                        },
                    });
                    notificationsCreated.push(notification.id);
                }

                // Attempt to send email if preferred
                if (sub.user.email && sub.user.emailNotifications) {
                    try {
                        await transporter.sendMail({
                            from: process.env.EMAIL_FROM,
                            to: sub.user.email,
                            subject: `Reminder: ${sub.name} Subscription Renewal`,
                            text: `Hello ${sub.user.name || 'there'},\n\nThis is a reminder that your ${sub.name} subscription is set to renew on ${sub.renewalDate.toLocaleDateString()} for $${sub.price}.\n\nLog in to SubReminder to manage your subscriptions.`,
                        });
                    } catch (emailErr) {
                        console.error(`Failed to send email to ${sub.user.email}:`, emailErr);
                    }
                }

            }
        }

        return NextResponse.json({
            success: true,
            processed: upcomingSubscriptions.length,
            notificationsSent: notificationsCreated.length
        });
    } catch (error) {
        console.error("Cron job failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
