import React from 'react';
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils";
import { Vote, Wallet, CheckCircle } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  account: string;
  onConnectWallet: () => Promise<void>;
}

export function Header({ isConnected, account, onConnectWallet }: HeaderProps) {
  return (
    <header className="bg-[hsl(var(--primary))] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Vote className="w-6 h-6" />
          <h1 className="text-xl font-bold">BlockVote</h1>
        </div>
        
        {!isConnected ? (
          <Button 
            onClick={onConnectWallet}
            className="bg-white text-[hsl(var(--primary))] hover:bg-[hsl(var(--neutral-200))] transition duration-300 flex items-center"
          >
            <Wallet className="mr-2 w-4 h-4" />
            <span>Connect Wallet</span>
          </Button>
        ) : (
          <div className="bg-white text-[hsl(var(--primary))] font-medium px-4 py-2 rounded-md flex items-center">
            <CheckCircle className="mr-2 w-4 h-4 text-[hsl(var(--success))]" />
            <span className="truncate max-w-[150px]">{shortenAddress(account)}</span>
          </div>
        )}
      </div>
    </header>
  );
}
