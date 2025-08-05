import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Game } from "@shared/schema";

interface GameHeaderProps {
  game: Game;
}

const phaseLabels: Record<string, string> = {
  "waiting": "Waiting for Players",
  "pre-round": "Pre-Round Submissions",
  "word-feedback": "Word & Feedback Phase",
  "guessing": "Guessing Phase",
  "hand-deduction": "Hand Deduction Phase",
  "finished": "Game Complete"
};

export function GameHeader({ game }: GameHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-slate-900" data-testid="text-game-title">
              🎯 Hooky Letters
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
              {game.round > 0 && (
                <>
                  <span 
                    className="bg-secondary/10 text-secondary px-2 py-1 rounded-full font-medium"
                    data-testid="text-round-indicator"
                  >
                    Round {game.round} of 6
                  </span>
                  <span>•</span>
                </>
              )}
              <span data-testid="text-phase-indicator">
                {phaseLabels[game.phase] || game.phase}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">
              Room: <span className="font-mono font-medium" data-testid="text-room-code">{game.roomCode}</span>
            </div>
            <Button variant="ghost" size="sm" data-testid="button-settings">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
