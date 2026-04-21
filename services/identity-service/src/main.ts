// e:\SAAVI\Repo\services\identity-service\src\main.ts
// Clean Architecture: Identity & SaaS Management Service

import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// Domain Models
interface TenantParams {
    tenantId: string;
    markupPercent: number;
    billingTier: 'Free' | 'Pro' | 'Enterprise';
}

// Controller Logic
app.post('/identity/tenant/onboard', (req: Request, res: Response) => {
    const { tenantId, markupPercent, billingTier }: TenantParams = req.body;

    // Call Use-Case: CreateTenantWithResellerMarkup
    try {
        const result = createTenantUseCase(tenantId, markupPercent, billingTier);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: "Failed to provision tenant." });
    }
});

// Use-Case Layer
function createTenantUseCase(id: string, markup: number, tier: string) {
    // Isolated DB logic here (Prisma/TypeORM to local identity DB)
    console.log(`Provisioning Tenant [${id}] on ${tier} tier with ${markup}% margin.`);
    return {
        tenantId: id,
        baseCost: tier === 'Enterprise' ? 1000 : 100,
        endUserPrice: calculateEndUserPrice(tier === 'Enterprise' ? 1000 : 100, markup),
        sso_enabled: tier === 'Enterprise',
        model_swapper_enabled: tier !== 'Free'
    };
}

// Domain Logic
function calculateEndUserPrice(baseCost: number, markupPercent: number): number {
    return baseCost + (baseCost * (markupPercent / 100));
}

app.listen(3001, () => {
    console.log("🚀 Identity & SaaS Service listening on Port 3001");
});
