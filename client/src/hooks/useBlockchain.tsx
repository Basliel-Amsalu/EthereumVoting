import { useState, useEffect, useCallback } from "react";
import { ethers, BrowserProvider } from "ethers";
import { useToast } from "@/hooks/use-toast";
import {
  getVotingContract,
  VotingContract,
  HARDHAT_VOTING_CONTRACT_ADDRESS,
  Winner,
} from "@/lib/contracts";

interface Candidate {
  id: number;
  name: string;
  proposal: string;
  voteCount: number;
}

interface VoterInfo {
  isRegistered: boolean;
  weight: number;
  hasVoted: boolean;
  votedFor: number;
}

interface BlockchainState {
  provider: BrowserProvider | null;
  contract: VotingContract | null;
  isAdmin: boolean;
  account: string;
  isConnected: boolean;
  networkName: string;
  contractAddress: string;
  votingActive: boolean;
  timeRemaining: number;
  totalVotes: number;
  totalVoters: number;
  candidates: Candidate[];
  voterInfo: VoterInfo | null;
  winner: Winner | null;
}

interface UseBlockchainReturn extends BlockchainState {
  connectWallet: () => Promise<void>;
  castVote: (candidateId: number) => Promise<void>;
  addCandidate: (name: string, proposal: string) => Promise<void>;
  registerVoter: (address: string, isAdmin: boolean) => Promise<void>;
  startVoting: (startTime: number, endTime: number) => Promise<void>;
  endVoting: () => Promise<void>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
  txStatus: "idle" | "pending" | "success" | "error";
  setTxStatus: (status: "idle" | "pending" | "success" | "error") => void;
}

export function useBlockchain(): UseBlockchainReturn {
  const { toast } = useToast();

  // State for blockchain connection
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<VotingContract | null>(null);
  const [account, setAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [networkName, setNetworkName] = useState<string>("Localhost");
  const [contractAddress, setContractAddress] = useState<string>(
    HARDHAT_VOTING_CONTRACT_ADDRESS
  );

  // State for blockchain data
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [votingActive, setVotingActive] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [totalVoters, setTotalVoters] = useState<number>(0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voterInfo, setVoterInfo] = useState<VoterInfo | null>(null);
  const [winner, setWinner] = useState<Winner | null>(null);

  // State for transaction handling
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  // Function to connect to wallet
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setTxStatus("pending");

    try {
      // Check if MetaMask is installed
      if (!(window as any).ethereum) {
        throw new Error("Please install MetaMask to use this application");
      }

      // Connect to MetaMask
      // @ts-ignore - Ignore TypeScript errors because we know ethereum exists
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Get contract instance
      let contract;
      try {
        contract = await getVotingContract(provider, contractAddress);

        // Test contract connection with a simple call
        try {
          await contract.getVotingStatus();
        } catch (contractError) {
          console.error("Contract connection test failed:", contractError);
          throw new Error(
            "Smart contract connection failed. Make sure your blockchain node is running and the contract is deployed at the correct address."
          );
        }
      } catch (error) {
        console.error("Contract initialization error:", error);
        throw new Error(
          "Failed to connect to the smart contract. Please check if your blockchain node is running and the contract is deployed correctly."
        );
      }

      // Get network information
      const network = await provider.getNetwork();
      const networkName =
        network.name === "unknown" ? "Localhost" : network.name;

      // Set state
      setProvider(provider);
      setContract(contract);
      setAccount(address);
      setIsConnected(true);
      setNetworkName(networkName);

      // Set transaction status
      setTxStatus("success");

      // Load data
      await refreshData(contract, address);

      toast({
        title: "Wallet Connected",
        description: `Connected to ${networkName} network`,
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      setError(error.message || "Failed to connect wallet");
      setTxStatus("error");

      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [contractAddress, toast]);

  // Function to refresh blockchain data
  const refreshData = useCallback(
    async (contractInstance?: VotingContract, accountAddress?: string) => {
      try {
        const c = contractInstance || contract;
        const addr = accountAddress || account;

        console.log(c?.getStartTime());
        console.log(c?.getEndTime());
        console.log(c?.getVotingStatus());
        console.log(c?.votingStarted());
        console.log(c?.votingEnded());
        console.log(c?.getTimeRemaining());
        console.log(c?.getCurrentTime());

        if (!c || !addr) return;

        // Check if contract is properly connected before making multiple calls
        try {
          // Simple call to check contract connection
          await c.getVotingStatus();
        } catch (connectionError) {
          console.error("Contract connection error:", connectionError);
          toast({
            title: "Contract Connection Error",
            description:
              "Failed to connect to the smart contract. Make sure your blockchain node is running.",
            variant: "destructive",
          });
          return;
        }

        // Use individual try/catch blocks for each call to identify which one fails
        let adminStatus = false;
        let votingStatus = false;
        let candidatesData: Candidate[] = [];
        let voter = {
          voterIsRegistered: false,
          weight: 0,
          hasVoted: false,
          votedFor: 0,
        };
        let votes = 0;
        let voters = 0;
        let remaining = 0;

        try {
          adminStatus = await c.isAdmin();
        } catch (error) {
          console.error("Error checking admin status:", error);
        }

        try {
          votingStatus = await c.getVotingStatus();
          console.log("refreshData - getVotingStatus result:", votingStatus);

          // Get more details to debug voting status
          try {
            const votingStartedValue = await c.votingStarted();
            const votingEndedValue = await c.votingEnded();
            const startTimeValue = await c.getStartTime();
            const endTimeValue = await c.getEndTime();

            // Get current blockchain time if provider is available
            let blockchainTime = 0;
            if (provider) {
              const blockNumber = await provider.getBlockNumber();
              const block = await provider.getBlock(blockNumber);
              if (block) {
                blockchainTime = Number(block.timestamp);
              }
            }

            console.log("refreshData - Voting status details:", {
              votingStarted: votingStartedValue,
              votingEnded: votingEndedValue,
              startTime: Number(startTimeValue),
              endTime: Number(endTimeValue),
              blockchainTime,
              formattedStartTime: new Date(
                Number(startTimeValue) * 1000
              ).toLocaleString(),
              formattedEndTime: new Date(
                Number(endTimeValue) * 1000
              ).toLocaleString(),
              formattedBlockchainTime: blockchainTime
                ? new Date(blockchainTime * 1000).toLocaleString()
                : "Unknown",
              condition1: !votingStartedValue || votingEndedValue,
              condition2: blockchainTime >= Number(startTimeValue),
              condition3: blockchainTime <= Number(endTimeValue),
              timeCondition:
                blockchainTime >= Number(startTimeValue) &&
                blockchainTime <= Number(endTimeValue),
            });
          } catch (detailsError) {
            console.error("Error getting voting status details:", detailsError);
          }
        } catch (error) {
          console.error("Error getting voting status:", error);
        }

        try {
          candidatesData = await c.getCandidates();
        } catch (error) {
          console.error("Error getting candidates:", error);
        }

        try {
          voter = await c.getVoter(addr);
        } catch (error) {
          console.error("Error getting voter info:", error);
        }

        try {
          votes = await c.getTotalVotes();
        } catch (error) {
          console.error("Error getting total votes:", error);
        }

        try {
          voters = await c.getTotalVoters();
        } catch (error) {
          console.error("Error getting total voters:", error);
        }

        try {
          remaining = await c.getTimeRemaining();
          console.log(
            "Time remaining from contract:",
            Number(remaining),
            "seconds"
          );

          // Get current blockchain time and end time for comparison
          try {
            if (provider) {
              const blockNumber = await provider.getBlockNumber();
              const currentBlock = await provider.getBlock(blockNumber);
              const contractEndTime = await c.getEndTime();

              if (currentBlock && contractEndTime) {
                const blockchainTime = Number(currentBlock.timestamp);
                const endTimeValue = Number(contractEndTime);
                const calculatedRemaining = endTimeValue - blockchainTime;

                console.log(
                  "Calculated time remaining:",
                  calculatedRemaining,
                  "seconds"
                );
                console.log(
                  "Difference:",
                  Number(remaining) - calculatedRemaining,
                  "seconds"
                );
              }
            }
          } catch (timeError) {
            console.error("Error calculating time difference:", timeError);
          }
        } catch (error) {
          console.error("Error getting time remaining:", error);
        }

        setIsAdmin(adminStatus);
        setVotingActive(votingStatus);
        setCandidates(candidatesData);
        // Map the voter info to the expected structure
        setVoterInfo({
          isRegistered: voter.voterIsRegistered,
          weight: voter.weight,
          hasVoted: voter.hasVoted,
          votedFor: voter.votedFor,
        });
        setTotalVotes(Number(votes));
        setTotalVoters(Number(voters));
        setTimeRemaining(Number(remaining));

        // Get winner only if we have candidates and votes
        if (candidatesData.length > 0 && Number(votes) > 0) {
          try {
            const winnerData = await c.getWinner();
            setWinner(winnerData);
          } catch (winnerError) {
            console.error("Error getting winner:", winnerError);
            // Don't propagate this error as it's not critical
            setWinner(null);
          }
        } else {
          // Reset winner if no candidates or votes
          setWinner(null);
        }
      } catch (error: any) {
        console.error("Error refreshing data:", error);

        // Check for specific error types
        if (error.code === "CALL_EXCEPTION") {
          toast({
            title: "Blockchain Error",
            description:
              "There was an error calling the smart contract. Make sure your blockchain node is running and the contract is deployed correctly.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Data Refresh Failed",
            description: error.message || "Failed to load blockchain data",
            variant: "destructive",
          });
        }
      }
    },
    [contract, account, toast]
  );

  // Function to cast a vote
  const castVote = useCallback(
    async (candidateId: number) => {
      if (!contract) {
        toast({
          title: "Error",
          description: "Contract not connected",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      setError(null);
      setTxStatus("pending");

      try {
        const tx = await contract.vote(candidateId);
        setTxHash(tx.hash);
        await tx.wait();

        // Set transaction status
        setTxStatus("success");

        // Refresh data
        await refreshData();

        toast({
          title: "Vote Cast Successfully",
          description: "Your vote has been recorded on the blockchain",
        });
      } catch (error: any) {
        console.error("Error casting vote:", error);
        setError(error.message || "Failed to cast vote");
        setTxStatus("error");

        toast({
          title: "Vote Failed",
          description: error.message || "Failed to cast vote",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [contract, refreshData, toast]
  );

  // Function to add a candidate
  const addCandidate = useCallback(
    async (name: string, proposal: string) => {
      if (!contract) {
        toast({
          title: "Error",
          description: "Contract not connected",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      setError(null);
      setTxStatus("pending");

      try {
        const tx = await contract.addCandidate(name, proposal);
        setTxHash(tx.hash);
        await tx.wait();

        // Set transaction status
        setTxStatus("success");

        // Refresh data
        await refreshData();

        toast({
          title: "Candidate Added",
          description: `${name} has been added as a candidate`,
        });
      } catch (error: any) {
        console.error("Error adding candidate:", error);
        setError(error.message || "Failed to add candidate");
        setTxStatus("error");

        toast({
          title: "Failed to Add Candidate",
          description: error.message || "Failed to add candidate",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [contract, refreshData, toast]
  );

  // Function to register a voter
  const registerVoter = useCallback(
    async (address: string, isAdmin: boolean) => {
      if (!contract) {
        toast({
          title: "Error",
          description: "Contract not connected",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      setError(null);
      setTxStatus("pending");

      try {
        // Weight is 2 for admin, 1 for regular voter
        const weight = isAdmin ? 2 : 1;
        const tx = await contract.registerVoter(address, weight);
        setTxHash(tx.hash);
        await tx.wait();

        // Set transaction status
        setTxStatus("success");

        // Refresh data
        await refreshData();

        toast({
          title: "Voter Registered",
          description: `Voter registered with weight ${weight}`,
        });
      } catch (error: any) {
        console.error("Error registering voter:", error);
        setError(error.message || "Failed to register voter");
        setTxStatus("error");

        toast({
          title: "Failed to Register Voter",
          description: error.message || "Failed to register voter",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [contract, refreshData, toast]
  );

  // Function to start voting
  const startVoting = useCallback(
    async (startTime: number, endTime: number) => {
      if (!contract) {
        toast({
          title: "Error",
          description: "Contract not connected",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      setError(null);
      setTxStatus("pending");

      try {
        // Log the time values for debugging
        console.log("Starting voting with times:", {
          startTime,
          endTime,
          currentTime: Math.floor(Date.now() / 1000),
          formattedStart: new Date(startTime * 1000).toLocaleString(),
          formattedEnd: new Date(endTime * 1000).toLocaleString(),
          formattedCurrent: new Date().toLocaleString(),
        });

        const tx = await contract.startVoting(startTime, endTime);
        setTxHash(tx.hash);
        await tx.wait();

        // Set transaction status
        setTxStatus("success");

        // Check voting status immediately after starting
        const votingStatus = await contract.getVotingStatus();
        console.log("Voting status after starting:", votingStatus);

        // Get blockchain time for comparison
        if (provider) {
          try {
            const blockNumber = await provider.getBlockNumber();
            const block = await provider.getBlock(blockNumber);
            if (block) {
              console.log("Blockchain time:", {
                blockTimestamp: block.timestamp,
                formattedBlockTime: new Date(
                  Number(block.timestamp) * 1000
                ).toLocaleString(),
              });
            }
          } catch (error) {
            console.error("Error getting blockchain time:", error);
          }
        }

        // Get contract state
        const contractStartTime = await contract.getStartTime();
        const contractEndTime = await contract.getEndTime();
        const votingStarted = await contract.votingStarted();
        const votingEnded = await contract.votingEnded();
        

        console.log("Contract state:", {
          contractStartTime: Number(contractStartTime),
          contractEndTime: Number(contractEndTime),
          formattedContractStart: new Date(
            Number(contractStartTime) * 1000
          ).toLocaleString(),
          formattedContractEnd: new Date(
            Number(contractEndTime) * 1000
          ).toLocaleString(),
          votingStarted,
          votingEnded,
        });

        // Refresh data
        await refreshData();

        toast({
          title: "Voting Started",
          description: "The voting period has begun",
        });
      } catch (error: any) {
        console.error("Error starting voting:", error);
        setError(error.message || "Failed to start voting");
        setTxStatus("error");

        toast({
          title: "Failed to Start Voting",
          description: error.message || "Failed to start voting",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [contract, refreshData, toast]
  );

  // Function to end voting
  const endVoting = useCallback(async () => {
    if (!contract) {
      toast({
        title: "Error",
        description: "Contract not connected",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxStatus("pending");

    try {
      const tx = await contract.endVoting();
      setTxHash(tx.hash);
      await tx.wait();

      // Set transaction status
      setTxStatus("success");

      // Refresh data
      await refreshData();

      toast({
        title: "Voting Ended",
        description: "The voting period has ended",
      });
    } catch (error: any) {
      console.error("Error ending voting:", error);
      setError(error.message || "Failed to end voting");
      setTxStatus("error");

      toast({
        title: "Failed to End Voting",
        description: error.message || "Failed to end voting",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [contract, refreshData, toast]);

  // Effect to refresh data periodically
  useEffect(() => {
    if (contract && account) {
      // Full data refresh every 10 seconds
      const refreshInterval = setInterval(() => {
        refreshData();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(refreshInterval);
    }
  }, [contract, account, refreshData]);

  // Effect to update time remaining more frequently
  useEffect(() => {
    if (votingActive && timeRemaining > 0) {
      // Update time remaining every second
      const timerInterval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // If time is up, do a full refresh to update voting status
            refreshData();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [votingActive, timeRemaining, refreshData]);

  return {
    provider,
    contract,
    isAdmin,
    account,
    isConnected,
    networkName,
    contractAddress,
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
    refreshData: () => refreshData(),
    isLoading,
    error,
    txHash,
    txStatus,
    setTxStatus,
  };
}
