import React from 'react';
import { shortenAddress } from "@/lib/utils";

interface FooterProps {
  contractAddress: string;
}

export function Footer({ contractAddress }: FooterProps) {
  // Generate etherscan link based on network
  const getEtherscanLink = () => {
    // For a real app, you'd check the network ID and use the appropriate URL
    return `https://etherscan.io/address/${contractAddress}`;
  };
  
  return (
    <footer className="bg-[hsl(var(--neutral-400))] text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <span className="material-icons mr-2">how_to_vote</span>
              <span className="font-bold">BlockVote</span>
            </div>
            <p className="text-sm mt-1 text-[hsl(var(--neutral-200))]">Secure, transparent voting on the blockchain</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="text-sm mb-3 md:mb-0 md:mr-6">
              <p>Contract Address:</p>
              <p className="font-mono text-xs text-[hsl(var(--neutral-200))] hover:text-white transition duration-300 cursor-pointer">
                {shortenAddress(contractAddress)}
              </p>
            </div>
            <a 
              href={getEtherscanLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-white hover:text-[hsl(var(--neutral-200))] transition duration-300"
            >
              View on Etherscan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
