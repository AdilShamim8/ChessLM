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
    }, [gameState.turn, gameState.isGameOver]); // eslint-disable-line react-hooks/exhaustive-deps

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
                // AI move format e.g., e2e4 or e7e8q
                const from = data.move.substring(0, 2) as Square;
                const to = data.move.substring(2, 4) as Square;
                const promotion = data.move[4]; // 'q', 'r', etc

                setTimeout(() => {
                    makeMove(from, to, promotion);
                    setIsAIThinking(false);
                }, 500);
            } else {
                console.warn("AI didn't return a move", data);
                setIsAIThinking(false);
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

    // Drag and drop handler
    function onDrop(sourceSquare: Square, targetSquare: Square) {
        const currentPlayer = getCurrentPlayer();
        if (currentPlayer?.type === 'ai' || gameState.isGameOver) return false;

        const move = makeMove(sourceSquare, targetSquare);
        return move;
    }

    return (
        <div className="w-full max-w-2xl relative">
            <Chessboard
                position={gameState.fen}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                onPieceDrop={onDrop}
                customSquareStyles={{
                    ...optionSquares,
                    ...rightClickedSquares
                }}
                boardWidth={600}
                customBoardStyle={{
                    borderRadius: '8px',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
                }}
                customDarkSquareStyle={{ backgroundColor: '#4e7837' }} // Palette Dark Green
                customLightSquareStyle={{ backgroundColor: '#ffffff' }} // Palette White
            />
            {isAIThinking && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-lg z-10 animate-pulse text-lg font-bold backdrop-blur-sm">
                    AI is thinking...
                </div>
            )}
        </div>
    );
}
