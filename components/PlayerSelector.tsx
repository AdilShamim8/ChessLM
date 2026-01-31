'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChessStore } from '@/lib/chess-store';
import type { PlayerType, AIProvider, GameConfig } from '@/lib/types';

const AI_PROVIDERS = [
    { value: 'openai', label: 'OpenAI GPT-4' },
    { value: 'anthropic', label: 'Anthropic Claude' },
    { value: 'google', label: 'Google Gemini' },
    { value: 'xai', label: 'xAI Grok' }
];

export default function PlayerSelector() {
    const router = useRouter();
    const initializeGame = useChessStore(state => state.initializeGame);

    const [player1Type, setPlayer1Type] = useState<PlayerType>('human');
    const [player1AI, setPlayer1AI] = useState<AIProvider>('openai');
    const [player2Type, setPlayer2Type] = useState<PlayerType>('ai');
    const [player2AI, setPlayer2AI] = useState<AIProvider>('anthropic');

    const handleStartGame = () => {
        const config: GameConfig = {
            player1: {
                id: 'p1',
                type: player1Type,
                color: 'white',
                aiProvider: player1Type === 'ai' ? player1AI : undefined,
                name: player1Type === 'human' ? 'Human (White)' : `${player1AI} (White)`
            },
            player2: {
                id: 'p2',
                type: player2Type,
                color: 'black',
                aiProvider: player2Type === 'ai' ? player2AI : undefined,
                name: player2Type === 'human' ? 'Human (Black)' : `${player2AI} (Black)`
            }
        };

        initializeGame(config);
        router.push('/game');
    };

    return (
        <Card className="w-full max-w-2xl bg-card border-border shadow-2xl">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-center text-primary">
                    Game Setup
                </CardTitle>
                <p className="text-center text-muted-foreground mt-2">Configure match settings</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Player 1 */}
                    <div className="space-y-3 p-4 bg-secondary/20 rounded-lg border border-border">
                        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-white border border-gray-400"></span>
                            White
                        </h3>
                        <Select value={player1Type} onValueChange={(v) => setPlayer1Type(v as PlayerType)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="human">Human</SelectItem>
                                <SelectItem value="ai">AI</SelectItem>
                            </SelectContent>
                        </Select>
                        {player1Type === 'ai' && (
                            <Select value={player1AI} onValueChange={(v) => setPlayer1AI(v as AIProvider)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {AI_PROVIDERS.map(p => (
                                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Player 2 */}
                    <div className="space-y-3 p-4 bg-secondary/20 rounded-lg border border-border">
                        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-black border border-gray-600"></span>
                            Black
                        </h3>
                        <Select value={player2Type} onValueChange={(v) => setPlayer2Type(v as PlayerType)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="human">Human</SelectItem>
                                <SelectItem value="ai">AI</SelectItem>
                            </SelectContent>
                        </Select>
                        {player2Type === 'ai' && (
                            <Select value={player2AI} onValueChange={(v) => setPlayer2AI(v as AIProvider)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {AI_PROVIDERS.map(p => (
                                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>

                <Button
                    onClick={handleStartGame}
                    className="w-full text-lg font-bold py-6 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                    Start Game
                </Button>
            </CardContent>
        </Card>
    );
}
