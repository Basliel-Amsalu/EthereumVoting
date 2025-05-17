import React from "react";
import { Card } from "@/components/ui/card";
import { Winner } from "@/lib/contracts";
import { Award, Vote, CheckCircle } from "lucide-react";

interface WinnerDisplayProps {
  winner: Winner | null;
  votingEnded: boolean;
}

export function WinnerDisplay({ winner, votingEnded }: WinnerDisplayProps) {
  if (!winner) {
    return null;
  }

  // Format percentage to show 2 decimal places
  const percentage =
    typeof winner.percentage === "bigint"
      ? Number(winner.percentage)
      : winner.percentage;
  const formattedPercentage = (percentage / 100).toFixed(2);

  return (
    <Card className='bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-[hsl(var(--success))]'>
      <div className='flex items-center mb-4'>
        <div className='w-10 h-10 bg-[hsl(var(--success))]/10 rounded-full flex items-center justify-center mr-4'>
          <Award className='text-[hsl(var(--success))] w-5 h-5' />
        </div>
        <div>
          <h2 className='text-xl font-bold text-[hsl(var(--neutral-400))]'>
            {votingEnded ? "Winner" : "Current Leader"}
          </h2>
          <p className='text-sm text-[hsl(var(--neutral-300))]'>
            {votingEnded ? "Final result" : "Based on current votes"}
          </p>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 p-4 bg-[hsl(var(--success))]/5 rounded-lg'>
        <div className='mb-3 sm:mb-0'>
          <p className='text-sm text-[hsl(var(--neutral-300))] font-medium uppercase tracking-wider'>
            Candidate
          </p>
          <p className='text-lg font-bold text-[hsl(var(--neutral-400))]'>
            {winner.name}
          </p>
        </div>
        <div className='flex flex-col sm:items-end'>
          <p className='text-sm text-[hsl(var(--neutral-300))] font-medium uppercase tracking-wider'>
            Votes
          </p>
          <div className='flex items-center'>
            <span className='text-xl font-bold mr-2'>
              {typeof winner.voteCount === "bigint"
                ? Number(winner.voteCount)
                : winner.voteCount}
            </span>
            <span className='text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 px-2 py-1 rounded-full text-sm'>
              {formattedPercentage}%
            </span>
          </div>
        </div>
      </div>

      <div className='flex justify-center'>
        <div className='flex items-center justify-center w-16 h-16 bg-[hsl(var(--success))]/10 rounded-full'>
          {votingEnded ? (
            <CheckCircle className='text-[hsl(var(--success))] w-8 h-8' />
          ) : (
            <Vote className='text-[hsl(var(--success))] w-8 h-8' />
          )}
        </div>
      </div>
    </Card>
  );
}
