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
            "google/gemma-3-27b-it:free",           // Reliable, high quality
            "nvidia/nemotron-3-nano-30b-a3b:free",  // Very reliable fallback
            "liquid/lfm-2.5-1.2b-thinking:free",    // Thinking model (slower, moved down)
            "arcee-ai/trinity-large-preview:free",  // Large preview
            "qwen/qwen-2.5-72b-instruct:free",      // Strong alternative
            "mistralai/pixtral-12b:free",           // Good instruction following
            "google/gemini-2.0-flash-exp:free"      // Fast fallback
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

                if (response.ok && data.choices && data.choices[0]?.message?.content?.trim()) {
                    // Success! Return the response
                    return NextResponse.json(data);
                } else {
                    console.warn(`Model ${model} failed or returned empty content:`, data.error || 'Empty content');
                    lastError = data.error?.message || `El modelo ${model} devolvió una respuesta vacía.`;
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
