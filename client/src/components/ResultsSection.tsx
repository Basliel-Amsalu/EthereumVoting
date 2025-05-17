import React from "react";
import { Button } from "@/components/ui/button";
import { calculatePercentage } from "@/lib/utils";
import { Winner } from "@/lib/contracts";
import { WinnerDisplay } from "@/components/WinnerDisplay";
import { RefreshCw, Award } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  proposal: string;
  voteCount: number;
}

interface ResultsProps {
  candidates: Candidate[];
  totalVotes: number;
  votingEnded: boolean;
  winner: Winner | null;
  onRefresh: () => void;
}

export function ResultsSection({
  candidates,
  totalVotes,
  votingEnded,
  winner,
  onRefresh,
}: ResultsProps) {
  // Convert BigInt to number before sorting
  const sortedCandidates = [...candidates].sort((a, b) => {
    // Check if voteCount is a BigInt and convert to number safely
    const aCount =
      typeof a.voteCount === "bigint" ? Number(a.voteCount) : a.voteCount;
    const bCount =
      typeof b.voteCount === "bigint" ? Number(b.voteCount) : b.voteCount;
    return bCount - aCount;
  });
  const colors = [
    "bg-[hsl(var(--primary))]",
    "bg-[hsl(var(--secondary))]",
    "bg-[hsl(var(--accent))]",
  ];

  return (
    <div>
      {/* Winner display */}
      {winner && <WinnerDisplay winner={winner} votingEnded={votingEnded} />}

      {/* Detailed results */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-bold mb-6'>Voting Results</h2>

        {/* Results visualization */}
        <div className='mb-8'>
          {sortedCandidates.map((candidate, index) => {
            const percentage = calculatePercentage(
              candidate.voteCount,
              totalVotes
            );
            const isWinner = winner && winner.id === candidate.id;

            return (
              <div key={candidate.id} className='mb-4 last:mb-0'>
                <div className='flex justify-between mb-1'>
                  <span className='font-medium flex items-center'>
                    {candidate.name}
                    {isWinner && votingEnded && (
                      <Award className='text-[hsl(var(--success))] ml-1 w-4 h-4' />
                    )}
                  </span>
                  <span className='text-[hsl(var(--neutral-300))]'>
                    {typeof candidate.voteCount === "bigint"
                      ? Number(candidate.voteCount)
                      : candidate.voteCount}{" "}
                    {(typeof candidate.voteCount === "bigint"
                      ? Number(candidate.voteCount)
                      : candidate.voteCount) === 1
                      ? "vote"
                      : "votes"}{" "}
                    ({percentage}
                    %)
                  </span>
                </div>
                <div className='w-full bg-[hsl(var(--neutral-200))] rounded-full h-4'>
                  <div
                    className={`${
                      isWinner
                        ? "bg-[hsl(var(--success))]"
                        : colors[index % colors.length]
                    } h-4 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}

          {candidates.length === 0 && (
            <div className='text-center py-8 text-[hsl(var(--neutral-300))]'>
              No candidates or votes to display.
            </div>
          )}
        </div>

        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[hsl(var(--neutral-100))] rounded-lg'>
          <div className='mb-3 sm:mb-0'>
            <p className='text-sm text-[hsl(var(--neutral-300))]'>
              Total Votes Cast
            </p>
            <p className='text-xl font-bold'>
              {typeof totalVotes === "bigint" ? Number(totalVotes) : totalVotes}{" "}
              {(typeof totalVotes === "bigint"
                ? Number(totalVotes)
                : totalVotes) === 1
                ? "vote"
                : "votes"}
            </p>
          </div>
          <Button
            variant='outline'
            onClick={onRefresh}
            className='flex items-center px-4 py-2 bg-white border border-[hsl(var(--neutral-200))] hover:bg-[hsl(var(--neutral-100))]'
          >
            <RefreshCw className='mr-1 text-[hsl(var(--neutral-300))] w-4 h-4' />
            <span>Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
