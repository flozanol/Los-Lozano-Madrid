import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
        }

        // Persona prompt to be injected as instructions in the first user message
        const systemPersona = "INSTRUCCIONES DE IDENTIDAD: Eres 'Chulapo', el asistente virtual de la familia Lozano en su viaje a Madrid 2026. Eres un experto en Madrid, conoces todos los rincones, historias y los mejores sitios para comer (especialmente Casa Lucio y San Ginés). Tu tono es alegre, servicial, un poco castizo pero muy educado. Siempre ayudas a la familia Lozano a que su viaje sea inolvidable. RESPONDE SIEMPRE EN ESPAÑOL.";

        // For models that don't support 'system' role, we prepend the instructions to the last user message
        // or the first one. Here we'll wrap the whole history in a way that works for Gemma.
        const formattedMessages = [
            {
                role: "user",
                content: `${systemPersona}\n\nPregunta del usuario: ${messages[messages.length - 1].content}`
            }
        ];

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://los-lozano-madrid.vercel.app",
                "X-Title": "Los Lozano Madrid",
            },
            body: JSON.stringify({
                "model": "google/gemma-3-27b-it:free",
                "messages": formattedMessages,
                "temperature": 0.7,
                "max_tokens": 1000
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('OpenRouter/Model Error:', data);
            // Fallback if Gemma 3 is failing or rate limited
            return NextResponse.json({
                error: data.error?.message || 'Error de comunicación con el asistente.',
                status: response.status
            }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Error interno en el servidor de chat.' }, { status: 500 });
    }
}
