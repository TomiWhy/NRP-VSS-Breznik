import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('demo123', 10);

    // Create demo user
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@subreminder.com' },
        update: {},
        create: {
            email: 'demo@subreminder.com',
            name: 'Demo User',
            passwordHash: passwordHash,
        },
    });

    const now = new Date();

    // Create subscriptions
    const subscriptions = [
        {
            name: 'Netflix',
            category: 'streaming',
            price: 15.49,
            currency: 'USD',
            billingInterval: 'monthly',
            renewalDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            usageLevel: 'high',
            providerEmail: 'support@netflix.com',
        },
        {
            name: 'Spotify',
            category: 'streaming',
            price: 10.99,
            currency: 'USD',
            billingInterval: 'monthly',
            renewalDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
            usageLevel: 'low',
            providerEmail: 'support@spotify.com',
        },
        {
            name: 'Notion',
            category: 'productivity',
            price: 96.00,
            currency: 'USD',
            billingInterval: 'yearly',
            renewalDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
            usageLevel: 'high',
            providerEmail: 'support@notion.so',
        },
        {
            name: 'Coursera',
            category: 'education',
            price: 49.00,
            currency: 'USD',
            billingInterval: 'monthly',
            renewalDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
            usageLevel: 'medium',
            providerEmail: 'support@coursera.org',
        },
        {
            name: 'Gym App',
            category: 'fitness',
            price: 299.00,
            currency: 'USD',
            billingInterval: 'yearly',
            renewalDate: new Date(now.getTime() + 100 * 24 * 60 * 60 * 1000), // 100 days from now
            usageLevel: 'medium',
            providerEmail: 'support@gymapp.com',
        },
    ];

    for (const sub of subscriptions) {
        const createdSub = await prisma.subscription.create({
            data: {
                ...sub,
                userId: demoUser.id,
            },
        });

        // Add some refund requests for Netflix and Spotify
        if (sub.name === 'Netflix') {
            await prisma.refundRequest.create({
                data: {
                    userId: demoUser.id,
                    subscriptionId: createdSub.id,
                    status: 'approved',
                    amountRequested: 15.49,
                    reason: 'Service was not used for the last two billing cycles.',
                    emailDraft: '...',
                    commissionFee: 3.87,
                    updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Approved 2 days ago
                }
            });
        }

        if (sub.name === 'Spotify') {
            await prisma.refundRequest.create({
                data: {
                    userId: demoUser.id,
                    subscriptionId: createdSub.id,
                    status: 'sent',
                    amountRequested: 10.99,
                    reason: 'Accidental renewal after cancellation.',
                    emailDraft: '...',
                    updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Sent 1 day ago
                }
            });
        }
    }

    console.log('Seed data created with Refunds successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
