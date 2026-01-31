'use client';

import { useChessStore } from '@/lib/chess-store';
import { Card } from '@/components/ui/card';

const PIECE_SYMBOLS: Record<string, string> = {
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
    P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
};

export default function CapturedPieces() {
    const capturedPieces = useChessStore(state => state.gameState.capturedPieces);

    // Helper to render pieces
    // Note: Chess.js captures are usually lowercase (black pieces) or uppercase ?? 
    // Actually chess.js move.captured is always the lowercase symbol of the piece type (p, n, b, r, q).
    // But conventionally:
    // White captured pieces -> Black pieces (should use black symbols?)
    // Black captured pieces -> White pieces (should use white symbols?)
    // Let's stick to generic symbols or specific ones. 
    // If we want to show "White Captured", we typically show the Black pieces that were removed.
    // Characters: ♟ (filled/black) vs ♙ (hollow/white)

    return (
        <Card className="bg-slate-800/50 border-slate-700 p-4">
            <h3 className="text-white font-bold mb-3 text-lg">Captured Pieces</h3>
            <div className="space-y-4">
                {/* White Captured (Black Pieces) */}
                <div>
                    <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">White Captured</p>
                    <div className="flex flex-wrap gap-1 min-h-[32px] bg-black/20 p-2 rounded">
                        {capturedPieces.white.map((piece, i) => (
                            <span key={i} className="text-2xl text-slate-400 drop-shadow-lg" title={piece}>
                                {/* We map 'p' to the filled black pawn symbol for visual contrast, or hollow? 
                    Usually "White Captured" means we have a collection of Black pieces.
                    So we should show Black Piece symbols.
                */}
                                {PIECE_SYMBOLS[piece] || piece}
                            </span>
                        ))}
                        {capturedPieces.white.length === 0 && (
                            <span className="text-slate-600 text-sm py-1">None</span>
                        )}
                    </div>
                </div>

                {/* Black Captured (White Pieces) */}
                <div>
                    <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Black Captured</p>
                    <div className="flex flex-wrap gap-1 min-h-[32px] bg-white/5 p-2 rounded">
                        {capturedPieces.black.map((piece, i) => (
                            <span key={i} className="text-2xl text-slate-200 drop-shadow-lg" title={piece}>
                                {/* Black captured means we have White pieces. 
                     If the store logic put 'p' here, we might want to display the White Pawn symbol.
                     However, chess.js only gives lowercase for captured. 
                     We might want to map 'p' -> 'P' if we want the white symbol.
                 */}
                                {PIECE_SYMBOLS[piece.toUpperCase()] || piece}
                            </span>
                        ))}
                        {capturedPieces.black.length === 0 && (
                            <span className="text-slate-600 text-sm py-1">None</span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
