import type { Game, Player, Clue } from "@shared/schema";
import { randomUUID } from "crypto";
import { VALID_WORDS, getRandomValidWord } from "./word-validator";

// Get common words from the validator
const COMMON_WORDS = [...VALID_WORDS];

// AI difficulty levels
export type AIDifficulty = 'easy' | 'medium' | 'hard';

export class AIPlayer {
  private difficulty: AIDifficulty;
  private game: Game;
  private playerId: string;

  constructor(game: Game, playerId: string, difficulty: AIDifficulty = 'medium') {
    this.game = game;
    this.playerId = playerId;
    this.difficulty = difficulty;
  }

  // Generate a pre-round word
  generatePreRoundWord(): string {
    const player = this.game.players.find(p => p.id === this.playerId);
    if (!player) throw new Error('AI player not found');

    // Find words that contain at least one of the AI's letters
    const validWords = COMMON_WORDS.filter(word => 
      word.split('').some(letter => player.hand.includes(letter))
    );

    if (validWords.length === 0) {
      // Fallback: create a word using available letters
      return this.createWordFromHand(player.hand);
    }

    return validWords[Math.floor(Math.random() * validWords.length)];
  }

  // Generate a clue word and select target player
  generateClue(): { word: string; targetPlayerId: string } {
    const player = this.game.players.find(p => p.id === this.playerId);
    if (!player) throw new Error('AI player not found');

    const otherPlayers = this.game.players.filter(p => p.id !== this.playerId && !p.isAI);
    if (otherPlayers.length === 0) {
      // If only AI players, target another AI
      const allOthers = this.game.players.filter(p => p.id !== this.playerId);
      const targetPlayer = allOthers[Math.floor(Math.random() * allOthers.length)];
      
      return {
        word: this.generateStrategicWord(player),
        targetPlayerId: targetPlayer.id
      };
    }

    // Prefer targeting human players for more interesting gameplay
    const targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    
    return {
      word: this.generateStrategicWord(player),
      targetPlayerId: targetPlayer.id
    };
  }

  // Respond to a clue
  respondToClue(clue: Clue): number {
    const player = this.game.players.find(p => p.id === this.playerId);
    if (!player) throw new Error('AI player not found');

    const actualCount = this.calculateLettersInWord(player.hand, clue.word);
    
    // Add some randomness based on difficulty
    if (this.difficulty === 'easy') {
      // Easy AI might make mistakes 20% of the time
      if (Math.random() < 0.2) {
        const variation = Math.random() < 0.5 ? -1 : 1;
        return Math.max(0, Math.min(5, actualCount + variation));
      }
    } else if (this.difficulty === 'medium') {
      // Medium AI might make mistakes 10% of the time
      if (Math.random() < 0.1) {
        const variation = Math.random() < 0.5 ? -1 : 1;
        return Math.max(0, Math.min(5, actualCount + variation));
      }
    }
    // Hard AI always gives correct answers

    return actualCount;
  }

  // Generate hooky letter guesses
  generateHookyGuess(round: number): string[] {
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const usedLetters = new Set([
      ...this.game.players.flatMap(p => p.hand),
      ...this.game.revealedLetters
    ]);

    const possibleHookyLetters = allLetters.filter(letter => !usedLetters.has(letter));
    
    // Shuffle and take 3
    const shuffled = [...possibleHookyLetters].sort(() => Math.random() - 0.5);
    
    // Add some strategy based on difficulty and round
    if (this.difficulty === 'hard' && round >= 5) {
      // Hard AI tries to analyze clue patterns for better guesses
      return this.analyzeCluesForHookyLetters(shuffled);
    }
    
    return shuffled.slice(0, 3);
  }

  // Generate hand deduction guesses
  generateHandGuesses(): Record<string, string[]> {
    const guesses: Record<string, string[]> = {};
    const otherPlayers = this.game.players.filter(p => p.id !== this.playerId);
    
    for (const targetPlayer of otherPlayers) {
      guesses[targetPlayer.id] = this.guessPlayerHand(targetPlayer);
    }
    
    return guesses;
  }

  // Helper methods
  private createWordFromHand(hand: string[]): string {
    // Simple algorithm to create a valid-looking word
    const vowels = hand.filter(letter => 'AEIOU'.includes(letter));
    const consonants = hand.filter(letter => !'AEIOU'.includes(letter));
    
    let word = '';
    for (let i = 0; i < 5; i++) {
      if (i % 2 === 0 && consonants.length > 0) {
        word += consonants[Math.floor(Math.random() * consonants.length)];
      } else if (vowels.length > 0) {
        word += vowels[Math.floor(Math.random() * vowels.length)];
      } else if (consonants.length > 0) {
        word += consonants[Math.floor(Math.random() * consonants.length)];
      } else {
        word += hand[Math.floor(Math.random() * hand.length)];
      }
    }
    
    return word.padEnd(5, hand[0]).slice(0, 5);
  }

  private generateStrategicWord(player: Player): string {
    // Try to find a word that contains some of the player's letters
    // but also might reveal information about other players
    const validWords = COMMON_WORDS.filter(word => {
      const wordLetters = word.split('');
      return wordLetters.some(letter => player.hand.includes(letter));
    });

    if (validWords.length === 0) {
      return this.createWordFromHand(player.hand);
    }

    // Pick a word strategically based on difficulty
    if (this.difficulty === 'hard') {
      // Hard AI tries to pick words that might reveal more information
      return this.pickStrategicWord(validWords, player);
    }

    return validWords[Math.floor(Math.random() * validWords.length)];
  }

  private pickStrategicWord(validWords: string[], player: Player): string {
    // Analyze previous clues to pick words that might reveal patterns
    const recentClues = this.game.clues.slice(-3); // Look at recent clues
    
    // Prefer words that share some letters with recent clues
    const strategicWords = validWords.filter(word => {
      return recentClues.some(clue => {
        const overlap = word.split('').filter(letter => clue.word.includes(letter));
        return overlap.length >= 1 && overlap.length <= 3; // Some overlap but not too much
      });
    });

    if (strategicWords.length > 0) {
      return strategicWords[Math.floor(Math.random() * strategicWords.length)];
    }

    return validWords[Math.floor(Math.random() * validWords.length)];
  }

  private calculateLettersInWord(playerHand: string[], word: string): number {
    const wordLetters = word.split('');
    const handSet = new Set(playerHand);
    return wordLetters.filter(letter => handSet.has(letter)).length;
  }

  private analyzeCluesForHookyLetters(possibleLetters: string[]): string[] {
    // Analyze clue patterns to make educated guesses about hooky letters
    const letterFrequency: Record<string, number> = {};
    
    // Count how often each letter appears in clues vs responses
    for (const clue of this.game.clues) {
      const clueLetters = new Set(clue.word.split(''));
      for (const letter of clueLetters) {
        letterFrequency[letter] = (letterFrequency[letter] || 0) + 1;
      }
    }

    // Letters that appear frequently in clues but get low responses might be hooky
    const suspiciousLetters = possibleLetters.filter(letter => {
      const frequency = letterFrequency[letter] || 0;
      return frequency >= 2; // Appeared in multiple clues
    });

    if (suspiciousLetters.length >= 3) {
      return suspiciousLetters.slice(0, 3);
    }

    // Fill remaining slots with random choices
    const remaining = possibleLetters.filter(l => !suspiciousLetters.includes(l));
    const additionalGuesses = remaining.slice(0, 3 - suspiciousLetters.length);
    
    return [...suspiciousLetters, ...additionalGuesses];
  }

  private guessPlayerHand(targetPlayer: Player): string[] {
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const knownUsedLetters = new Set([
      ...this.game.hookyLetters,
      ...this.game.revealedLetters,
      ...this.game.players.filter(p => p.id !== targetPlayer.id).flatMap(p => p.hand)
    ]);

    const possibleLetters = allLetters.filter(letter => !knownUsedLetters.has(letter));
    
    // Analyze clues involving this player
    const targetClues = this.game.clues.filter(c => 
      c.targetPlayerId === targetPlayer.id || c.playerId === targetPlayer.id
    );

    const likelyLetters: string[] = [];
    const analyzedLetters = new Set<string>();

    // Analyze response patterns
    for (const clue of targetClues) {
      if (clue.targetPlayerId === targetPlayer.id && clue.response > 0) {
        // This player responded positively, so they likely have some of these letters
        for (const letter of clue.word.split('')) {
          if (!analyzedLetters.has(letter) && possibleLetters.includes(letter)) {
            likelyLetters.push(letter);
            analyzedLetters.add(letter);
          }
        }
      }
    }

    // Fill remaining slots with educated guesses
    const lettersPerPlayer = targetPlayer.hand.length;
    while (likelyLetters.length < lettersPerPlayer && possibleLetters.length > 0) {
      const randomLetter = possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
      if (!likelyLetters.includes(randomLetter)) {
        likelyLetters.push(randomLetter);
      }
    }

    return likelyLetters.slice(0, lettersPerPlayer);
  }
}

// Create AI players with different personalities
export function createAIPlayer(name: string, difficulty: AIDifficulty = 'medium'): Omit<Player, 'hand'> {
  return {
    id: randomUUID(),
    name,
    hookyGuesses: {},
    handGuesses: {},
    score: { hooky: 0, hand: 0, total: 0 },
    connected: true,
    isAI: true
  };
}

// AI player names and personalities
export const AI_PLAYERS = [
  { name: 'Dr. Wordsworth', difficulty: 'hard' as AIDifficulty },
  { name: 'Lexie', difficulty: 'medium' as AIDifficulty },
  { name: 'Puzzle Pete', difficulty: 'medium' as AIDifficulty },
  { name: 'Clue Bot', difficulty: 'easy' as AIDifficulty }
];