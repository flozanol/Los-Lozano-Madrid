import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error('AI Chat Error: OPENROUTER_API_KEY is missing in .env.local');
            return NextResponse.json({ error: 'CONFIG_ERROR', message: 'API key not configured' }, { status: 500 });
        }

        // We use openrouter/auto to find the best available model (often free if credits are low)
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/OpenRouterTeam/openrouter-docs", // Required for some free models
                "X-Title": "Los Lozano Madrid Travel Guide",
            },
            body: JSON.stringify({
                "model": "openrouter/auto",
                "messages": [
                    {
                        "role": "system",
                        "content": "Eres el guía experto de la familia Lozano para su viaje a Madrid del 26 de marzo al 6 de abril. Responde de forma amable, cercana y con un toque de humor madrileño. Conoces bien la historia, los mejores restaurantes y lugares secretos de la ciudad. Ayúdales a resolver dudas sobre transporte, clima y qué hacer en cada día de su itinerario."
                    },
                    ...messages
                ],
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('OpenRouter API Response Error:', data);
            // Specifically handle 402 Payment Required for OpenRouter
            if (response.status === 402) {
                return NextResponse.json({
                    role: 'assistant',
                    content: '¡Hola familia! Parece que mi bono de transporte (créditos de IA) se ha agotado. Por favor, recargad mi cuenta en OpenRouter para que pueda seguiros contando los secretos de Madrid.'
                });
            }
            return NextResponse.json({ error: 'API_ERROR', details: data }, { status: response.status });
        }

        if (!data.choices || !data.choices[0]) {
            console.error('Malformed OpenRouter Response:', data);
            return NextResponse.json({ error: 'PARSE_ERROR' }, { status: 500 });
        }

        return NextResponse.json(data.choices[0].message);
    } catch (error) {
        console.error('Critical Chat API Route Error:', error);
        return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
    }
}
