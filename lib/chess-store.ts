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

        // Calculate captured pieces
        // Note: chess.js history with verbose:true gives us the captured piece in the move object if any
        const capturedPieces = { white: [] as string[], black: [] as string[] };
        history.forEach((move: any) => {
            if (move.captured) {
                // If white moved and captured, they captured a black piece.
                // Wait, move.color is the color of the piece that MOVED.
                // If color is 'w', they captured 'b'. But we want to show what White HAS captured (i.e. black pieces).
                // Or do we want to show what pieces White has LOST?
                // Usually "Captured Pieces" UI shows the pieces that have been taken off the board.
                // Standard UI: "White Captures" shows Black pieces. "Black Captures" shows White pieces.

                // Use logic from prompt:
                // const color = move.color === 'w' ? 'black' : 'white';
                // capturedPieces[color].push(move.captured);

                const color = move.color === 'w' ? 'white' : 'black'; // This logic seems to imply "Pieces captured BY white"
                // Let's re-read the prompt's `chess-store.ts`.
                // Prompt says: 
                // const color = move.color === 'w' ? 'black' : 'white';
                // capturedPieces[color].push(move.captured);
                // Wait, if move.color is 'w', they captured a black piece. So we push to 'black'?
                // The prompt implementation pushes to `capturedPieces['black']` if white moved.
                // This implies `capturedPieces.black` holds the pieces captured BY white (which are black pieces).
                // Let's stick to the prompt's specific logic to be safe, or correct if obvious.
                // "CapturedPieces" component iterates `capturedPieces.white` and labels it "White captured:".
                // If `capturedPieces.white` contains pieces white captured, they should be black pieces (p, n, etc are usually lowercase in fen/chess.js for black).
                // Chess.js: 'p' is black pawn, 'P' is white pawn.
                // `move.captured` returns 'p', 'n' etc (always lowercase? or case sensitive? chess.js v1 might differ).
                // Typically chess.js `captured` property is the piece type (p, n, b, r, q) always lowercase.
                // So we just need to know WHO captured it.
                // If `capturedPieces.white` means "Items White has captured", then it should contain the pieces.

                const captorColor = move.color === 'w' ? 'white' : 'black';
                // In prompt: `const color = move.color === 'w' ? 'black' : 'white';`
                // If white moved, color = black. capturedPieces['black'].push...
                // Then in UI: `capturedPieces.white` labeled "White captured".
                // Prompt logic check:
                // File 2:
                // const color = move.color === 'w' ? 'black' : 'white';
                // capturedPieces[color].push(move.captured);
                // If white captured, it's a black piece (lowercase in chess.js)
                // If black captured, it's a white piece (uppercase in chess.js)
                // Standardize casing: White captures = black pieces = lowercase; Black captures = white pieces = uppercase
                const pieceSymbol = captorColor === 'white'
                    ? move.captured.toLowerCase()
                    : move.captured.toUpperCase();

                capturedPieces[captorColor].push(pieceSymbol);
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
