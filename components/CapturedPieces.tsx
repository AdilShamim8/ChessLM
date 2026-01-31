'use client';

import { useChessStore } from '@/lib/chess-store';
import { Card } from '@/components/ui/card';

const PIECE_SYMBOLS: Record<string, string> = {
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
    P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
};

interface CapturedPiecesProps {
    color: 'white' | 'black';
}

export default function CapturedPieces({ color }: CapturedPiecesProps) {
    const capturedPieces = useChessStore(state => state.gameState.capturedPieces[color]);

    if (!capturedPieces || capturedPieces.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-0.5 mt-1 opacity-80">
            {capturedPieces.map((piece, i) => (
                <span
                    key={i}
                    className={`text-xl drop-shadow-sm select-none transition-all hover:scale-110 ${color === 'white' ? 'text-slate-400' : 'text-slate-200'
                        }`}
                    title={piece}
                >
                    {PIECE_SYMBOLS[piece] || piece}
                </span>
            ))}
        </div>
    );
}
