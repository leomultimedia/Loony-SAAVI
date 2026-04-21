import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/leads?tenantId=xxx
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    if (!tenantId) return NextResponse.json({ error: 'tenantId required' }, { status: 400 });

    const leads = await prisma.lead.findMany({
        where: { tenantId },
        include: { agent: true, salesUser: true },
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(leads);
}

// POST /api/leads — create or bulk-import
export async function POST(req: Request) {
    const body = await req.json();
    const { tenantId, leads: bulk, ...single } = body;

    if (bulk && Array.isArray(bulk)) {
        // Bulk import from Excel/GSheet
        const created = await prisma.$transaction(
            bulk.map((l: any) => prisma.lead.upsert({
                where: { id: l.id || 'nonexistent' },
                update: {},
                create: {
                    tenantId,
                    name: l.name,
                    company: l.company || '',
                    phone: l.phone?.replace(/\d(?=\d{4})/g, '*') || '[REDACTED]', // PDPL mask
                    email: l.email ? l.email.replace(/(.{2}).+@/, '$1***@') : '',
                    source: l.source || 'EXCEL',
                    status: 'NEW',
                },
            }))
        );
        return NextResponse.json({ count: created.length });
    }

    // Single lead
    const lead = await prisma.lead.create({
        data: {
            tenantId,
            name: single.name,
            company: single.company,
            phone: single.phone?.replace(/\d(?=\d{4})/g, '*') || '[REDACTED]',
            email: single.email ? single.email.replace(/(.{2}).+@/, '$1***@') : '',
            source: single.source || 'MANUAL',
        },
    });
    return NextResponse.json(lead);
}
