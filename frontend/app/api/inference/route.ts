import { NextResponse } from 'next/server';
import { ModelRouter } from '../../../packages/core/ModelRouter';

const router = new ModelRouter(
    process.env.OLLAMA_ENDPOINT || 'http://localhost:11434',
    process.env.GROQ_API_KEY || ''
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await router.execute(body.prompt, body.tenantId, body.context);
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
