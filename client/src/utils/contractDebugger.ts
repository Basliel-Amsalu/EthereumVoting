import { ethers } from "ethers";
import { getVotingContract, testContractConnection, HARDHAT_VOTING_CONTRACT_ADDRESS } from "../lib/contracts";

/**
 * Debug utility for Ethereum contract interactions
 */
export class ContractDebugger {
  private provider: ethers.BrowserProvider | null = null;
  private contractAddress: string;

  constructor(contractAddress: string = HARDHAT_VOTING_CONTRACT_ADDRESS) {
    this.contractAddress = contractAddress;
  }

  /**
   * Initialize the provider
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if window.ethereum is available (MetaMask or other wallet)
      if (window.ethereum) {
        console.log("Ethereum provider found");
        this.provider = new ethers.BrowserProvider(window.ethereum);
        return true;
      } else {
        console.error("No Ethereum provider found. Please install MetaMask or another wallet.");
        return false;
      }
    } catch (error) {
      console.error("Error initializing provider:", error);
      return false;
    }
  }

  /**
   * Test connection to the contract
   */
  async testConnection(): Promise<boolean> {
    if (!this.provider) {
      console.error("Provider not initialized. Call initialize() first.");
      return false;
    }

    return await testContractConnection(this.provider, this.contractAddress);
  }

  /**
   * Get contract ABI method details
   */
  getContractABIDetails(): void {
    const { VOTING_ABI } = require("../lib/contracts");
    
    console.log("Contract ABI Methods:");
    VOTING_ABI.forEach((method: string, index: number) => {
      console.log(`${index + 1}. ${method}`);
    });
  }

  /**
   * Debug a specific contract method
   */
  async debugMethod(methodName: string, ...args: any[]): Promise<any> {
    if (!this.provider) {
      console.error("Provider not initialized. Call initialize() first.");
      return null;
    }

    try {
      console.log(`Debugging method: ${methodName} with args:`, args);
      const contract = await getVotingContract(this.provider, this.contractAddress);
      
      if (typeof contract[methodName] !== 'function') {
        console.error(`Method ${methodName} not found on contract`);
        return null;
      }

      const result = await contract[methodName](...args);
      console.log(`Method ${methodName} result:`, result);
      return result;
    } catch (error) {
      console.error(`Error debugging method ${methodName}:`, error);
      return null;
    }
  }
}

// Helper function to use in browser console
export async function createDebugger(contractAddress?: string): Promise<ContractDebugger> {
  const debugger = new ContractDebugger(contractAddress);
  await debugger.initialize();
  return debugger;
}

// Add to window for console access
declare global {
  interface Window {
    contractDebugger: {
      create: typeof createDebugger;
      instance: ContractDebugger | null;
    };
  }
}

// Initialize for browser console debugging
if (typeof window !== 'undefined') {
  window.contractDebugger = {
    create: async (address?: string) => {
      const instance = await createDebugger(address);
      window.contractDebugger.instance = instance;
      return instance;
    },
    instance: null
  };
}
