import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is missing in environment variables.");
        return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
    }

    try {
        const { refundId } = await req.json();

        const refund = await prisma.refundRequest.findUnique({
            where: { id: refundId },
            include: { 
                subscription: true,
                user: true
            }
        });

        if (!refund || refund.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Refund request not found." }, { status: 404 });
        }

        // ==========================================
        // ACTUAL EMAIL DISPATCH VIA RESEND
        // ==========================================
        try {
            await resend.emails.send({
                from: "Refunds Assistant <onboarding@resend.dev>", // Using Resend trial domain
                to: refund.subscription.providerEmail,
                replyTo: session.user?.email || "",
                subject: `Refund Request: ${refund.subscription.name}`,
                text: refund.emailDraft,
            });
            console.log(`[RESEND] Email sent to ${refund.subscription.providerEmail}`);
        } catch (mailError) {
            console.error("Resend delivery failed:", mailError);
            return NextResponse.json({ error: "Mail delivery failed. Check your API key." }, { status: 500 });
        }

        // Update status to 'sent'
        const updatedRefund = await prisma.refundRequest.update({
            where: { id: refundId },
            data: { status: "sent" },
            include: { subscription: true }
        });

        return NextResponse.json(updatedRefund);
    } catch (error) {
        console.error("Failed to process refund email:", error);
        return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }
}
