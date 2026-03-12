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
import { WinModal } from '@/components/WinModal';

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

    const { player1, player2 } = gameConfig;

    return (
        <div className="min-h-screen bg-background p-3 sm:p-4 md:p-8">
            <WinModal />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center gap-2 mb-4 sm:mb-6">
                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="bg-card hover:bg-secondary text-primary-foreground border-border text-xs sm:text-sm px-3 sm:px-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        New Game
                    </Button>
                    <Button
                        onClick={resetGame}
                        variant="outline"
                        className="bg-card hover:bg-secondary text-primary-foreground border-border text-xs sm:text-sm px-3 sm:px-4"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Board
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-12">
                    <div className="lg:col-span-8 flex flex-col items-center">
                        {/* Opponent Label (Detail View) */}
                        <div className="w-full flex flex-col mb-3 sm:mb-4 max-w-[600px]">
                            <div className="flex items-center justify-between bg-secondary/50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-t-lg border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center border border-gray-600 shimmer">
                                        <span className="text-[10px] text-gray-400 font-bold">
                                            {player2.type === 'ai' ? 'AI' : 'HU'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold leading-none text-sm md:text-base">{player2.name}</span>
                                        <span className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                                            {player2.type === 'ai' ? 'Grandmaster AI' : 'Opponent'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Captured</span>
                                    <CapturedPieces color="black" />
                                </div>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 border-x border-border/50" />
                        </div>

                        <div className="relative w-full p-1.5 sm:p-2 md:p-4 bg-gradient-to-b from-border/10 to-transparent rounded-xl border border-border/20 shadow-2xl">
                            <ChessGameBoard />
                        </div>

                        {/* Player Label (Detail View) */}
                        <div className="w-full flex flex-col mt-3 sm:mt-4 max-w-[600px]">
                            <div className="h-1 bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 border-x border-primary/20" />
                            <div className="flex items-center justify-between bg-primary/10 px-3 sm:px-4 py-2.5 sm:py-3 rounded-b-lg border border-primary/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-300 shadow-inner">
                                        <span className="text-[10px] text-gray-600 font-bold">
                                            {player1.type === 'human' ? 'YOU' : 'AI'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-foreground font-bold leading-none text-sm md:text-base">{player1.name}</span>
                                        <span className="text-[10px] md:text-xs text-primary/70 mt-0.5">
                                            {player1.type === 'human' ? 'Human Challenger' : 'Pro AI Engine'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] md:text-[10px] text-primary/50 uppercase tracking-widest mb-1">Captured</span>
                                    <CapturedPieces color="white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                        <GameStatus />
                        <MoveHistory />
                    </div>
                </div>
            </div>
        </div>
    );
}
