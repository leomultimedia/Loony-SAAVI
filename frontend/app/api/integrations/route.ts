import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    if (!tenantId) return NextResponse.json({ error: 'tenantId required' }, { status: 400 });

    const plugins = ['WHATSAPP', 'HUBSPOT', 'GSHEET', 'CALCOM', 'STRIPE', 'VAPI', 'GROQ', 'OLLAMA'];
    try {
        await Promise.all(plugins.map(plugin =>
            prisma.integration.upsert({
                where: { tenantId_plugin: { tenantId, plugin } },
                update: {},
                create: { tenantId, plugin, isEnabled: false, config: '{}' },
            })
        ));
        const integrations = await prisma.integration.findMany({ where: { tenantId } });
        return NextResponse.json(integrations);
    } catch {
        return NextResponse.json([]);
    }
}

export async function PATCH(req: Request) {
    const body = await req.json();
    const { tenantId, plugin, isEnabled, config } = body;

    const integration = await prisma.integration.upsert({
        where: { tenantId_plugin: { tenantId, plugin } },
        update: {
            ...(isEnabled !== undefined && { isEnabled }),
            ...(config !== undefined && { config: JSON.stringify(config) }),
        },
        create: { tenantId, plugin, isEnabled: isEnabled ?? false, config: config ? JSON.stringify(config) : '{}' },
    });

    return NextResponse.json(integration);
}
