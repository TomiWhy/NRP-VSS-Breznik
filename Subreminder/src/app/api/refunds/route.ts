import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const refunds = await prisma.refundRequest.findMany({
        where: { userId: (session.user as any).id },
        include: { subscription: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(refunds);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { subscriptionId, reason, amount } = await req.json();

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return NextResponse.json({ error: "Amount must be greater than zero." }, { status: 400 });
        }

        const subscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId }
        });

        if (!subscription) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        // Draft the email template using Gemini AI
        const prompt = `
Write a professional, empathetic, and persuasive email to request a refund for a service subscription.
The provider supports the user who has cancelled due to a specific reason.

Details:
Service Name: ${subscription.name}
Subscriber Name: ${session.user?.name || "Customer"}
Subscriber Email: ${session.user?.email || "Email"}
Refund Amount Requested: $${amount}
Reason for Refund: ${reason}

Instructions:
- The email must be addressed to the ${subscription.name} Support Team.
- Keep the tone formal yet persuasive.
- Mention the requested refund amount clearly.
- Briefly and politely explain the reason for the refund request.
- Ensure the email looks ready-to-send without any placeholders. Do not include markdown formatting or [Insert Text] fields. Just pure plain text email format.
- Do NOT include any 'Subject:' line in the output, just the body of the email. I will add the subject programmatically.
        `;

        let generatedBody = "";
        try {
            const result = await model.generateContent(prompt);
            generatedBody = result.response.text().trim() || "Failed to generate text.";
        } catch (genError) {
            console.error("Gemini AI failed to generate email draft:", genError);
            generatedBody = `Dear ${subscription.name} Support Team,\n\nI am writing to formally request a refund for my recent subscription payment of $${amount}.\nReason: ${reason}\n\nAccount Details:\n- Name: ${session.user?.name}\n- Email: ${session.user?.email}\n\nThank you.\n\nBest regards,\n${session.user?.name}`;
        }

        const emailTemplate = `Subject: Refund Request - ${subscription.name} - Account: ${session.user?.email}

${generatedBody}`;

        const refund = await prisma.refundRequest.create({
            data: {
                subscriptionId,
                userId: (session.user as any).id,
                status: "pending",
                amountRequested: parsedAmount,
                reason: reason,
                emailDraft: emailTemplate,
            },
        });

        return NextResponse.json(refund, { status: 201 });
    } catch (error) {
        console.error("Failed to create refund request:", error);
        return NextResponse.json({ error: "Failed to create refund request" }, { status: 500 });
    }
}
