// Script to check the current Hardhat blockchain time
import { ethers } from "hardhat";

async function main() {
  // Get the current block
  const block = await ethers.provider.getBlock("latest");

  // Get the current timestamp
  const timestamp = block.timestamp;

  // Convert to human-readable date
  const date = new Date(timestamp * 1000);

  console.log("Current Hardhat blockchain time:");
  console.log("Timestamp (seconds):", timestamp);
  console.log("Human-readable date:", date.toLocaleString());

  // Also show the current system time for comparison
  console.log("\nCurrent system time:");
  console.log("Timestamp (seconds):", Math.floor(Date.now() / 1000));
  console.log("Human-readable date:", new Date().toLocaleString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
