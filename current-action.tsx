import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Game, Player, Clue } from "@shared/schema";
import { calculateLettersInWord } from "@/lib/game-utils";

interface CurrentActionProps {
  game: Game;
  currentPlayer: Player;
  isCurrentTurn: boolean;
  pendingClue: Clue | null;
  onClearPendingClue: () => void;
  onSendMessage: (message: any) => void;
}

export function CurrentAction({
  game,
  currentPlayer,
  isCurrentTurn,
  pendingClue,
  onClearPendingClue,
  onSendMessage
}: CurrentActionProps) {
  const { toast } = useToast();
  const [word, setWord] = useState("");
  const [targetPlayerId, setTargetPlayerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const otherPlayers = game.players.filter(p => p.id !== currentPlayer.id && p.connected);

  const handleSubmitPreRoundWord = async () => {
    if (!word.trim() || word.length !== 5) {
      toast({
        title: "Invalid Word",
        description: "Please enter a 5-letter word",
        variant: "destructive"
      });
      return;
    }

    const hasOwnLetter = word.toUpperCase().split('').some(letter => 
      currentPlayer.hand.includes(letter)
    );

    if (!hasOwnLetter) {
      toast({
        title: "Invalid Word",
        description: "Word must contain at least one of your letters",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    onSendMessage({
      type: 'submitPreRoundWord',
      data: { word: word.toUpperCase() }
    });
    
    setWord("");
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const handleSubmitClue = async () => {
    if (!word.trim() || word.length !== 5) {
      toast({
        title: "Invalid Word",
        description: "Please enter a 5-letter word",
        variant: "destructive"
      });
      return;
    }

    if (!targetPlayerId) {
      toast({
        title: "No Target Selected",
        description: "Please select a player to ask",
        variant: "destructive"
      });
      return;
    }

    const hasOwnLetter = word.toUpperCase().split('').some(letter => 
      currentPlayer.hand.includes(letter)
    );

    if (!hasOwnLetter) {
      toast({
        title: "Invalid Word",
        description: "Word must contain at least one of your letters",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    onSendMessage({
      type: 'submitClue',
      data: { 
        word: word.toUpperCase(),
        targetPlayerId 
      }
    });
    
    setWord("");
    setTargetPlayerId("");
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const handleRespondToClue = (response: number) => {
    if (!pendingClue) return;
    
    onSendMessage({
      type: 'respondToClue',
      data: {
        clueId: pendingClue.id,
        response
      }
    });
    
    onClearPendingClue();
  };

  // Handle hand deduction phase
  if (game.phase === "hand-deduction") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Final Phase: Hand Deduction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            Submit your guesses for what letters each other player holds.
          </p>
          <Button
            onClick={() => {
              // This would open a modal for hand deduction guesses
              toast({
                title: "Feature Coming",
                description: "Hand deduction interface will be implemented",
              });
            }}
            className="w-full"
            data-testid="button-hand-deduction"
          >
            Submit Hand Guesses
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Handle game finished
  if (game.phase === "finished") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            The game has ended. Check the final scores!
          </p>
          <div className="space-y-2">
            <h4 className="font-medium">Hooky Letters:</h4>
            <div className="flex gap-2">
              {game.hookyLetters.map((letter, index) => (
                <div
                  key={index}
                  className="bg-salmon text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg border-2 border-salmon-600/30"
                  data-testid={`hooky-letter-${letter}`}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle pending clue response
  if (pendingClue) {
    const matchCount = calculateLettersInWord(currentPlayer.hand, pendingClue.word);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Respond to Clue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600">
                <strong>{game.players.find(p => p.id === pendingClue.playerId)?.name}</strong> asked:
              </p>
              <p className="text-lg font-mono font-bold text-center py-2">
                "{pendingClue.word}"
              </p>
              <p className="text-sm text-slate-600">
                How many of your letters are in this word?
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <Button
                  key={num}
                  onClick={() => handleRespondToClue(num)}
                  variant={num === matchCount ? "default" : "outline"}
                  className="h-12 text-lg font-bold"
                  data-testid={`button-response-${num}`}
                >
                  {num}
                </Button>
              ))}
            </div>
            
            <p className="text-xs text-slate-500 text-center">
              Suggested answer: {matchCount} (based on your hand)
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pre-round phase
  if (game.phase === "pre-round") {
    const hasSubmitted = game.preRoundWords.some(w => w.playerId === currentPlayer.id);
    
    if (hasSubmitted) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Pre-Round Word Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Waiting for other players to submit their words...
            </p>
            <div className="mt-4">
              <p className="text-xs text-slate-500">
                {game.preRoundWords.length} of {game.players.length} players submitted
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Submit Pre-Round Word</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pre-round-word">Enter 5-letter word:</Label>
              <Input
                id="pre-round-word"
                data-testid="input-pre-round-word"
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value.toUpperCase())}
                placeholder="GAMES"
                maxLength={5}
                className="uppercase tracking-widest text-center font-mono text-lg"
              />
              <p className="text-xs text-slate-500 mt-1">
                Must contain at least one of your letters
              </p>
            </div>
            <Button
              onClick={handleSubmitPreRoundWord}
              disabled={isSubmitting || word.length !== 5}
              className="w-full"
              data-testid="button-submit-pre-round"
            >
              {isSubmitting ? "Submitting..." : "Submit Word"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Regular game turns
  if (!isCurrentTurn) {
    const currentTurnPlayer = game.players[game.currentPlayerIndex];
    return (
      <Card>
        <CardHeader>
          <CardTitle>Waiting for Turn</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            It's <strong data-testid="text-current-player">{currentTurnPlayer?.name}</strong>'s turn to give a clue.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Turn</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="clue-word">Enter 5-letter clue word:</Label>
            <Input
              id="clue-word"
              data-testid="input-clue-word"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value.toUpperCase())}
              placeholder="GAMES"
              maxLength={5}
              className="uppercase tracking-widest text-center font-mono text-lg"
            />
            <p className="text-xs text-slate-500 mt-1">
              Must contain at least one of your letters
            </p>
          </div>
          <div>
            <Label htmlFor="target-player">Ask player:</Label>
            <Select value={targetPlayerId} onValueChange={setTargetPlayerId}>
              <SelectTrigger data-testid="select-target-player">
                <SelectValue placeholder="Select player..." />
              </SelectTrigger>
              <SelectContent>
                {otherPlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmitClue}
            disabled={isSubmitting || word.length !== 5 || !targetPlayerId}
            className="w-full"
            data-testid="button-submit-clue"
          >
            {isSubmitting ? "Submitting..." : "Submit Clue Word"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
