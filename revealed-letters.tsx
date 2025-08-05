import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import type { Game } from "@shared/schema";

interface RevealedLettersProps {
  game: Game;
}

export function RevealedLetters({ game }: RevealedLettersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-5 h-5 text-success mr-2" />
          Revealed Letters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {game.revealedLetters.map((letter, index) => (
            <div
              key={index}
              className="bg-sky text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg border-2 border-sky-600/30"
              data-testid={`revealed-letter-${letter}`}
            >
              {letter}
            </div>
          ))}
          
          {/* Show placeholder for unrevealed letters */}
          {game.unrevealed.map((_, index) => (
            <div
              key={`unrevealed-${index}`}
              className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-bold text-lg"
              data-testid={`unrevealed-placeholder-${index}`}
            >
              ?
            </div>
          ))}
        </div>
        
        <p className="text-sm text-slate-600" data-testid="text-reveal-info">
          {game.unrevealed.length > 0 ? (
            <>Letters will be revealed after each round</>
          ) : (
            <>All letters have been revealed</>
          )}
        </p>
        
        {/* Show count */}
        <div className="mt-2 text-xs text-slate-500">
          Revealed: {game.revealedLetters.length} • Remaining: {game.unrevealed.length}
        </div>
      </CardContent>
    </Card>
  );
}
