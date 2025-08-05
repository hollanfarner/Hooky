import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  createGameSchema, 
  joinGameSchema, 
  submitWordSchema, 
  submitClueSchema, 
  respondToClueSchema,
  submitHookyGuessSchema,
  submitHandGuessSchema,
  type Game,
  type Player,
  type Clue
} from "@shared/schema";
import { randomUUID } from "crypto";
import { AIPlayer } from "./ai-player";
import { validateWordWithFeedback, isValidWord } from "./word-validator";

interface ClientConnection {
  ws: WebSocket;
  gameId?: string;
  playerId?: string;
}

const connections = new Map<string, ClientConnection>();

function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function broadcastToGame(gameId: string, message: any, excludePlayerId?: string) {
  for (const [connectionId, connection] of Array.from(connections.entries())) {
    if (connection.gameId === gameId && 
        connection.playerId !== excludePlayerId && 
        connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify(message));
    }
  }
}

function sendToPlayer(playerId: string, message: any) {
  for (const [connectionId, connection] of Array.from(connections.entries())) {
    if (connection.playerId === playerId && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify(message));
      break;
    }
  }
}

function calculateLettersInWord(playerHand: string[], word: string): number {
  const wordLetters = word.split('');
  const handSet = new Set(playerHand);
  return wordLetters.filter(letter => handSet.has(letter)).length;
}

function advanceGamePhase(game: Game): Game {
  let updatedGame = { ...game };
  
  if (game.phase === "pre-round" && game.preRoundWords.length === game.players.length) {
    updatedGame.phase = "word-feedback";
    updatedGame.round = 1;
  } else if (game.phase === "word-feedback" && game.round === 3) {
    updatedGame.phase = "guessing";
    updatedGame.round = 4;
  } else if (game.phase === "guessing" && game.round === 6) {
    updatedGame.phase = "hand-deduction";
  } else if (game.phase === "hand-deduction") {
    updatedGame.phase = "finished";
    // Calculate final scores
    updatedGame = calculateFinalScores(updatedGame);
  }
  
  return updatedGame;
}

function calculateFinalScores(game: Game): Game {
  const updatedPlayers = game.players.map(player => {
    let hookyScore = 0;
    let handScore = 0;
    
    // Calculate hooky letter scores
    Object.entries(player.hookyGuesses).forEach(([round, guess]) => {
      const correctCount = guess.filter(letter => game.hookyLetters.includes(letter)).length;
      if (round === "4" || round === "5") {
        hookyScore += correctCount * 5;
      } else if (round === "6") {
        hookyScore += correctCount * 10;
      }
    });
    
    // Calculate hand deduction scores
    Object.entries(player.handGuesses).forEach(([targetPlayerId, guess]) => {
      const targetPlayer = game.players.find(p => p.id === targetPlayerId);
      if (targetPlayer) {
        const correctLetters = guess.filter(letter => targetPlayer.hand.includes(letter)).length;
        handScore += correctLetters;
        
        // Bonus for complete hand
        if (correctLetters === targetPlayer.hand.length && guess.length === targetPlayer.hand.length) {
          handScore += 1;
        }
      }
    });
    
    return {
      ...player,
      score: {
        hooky: hookyScore,
        hand: handScore,
        total: hookyScore + handScore
      }
    };
  });
  
  return { ...game, players: updatedPlayers };
}

function nextTurn(game: Game): Game {
  const nextIndex = (game.currentPlayerIndex + 1) % game.players.length;
  return { ...game, currentPlayerIndex: nextIndex };
}

function revealLetter(game: Game): Game {
  if (game.unrevealed.length === 0) return game;
  
  const randomIndex = Math.floor(Math.random() * game.unrevealed.length);
  const letterToReveal = game.unrevealed[randomIndex];
  
  return {
    ...game,
    revealedLetters: [...game.revealedLetters, letterToReveal],
    unrevealed: game.unrevealed.filter((_, index) => index !== randomIndex)
  };
}

// AI processing functions
async function processAIActions(game: Game): Promise<void> {
  // Process AI actions for the current phase
  if (game.phase === "pre-round") {
    await processAIPreRoundWords(game);
  } else if (game.phase === "word-feedback") {
    await processAIClues(game);
    await processAIResponses(game);
  } else if (game.phase === "guessing") {
    await processAIHookyGuesses(game);
  } else if (game.phase === "hand-deduction") {
    await processAIHandGuesses(game);
  }
}

async function processAIPreRoundWords(game: Game): Promise<void> {
  const aiPlayers = game.players.filter(p => p.isAI);
  
  for (const aiPlayer of aiPlayers) {
    const existingWord = game.preRoundWords.find(w => w.playerId === aiPlayer.id);
    if (!existingWord) {
      const aiLogic = new AIPlayer(game, aiPlayer.id);
      const word = aiLogic.generatePreRoundWord();
      
      await storage.addPreRoundWord(game.id, {
        playerId: aiPlayer.id,
        word
      });
      
      const updatedGame = await storage.getGame(game.id);
      if (updatedGame) {
        broadcastToGame(game.id, { type: "gameUpdated", game: updatedGame });
      }
    }
  }
}

async function processAIClues(game: Game): Promise<void> {
  const aiPlayers = game.players.filter(p => p.isAI);
  const currentRoundClues = game.clues.filter(c => c.round === game.round);
  
  for (const aiPlayer of aiPlayers) {
    const hasSubmittedClue = currentRoundClues.some(c => c.playerId === aiPlayer.id);
    if (!hasSubmittedClue) {
      const aiLogic = new AIPlayer(game, aiPlayer.id);
      const { word, targetPlayerId } = aiLogic.generateClue();
      
      await storage.addClue(game.id, {
        id: randomUUID(),
        playerId: aiPlayer.id,
        targetPlayerId,
        word,
        round: game.round,

        timestamp: Date.now()
      });
      
      // Add delay to make AI feel more natural
      setTimeout(async () => {
        const updatedGame = await storage.getGame(game.id);
        if (updatedGame) {
          broadcastToGame(game.id, { type: "gameUpdated", game: updatedGame });
        }
      }, Math.random() * 2000 + 1000); // 1-3 second delay
    }
  }
}

async function processAIResponses(game: Game): Promise<void> {
  const aiPlayers = game.players.filter(p => p.isAI);
  const currentRoundClues = game.clues.filter(c => c.round === game.round);
  
  for (const clue of currentRoundClues) {
    const targetPlayer = game.players.find(p => p.id === clue.targetPlayerId);
    if (targetPlayer?.isAI && clue.response === undefined) {
      const aiLogic = new AIPlayer(game, targetPlayer.id);
      const response = aiLogic.respondToClue(clue);
      
      // Update the clue with the response
      const updatedClues = game.clues.map(c => 
        c.id === clue.id ? { ...c, response } : c
      );
      
      await storage.updateGame({ ...game, clues: updatedClues });
      
      // Add delay for natural feel
      setTimeout(async () => {
        const updatedGame = await storage.getGame(game.id);
        if (updatedGame) {
          broadcastToGame(game.id, { type: "gameUpdated", game: updatedGame });
        }
      }, Math.random() * 1500 + 500); // 0.5-2 second delay
    }
  }
}

async function processAIHookyGuesses(game: Game): Promise<void> {
  const aiPlayers = game.players.filter(p => p.isAI);
  
  for (const aiPlayer of aiPlayers) {
    const hasGuessed = aiPlayer.hookyGuesses[game.round.toString()];
    if (!hasGuessed) {
      const aiLogic = new AIPlayer(game, aiPlayer.id);
      const guess = aiLogic.generateHookyGuess(game.round);
      
      const updatedPlayer = {
        ...aiPlayer,
        hookyGuesses: {
          ...aiPlayer.hookyGuesses,
          [game.round.toString()]: guess
        }
      };
      
      const updatedPlayers = game.players.map(p => 
        p.id === aiPlayer.id ? updatedPlayer : p
      );
      
      await storage.updateGame({ ...game, players: updatedPlayers });
      
      setTimeout(async () => {
        const updatedGame = await storage.getGame(game.id);
        if (updatedGame) {
          broadcastToGame(game.id, { type: "gameUpdated", game: updatedGame });
        }
      }, Math.random() * 3000 + 1000); // 1-4 second delay
    }
  }
}

async function processAIHandGuesses(game: Game): Promise<void> {
  const aiPlayers = game.players.filter(p => p.isAI);
  
  for (const aiPlayer of aiPlayers) {
    const hasGuessed = Object.keys(aiPlayer.handGuesses).length > 0;
    if (!hasGuessed) {
      const aiLogic = new AIPlayer(game, aiPlayer.id);
      const guesses = aiLogic.generateHandGuesses();
      
      const updatedPlayer = {
        ...aiPlayer,
        handGuesses: guesses
      };
      
      const updatedPlayers = game.players.map(p => 
        p.id === aiPlayer.id ? updatedPlayer : p
      );
      
      await storage.updateGame({ ...game, players: updatedPlayers });
      
      setTimeout(async () => {
        const updatedGame = await storage.getGame(game.id);
        if (updatedGame) {
          broadcastToGame(game.id, { type: "gameUpdated", game: updatedGame });
        }
      }, Math.random() * 4000 + 2000); // 2-6 second delay
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create game
  app.post("/api/games", async (req, res) => {
    try {
      const { playerName, singlePlayer } = createGameSchema.parse(req.body);
      const roomCode = generateRoomCode();
      
      const { game, playerId } = await storage.createGame(roomCode, playerName, singlePlayer);
      
      // Process AI actions for single-player games
      if (singlePlayer && game.phase === "pre-round") {
        setTimeout(() => processAIActions(game), 1000);
      }
      
      res.json({ game, playerId });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Join game
  app.post("/api/games/join", async (req, res) => {
    try {
      const { roomCode, playerName } = joinGameSchema.parse(req.body);
      
      const result = await storage.joinGame(roomCode, playerName);
      if (!result) {
        return res.status(404).json({ message: "Game not found or full" });
      }
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Start game
  app.post("/api/games/:gameId/start", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      if (game.players.length < 3) {
        return res.status(400).json({ message: "Need at least 3 players to start" });
      }
      
      const updatedGame = await storage.updateGame({
        ...game,
        phase: "pre-round"
      });
      
      broadcastToGame(game.id, { type: "gameUpdated", game: updatedGame });
      res.json({ game: updatedGame });
    } catch (error) {
      res.status(500).json({ message: "Failed to start game" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    const connectionId = randomUUID();
    connections.set(connectionId, { ws });
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        const connection = connections.get(connectionId);
        if (!connection) return;
        
        switch (message.type) {
          case 'joinGame':
            connection.gameId = message.gameId;
            connection.playerId = message.playerId;
            
            const game = await storage.getGame(message.gameId);
            if (game) {
              ws.send(JSON.stringify({ type: 'gameUpdated', game }));
            }
            break;
            
          case 'submitPreRoundWord':
            const wordData = submitWordSchema.parse(message.data);
            const preRoundGame = await storage.getGame(connection.gameId!);
            if (!preRoundGame || !connection.playerId) break;
            
            // Validate word is in dictionary
            const wordValidation = validateWordWithFeedback(wordData.word);
            if (!wordValidation.valid) {
              ws.send(JSON.stringify({ type: 'error', message: wordValidation.message }));
              break;
            }
            
            // Validate word contains player's letters
            const player = preRoundGame.players.find(p => p.id === connection.playerId);
            if (!player) break;
            
            const hasOwnLetter = wordData.word.split('').some(letter => player.hand.includes(letter));
            if (!hasOwnLetter) {
              ws.send(JSON.stringify({ type: 'error', message: 'Word must contain at least one of your letters' }));
              break;
            }
            
            await storage.addPreRoundWord(preRoundGame.id, {
              playerId: connection.playerId,
              word: wordData.word
            });
            
            const updatedPreGame = await storage.getGame(connection.gameId!);
            if (updatedPreGame) {
              const nextPhaseGame = advanceGamePhase(updatedPreGame);
              if (nextPhaseGame.phase !== updatedPreGame.phase) {
                await storage.updateGame(nextPhaseGame);
                broadcastToGame(connection.gameId!, { type: 'gameUpdated', game: nextPhaseGame });
                // Process AI actions for new phase
                setTimeout(() => processAIActions(nextPhaseGame), 1000);
              } else {
                broadcastToGame(connection.gameId!, { type: 'gameUpdated', game: updatedPreGame });
                // Process AI actions for current phase
                setTimeout(() => processAIActions(updatedPreGame), 500);
              }
            }
            break;
            
          case 'submitClue':
            const clueData = submitClueSchema.parse(message.data);
            const clueGame = await storage.getGame(connection.gameId!);
            if (!clueGame || !connection.playerId) break;
            
            // Validate word is in dictionary
            const clueWordValidation = validateWordWithFeedback(clueData.word);
            if (!clueWordValidation.valid) {
              ws.send(JSON.stringify({ type: 'error', message: clueWordValidation.message }));
              break;
            }
            
            // Validate it's player's turn
            const currentPlayer = clueGame.players[clueGame.currentPlayerIndex];
            if (currentPlayer.id !== connection.playerId) {
              ws.send(JSON.stringify({ type: 'error', message: 'Not your turn' }));
              break;
            }
            
            // Validate word contains player's letters
            const hasOwnLetterClue = clueData.word.split('').some(letter => currentPlayer.hand.includes(letter));
            if (!hasOwnLetterClue) {
              ws.send(JSON.stringify({ type: 'error', message: 'Word must contain at least one of your letters' }));
              break;
            }
            
            const clue: Clue = {
              id: randomUUID(),
              playerId: connection.playerId,
              targetPlayerId: clueData.targetPlayerId,
              word: clueData.word,
              round: clueGame.round,
              timestamp: Date.now()
            };
            
            await storage.addClue(clueGame.id, clue);
            
            // Notify target player to respond (but don't send to AI players as they auto-respond)
            const targetPlayer = clueGame.players.find(p => p.id === clueData.targetPlayerId);
            if (targetPlayer && !targetPlayer.isAI) {
              sendToPlayer(clueData.targetPlayerId, {
                type: 'respondToClue',
                clue
              });
            }
            
            const updatedClueGame = await storage.getGame(connection.gameId!);
            if (updatedClueGame) {
              broadcastToGame(connection.gameId!, { type: 'gameUpdated', game: updatedClueGame });
              // Process AI actions after clue submission
              setTimeout(() => processAIActions(updatedClueGame), 1000);
            }
            break;
            
          case 'respondToClue':
            const responseData = respondToClueSchema.parse(message.data);
            const responseGame = await storage.getGame(connection.gameId!);
            if (!responseGame || !connection.playerId) break;
            
            // Find and update the clue
            const clueToUpdate = responseGame.clues.find(c => c.id === responseData.clueId);
            if (!clueToUpdate || clueToUpdate.targetPlayerId !== connection.playerId) break;
            
            const updatedClues = responseGame.clues.map(c => 
              c.id === responseData.clueId ? { ...c, response: responseData.response } : c
            );
            
            let gameAfterResponse = { ...responseGame, clues: updatedClues };
            
            // Advance turn
            gameAfterResponse = nextTurn(gameAfterResponse);
            
            // Check if round is complete (all players have taken a turn)
            const cluesThisRound = updatedClues.filter(c => c.round === responseGame.round);
            if (cluesThisRound.length === responseGame.players.length) {
              // Reveal a letter
              gameAfterResponse = revealLetter(gameAfterResponse);
              
              // Advance round or phase
              if (responseGame.round < 6) {
                gameAfterResponse.round += 1;
              }
              
              gameAfterResponse = advanceGamePhase(gameAfterResponse);
            }
            
            await storage.updateGame(gameAfterResponse);
            broadcastToGame(connection.gameId!, { type: 'gameUpdated', game: gameAfterResponse });
            break;
            
          case 'submitHookyGuess':
            const hookyData = submitHookyGuessSchema.parse(message.data);
            const hookyGame = await storage.getGame(connection.gameId!);
            if (!hookyGame || !connection.playerId) break;
            
            const hookyPlayer = hookyGame.players.find(p => p.id === connection.playerId);
            if (!hookyPlayer) break;
            
            const updatedHookyPlayer = {
              ...hookyPlayer,
              hookyGuesses: {
                ...hookyPlayer.hookyGuesses,
                [hookyGame.round.toString()]: hookyData.letters
              }
            };
            
            const updatedHookyGame = {
              ...hookyGame,
              players: hookyGame.players.map(p => 
                p.id === connection.playerId ? updatedHookyPlayer : p
              )
            };
            
            await storage.updateGame(updatedHookyGame);
            
            // Only send confirmation to the player, don't broadcast guesses
            ws.send(JSON.stringify({ type: 'hookyGuessSubmitted' }));
            break;
            
          case 'submitHandGuesses':
            const handData = submitHandGuessSchema.parse(message.data);
            const handGame = await storage.getGame(connection.gameId!);
            if (!handGame || !connection.playerId) break;
            
            const handPlayer = handGame.players.find(p => p.id === connection.playerId);
            if (!handPlayer) break;
            
            const updatedHandPlayer = {
              ...handPlayer,
              handGuesses: handData.guesses
            };
            
            const updatedHandGame = {
              ...handGame,
              players: handGame.players.map(p => 
                p.id === connection.playerId ? updatedHandPlayer : p
              )
            };
            
            // Check if all players have submitted hand guesses
            const allSubmitted = updatedHandGame.players.every(p => 
              Object.keys(p.handGuesses).length > 0
            );
            
            if (allSubmitted) {
              const finalGame = advanceGamePhase(updatedHandGame);
              await storage.updateGame(finalGame);
              broadcastToGame(connection.gameId!, { type: 'gameUpdated', game: finalGame });
            } else {
              await storage.updateGame(updatedHandGame);
              ws.send(JSON.stringify({ type: 'handGuessesSubmitted' }));
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });
    
    ws.on('close', () => {
      const connection = connections.get(connectionId);
      if (connection && connection.gameId && connection.playerId) {
        storage.removePlayer(connection.gameId, connection.playerId);
      }
      connections.delete(connectionId);
    });
  });

  return httpServer;
}
