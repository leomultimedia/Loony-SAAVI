import { NextResponse } from 'next/server';

// Local inference stub - routes to Ollama or Groq depending on tenant config
async function runInference(prompt: string, model: string = 'llama3'): Promise<string> {
    try {
        const endpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
        const res = await fetch(`${endpoint}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt, stream: false }),
        });
        const data = await res.json();
        return data.response || '[No response from model]';
    } catch {
        return `[Inference stub: ${model}] Simulated response for: ${prompt.slice(0, 60)}`;
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await runInference(body.prompt, body.model || 'llama3');
        return NextResponse.json({ response: result, model: body.model || 'llama3' });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
