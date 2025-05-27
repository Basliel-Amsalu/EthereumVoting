import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimeRemaining(timeRemaining: number): string {
  if (!timeRemaining) return "N/A";

  // timeRemaining is already in seconds from the contract
  const diff = timeRemaining;

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = Math.floor(diff % 60);

  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""} ${hours} hour${
      hours !== 1 ? "s" : ""
    }`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${
      minutes !== 1 ? "s" : ""
    }`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ${seconds} second${
      seconds !== 1 ? "s" : ""
    }`;
  } else {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
}

export function calculatePercentage(
  votes: number | bigint,
  totalVotes: number | bigint
): number {
  // Convert BigInt to number if needed
  const votesNum = typeof votes === "bigint" ? Number(votes) : votes;
  const totalVotesNum =
    typeof totalVotes === "bigint" ? Number(totalVotes) : totalVotes;

  if (totalVotesNum === 0) return 0;
  return Math.round((votesNum / totalVotesNum) * 100);
}
