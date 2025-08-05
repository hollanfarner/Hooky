import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Plus, Clock } from "lucide-react";
import type { Game } from "@shared/schema";

interface GameHistoryProps {
  game: Game;
}

export function GameHistory({ game }: GameHistoryProps) {
  const cluesByRound = game.clues.reduce((acc, clue) => {
    if (!acc[clue.round]) acc[clue.round] = [];
    acc[clue.round].push(clue);
    return acc;
  }, {} as Record<number, typeof game.clues>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="w-5 h-5 text-secondary mr-2" />
          Game History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Pre-Round Words */}
          {game.preRoundWords.length > 0 && (
            <div className="border-l-4 border-slate-300 pl-4">
              <h4 className="font-medium text-slate-700 mb-2">Pre-Round Submissions</h4>
              <div className="space-y-2 text-sm">
                {game.preRoundWords.map((submission, index) => {
                  const player = game.players.find(p => p.id === submission.playerId);
                  return (
                    <div key={index} className="flex justify-between items-center">
                      <span data-testid={`pre-round-${player?.name}`}>
                        <strong>{player?.name}:</strong> {submission.word}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rounds */}
          {Object.entries(cluesByRound)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([roundStr, roundClues]) => {
              const round = parseInt(roundStr);
              const isCurrentRound = round === game.round;
              
              return (
                <div
                  key={round}
                  className={`border-l-4 pl-4 ${
                    isCurrentRound ? 'border-warning' : 'border-primary'
                  }`}
                >
                  <h4 className="font-medium text-slate-700 mb-2">
                    Round {round}
                    {isCurrentRound && ' (Current)'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    {roundClues.map((clue) => {
                      const cluePlayer = game.players.find(p => p.id === clue.playerId);
                      const targetPlayer = game.players.find(p => p.id === clue.targetPlayerId);
                      
                      return (
                        <div
                          key={clue.id}
                          className="bg-slate-50 p-3 rounded-lg"
                          data-testid={`clue-${clue.id}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span>
                              <strong>{cluePlayer?.name}</strong> → <strong>{targetPlayer?.name}:</strong> "{clue.word}"
                            </span>
                            {clue.response !== undefined ? (
                              <span className="bg-blush text-white px-2 py-1 rounded text-xs font-medium">
                                {clue.response}
                              </span>
                            ) : (
                              <span className="bg-salmon text-white px-2 py-1 rounded text-xs font-medium">
                                Pending
                              </span>
                            )}
                          </div>
                          {clue.response !== undefined && (
                            <p className="text-slate-600 text-xs">
                              {targetPlayer?.name} has {clue.response} letters from {clue.word}
                            </p>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Show waiting indicator for current round */}
                    {isCurrentRound && roundClues.length < game.players.length && (
                      <div className="bg-salmon/10 border border-salmon/20 p-3 rounded-lg">
                        <p className="text-salmon font-medium text-xs flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Waiting for more clues this round...
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Show revealed letter for completed rounds */}
                  {!isCurrentRound && round <= game.revealedLetters.length && (
                    <div className="text-xs text-success font-medium mt-2 flex items-center">
                      <Plus className="w-3 h-3 mr-1" />
                      Letter revealed after this round
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
