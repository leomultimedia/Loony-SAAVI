import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AGENT_PERSONAS = {
    Leo:   { tone: 'Confident & Direct', speciality: 'Enterprise Deals', language: 'English', color: '#ef4444' },
    Eva:   { tone: 'Empathetic & Warm', speciality: 'SME Onboarding', language: 'English/Arabic', color: '#8b5cf6' },
    Lia:   { tone: 'Technical & Precise', speciality: 'ISO/Compliance', language: 'English', color: '#06b6d4' },
    James: { tone: 'Persuasive & Bold', speciality: 'Sales Closing', language: 'English', color: '#f59e0b' },
    Mary:  { tone: 'Friendly & Nurturing', speciality: 'Lead Qualification', language: 'English/Hindi', color: '#10b981' },
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    if (!tenantId) return NextResponse.json({ error: 'tenantId required' }, { status: 400 });
    try {
        await Promise.all(Object.entries(AGENT_PERSONAS).map(([name, persona]) =>
            prisma.agentConfig.upsert({
                where: { tenantId_agentName: { tenantId, agentName: name } },
                update: {},
                create: { tenantId, agentName: name, isActive: name === 'Leo', persona: JSON.stringify(persona), model: 'llama3' },
            })
        ));
        const agents = await prisma.agentConfig.findMany({ where: { tenantId } });
        return NextResponse.json(agents.map(a => ({ ...a, persona: JSON.parse(a.persona) })));
    } catch {
        return NextResponse.json([]);
    }
}

export async function PATCH(req: Request) {
    const body = await req.json();
    const { tenantId, agentName, isActive, model, vapiVoiceId } = body;

    const agent = await prisma.agentConfig.update({
        where: { tenantId_agentName: { tenantId, agentName } },
        data: {
            ...(isActive !== undefined && { isActive }),
            ...(model && { model }),
            ...(vapiVoiceId !== undefined && { vapiVoiceId }),
        },
    });
    return NextResponse.json(agent);
}
