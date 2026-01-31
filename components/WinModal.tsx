"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChessStore } from "@/lib/chess-store";
import { Trophy, RotateCcw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export function WinModal() {
    const router = useRouter();
    const { gameState, gameConfig, resetGame } = useChessStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (gameState.isGameOver) {
            setIsOpen(true);
            // Trigger confetti
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 100 * (timeLeft / duration);

                // Left cannon
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: 0, y: 0.8 },
                    angle: 60,
                    spread: 55,
                });
                // Right cannon
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: 1, y: 0.8 },
                    angle: 120,
                    spread: 55,
                });
            }, 250);

            return () => clearInterval(interval);
        } else {
            setIsOpen(false);
        }
    }, [gameState.isGameOver]);

    if (!gameConfig) return null;

    const getWinnerText = () => {
        if (gameState.isCheckmate) {
            const winner = gameState.turn === 'white' ? gameConfig.player2 : gameConfig.player1;
            return {
                title: "Checkmate!",
                message: `${winner.name} wins the match!`,
                winner: winner.name,
                type: winner.type
            };
        }
        if (gameState.isStalemate) return { title: "Stalemate", message: "It's a draw!", winner: "", type: "" };
        if (gameState.isDraw) return { title: "Draw", message: "The game ended in a draw!", winner: "", type: "" };
        return { title: "Game Over", message: "The game has ended.", winner: "", type: "" };
    };

    const result = getWinnerText();

    const handleNewGame = () => {
        setIsOpen(false);
        router.push("/");
    };

    const handleReset = () => {
        setIsOpen(false);
        resetGame();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white flex flex-col items-center">
                <DialogHeader className="flex flex-col items-center justify-center space-y-4 pt-4">
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-2 animate-bounce">
                        <Trophy className="w-12 h-12 text-yellow-500" />
                    </div>
                    <div className="space-y-2 text-center">
                        <DialogTitle className="text-3xl font-extrabold tracking-tight text-white">
                            {result.title}
                        </DialogTitle>
                        {result.winner && (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xl font-medium text-slate-300">
                                    {result.winner}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest border ${result.type === 'human'
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                        : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                    }`}>
                                    {result.type === 'human' ? 'Human Victor' : 'AI Champion'}
                                </span>
                            </div>
                        )}
                        <DialogDescription className="text-slate-400 text-lg pt-2 italic">
                            {result.message}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6 w-full">
                    <Button
                        onClick={handleNewGame}
                        variant="outline"
                        className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Home
                    </Button>
                    <Button
                        onClick={handleReset}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Rematch
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
