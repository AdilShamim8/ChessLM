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
