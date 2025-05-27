import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CandidateCard } from "@/components/CandidateCard";
import { Info, CheckCircle } from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  proposal: string;
  voteCount: number;
}

interface VotingProps {
  candidates: Candidate[];
  isConnected: boolean;
  isRegistered: boolean;
  hasVoted: boolean;
  votedFor: number | null;
  votingActive: boolean;
  onVote: (candidateId: number) => void;
}

export function VotingSection({ 
  candidates, 
  isConnected, 
  isRegistered, 
  hasVoted, 
  votedFor, 
  votingActive,
  onVote 
}: VotingProps) {
  // Get voted candidate
  const votedCandidate = candidates.find(c => c.id === votedFor);
  
  // Check eligibility
  const canVote = isConnected && isRegistered && votingActive && !hasVoted;
  console.log(canVote, votingActive)
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-6">Cast Your Vote</h2>
      
      {/* Not eligible alert */}
      {!canVote && !hasVoted && (
        <Alert className="mb-6 bg-[hsl(var(--warning))]/20 border-l-4 border-[hsl(var(--warning))] rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="text-[hsl(var(--warning))] w-5 h-5" />
            </div>
            <div className="ml-3">
              <AlertDescription className="text-sm text-[hsl(var(--neutral-400))]">
                {!isConnected
                  ? "You need to connect your wallet to vote."
                  : !isRegistered
                  ? "You are not registered to vote in this election."
                  : !votingActive
                  ? "Voting is not currently active."
                  : ""}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
      
      {/* Already voted alert */}
      {hasVoted && votedCandidate && (
        <Alert className="mb-6 bg-[hsl(var(--success))]/20 border-l-4 border-[hsl(var(--success))] rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="text-[hsl(var(--success))] w-5 h-5" />
            </div>
            <div className="ml-3">
              <AlertDescription className="text-sm text-[hsl(var(--neutral-400))]">
                You have already cast your vote for <span className="font-medium">{votedCandidate.name}</span>.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}
      
      {/* Candidates list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            id={candidate.id}
            name={candidate.name}
            proposal={candidate.proposal}
            isVoted={hasVoted}
            isSelected={votedFor === candidate.id}
            disabled={!canVote}
            onVote={onVote}
          />
        ))}
        
        {candidates.length === 0 && (
          <div className="col-span-full text-center py-8 text-[hsl(var(--neutral-300))]">
            No candidates have been added yet.
          </div>
        )}
      </div>
    </div>
  );
}
