export function calculateLettersInWord(playerHand: string[], word: string): number {
  const wordLetters = word.split('');
  const handSet = new Set(playerHand);
  return wordLetters.filter(letter => handSet.has(letter)).length;
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getPhaseDescription(phase: string, round: number): string {
  switch (phase) {
    case "waiting":
      return "Waiting for Players";
    case "pre-round":
      return "Pre-Round Submissions";
    case "word-feedback":
      return `Round ${round}: Word & Feedback Phase`;
    case "guessing":
      return `Round ${round}: Guessing Phase`;
    case "hand-deduction":
      return "Final Phase: Hand Deduction";
    case "finished":
      return "Game Complete";
    default:
      return phase;
  }
}

export function isHookyGuessRound(round: number): boolean {
  return [4, 5, 6].includes(round);
}

export function getHookyPoints(round: number): number {
  return round === 6 ? 10 : 5;
}
