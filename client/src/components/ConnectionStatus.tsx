import React from 'react';
import { cn } from "@/lib/utils";
import { CheckCircle, Clock } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  networkName: string;
  className?: string;
}

export function ConnectionStatus({ isConnected, networkName, className }: ConnectionStatusProps) {
  return (
    <div className={cn("w-full bg-[hsl(var(--neutral-100))] rounded-lg p-4 mb-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="flex items-center mb-3 sm:mb-0">
          {isConnected ? 
            <CheckCircle className="mr-2 w-5 h-5 text-[hsl(var(--success))]" /> : 
            <Clock className="mr-2 w-5 h-5 text-[hsl(var(--warning))]" />
          }
          <span className="font-medium">
            {isConnected 
              ? "Connected to blockchain network"
              : <span>Connecting to blockchain network<span className="loading-dots"></span></span>
            }
          </span>
        </div>
        <div>
          <span className="text-sm text-[hsl(var(--neutral-300))] hidden sm:inline mr-2">Network:</span>
          <span className="bg-[hsl(var(--primary-light))] text-white text-sm py-1 px-2 rounded-full">
            {networkName}
          </span>
        </div>
      </div>
    </div>
  );
}
