import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown } from "lucide-react";
import type { Game } from "@shared/schema";

interface PlayersListProps {
  game: Game;
  currentPlayerId: string;
}

export function PlayersList({ game, currentPlayerId }: PlayersListProps) {
  const sortedPlayers = [...game.players].sort((a, b) => b.score.total - a.score.total);
  const currentTurnPlayer = game.players[game.currentPlayerIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 text-secondary mr-2" />
          Players
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedPlayers.map((player, index) => {
            const isCurrentPlayer = player.id === currentPlayerId;
            const isCurrentTurn = currentTurnPlayer?.id === player.id;
            const isLeader = index === 0 && player.score.total > 0;
            
            return (
              <div
                key={player.id}
                className={`border rounded-lg p-4 ${
                  isCurrentPlayer ? 'bg-primary/5 border-primary/20' : 
                  !player.connected ? 'bg-slate-100 border-slate-200' :
                  'border-slate-200'
                }`}
                data-testid={`player-card-${player.name}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${!player.connected ? 'text-slate-500' : ''}`}>
                    {player.name}
                    {isCurrentPlayer && ' (You)'}
                  </span>
                  <div className="flex items-center space-x-1">
                    {isLeader && (
                      <Crown className="w-4 h-4 text-yellow-500" data-testid={`crown-${player.name}`} />
                    )}
                    {isCurrentTurn && game.phase !== "waiting" && (
                      <span className="bg-primary text-white px-2 py-1 rounded-full text-xs">
                        Current
                      </span>
                    )}
                    {!player.connected && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        Offline
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Score:</span>
                    <span className="font-medium" data-testid={`score-${player.name}`}>
                      {player.score.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Letters:</span>
                    <span className="font-medium" data-testid={`letters-${player.name}`}>
                      {player.hand.length}
                    </span>
                  </div>
                  {game.phase === "finished" && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-xs">
                      <div className="flex justify-between">
                        <span>Hooky:</span>
                        <span>{player.score.hooky}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hand:</span>
                        <span>{player.score.hand}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
