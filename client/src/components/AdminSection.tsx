import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminSectionProps {
  isAdmin: boolean;
  isConnected: boolean;
  addCandidate: (name: string, proposal: string) => Promise<void>;
  registerVoter: (address: string, isAdmin: boolean) => Promise<void>;
  startVoting: (startTime: number, endTime: number) => Promise<void>;
  endVoting: () => Promise<void>;
}

export function AdminSection({
  isAdmin,
  isConnected,
  addCandidate,
  registerVoter,
  startVoting,
  endVoting,
}: AdminSectionProps) {
  // Form state
  const [candidateName, setCandidateName] = useState("");
  const [candidateProposal, setCandidateProposal] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [isVoterAdmin, setIsVoterAdmin] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Handle add candidate
  const handleAddCandidate = () => {
    if (!candidateName || !candidateProposal) return;
    addCandidate(candidateName, candidateProposal);
    setCandidateName("");
    setCandidateProposal("");
  };

  // Handle register voter
  const handleRegisterVoter = () => {
    if (!voterAddress) return;
    registerVoter(voterAddress, isVoterAdmin);
    setVoterAddress("");
    setIsVoterAdmin(false);
  };

  // Handle start voting
  const handleStartVoting = () => {
    if (!endDate) return;

    // Use current time as start time to ensure voting is active immediately
    const currentTime = Math.floor(Date.now() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    // Make sure end time is after current time
    if (endTimestamp <= currentTime) {
      alert("End time must be in the future");
      return;
    }

    console.log("Starting voting with times:", {
      startTime: currentTime,
      endTime: endTimestamp,
      formattedStart: new Date(currentTime * 1000).toLocaleString(),
      formattedEnd: new Date(endTimestamp * 1000).toLocaleString(),
    });

    startVoting(currentTime, endTimestamp);
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-bold'>Admin Controls</h2>

        {/* Admin status indicator */}
        {!isConnected ? (
          <div className='bg-[hsl(var(--neutral-300))]/10 text-[hsl(var(--neutral-300))] px-3 py-1 rounded-full text-sm flex items-center'>
            <span className='material-icons text-sm mr-1'>
              account_balance_wallet
            </span>
            <span>Not Connected</span>
          </div>
        ) : !isAdmin ? (
          <div className='bg-[hsl(var(--error))]/10 text-[hsl(var(--error))] px-3 py-1 rounded-full text-sm flex items-center'>
            <span className='material-icons text-sm mr-1'>block</span>
            <span>Not Admin</span>
          </div>
        ) : (
          <div className='bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] px-3 py-1 rounded-full text-sm flex items-center'>
            <span className='material-icons text-sm mr-1'>verified</span>
            <span>Admin Access</span>
          </div>
        )}
      </div>

      {/* Admin access required notice */}
      {!isAdmin && (
        <Alert className='mb-6 p-4 bg-[hsl(var(--neutral-100))] border border-[hsl(var(--neutral-200))] rounded-md'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <span className='material-icons text-[hsl(var(--neutral-300))]'>
                admin_panel_settings
              </span>
            </div>
            <div className='ml-3'>
              <AlertDescription className='text-sm text-[hsl(var(--neutral-400))]'>
                Admin access is required to use these controls. Connect with the
                contract owner's wallet.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {/* Admin controls */}
      <div className={`${!isAdmin ? "opacity-50 pointer-events-none" : ""}`}>
        {/* Add Candidate */}
        <div className='mb-6 p-4 border border-[hsl(var(--neutral-200))] rounded-md'>
          <h3 className='font-medium mb-4'>Add Candidate</h3>
          <div className='mb-4'>
            <Label
              htmlFor='candidate-name'
              className='block text-sm font-medium text-[hsl(var(--neutral-400))] mb-1'
            >
              Candidate Name
            </Label>
            <Input
              id='candidate-name'
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className='w-full p-2 border border-[hsl(var(--neutral-200))] rounded-md'
              placeholder='Enter candidate name'
            />
          </div>
          <div className='mb-4'>
            <Label
              htmlFor='candidate-proposal'
              className='block text-sm font-medium text-[hsl(var(--neutral-400))] mb-1'
            >
              Proposal
            </Label>
            <Textarea
              id='candidate-proposal'
              value={candidateProposal}
              onChange={(e) => setCandidateProposal(e.target.value)}
              className='w-full p-2 border border-[hsl(var(--neutral-200))] rounded-md'
              placeholder="Enter candidate's proposal"
              rows={2}
            />
          </div>
          <Button
            onClick={handleAddCandidate}
            className='bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-dark))]'
          >
            Add Candidate
          </Button>
        </div>

        {/* Register Voter */}
        <div className='mb-6 p-4 border border-[hsl(var(--neutral-200))] rounded-md'>
          <h3 className='font-medium mb-4'>Register Voter</h3>
          <div className='mb-4'>
            <Label
              htmlFor='voter-address'
              className='block text-sm font-medium text-[hsl(var(--neutral-400))] mb-1'
            >
              Voter Address
            </Label>
            <Input
              id='voter-address'
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
              className='w-full p-2 border border-[hsl(var(--neutral-200))] rounded-md'
              placeholder='Enter wallet address'
            />
          </div>
          <div className='flex items-center mb-4'>
            <Checkbox
              id='is-admin'
              checked={isVoterAdmin}
              onCheckedChange={(checked) => setIsVoterAdmin(checked === true)}
              className='mr-2'
            />
            <Label
              htmlFor='is-admin'
              className='text-sm text-[hsl(var(--neutral-400))]'
            >
              Register as admin (weight = 2)
            </Label>
          </div>
          <Button
            onClick={handleRegisterVoter}
            className='bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-dark))]'
          >
            Register Voter
          </Button>
        </div>

        {/* Voting Period Controls */}
        <div className='p-4 border border-[hsl(var(--neutral-200))] rounded-md'>
          <h3 className='font-medium mb-4'>Voting Period Controls</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
            <div>
              <Label
                htmlFor='start-time'
                className='block text-sm font-medium text-[hsl(var(--neutral-400))] mb-1'
              >
                Start Time
              </Label>
              <Input
                id='start-time'
                type='datetime-local'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='w-full p-2 border border-[hsl(var(--neutral-200))] rounded-md'
              />
            </div>
            <div>
              <Label
                htmlFor='end-time'
                className='block text-sm font-medium text-[hsl(var(--neutral-400))] mb-1'
              >
                End Time
              </Label>
              <Input
                id='end-time'
                type='datetime-local'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='w-full p-2 border border-[hsl(var(--neutral-200))] rounded-md'
              />
            </div>
          </div>
          <div className='flex space-x-3'>
            <Button
              onClick={handleStartVoting}
              className='bg-[hsl(var(--success))] text-white hover:bg-[hsl(var(--success))]/80 flex-1'
            >
              Start Voting
            </Button>
            <Button
              onClick={endVoting}
              className='bg-[hsl(var(--error))] text-white hover:bg-[hsl(var(--error))]/80 flex-1'
            >
              End Voting
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
