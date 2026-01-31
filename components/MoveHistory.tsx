'use client';

import { useChessStore } from '@/lib/chess-store';
import { Card } from '@/components/ui/card';
import { useEffect, useRef } from 'react';

export default function MoveHistory() {
    const moves = useChessStore(state => state.gameState.moves);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [moves]);

    const pairs = [];
    for (let i = 0; i < moves.length; i += 2) {
        pairs.push({
            moveNumber: Math.floor(i / 2) + 1,
            white: moves[i],
            black: moves[i + 1]
        });
    }

    return (
        <Card className="bg-card border-border p-4 max-h-96 flex flex-col shadow-lg">
            <h3 className="text-foreground font-bold mb-3 text-lg">Move History</h3>
            <div
                ref={scrollRef}
                className="space-y-1 overflow-y-auto flex-1 custom-scrollbar pr-2"
            >
                {pairs.map((pair) => (
                    <div key={pair.moveNumber} className="flex gap-4 text-sm font-mono text-muted-foreground hover:bg-secondary/50 p-1 rounded transition-colors">
                        <span className="w-8 text-muted-foreground/50">{pair.moveNumber}.</span>
                        <span className="w-16 font-medium text-foreground">{pair.white?.san}</span>
                        <span className="w-16 font-medium text-foreground">{pair.black?.san || ''}</span>
                    </div>
                ))}
                {moves.length === 0 && (
                    <p className="text-muted-foreground text-sm italic">No moves yet</p>
                )}
            </div>
        </Card>
    );
}
