export interface AIResponse {
    move: string;
    reasoning?: string;
    error?: string;
}

const SYSTEM_PROMPT = `You are a Grandmaster-level chess engine. Your goal is to play the absolute best move in every position.

ANALYSIS GUIDELINES:
1. Material: Evaluate material imbalances.
2. Position: Assess king safety, piece activity, pawn structure, and key squares.
3. Tactics: Look for immediate tactical shots (forks, pins, skewers, discovered attacks).
4. Strategy: Formulate a long-term plan based on the position's needs.
5. Endgames: Use precise theoretical knowledge for endgame positions.

CRITICAL OUTPUT RULES:
1. Return ONLY the move in UCI format (e.g., "e2e4", "e7e8q", "e1g1").
2. DO NOT include reasoning, numbering, or quotes.
3. Choose ONLY from the provided legal moves.
4. If there is a forced mate, find the fastest mate.

Examples:
- Standard: e2e4
- Promotion: a7a8q
- Castling: e1g1 (Kingside), e1c1 (Queenside)`;

export async function getAIMove(
    provider: string,
    fen: string,
    legalMoves: string[],
    moveHistory: string[]
): Promise<AIResponse> {
    const userPrompt = `Position (FEN): ${fen}
Move History: ${moveHistory.join(', ') || 'Game start'}
Legal Moves (UCI): ${legalMoves.join(', ')}

Your move (UCI format only):`;

    try {
        switch (provider) {
            case 'openai':
                return await callOpenAI(userPrompt, legalMoves);
            case 'anthropic':
                return await callAnthropic(userPrompt, legalMoves);
            case 'google':
                return await callGoogle(userPrompt, legalMoves);
            case 'xai':
                return await callXAI(userPrompt, legalMoves);
            default:
                return { move: legalMoves[0], error: 'Unknown provider' };
        }
    } catch (error: any) {
        console.error(`AI Error (${provider}):`, error);
        return {
            move: legalMoves[Math.floor(Math.random() * legalMoves.length)],
            error: error.message
        };
    }
}

async function callOpenAI(prompt: string, legalMoves: string[]): Promise<AIResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 50
        })
    });

    const data = await response.json();
    const move = extractMove(data.choices?.[0]?.message?.content || '', legalMoves);
    return { move };
}

async function callAnthropic(prompt: string, legalMoves: string[]): Promise<AIResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY!,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 100,
            messages: [{
                role: 'user',
                content: `${SYSTEM_PROMPT}\n\n${prompt}`
            }]
        })
    });

    const data = await response.json();
    const move = extractMove(data.content?.[0]?.text || '', legalMoves);
    return { move };
}

async function callGoogle(prompt: string, legalMoves: string[]): Promise<AIResponse> {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 50
                }
            })
        }
    );

    const data = await response.json();
    const move = extractMove(data.candidates?.[0]?.content?.parts?.[0]?.text || '', legalMoves);
    return { move };
}

async function callXAI(prompt: string, legalMoves: string[]): Promise<AIResponse> {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'grok-beta',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8
        })
    });

    const data = await response.json();
    const move = extractMove(data.choices?.[0]?.message?.content || '', legalMoves);
    return { move };
}

function extractMove(aiResponse: string, legalMoves: string[]): string {
    const cleaned = aiResponse.trim().toLowerCase().replace(/['"`;.\s]/g, '');

    for (const move of legalMoves) {
        if (cleaned.includes(move)) return move;
    }

    const match = cleaned.match(/([a-h][1-8])([a-h][1-8])([qrbn])?/);
    if (match) {
        const candidateMove = match[1] + match[2] + (match[3] || '');
        if (legalMoves.includes(candidateMove)) return candidateMove;
    }

    // Fallback to random legal move if parsing fails
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
}
