import { HandIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Player } from "@shared/schema";

interface PlayerHandProps {
  player: Player;
}

export function PlayerHand({ player }: PlayerHandProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <HandIcon className="w-5 h-5 text-primary mr-2" />
          Your Letters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {player.hand.map((letter, index) => (
            <div
              key={index}
              className="bg-tyrian text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg border-2 border-tyrian-600/30"
              data-testid={`letter-hand-${letter}`}
            >
              {letter}
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600" data-testid="text-hand-count">
          You have <span className="font-medium">{player.hand.length}</span> letters
        </p>
        
        {/* Score display */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="font-medium text-slate-900 mb-2">Your Score</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Hooky Letters:</span>
              <span className="font-semibold" data-testid="text-hooky-score">{player.score.hooky}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Hand Deduction:</span>
              <span className="font-semibold" data-testid="text-hand-score">{player.score.hand}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between">
              <span className="font-semibold text-slate-900">Total:</span>
              <span className="font-bold text-xl text-primary" data-testid="text-total-score">
                {player.score.total}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
