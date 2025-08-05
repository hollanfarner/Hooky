import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trophy, Users, BookOpen, Bot } from "lucide-react";
import { GameRulesModal } from "@/components/game-rules-modal";

export default function Lobby() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [singlePlayer, setSinglePlayer] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await apiRequest("POST", "/api/games", { 
        playerName: playerName.trim(),
        singlePlayer 
      });
      const { game, playerId } = await response.json();
      
      // Store player info in localStorage
      localStorage.setItem("hooky-player-id", playerId);
      localStorage.setItem("hooky-game-id", game.id);
      
      setLocation(`/game/${game.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create game",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGame = async () => {
    if (!playerName.trim() || !roomCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name and room code",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    try {
      const response = await apiRequest("POST", "/api/games/join", { 
        playerName: playerName.trim(), 
        roomCode: roomCode.trim().toUpperCase() 
      });
      const { game, playerId } = await response.json();
      
      // Store player info in localStorage
      localStorage.setItem("hooky-player-id", playerId);
      localStorage.setItem("hooky-game-id", game.id);
      
      setLocation(`/game/${game.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join game. Check room code and try again.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tearose-900 via-tearose-800 to-salmon-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            🎯 Hooky Letters
          </h1>
          <p className="text-xl text-white/90 mb-6 drop-shadow">
            A multiplayer word deduction game
          </p>
          <Button
            variant="outline"
            onClick={() => setShowRules(true)}
            className="mb-8"
            data-testid="button-show-rules"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            How to Play
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Game */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-primary" />
                Create New Game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="create-name">Your Name</Label>
                <Input
                  id="create-name"
                  data-testid="input-create-name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={20}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-tyrian/30 p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="practice-mode" className="text-sm font-medium flex items-center">
                    <Bot className="w-4 h-4 mr-2 text-tyrian" />
                    Practice Mode
                  </Label>
                  <div className="text-xs text-muted-foreground">
                    Play with AI opponents to learn the game
                  </div>
                </div>
                <Switch
                  id="practice-mode"
                  checked={singlePlayer}
                  onCheckedChange={setSinglePlayer}
                  data-testid="switch-single-player"
                />
              </div>
              <Button
                onClick={handleCreateGame}
                disabled={isCreating}
                className="w-full"
                data-testid="button-create-game"
              >
                {isCreating ? "Creating..." : singlePlayer ? "Start Practice" : "Create Game"}
              </Button>
            </CardContent>
          </Card>

          {/* Join Game */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-secondary" />
                Join Existing Game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="join-name">Your Name</Label>
                <Input
                  id="join-name"
                  data-testid="input-join-name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={20}
                />
              </div>
              <div>
                <Label htmlFor="room-code">Room Code</Label>
                <Input
                  id="room-code"
                  data-testid="input-room-code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character room code"
                  maxLength={6}
                  className="font-mono uppercase"
                />
              </div>
              <Button
                onClick={handleJoinGame}
                disabled={isJoining}
                className="w-full"
                data-testid="button-join-game"
              >
                {isJoining ? "Joining..." : "Join Game"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="font-semibold text-lg mb-2">Strategic Deduction</h3>
            <p className="text-slate-600 text-sm">
              Use clever word clues to deduce hidden letters and opponents' hands
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-semibold text-lg mb-2">3-5 Players</h3>
            <p className="text-slate-600 text-sm">
              Perfect for small groups, with dynamic letter distribution
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="text-3xl mb-3">⏱️</div>
            <h3 className="font-semibold text-lg mb-2">6 Exciting Rounds</h3>
            <p className="text-slate-600 text-sm">
              Multiple phases with increasing complexity and scoring
            </p>
          </div>
        </div>
      </div>

      <GameRulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
    </div>
  );
}
