import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /api/leads/[id] — assign agent, sales user, update status
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.json();

    const lead = await prisma.lead.update({
        where: { id },
        data: {
            ...(body.status && { status: body.status }),
            ...(body.agentId !== undefined && { agentId: body.agentId }),
            ...(body.salesUserId !== undefined && { salesUserId: body.salesUserId }),
            ...(body.aiScore !== undefined && { aiScore: body.aiScore }),
            ...(body.chatLog !== undefined && { chatLog: JSON.stringify(body.chatLog) }),
            ...(body.meetingDate && { meetingDate: body.meetingDate }),
            ...(body.meetingLink && { meetingLink: body.meetingLink }),
        },
        include: { agent: true, salesUser: true },
    });
    return NextResponse.json(lead);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
