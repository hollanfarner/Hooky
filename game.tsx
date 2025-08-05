import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { GameHeader } from "@/components/game-header";
import { PlayerHand } from "@/components/player-hand";
import { CurrentAction } from "@/components/current-action";
import { GameHistory } from "@/components/game-history";
import { RevealedLetters } from "@/components/revealed-letters";
import { PlayersList } from "@/components/players-list";
import { HookyGuessModal } from "@/components/hooky-guess-modal";
import { GameRulesModal } from "@/components/game-rules-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Game } from "@shared/schema";
import { Play, BookOpen } from "lucide-react";

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { toast } = useToast();
  const [game, setGame] = useState<Game | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [showHookyGuess, setShowHookyGuess] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [pendingClue, setPendingClue] = useState<any>(null);

  const { sendMessage, isConnected } = useWebSocket({
    onMessage: (message) => {
      switch (message.type) {
        case 'gameUpdated':
          setGame(message.game);
          
          // Show hooky guess modal at end of rounds 4-6
          if (message.game.phase === "guessing" && 
              [4, 5, 6].includes(message.game.round) &&
              message.game.currentPlayerIndex === 0) {
            setShowHookyGuess(true);
          }
          break;
        case 'respondToClue':
          setPendingClue(message.clue);
          break;
        case 'hookyGuessSubmitted':
          toast({
            title: "Guess Submitted",
            description: "Your hooky letter guess has been recorded"
          });
          setShowHookyGuess(false);
          break;
        case 'handGuessesSubmitted':
          toast({
            title: "Guesses Submitted",
            description: "Your hand deduction guesses have been recorded"
          });
          break;
        case 'error':
          toast({
            title: "Error",
            description: message.message,
            variant: "destructive"
          });
          break;
      }
    }
  });

  useEffect(() => {
    if (!gameId) return;
    
    const storedPlayerId = localStorage.getItem("hooky-player-id");
    const storedGameId = localStorage.getItem("hooky-game-id");
    
    if (!storedPlayerId || storedGameId !== gameId) {
      toast({
        title: "Error",
        description: "Invalid game session",
        variant: "destructive"
      });
      return;
    }
    
    setPlayerId(storedPlayerId);
    
    if (isConnected) {
      sendMessage({
        type: 'joinGame',
        gameId,
        playerId: storedPlayerId
      });
    }
  }, [gameId, isConnected, sendMessage, toast]);

  const handleStartGame = async () => {
    if (!gameId) return;
    
    try {
      await apiRequest("POST", `/api/games/${gameId}/start`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start game",
        variant: "destructive"
      });
    }
  };

  const currentPlayer = game?.players.find(p => p.id === playerId);
  const isCurrentTurn = game && currentPlayer && game.players[game.currentPlayerIndex]?.id === playerId;

  if (!game || !currentPlayer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (game.phase === "waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tearose-900 via-tearose-800 to-salmon-900">
        <GameHeader game={game} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Waiting for Players
                </h2>
                <p className="text-slate-600 mb-6">
                  Room Code: <span className="font-mono font-bold text-lg">{game.roomCode}</span>
                </p>
                
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold">Players ({game.players.length}/5):</h3>
                  <div className="grid gap-2">
                    {game.players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium">{player.name}</span>
                        {player.connected ? (
                          <span className="text-green-600 text-sm">Connected</span>
                        ) : (
                          <span className="text-red-600 text-sm">Disconnected</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {game.players.length >= 3 && (
                  <Button 
                    onClick={handleStartGame} 
                    size="lg"
                    data-testid="button-start-game"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Game
                  </Button>
                )}
                {game.players.length < 3 && (
                  <p className="text-slate-500">Need at least 3 players to start</p>
                )}
                
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowRules(true)}
                    data-testid="button-show-rules"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    How to Play
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tearose-900 via-tearose-800 to-salmon-900">
      <GameHeader game={game} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Player Info & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <PlayerHand player={currentPlayer} />
            
            <CurrentAction
              game={game}
              currentPlayer={currentPlayer}
              isCurrentTurn={!!isCurrentTurn}
              pendingClue={pendingClue}
              onClearPendingClue={() => setPendingClue(null)}
              onSendMessage={sendMessage}
            />
          </div>

          {/* Center Column: Game Board */}
          <div className="lg:col-span-2 space-y-6">
            <RevealedLetters game={game} />
            <GameHistory game={game} />
            <PlayersList game={game} currentPlayerId={playerId || ""} />
          </div>
        </div>
      </main>

      <HookyGuessModal
        isOpen={showHookyGuess}
        round={game.round}
        onSubmit={(letters) => {
          sendMessage({
            type: 'submitHookyGuess',
            data: { letters }
          });
        }}
        onSkip={() => setShowHookyGuess(false)}
      />

      <GameRulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
    </div>
  );
}
