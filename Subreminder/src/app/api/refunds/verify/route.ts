import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: "AI service not configured." }, { status: 500 });
    }

    try {
        const { refundId, mailContent } = await req.json();

        const refund = await prisma.refundRequest.findUnique({
            where: { id: refundId },
            include: { subscription: true }
        });

        if (!refund || refund.userId !== (session.user as any).id) {
            return NextResponse.json({ error: "Refund request not found." }, { status: 404 });
        }

        // Initialize Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are a refund verification assistant for a SaaS platform called SubReminder.
            Your task is to analyze an email response from a service provider (like Netflix, Spotify, etc.) 
            and determine if a refund has been approved, rejected, or if more information is needed.

            Email Content:
            """
            ${mailContent}
            """

            Rules:
            1. Determine the status: "approved" (if they say they will refund money), "rejected" (if they refuse), or "pending" (if they asked for more info).
            2. If approved, extract the exact refund amount. If no specific amount is mentioned, use the original requested amount: ${refund.amountRequested}.
            3. Return ONLY a valid JSON object in this format:
            {
                "status": "approved" | "rejected" | "pending",
                "amount": number,
                "reason": "short explanation in English"
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        // Clean markdown code blocks if AI included them
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI returned invalid format");
        }
        
        const aiResult = JSON.parse(jsonMatch[0]);

        let finalStatus = refund.status;
        let updateData: any = {};

        if (aiResult.status === "approved") {
            finalStatus = "payment_pending";
            updateData.amountRequested = aiResult.amount;
            
            // Re-calculate commission fee
            const amt = aiResult.amount;
            let baseRate = 0.35;
            if (amt > 100) baseRate = 0.15;
            else if (amt > 50) baseRate = 0.20;
            else if (amt > 20) baseRate = 0.25;
            
            const user = await prisma.user.findUnique({ where: { id: refund.userId } });
            const discount = Math.floor((user?.referralsCount || 0) / 10) * 0.005;
            const finalRate = Math.max(0.05, baseRate - discount);
            updateData.commissionFee = amt * finalRate;
        } else if (aiResult.status === "rejected") {
            finalStatus = "rejected";
        }

        const updatedRefund = await prisma.refundRequest.update({
            where: { id: refundId },
            data: {
                ...updateData,
                status: finalStatus
            },
            include: { subscription: true }
        });

        // Try to unlock account if no other overdue exists
        const userId = (session.user as any).id;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const otherOverdue = await prisma.refundRequest.findFirst({
            where: {
                userId,
                OR: [
                    { status: "payment_pending", updatedAt: { lte: sevenDaysAgo } },
                    { status: "sent", updatedAt: { lte: sevenDaysAgo } }
                ],
                id: { not: refundId }
            }
        });

        if (!otherOverdue && (aiResult.status === "approved" || aiResult.status === "rejected")) {
            await prisma.user.update({
                where: { id: userId },
                data: { accountLocked: false }
            });
        }

        // Create Notification
        await prisma.notification.create({
            data: {
                userId,
                type: "refund",
                message: aiResult.status === "approved" 
                    ? `AI Verified! Your refund for ${refund.subscription.name} was approved. Please pay the fee to continue.` 
                    : `AI Verified: The refund for ${refund.subscription.name} was rejected by the provider.`
            }
        });

        return NextResponse.json({ 
            success: true, 
            result: aiResult,
            refund: updatedRefund
        });

    } catch (error) {
        console.error("AI Verification failed:", error);
        return NextResponse.json({ error: "AI Verification failed. Please try again or update manually." }, { status: 500 });
    }
}
