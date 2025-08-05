import { z } from "zod";

export const gamePhases = ["waiting", "pre-round", "word-feedback", "guessing", "hand-deduction", "finished"] as const;
export type GamePhase = typeof gamePhases[number];

export const playerSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(20),
  hand: z.array(z.string().length(1)),
  hookyGuesses: z.record(z.string(), z.array(z.string().length(1)).length(3)).default({}),
  handGuesses: z.record(z.string(), z.array(z.string().length(1))).default({}),
  score: z.object({
    hooky: z.number().default(0),
    hand: z.number().default(0),
    total: z.number().default(0)
  }).default({ hooky: 0, hand: 0, total: 0 }),
  connected: z.boolean().default(true),
  isAI: z.boolean().default(false)
});

export const clueSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  targetPlayerId: z.string(),
  word: z.string().length(5),
  response: z.number().min(0).max(5),
  round: z.number(),
  timestamp: z.number()
});

export const preRoundWordSchema = z.object({
  playerId: z.string(),
  word: z.string().length(5)
});

export const gameSchema = z.object({
  id: z.string(),
  roomCode: z.string().length(6),
  phase: z.enum(gamePhases),
  round: z.number().min(0).max(6),
  currentPlayerIndex: z.number(),
  players: z.array(playerSchema),
  hookyLetters: z.array(z.string().length(1)).length(3),
  revealedLetters: z.array(z.string().length(1)),
  unrevealed: z.array(z.string().length(1)),
  clues: z.array(clueSchema),
  preRoundWords: z.array(preRoundWordSchema),
  createdAt: z.number(),
  updatedAt: z.number()
});

export const createGameSchema = z.object({
  playerName: z.string().min(1).max(20),
  singlePlayer: z.boolean().default(false)
});

export const joinGameSchema = z.object({
  roomCode: z.string().length(6),
  playerName: z.string().min(1).max(20)
});

export const submitWordSchema = z.object({
  word: z.string().length(5).transform(s => s.toUpperCase())
});

export const submitClueSchema = z.object({
  word: z.string().length(5).transform(s => s.toUpperCase()),
  targetPlayerId: z.string()
});

export const respondToClueSchema = z.object({
  clueId: z.string(),
  response: z.number().min(0).max(5)
});

export const submitHookyGuessSchema = z.object({
  letters: z.array(z.string().length(1)).length(3).transform(arr => arr.map(s => s.toUpperCase()))
});

export const submitHandGuessSchema = z.object({
  guesses: z.record(z.string(), z.array(z.string().length(1)))
});

export type Player = z.infer<typeof playerSchema>;
export type Game = z.infer<typeof gameSchema>;
export type Clue = z.infer<typeof clueSchema>;
export type PreRoundWord = z.infer<typeof preRoundWordSchema>;
export type CreateGame = z.infer<typeof createGameSchema>;
export type JoinGame = z.infer<typeof joinGameSchema>;
export type SubmitWord = z.infer<typeof submitWordSchema>;
export type SubmitClue = z.infer<typeof submitClueSchema>;
export type RespondToClue = z.infer<typeof respondToClueSchema>;
export type SubmitHookyGuess = z.infer<typeof submitHookyGuessSchema>;
export type SubmitHandGuess = z.infer<typeof submitHandGuessSchema>;
