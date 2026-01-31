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
                        {/* Opponent Label (Detail View) */}
                        <div className="w-full flex flex-col mb-4 max-w-[600px]">
                            <div className="flex items-center justify-between bg-secondary/50 px-4 py-3 rounded-t-lg border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center border border-gray-600 shimmer">
                                        <span className="text-[10px] text-gray-400 font-bold">AI</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold leading-none">Black</span>
                                        <span className="text-xs text-muted-foreground mt-0.5">Grandmaster AI</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Captured</span>
                                    <CapturedPieces color="black" />
                                </div>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 border-x border-border/50" />
                        </div>

                        <div className="relative p-2 bg-gradient-to-b from-border/10 to-transparent rounded-xl border border-border/20 shadow-2xl">
                            <ChessGameBoard />
                        </div>

                        {/* Player Label (Detail View) */}
                        <div className="w-full flex flex-col mt-4 max-w-[600px]">
                            <div className="h-1 bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 border-x border-primary/20" />
                            <div className="flex items-center justify-between bg-primary/10 px-4 py-3 rounded-b-lg border border-primary/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-300 shadow-inner">
                                        <span className="text-[10px] text-gray-600 font-bold">YOU</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-foreground font-bold leading-none">White</span>
                                        <span className="text-xs text-primary/70 mt-0.5">Human Challenger</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-primary/50 uppercase tracking-widest mb-1">Captured</span>
                                    <CapturedPieces color="white" />
                                </div>
                            </div>
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
