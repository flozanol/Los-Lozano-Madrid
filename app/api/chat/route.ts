import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://los-lozano-madrid.vercel.app", // Optional
                "X-Title": "Los Lozano Madrid", // Optional
            },
            body: JSON.stringify({
                "model": "google/gemma-3-27b-it:free",
                "messages": [
                    {
                        "role": "system",
                        "content": "Eres 'Chulapo', el asistente virtual de la familia Lozano en su viaje a Madrid 2026. Eres un experto en Madrid, conoces todos los rincones, historias y los mejores sitios para comer (especialmente Casa Lucio y San Ginés). Tu tono es alegre, servicial, un poco castizo pero muy educado. Siempre ayudas a la familia Lozano a que su viaje sea inolvidable."
                    },
                    ...messages
                ],
            })
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
