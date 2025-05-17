import { ethers, Contract, Interface } from 'ethers';
import Vote_ABI from '../utils/Vote_ABI.json';
// ABI for the Voting contract


// Winner interface
export interface Winner {
  id: number;
  name: string;
  voteCount: number;
  percentage: number;
}

// Interface for the voting contract methods
export interface VotingContractMethods {
  addCandidate(name: string, proposal: string): Promise<ethers.TransactionResponse>;
  registerVoter(voter: string, weight: number): Promise<ethers.TransactionResponse>;
  startVoting(startTime: number, endTime: number): Promise<ethers.TransactionResponse>;
  endVoting(): Promise<ethers.TransactionResponse>;
  vote(candidateId: number): Promise<ethers.TransactionResponse>;
  getVotingStatus(): Promise<boolean>;
  getCandidates(): Promise<{ id: number, name: string, proposal: string, voteCount: number }[]>;
  getTimeRemaining(): Promise<number>;
  getVoter(voter: string): Promise<{ voterIsRegistered: boolean, weight: number, hasVoted: boolean, votedFor: number }>;
  getTotalVotes(): Promise<number>;
  getTotalVoters(): Promise<number>;
  getStartTime(): Promise<number>;
  getEndTime(): Promise<number>;
  isAdmin(): Promise<boolean>;
  getWinner(): Promise<Winner>;
  getCurrentTime(): Promise<number>;
}

// Define VotingContract as a type that combines Contract and our methods
export type VotingContract = Contract & VotingContractMethods;

// For local development with Hardhat
export const HARDHAT_VOTING_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Function to get contract instance
export async function getVotingContract(provider: ethers.BrowserProvider, contractAddress: string): Promise<VotingContract> {
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, Vote_ABI, signer) as VotingContract;
}
