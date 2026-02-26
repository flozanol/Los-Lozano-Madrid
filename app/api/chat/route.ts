import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
        }

        // List of free fallback models provided by the user + current one
        const models = [
            "liquid/lfm-2.5-1.2b-thinking:free",   // High quality thinking model
            "google/gemma-3-27b-it:free",           // Current model
            "arcee-ai/trinity-large-preview:free", // Large preview
            "liquid/lfm-2.5-1.2b-instruct:free",   // Fast instruct model
            "nvidia/nemotron-3-nano-30b-a3b:free",  // Reliable fallback
            "arcee-ai/trinity-mini:free"           // Lightweight fallback
        ];

        const systemPersona = "INSTRUCCIONES DE IDENTIDAD: Eres 'Chulapo', el asistente virtual de la familia Lozano en su viaje a Madrid 2026. Eres un experto en Madrid, conoces todos los rincones, historias y los mejores sitios para comer (especialmente Casa Lucio y San Ginés). Tu tono es alegre, servicial, un poco castizo pero muy educado. Siempre ayudas a la familia Lozano a que su viaje sea inolvidable. RESPONDE SIEMPRE EN ESPAÑOL Y DE FORMA CONCISA.";

        // For robustness across different model prompt formats, we'll try a standard chat format first
        // Most OpenRouter free models now handle multi-turn chat well.
        const chatMessages = [
            { role: "system", content: systemPersona },
            ...messages.slice(-5) // Keep last 5 messages for context
        ];

        let lastError = null;

        // Try each model until one succeeds
        for (const model of models) {
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://los-lozano-madrid.vercel.app",
                        "X-Title": "Los Lozano Madrid",
                    },
                    body: JSON.stringify({
                        "model": model,
                        "messages": chatMessages,
                        "temperature": 0.7,
                        "max_tokens": 500
                    })
                });

                const data = await response.json();

                if (response.ok && data.choices && data.choices[0]) {
                    // Success! Return the response with the model name for debugging if needed
                    return NextResponse.json(data);
                } else {
                    console.warn(`Model ${model} failed:`, data.error || 'Unknown error');
                    lastError = data.error?.message || `Error with model ${model}`;
                }
            } catch (err) {
                console.error(`Fetch error for model ${model}:`, err);
                lastError = "Connection error";
            }
        }

        // if all models failed
        return NextResponse.json({
            error: lastError || 'Todos los modelos de Chulapo están ocupados ahora mismo.',
            status: 503
        }, { status: 503 });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Error interno en el servidor de chat.' }, { status: 500 });
    }
}
