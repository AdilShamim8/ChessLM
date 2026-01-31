'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ChessGameBoard from '@/components/ChessGameBoard';
import MoveHistory from '@/components/MoveHistory';
import GameStatus from '@/components/GameStatus';
import CapturedPieces from '@/components/CapturedPieces';
import { useChessStore } from '@/lib/chess-store';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function GamePage() {
    const router = useRouter();
    const resetGame = useChessStore(state => state.resetGame);
    const gameConfig = useChessStore(state => state.gameConfig);

    // Redirect if no game config (e.g. refresh)
    useEffect(() => {
        if (!gameConfig) {
            router.push('/');
        }
    }, [gameConfig, router]);

    if (!gameConfig) return null;

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="bg-card hover:bg-secondary text-primary-foreground border-border"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        New Game
                    </Button>
                    <Button
                        onClick={resetGame}
                        variant="outline"
                        className="bg-card hover:bg-secondary text-primary-foreground border-border"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Board
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 flex flex-col items-center">
                        {/* Opponent Label */}
                        <div className="w-full flex justify-between items-center mb-4 max-w-[600px]">
                            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg border border-border/50">
                                <span className="w-3 h-3 rounded-full bg-black border border-gray-600 shimmer" />
                                <span className="text-muted-foreground font-medium">Black (AI)</span>
                            </div>
                        </div>

                        <ChessGameBoard />

                        {/* Player Label */}
                        <div className="w-full flex justify-between items-center mt-4 max-w-[600px]">
                            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                                <span className="w-3 h-3 rounded-full bg-white border border-gray-300" />
                                <span className="text-foreground font-bold">White (You)</span>
                            </div>
                        </div>

                        {/* Captured Pieces */}
                        <div className="w-full max-w-[600px] mt-6">
                            <CapturedPieces />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <GameStatus />
                        <MoveHistory />
                    </div>
                </div>
            </div>
        </div>
    );
}
