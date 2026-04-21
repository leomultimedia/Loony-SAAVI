import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    if (!tenantId) return NextResponse.json({ error: 'tenantId required' }, { status: 400 });
    try {
        const users = await prisma.salesUser.findMany({
            where: { tenantId },
            include: { _count: { select: { leads: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(users);
    } catch {
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const user = await prisma.salesUser.create({
        data: {
            tenantId: body.tenantId,
            name: body.name,
            email: body.email,
            phone: body.phone || null,
            role: body.role || 'SALES_REP',
        },
    });
    return NextResponse.json(user);
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await prisma.salesUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
