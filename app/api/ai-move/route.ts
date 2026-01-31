import { NextRequest, NextResponse } from 'next/server';
import { Chess } from 'chess.js';
import { getAIMove } from '@/lib/ai-providers';

export async function POST(request: NextRequest) {
    try {
        const { fen, provider, moveHistory } = await request.json();

        if (!fen || !provider) {
            return NextResponse.json(
                { error: 'Missing fen or provider' },
                { status: 400 }
            );
        }

        const game = new Chess(fen);
        const moves = game.moves({ verbose: true });
        // IMPORTANT: UCI format is required for the AI prompts
        const legalMoves = moves.map(m => m.from + m.to + (m.promotion || ''));

        if (legalMoves.length === 0) {
            return NextResponse.json(
                { error: 'No legal moves available' },
                { status: 400 }
            );
        }

        const result = await getAIMove(provider, fen, legalMoves, moveHistory || []);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('AI Move API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
