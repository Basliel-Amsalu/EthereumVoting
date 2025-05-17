// Script to check the voting status and related variables
const hre = require("hardhat");

async function main() {
  // Get the Voting contract
  const Voting = await hre.ethers.getContractFactory("Voting");
  const votingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
  const voting = await Voting.attach(votingAddress);
  
  // Get the current block
  const block = await hre.ethers.provider.getBlock("latest");
  const currentTime = block.timestamp;
  
  // Get voting status
  const votingStatus = await voting.getVotingStatus();
  
  // Get other relevant variables
  const votingStarted = await voting.votingStarted();
  const votingEnded = await voting.votingEnded();
  const startTime = await voting.startTime();
  const endTime = await voting.endTime();
  const timeRemaining = await voting.getTimeRemaining();
  
  // Display results
  console.log("Current Blockchain Time:", currentTime, "(", new Date(currentTime * 1000).toLocaleString(), ")");
  console.log("\nVoting Status Variables:");
  console.log("- votingStatus (from getVotingStatus):", votingStatus);
  console.log("- votingStarted:", votingStarted);
  console.log("- votingEnded:", votingEnded);
  console.log("- startTime:", startTime, "(", new Date(Number(startTime) * 1000).toLocaleString(), ")");
  console.log("- endTime:", endTime, "(", new Date(Number(endTime) * 1000).toLocaleString(), ")");
  console.log("- timeRemaining:", timeRemaining, "seconds");
  
  // Check conditions in getVotingStatus function
  console.log("\nAnalyzing getVotingStatus conditions:");
  console.log("1. !votingStarted || votingEnded =", !votingStarted || votingEnded);
  console.log("2. block.timestamp >= startTime =", currentTime >= startTime);
  console.log("3. block.timestamp <= endTime =", currentTime <= endTime);
  console.log("4. Combined time condition =", (currentTime >= startTime && currentTime <= endTime));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
