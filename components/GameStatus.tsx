'use client';

import { useChessStore } from '@/lib/chess-store';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function GameStatus() {
    const { gameState, gameConfig, getCurrentPlayer } = useChessStore();
    const currentPlayer = getCurrentPlayer();

    return (
        <Card className="bg-card border-border p-4 shadow-lg">
            <div className="space-y-3">
                <div>
                    <h3 className="text-foreground font-bold text-lg mb-2">Game Status</h3>
                    <div className="flex flex-wrap gap-2">
                        {gameState.isCheckmate && (
                            <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Checkmate</Badge>
                        )}
                        {gameState.isStalemate && (
                            <Badge variant="secondary">Stalemate</Badge>
                        )}
                        {gameState.isDraw && !gameState.isStalemate && (
                            <Badge variant="secondary">Draw</Badge>
                        )}
                        {gameState.isCheck && !gameState.isCheckmate && (
                            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 animate-pulse">Check</Badge>
                        )}
                        {!gameState.isGameOver && (
                            <Badge className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30">In Progress</Badge>
                        )}
                    </div>
                </div>

                <div className="text-muted-foreground space-y-2 text-sm">
                    <div className="flex justify-between items-center bg-secondary/30 p-2 rounded border border-border/50">
                        <strong>Turn:</strong>
                        <span className={gameState.turn === 'white' ? 'text-foreground font-bold' : 'text-muted-foreground font-bold'}>
                            {gameState.turn === 'white' ? '⚪ White' : '⚫ Black'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center bg-secondary/30 p-2 rounded border border-border/50">
                        <strong>Current Player:</strong>
                        <span>{currentPlayer?.name}</span>
                    </div>
                </div>

                <div className="border-t border-border pt-3 mt-3">
                    <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wider">Matchup</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-secondary/20 p-2 rounded border border-border">
                            <p className="text-xs text-muted-foreground">White</p>
                            <p className="text-foreground font-medium text-sm truncate">{gameConfig?.player1.name}</p>
                        </div>
                        <div className="bg-secondary/20 p-2 rounded border border-border">
                            <p className="text-xs text-muted-foreground">Black</p>
                            <p className="text-foreground font-medium text-sm truncate">{gameConfig?.player2.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
