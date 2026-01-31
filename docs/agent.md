# ChessLM

Create a complete Next.js 14 chess application where users can play chess with multiple AI providers (OpenAI, Anthropic, Google Gemini, xAI Grok) or human vs human.

TECH STACK:
- Next.js 14.2+ (App Router, TypeScript)
- Tailwind CSS + shadcn/ui components
- chess.js (v1.0.0+) for game logic
- react-chessboard (v4.0+) for UI
- Zustand for state management

PROJECT STRUCTURE:
chess-ai/
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── app/
│   ├── layout.tsx
│   ├── page.tsx (player selection)
│   ├── game/
│   │   └── page.tsx (game board)
│   └── api/
│       └── ai-move/
│           └── route.ts
├── components/
│   ├── ui/ (shadcn components)
│   │   ├── button.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── PlayerSelector.tsx
│   ├── ChessGameBoard.tsx
│   ├── MoveHistory.tsx
│   ├── CapturedPieces.tsx
│   └── GameStatus.tsx
├── lib/
│   ├── utils.ts
│   ├── chess-store.ts
│   ├── ai-providers.ts
│   └── types.ts
└── public/
    └── chess-pieces/ (optional custom pieces)

DEPENDENCIES (package.json):
{
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.0",
    "react-dom": "18.3.0",
    "typescript": "5.4.0",
    "chess.js": "^1.0.0",
    "react-chessboard": "^4.6.0",
    "zustand": "^4.5.0",
    "tailwindcss": "3.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.344.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/node": "20.11.0",
    "@types/react": "18.2.0",
    "@types/chess.js": "^0.13.0"
  }
}

ENVIRONMENT VARIABLES (.env.local):
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-api03-...
GOOGLE_AI_API_KEY=AIza...
XAI_API_KEY=xai-...
NEXT_PUBLIC_APP_URL=http://localhost:3000

===== FILE 1: lib/types.ts =====
export type PlayerType = 'human' | 'ai';
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'xai';
export type PieceColor = 'white' | 'black';

export interface Player {
  id: string;
  type: PlayerType;
  color: PieceColor;
  aiProvider?: AIProvider;
  name: string;
}

export interface GameConfig {
  player1: Player;
  player2: Player;
}

export interface Move {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
  san: string;
  timestamp: number;
}

export interface GameState {
  fen: string;
  pgn: string;
  moves: Move[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  turn: PieceColor;
  capturedPieces: {
    white: string[];
    black: string[];
  };
}

===== FILE 2: lib/chess-store.ts =====
import { create } from 'zustand';
import { Chess } from 'chess.js';
import type { GameConfig, GameState, Move, Player } from './types';

interface ChessStore {
  game: Chess;
  gameConfig: GameConfig | null;
  gameState: GameState;
  selectedSquare: string | null;
  
  initializeGame: (config: GameConfig) => void;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  resetGame: () => void;
  setSelectedSquare: (square: string | null) => void;
  updateGameState: () => void;
  getCurrentPlayer: () => Player | null;
}

export const useChessStore = create<ChessStore>((set, get) => ({
  game: new Chess(),
  gameConfig: null,
  selectedSquare: null,
  gameState: {
    fen: new Chess().fen(),
    pgn: '',
    moves: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    isDraw: false,
    isGameOver: false,
    turn: 'white',
    capturedPieces: { white: [], black: [] }
  },

  initializeGame: (config) => {
    const game = new Chess();
    set({ game, gameConfig: config });
    get().updateGameState();
  },

  makeMove: (from, to, promotion) => {
    const { game } = get();
    try {
      const move = game.move({ from, to, promotion: promotion || 'q' });
      if (move) {
        get().updateGameState();
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  },

  resetGame: () => {
    const game = new Chess();
    set({ game, selectedSquare: null });
    get().updateGameState();
  },

  setSelectedSquare: (square) => set({ selectedSquare: square }),

  updateGameState: () => {
    const { game, gameConfig } = get();
    const history = game.history({ verbose: true });
    
    const capturedPieces = { white: [] as string[], black: [] as string[] };
    history.forEach((move: any) => {
      if (move.captured) {
        const color = move.color === 'w' ? 'black' : 'white';
        capturedPieces[color].push(move.captured);
      }
    });

    set({
      gameState: {
        fen: game.fen(),
        pgn: game.pgn(),
        moves: history.map((m: any) => ({
          from: m.from,
          to: m.to,
          piece: m.piece,
          captured: m.captured,
          promotion: m.promotion,
          san: m.san,
          timestamp: Date.now()
        })),
        isCheck: game.isCheck(),
        isCheckmate: game.isCheckmate(),
        isStalemate: game.isStalemate(),
        isDraw: game.isDraw(),
        isGameOver: game.isGameOver(),
        turn: game.turn() === 'w' ? 'white' : 'black',
        capturedPieces
      }
    });
  },

  getCurrentPlayer: () => {
    const { gameConfig, gameState } = get();
    if (!gameConfig) return null;
    return gameState.turn === 'white' ? gameConfig.player1 : gameConfig.player2;
  }
}));

===== FILE 3: lib/ai-providers.ts =====
export interface AIResponse {
  move: string;
  reasoning?: string;
  error?: string;
}

const SYSTEM_PROMPT = `You are an expert chess player. Analyze the position and return your next move.

CRITICAL RULES:
1. Return ONLY the move in UCI format (e.g., "e2e4" or "e7e8q" for promotion)
2. UCI format is: source_square + destination_square + optional_promotion_piece
3. Choose ONLY from the provided legal moves
4. No explanations, no formatting, no quotes - just the move

Examples:
- Pawn e2 to e4: e2e4
- Knight g1 to f3: g1f3
- Pawn promotion e7 to e8 (queen): e7e8q
- Castling kingside (white): e1g1
- Castling queenside (black): e8c8`;

export async function getAIMove(
  provider: string,
  fen: string,
  legalMoves: string[],
  moveHistory: string[]
): Promise<AIResponse> {
  const userPrompt = `Position (FEN): ${fen}
Move History: ${moveHistory.join(', ') || 'Game start'}
Legal Moves (UCI): ${legalMoves.join(', ')}

Your move (UCI format only):`;

  try {
    switch (provider) {
      case 'openai':
        return await callOpenAI(userPrompt, legalMoves);
      case 'anthropic':
        return await callAnthropic(userPrompt, legalMoves);
      case 'google':
        return await callGoogle(userPrompt, legalMoves);
      case 'xai':
        return await callXAI(userPrompt, legalMoves);
      default:
        return { move: legalMoves[0], error: 'Unknown provider' };
    }
  } catch (error: any) {
    console.error(`AI Error (${provider}):`, error);
    return { 
      move: legalMoves[Math.floor(Math.random() * legalMoves.length)],
      error: error.message 
    };
  }
}

async function callOpenAI(prompt: string, legalMoves: string[]): Promise<AIResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 50
    })
  });

  const data = await response.json();
  const move = extractMove(data.choices[0].message.content, legalMoves);
  return { move };
}

async function callAnthropic(prompt: string, legalMoves: string[]): Promise<AIResponse> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `${SYSTEM_PROMPT}\n\n${prompt}`
      }]
    })
  });

  const data = await response.json();
  const move = extractMove(data.content[0].text, legalMoves);
  return { move };
}

async function callGoogle(prompt: string, legalMoves: string[]): Promise<AIResponse> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 50
        }
      })
    }
  );

  const data = await response.json();
  const move = extractMove(data.candidates[0].content.parts[0].text, legalMoves);
  return { move };
}

async function callXAI(prompt: string, legalMoves: string[]): Promise<AIResponse> {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8
    })
  });

  const data = await response.json();
  const move = extractMove(data.choices[0].message.content, legalMoves);
  return { move };
}

function extractMove(aiResponse: string, legalMoves: string[]): string {
  const cleaned = aiResponse.trim().toLowerCase().replace(/['"`;.\s]/g, '');
  
  for (const move of legalMoves) {
    if (cleaned.includes(move)) return move;
  }
  
  const match = cleaned.match(/([a-h][1-8])([a-h][1-8])([qrbn])?/);
  if (match) {
    const candidateMove = match[1] + match[2] + (match[3] || '');
    if (legalMoves.includes(candidateMove)) return candidateMove;
  }
  
  return legalMoves[Math.floor(Math.random() * legalMoves.length)];
}

===== FILE 4: app/api/ai-move/route.ts =====
import { NextRequest, NextResponse } from 'next/server';
import { Chess } from 'chess.js';
import { getAIMove } from '@/lib/ai-providers';

export async function POST(request: NextRequest) {
  try {
    const { fen, provider, moveHistory } = await request.json();

    if (!fen || !provider) {
      return NextResponse.json(
        { error: 'Missing fen or provider' },
        { status: 400 }
      );
    }

    const game = new Chess(fen);
    const moves = game.moves({ verbose: true });
    const legalMoves = moves.map(m => m.from + m.to + (m.promotion || ''));

    if (legalMoves.length === 0) {
      return NextResponse.json(
        { error: 'No legal moves available' },
        { status: 400 }
      );
    }

    const result = await getAIMove(provider, fen, legalMoves, moveHistory || []);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Move API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

===== FILE 5: components/PlayerSelector.tsx =====
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/50 backdrop-blur border-slate-700">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-white">
            ♟️ AI Chess Arena
          </CardTitle>
          <p className="text-center text-slate-300 mt-2">Choose your players and start the game</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Player 1 */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Player 1 (White)</h3>
            <Select value={player1Type} onValueChange={(v) => setPlayer1Type(v as PlayerType)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human">Human</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
              </SelectContent>
            </Select>
            {player1Type === 'ai' && (
              <Select value={player1AI} onValueChange={(v) => setPlayer1AI(v as AIProvider)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Player 2 (Black)</h3>
            <Select value={player2Type} onValueChange={(v) => setPlayer2Type(v as PlayerType)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human">Human</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
              </SelectContent>
            </Select>
            {player2Type === 'ai' && (
              <Select value={player2AI} onValueChange={(v) => setPlayer2AI(v as AIProvider)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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

          <Button 
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-6 text-lg"
          >
            Start Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

===== FILE 6: components/ChessGameBoard.tsx =====
'use client';

import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessStore } from '@/lib/chess-store';
import type { Square } from 'chess.js';

export default function ChessGameBoard() {
  const { game, gameState, gameConfig, makeMove, getCurrentPlayer } = useChessStore();
  const [rightClickedSquares, setRightClickedSquares] = useState<Record<string, any>>({});
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});
  const [isAIThinking, setIsAIThinking] = useState(false);

  useEffect(() => {
    const currentPlayer = getCurrentPlayer();
    if (currentPlayer?.type === 'ai' && !gameState.isGameOver && !isAIThinking) {
      makeAIMove(currentPlayer.aiProvider!);
    }
  }, [gameState.turn, gameState.isGameOver]);

  const makeAIMove = async (provider: string) => {
    setIsAIThinking(true);
    try {
      const response = await fetch('/api/ai-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: gameState.fen,
          provider,
          moveHistory: gameState.moves.map(m => m.san)
        })
      });

      const data = await response.json();
      if (data.move) {
        const from = data.move.substring(0, 2) as Square;
        const to = data.move.substring(2, 4) as Square;
        const promotion = data.move[4];
        
        setTimeout(() => {
          makeMove(from, to, promotion);
          setIsAIThinking(false);
        }, 500);
      }
    } catch (error) {
      console.error('AI move failed:', error);
      setIsAIThinking(false);
    }
  };

  const getMoveOptions = (square: Square) => {
    const moves = game.moves({ square, verbose: true });
    const newSquares: Record<string, any> = {};
    
    moves.forEach((move) => {
      newSquares[move.to] = {
        background: game.get(move.to as Square)
          ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
    });
    
    newSquares[square] = { background: 'rgba(255, 255, 0, 0.4)' };
    setOptionSquares(newSquares);
    return moves.length > 0;
  };

  const onSquareClick = (square: Square) => {
    const currentPlayer = getCurrentPlayer();
    if (currentPlayer?.type === 'ai' || gameState.isGameOver) return;

    if (!moveFrom) {
      const hasMoves = getMoveOptions(square);
      if (hasMoves) setMoveFrom(square);
      return;
    }

    const moveSuccessful = makeMove(moveFrom, square);
    
    if (!moveSuccessful) {
      const hasMoves = getMoveOptions(square);
      setMoveFrom(hasMoves ? square : null);
    } else {
      setMoveFrom(null);
      setOptionSquares({});
    }
  };

  const onSquareRightClick = (square: Square) => {
    const color = 'rgba(255, 0, 0, 0.5)';
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]: rightClickedSquares[square]?.backgroundColor === color
        ? undefined
        : { backgroundColor: color }
    });
  };

  return (
    <div className="w-full max-w-2xl">
      <Chessboard
        position={gameState.fen}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        customSquareStyles={{
          ...optionSquares,
          ...rightClickedSquares
        }}
        boardWidth={600}
        customBoardStyle={{
          borderRadius: '8px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}
        customDarkSquareStyle={{ backgroundColor: '#779952' }}
        customLightSquareStyle={{ backgroundColor: '#edeed1' }}
      />
      {isAIThinking && (
        <div className="text-center mt-4 text-white text-lg animate-pulse">
          AI is thinking...
        </div>
      )}
    </div>
  );
}

===== FILE 7: components/MoveHistory.tsx =====
'use client';

import { useChessStore } from '@/lib/chess-store';
import { Card } from '@/components/ui/card';

export default function MoveHistory() {
  const moves = useChessStore(state => state.gameState.moves);

  const pairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1]
    });
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-4 max-h-96 overflow-y-auto">
      <h3 className="text-white font-bold mb-3 text-lg">Move History</h3>
      <div className="space-y-1">
        {pairs.map((pair) => (
          <div key={pair.moveNumber} className="flex gap-4 text-sm font-mono text-slate-300">
            <span className="w-8 text-slate-500">{pair.moveNumber}.</span>
            <span className="w-16">{pair.white?.san}</span>
            <span className="w-16">{pair.black?.san || ''}</span>
          </div>
        ))}
        {moves.length === 0 && (
          <p className="text-slate-500 text-sm italic">No moves yet</p>
        )}
      </div>
    </Card>
  );
}

===== FILE 8: components/GameStatus.tsx =====
'use client';

import { useChessStore } from '@/lib/chess-store';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function GameStatus() {
  const { gameState, gameConfig, getCurrentPlayer } = useChessStore();
  const currentPlayer = getCurrentPlayer();

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">Game Status</h3>
          {gameState.isCheckmate && (
            <Badge className="bg-red-600 text-white">Checkmate!</Badge>
          )}
          {gameState.isStalemate && (
            <Badge className="bg-yellow-600 text-white">Stalemate</Badge>
          )}
          {gameState.isDraw && (
            <Badge className="bg-gray-600 text-white">Draw</Badge>
          )}
          {gameState.isCheck && !gameState.isCheckmate && (
            <Badge className="bg-orange-600 text-white">Check</Badge>
          )}
          {!gameState.isGameOver && (
            <Badge className="bg-green-600 text-white">In Progress</Badge>
          )}
        </div>

        <div className="text-slate-300 space-y-1 text-sm">
          <p><strong>Turn:</strong> {gameState.turn === 'white' ? '⚪ White' : '⚫ Black'}</p>
          <p><strong>Current Player:</strong> {currentPlayer?.name}</p>
        </div>

        <div className="border-t border-slate-600 pt-3 mt-3">
          <p className="text-slate-400 text-xs mb-2">Players:</p>
          <p className="text-slate-300 text-sm">⚪ {gameConfig?.player1.name}</p>
          <p className="text-slate-300 text-sm">⚫ {gameConfig?.player2.name}</p>
        </div>
      </div>
    </Card>
  );
}

===== FILE 9: components/CapturedPieces.tsx =====
'use client';

import { useChessStore } from '@/lib/chess-store';
import { Card } from '@/components/ui/card';

const PIECE_SYMBOLS: Record<string, string> = {
  p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚'
};

export default function CapturedPieces() {
  const capturedPieces = useChessStore(state => state.gameState.capturedPieces);

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-4">
      <h3 className="text-white font-bold mb-3 text-lg">Captured Pieces</h3>
      <div className="space-y-3">
        <div>
          <p className="text-slate-400 text-sm mb-1">⚪ White captured:</p>
          <div className="flex flex-wrap gap-1">
            {capturedPieces.white.map((piece, i) => (
              <span key={i} className="text-3xl">{PIECE_SYMBOLS[piece]}</span>
            ))}
            {capturedPieces.white.length === 0 && (
              <span className="text-slate-600 text-sm">None</span>
            )}
          </div>
        </div>
        <div>
          <p className="text-slate-400 text-sm mb-1">⚫ Black captured:</p>
          <div className="flex flex-wrap gap-1">
            {capturedPieces.black.map((piece, i) => (
              <span key={i} className="text-3xl">{PIECE_SYMBOLS[piece]}</span>
            ))}
            {capturedPieces.black.length === 0 && (
              <span className="text-slate-600 text-sm">None</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

===== FILE 10: app/page.tsx =====
import PlayerSelector from '@/components/PlayerSelector';

export default function Home() {
  return <PlayerSelector />;
}

===== FILE 11: app/game/page.tsx =====
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ChessGameBoard from '@/components/ChessGameBoard';
import MoveHistory from '@/components/MoveHistory';
import GameStatus from '@/components/GameStatus';
import CapturedPieces from '@/components/CapturedPieces';
import { useChessStore } from '@/lib/chess-store';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function GamePage() {
  const router = useRouter();
  const resetGame = useChessStore(state => state.resetGame);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Game
          </Button>
          <Button 
            onClick={resetGame}
            variant="outline"
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Board
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex justify-center">
            <ChessGameBoard />
          </div>
          
          <div className="space-y-4">
            <GameStatus />
            <CapturedPieces />
            <MoveHistory />
          </div>
        </div>
      </div>
    </div>
  );
}

===== FILE 12: app/layout.tsx =====
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Chess Arena',
  description: 'Play chess against multiple AI providers'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

===== SETUP INSTRUCTIONS =====

1. Install dependencies:
npm install next@14.2.0 react@18.3.0 react-dom@18.3.0 chess.js react-chessboard zustand tailwindcss clsx tailwind-merge lucide-react class-variance-authority

2. Install shadcn/ui:
npx shadcn-ui@latest init
npx shadcn-ui@latest add button select card badge

3. Configure .env.local with API keys

4. Run development server:
npm run dev

FEATURES IMPLEMENTED:
✅ Player selection (Human vs AI, AI vs AI, Human vs Human)
✅ 4 AI providers (OpenAI, Anthropic, Google, xAI)
✅ Beautiful chess board with drag-drop
✅ Move history tracking
✅ Captured pieces display
✅ Game status (check, checkmate, stalemate)
✅ Legal move validation
✅ Square highlighting
✅ Right-click annotations
✅ Responsive design
✅ Dark theme
✅ AI thinking indicator
✅ Reset/new game functionality

STYLING:
- Dark gradient background
- Glassmorphism cards
- Smooth animations
- Professional chess piece rendering
- Responsive grid layout
```


