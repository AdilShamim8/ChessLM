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

            const randomInRange = (min: number, max: number) =>
                Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
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
            // If it's checkmate, the winner is the one who ISN'T currently's turn
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
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
                <DialogHeader className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <Trophy className="w-10 h-10 text-yellow-500" />
                    </div>
                    <DialogTitle className="text-3xl font-bold tracking-tight text-center">
                        {result.title}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-center text-lg">
                        {result.message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
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
