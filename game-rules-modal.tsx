import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface GameRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameRulesModal({ isOpen, onClose }: GameRulesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto" data-testid="modal-game-rules">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-slate-900">
              🎯 Hooky Letters Rules
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-rules">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">🧠 Game Setup</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>26 letters (A–Z) total</li>
              <li>3 random "hooky" letters are removed (hidden from all players)</li>
              <li>Remaining 23 letters distributed among players + some unrevealed</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">📝 Pre-Round Phase</h3>
            <p className="text-slate-600">
              Every player submits a 5-letter word using at least one of their own letters. 
              These words are revealed publicly.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">🔁 Rounds 1–3: Word & Feedback</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Players take turns giving 5-letter clue words</li>
              <li>Clue must contain at least one letter from their own hand</li>
              <li>Ask another player: "How many of your letters are in this word?"</li>
              <li>That player reveals the count publicly</li>
              <li>After each round, one unrevealed letter is shown to all</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">🔁 Rounds 4–6: Guessing Phase</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>Continue clue/feedback process</li>
              <li>At round end, each player guesses the 3 hooky letters (secret)</li>
              <li>Guesses revealed and scored after Round 6</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">🎯 Final Phase: Hand Deduction</h3>
            <p className="text-slate-600">
              Each player submits guesses for what letters each other player holds.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">🧮 Scoring</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li><strong>Hooky Letters:</strong> Round 4-5: +5 pts per correct, Round 6: +10 pts per correct</li>
              <li><strong>Hand Deduction:</strong> +1 pt per correct letter, +1 bonus for complete hand</li>
            </ul>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">🎯 Objective</h3>
            <p className="text-slate-600">
              Players try to deduce:
            </p>
            <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
              <li>The 3 hidden "hooky" letters that no one holds</li>
              <li>Which letters the other players are holding</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
