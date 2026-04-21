import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const tenants = await prisma.tenant.findMany({
            include: { subEntities: true }
        });
        return NextResponse.json(tenants);
    } catch (e) {
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const tenant = await prisma.tenant.create({
            data: {
                name: body.name,
                email: body.email,
                subscriptionTier: body.tier || 'PRO',
                isMaster: body.isMaster || false,
                parentId: body.parentId || null,
                status: 'Active',
                customApiKeys: JSON.stringify({
                    groq: body.groqKey,
                    hubspot: body.hubspotKey
                })
            }
        });
        return NextResponse.json(tenant);
    } catch (e: any) {
        if (e.code === 'P2002') {
            return NextResponse.json({ error: 'Entity name must be unique globally' }, { status: 400 });
        }
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
