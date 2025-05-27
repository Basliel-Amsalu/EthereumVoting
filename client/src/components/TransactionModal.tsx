import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TransactionModalProps {
  title: string;
  status: 'idle' | 'pending' | 'success' | 'error';
  txHash?: string | null;
  errorMessage?: string;
  open: boolean;
  onClose: () => void;
}

export function TransactionModal({ 
  title, 
  status, 
  txHash, 
  errorMessage, 
  open, 
  onClose 
}: TransactionModalProps) {
  // Generate etherscan link based on network
  const getEtherscanLink = () => {
    // For a real app, you'd check the network ID and use the appropriate URL
    return `https://etherscan.io/tx/${txHash}`;
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {/* Loading state */}
        {status === 'pending' && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 border-4 border-[hsl(var(--neutral-200))] border-t-[hsl(var(--primary))] rounded-full animate-spin mb-4"></div>
            <p className="text-[hsl(var(--neutral-300))]">Please confirm the transaction in your wallet...</p>
          </div>
        )}
        
        {/* Success state */}
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 bg-[hsl(var(--success))]/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-icons text-4xl text-[hsl(var(--success))]">check_circle</span>
            </div>
            <p className="text-[hsl(var(--neutral-400))] mb-2">Transaction completed successfully!</p>
            {txHash && (
              <a 
                href={getEtherscanLink()} 
                className="text-[hsl(var(--primary))] hover:underline text-sm" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on blockchain explorer
              </a>
            )}
          </div>
        )}
        
        {/* Error state */}
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 bg-[hsl(var(--error))]/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-icons text-4xl text-[hsl(var(--error))]">error</span>
            </div>
            <p className="text-[hsl(var(--neutral-400))] mb-2">Transaction failed</p>
            <p className="text-sm text-[hsl(var(--error))] text-center">
              {errorMessage || "Something went wrong with your transaction"}
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
