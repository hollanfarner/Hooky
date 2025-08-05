import { type Game, type Player, type Clue, type PreRoundWord } from "@shared/schema";
import { randomUUID } from "crypto";
import { createAIPlayer, AI_PLAYERS } from "./ai-player";

export interface IStorage {
  createGame(roomCode: string, playerName: string, singlePlayer?: boolean): Promise<{ game: Game; playerId: string }>;
  joinGame(roomCode: string, playerName: string): Promise<{ game: Game; playerId: string } | null>;
  getGame(gameId: string): Promise<Game | undefined>;
  getGameByRoomCode(roomCode: string): Promise<Game | undefined>;
  updateGame(game: Game): Promise<Game>;
  addPlayer(gameId: string, player: Player): Promise<Game | undefined>;
  removePlayer(gameId: string, playerId: string): Promise<Game | undefined>;
  addClue(gameId: string, clue: Clue): Promise<Game | undefined>;
  addPreRoundWord(gameId: string, word: PreRoundWord): Promise<Game | undefined>;
  getAllGames(): Promise<Game[]>;
}

export class MemStorage implements IStorage {
  private games: Map<string, Game>;
  private gamesByRoomCode: Map<string, string>; // roomCode -> gameId

  constructor() {
    this.games = new Map();
    this.gamesByRoomCode = new Map();
  }

  async createGame(roomCode: string, playerName: string, singlePlayer: boolean = false): Promise<{ game: Game; playerId: string }> {
    const gameId = randomUUID();
    const playerId = randomUUID();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    // Randomly select 3 hooky letters
    const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
    const hookyLetters = shuffled.slice(0, 3);
    const remainingLetters = shuffled.slice(3);
    
    // Distribute letters based on player count (starting with 1 player)
    const playerHand = remainingLetters.slice(0, 7); // 7 letters for 3 players initially
    const unrevealed = remainingLetters.slice(7, 9); // 2 unrevealed for 3 players
    
    const player: Player = {
      id: playerId,
      name: playerName,
      hand: playerHand,
      hookyGuesses: {},
      handGuesses: {},
      score: { hooky: 0, hand: 0, total: 0 },
      connected: true,
      isAI: false
    };

    let allPlayers = [player];
    
    // Add AI players for single-player mode
    if (singlePlayer) {
      const numAIPlayers = 2; // Add 2 AI players for 3 total
      const selectedAI = AI_PLAYERS.slice(0, numAIPlayers);
      
      // Redistribute letters for 3 players
      const lettersPerPlayer = 7;
      const unrevealedc = 2;
      
      const allNonHookyLetters = alphabet.filter(letter => !hookyLetters.includes(letter));
      const shuffled = [...allNonHookyLetters].sort(() => Math.random() - 0.5);
      
      // Update human player's hand
      player.hand = shuffled.slice(0, lettersPerPlayer);
      
      // Create AI players with hands
      for (let i = 0; i < numAIPlayers; i++) {
        const aiPlayerBase = createAIPlayer(selectedAI[i].name, selectedAI[i].difficulty);
        const aiPlayerHand = shuffled.slice((i + 1) * lettersPerPlayer, (i + 2) * lettersPerPlayer);
        
        const aiPlayer: Player = {
          ...aiPlayerBase,
          hand: aiPlayerHand
        };
        
        allPlayers.push(aiPlayer);
      }
      
      // Update unrevealed letters for 3 players
      unrevealed = shuffled.slice(3 * lettersPerPlayer, 3 * lettersPerPlayer + unrevealedc);
    }

    const game: Game = {
      id: gameId,
      roomCode,
      phase: singlePlayer ? "pre-round" : "waiting", // Auto-start single player games
      round: 0,
      currentPlayerIndex: 0,
      players: allPlayers,
      hookyLetters,
      revealedLetters: [],
      unrevealed,
      clues: [],
      preRoundWords: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.games.set(gameId, game);
    this.gamesByRoomCode.set(roomCode, gameId);
    
    return { game, playerId };
  }

  async joinGame(roomCode: string, playerName: string): Promise<{ game: Game; playerId: string } | null> {
    const gameId = this.gamesByRoomCode.get(roomCode);
    if (!gameId) return null;
    
    const game = this.games.get(gameId);
    if (!game || game.phase !== "waiting" || game.players.length >= 5) return null;

    const playerId = randomUUID();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const usedLetters = [...game.hookyLetters, ...game.players.flatMap(p => p.hand), ...game.unrevealed];
    const availableLetters = alphabet.filter(letter => !usedLetters.includes(letter));
    
    // Redistribute letters based on new player count
    const playerCount = game.players.length + 1;
    const lettersPerPlayer = playerCount === 3 ? 7 : playerCount === 4 ? 5 : 4;
    const unrevealedc = playerCount === 3 ? 2 : 3;
    
    // Recalculate distribution
    const allNonHookyLetters = alphabet.filter(letter => !game.hookyLetters.includes(letter));
    const shuffled = [...allNonHookyLetters].sort(() => Math.random() - 0.5);
    
    // Redistribute all players' hands
    const newPlayers = [...game.players];
    for (let i = 0; i < newPlayers.length; i++) {
      newPlayers[i].hand = shuffled.slice(i * lettersPerPlayer, (i + 1) * lettersPerPlayer);
    }
    
    // New player gets their hand
    const playerHand = shuffled.slice(newPlayers.length * lettersPerPlayer, (newPlayers.length + 1) * lettersPerPlayer);
    
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      hand: playerHand,
      hookyGuesses: {},
      handGuesses: {},
      score: { hooky: 0, hand: 0, total: 0 },
      connected: true
    };

    newPlayers.push(newPlayer);
    
    // Update unrevealed letters
    const totalUsed = (newPlayers.length) * lettersPerPlayer;
    const newUnrevealed = shuffled.slice(totalUsed, totalUsed + unrevealedc);

    const updatedGame: Game = {
      ...game,
      players: newPlayers,
      unrevealed: newUnrevealed,
      updatedAt: Date.now()
    };

    this.games.set(gameId, updatedGame);
    return { game: updatedGame, playerId };
  }

  async getGame(gameId: string): Promise<Game | undefined> {
    return this.games.get(gameId);
  }

  async getGameByRoomCode(roomCode: string): Promise<Game | undefined> {
    const gameId = this.gamesByRoomCode.get(roomCode);
    return gameId ? this.games.get(gameId) : undefined;
  }

  async updateGame(game: Game): Promise<Game> {
    const updatedGame = { ...game, updatedAt: Date.now() };
    this.games.set(game.id, updatedGame);
    return updatedGame;
  }

  async addPlayer(gameId: string, player: Player): Promise<Game | undefined> {
    const game = this.games.get(gameId);
    if (!game) return undefined;

    const updatedGame = {
      ...game,
      players: [...game.players, player],
      updatedAt: Date.now()
    };

    this.games.set(gameId, updatedGame);
    return updatedGame;
  }

  async removePlayer(gameId: string, playerId: string): Promise<Game | undefined> {
    const game = this.games.get(gameId);
    if (!game) return undefined;

    const updatedGame = {
      ...game,
      players: game.players.map(p => p.id === playerId ? { ...p, connected: false } : p),
      updatedAt: Date.now()
    };

    this.games.set(gameId, updatedGame);
    return updatedGame;
  }

  async addClue(gameId: string, clue: Clue): Promise<Game | undefined> {
    const game = this.games.get(gameId);
    if (!game) return undefined;

    const updatedGame = {
      ...game,
      clues: [...game.clues, clue],
      updatedAt: Date.now()
    };

    this.games.set(gameId, updatedGame);
    return updatedGame;
  }

  async addPreRoundWord(gameId: string, word: PreRoundWord): Promise<Game | undefined> {
    const game = this.games.get(gameId);
    if (!game) return undefined;

    const updatedGame = {
      ...game,
      preRoundWords: [...game.preRoundWords, word],
      updatedAt: Date.now()
    };

    this.games.set(gameId, updatedGame);
    return updatedGame;
  }

  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
}

export const storage = new MemStorage();
