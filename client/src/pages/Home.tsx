import React, { useState } from "react";
import { useBlockchain } from "@/hooks/useBlockchain";
import { Header } from "@/components/Header";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { StatCard } from "@/components/ui/statcard";
import { VotingSection } from "@/components/VotingSection";
import { ResultsSection } from "@/components/ResultsSection";
import { AdminSection } from "@/components/AdminSection";
import { TransactionModal } from "@/components/TransactionModal";
import { Footer } from "@/components/Footer";
import { formatTimeRemaining } from "@/lib/utils";

enum Tab {
  Vote,
  Results,
  Admin,
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Vote);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    account,
    isConnected,
    networkName,
    contractAddress,
    isAdmin,
    votingActive,
    timeRemaining,
    totalVotes,
    totalVoters,
    candidates,
    voterInfo,
    winner,
    connectWallet,
    castVote,
    addCandidate,
    registerVoter,
    startVoting,
    endVoting,
    refreshData,
    txStatus,
    error,
    txHash,
    setTxStatus,
  } = useBlockchain();

  // Handle vote
  const handleVote = async (candidateId: number) => {
    setModalOpen(true);
    await castVote(candidateId);
  };

  // Handle add candidate
  const handleAddCandidate = async (name: string, proposal: string) => {
    setModalOpen(true);
    await addCandidate(name, proposal);
  };

  // Handle register voter
  const handleRegisterVoter = async (address: string, isAdmin: boolean) => {
    setModalOpen(true);
    await registerVoter(address, isAdmin);
  };

  // Handle start voting
  const handleStartVoting = async (startTime: number, endTime: number) => {
    setModalOpen(true);
    await startVoting(startTime, endTime);
  };

  // Handle end voting
  const handleEndVoting = async () => {
    setModalOpen(true);
    await endVoting();
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setTxStatus("idle");
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Header
        isConnected={isConnected}
        account={account}
        onConnectWallet={connectWallet}
      />

      <main className='flex-grow container mx-auto px-4 py-8'>
        {/* Blockchain connection status */}
        <div className='mb-8'>
          <ConnectionStatus
            isConnected={isConnected}
            networkName={networkName}
          />
        </div>

        {/* Contract State Summary */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <StatCard
            title='Voting Status'
            value={votingActive ? "Active" : "Inactive"}
            subValue={
              votingActive
                ? `Ends in ${formatTimeRemaining(timeRemaining)}`
                : "Not started or ended"
            }
            icon={votingActive ? "how_to_reg" : "event_busy"}
            iconColor={
              votingActive
                ? "text-[hsl(var(--success))]"
                : "text-[hsl(var(--neutral-300))]"
            }
          />

          <StatCard
            title='Total Votes'
            value={totalVotes}
            subValue={`${
              typeof totalVoters === "bigint"
                ? Number(totalVoters)
                : totalVoters
            } registered voters`}
            icon='how_to_vote'
            iconColor='text-[hsl(var(--primary))]'
          />

          <StatCard
            title='Your Status'
            value={voterInfo?.isRegistered ? "Registered" : "Not Registered"}
            subValue={
              voterInfo?.isRegistered
                ? `Vote Weight: ${voterInfo.weight}`
                : "Connect wallet to check status"
            }
            icon={voterInfo?.isRegistered ? "how_to_reg" : "person"}
            iconColor={
              voterInfo?.isRegistered
                ? "text-[hsl(var(--success))]"
                : "text-[hsl(var(--secondary))]"
            }
          />
        </div>

        {/* Tabs */}
        <div className='mb-6 border-b border-[hsl(var(--neutral-200))]'>
          <div className='flex'>
            <button
              onClick={() => setActiveTab(Tab.Vote)}
              className={`px-4 py-3 font-medium ${
                activeTab === Tab.Vote
                  ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]"
                  : "text-[hsl(var(--neutral-300))] hover:text-[hsl(var(--primary))]"
              }`}
            >
              Vote
            </button>
            <button
              onClick={() => setActiveTab(Tab.Results)}
              className={`px-4 py-3 font-medium ${
                activeTab === Tab.Results
                  ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]"
                  : "text-[hsl(var(--neutral-300))] hover:text-[hsl(var(--primary))]"
              }`}
            >
              Results
            </button>
            <button
              onClick={() => setActiveTab(Tab.Admin)}
              className={`px-4 py-3 font-medium ${
                activeTab === Tab.Admin
                  ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]"
                  : "text-[hsl(var(--neutral-300))] hover:text-[hsl(var(--primary))]"
              } ml-auto`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === Tab.Vote && (
            <VotingSection
              candidates={candidates}
              isConnected={isConnected}
              isRegistered={voterInfo?.isRegistered || false}
              hasVoted={voterInfo?.hasVoted || false}
              votedFor={voterInfo?.hasVoted ? voterInfo.votedFor : null}
              votingActive={votingActive}
              onVote={handleVote}
            />
          )}

          {activeTab === Tab.Results && (
            <ResultsSection
              candidates={candidates}
              totalVotes={totalVotes}
              votingEnded={!votingActive && timeRemaining === 0}
              winner={winner}
              onRefresh={refreshData}
            />
          )}

          {activeTab === Tab.Admin && (
            <AdminSection
              isAdmin={isAdmin}
              isConnected={isConnected}
              addCandidate={handleAddCandidate}
              registerVoter={handleRegisterVoter}
              startVoting={handleStartVoting}
              endVoting={handleEndVoting}
            />
          )}
        </div>
      </main>

      <Footer contractAddress={contractAddress} />

      {/* Transaction Modal */}
      <TransactionModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          txStatus === "pending"
            ? "Processing Transaction"
            : txStatus === "success"
            ? "Transaction Successful"
            : txStatus === "error"
            ? "Transaction Failed"
            : "Transaction"
        }
        status={txStatus}
        txHash={txHash}
        errorMessage={error || undefined}
      />
    </div>
  );
}
