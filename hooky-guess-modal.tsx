import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HookyGuessModalProps {
  isOpen: boolean;
  round: number;
  onSubmit: (letters: string[]) => void;
  onSkip: () => void;
}

export function HookyGuessModal({ isOpen, round, onSubmit, onSkip }: HookyGuessModalProps) {
  const [letters, setLetters] = useState<string[]>(["", "", ""]);

  const handleLetterChange = (index: number, value: string) => {
    const newLetters = [...letters];
    newLetters[index] = value.toUpperCase();
    setLetters(newLetters);
    
    // Auto-focus next input
    if (value && index < 2) {
      const nextInput = document.getElementById(`hooky-letter-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = () => {
    if (letters.some(letter => !letter.trim())) {
      return; // Don't submit if any letter is empty
    }
    onSubmit(letters);
    setLetters(["", "", ""]);
  };

  const handleSkip = () => {
    onSkip();
    setLetters(["", "", ""]);
  };

  const pointsPerCorrect = round === 6 ? 10 : 5;

  return (
    <Dialog open={isOpen} onOpenChange={handleSkip}>
      <DialogContent className="max-w-md" data-testid="modal-hooky-guess">
        <DialogHeader>
          <DialogTitle>Guess the Hooky Letters</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Enter your guess for the 3 hidden letters that no one holds:
          </p>
          
          <div className="text-center">
            <p className="text-sm font-medium text-primary">
              Round {round}: {pointsPerCorrect} points per correct letter
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {letters.map((letter, index) => (
              <div key={index}>
                <Label htmlFor={`hooky-letter-${index}`} className="sr-only">
                  Letter {index + 1}
                </Label>
                <Input
                  id={`hooky-letter-${index}`}
                  data-testid={`input-hooky-letter-${index}`}
                  type="text"
                  value={letter}
                  onChange={(e) => handleLetterChange(index, e.target.value)}
                  className="w-full h-16 text-center text-2xl font-bold uppercase"
                  maxLength={1}
                  placeholder="?"
                />
              </div>
            ))}
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1"
              data-testid="button-skip-hooky"
            >
              Skip This Round
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={letters.some(letter => !letter.trim())}
              className="flex-1"
              data-testid="button-submit-hooky"
            >
              Submit Guess
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
