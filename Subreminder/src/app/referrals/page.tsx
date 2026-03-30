import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReferralsClient from "./ReferralsClient";

export default async function ReferralsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }
    const userId = (session.user as any).id;
    const userProfile = await prisma.user.findUnique({
        where: { id: userId },
    });
    
    const referralsCount = (userProfile as any)?.referralsCount || 0;

    return <ReferralsClient referralsCount={referralsCount} />;
}
