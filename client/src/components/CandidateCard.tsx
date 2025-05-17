import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle } from 'lucide-react';

interface CandidateCardProps {
  id: number;
  name: string;
  proposal: string;
  isVoted: boolean;
  isSelected: boolean;
  disabled: boolean;
  onVote: (id: number) => void;
  className?: string;
}

export function CandidateCard({ 
  id, 
  name, 
  proposal, 
  isVoted, 
  isSelected, 
  disabled, 
  onVote, 
  className 
}: CandidateCardProps) {
  return (
    <div 
      className={cn(
        "border rounded-lg p-4 transition duration-300",
        isSelected 
          ? "border-[hsl(var(--primary))]" 
          : "border-[hsl(var(--neutral-200))] hover:border-[hsl(var(--primary))]",
        "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-lg">{name}</h3>
        {isSelected && (
          <CheckCircle className="text-[hsl(var(--success))] w-5 h-5" />
        )}
      </div>
      <p className="text-sm text-[hsl(var(--neutral-300))] mb-4">{proposal}</p>
      <div className="mt-auto">
        <Button
          onClick={() => onVote(id)}
          disabled={disabled || isVoted}
          className={cn(
            "w-full",
            disabled || isVoted 
              ? "bg-[hsl(var(--neutral-300))]" 
              : "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-dark))]"
          )}
        >
          {isVoted ? "Voted" : "Vote"}
        </Button>
      </div>
    </div>
  );
}
