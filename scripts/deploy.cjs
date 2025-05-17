const hre = require("hardhat");
const { updateContractAddress } = require("./update-contract-address.cjs");

async function main() {
  // Get the test accounts from Hardhat
  const [deployer, addr1, addr2, addr3] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  // console.log("Account balance:", (await deployer.).toString());

  // Deploy Voting contract
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  // Wait for deployment and get the transaction receipt
  const deployTx = await voting.deploymentTransaction().wait();

  // Get the contract address from the deployment transaction
  const contractAddress = deployTx.contractAddress || voting.target;

  console.log("Voting contract deployed to:", contractAddress);

  // Add initial candidates
  console.log("Adding candidates...");
  await (await voting.addCandidate("Candidate A", "Transparency")).wait();
  await (await voting.addCandidate("Candidate B", "Community")).wait();
  await (await voting.addCandidate("Candidate C", "Innovation")).wait();

  // Register test voters
  console.log("Registering voters...");
  await (await voting.registerVoter(addr1.address, 1)).wait();
  await (await voting.registerVoter(addr2.address, 1)).wait();
  await (await voting.registerVoter(addr3.address, 2)).wait();

  // Start voting period (24 hours from now)
  const now = Math.floor(Date.now() / 1000);
  const oneDay = 24 * 60 * 60;
  await (await voting.startVoting(now, now + oneDay)).wait();

  console.log(`
  Deployment successful!
  Contract address: ${contractAddress}
  Deployer: ${deployer.address}
  Test accounts:
  1. ${addr1.address} (weight: 1)
  2. ${addr2.address} (weight: 1)
  3. ${addr3.address} (weight: 2)
  Voting ends at: ${new Date((now + oneDay) * 1000)}
  `);

  // Update the contract address in the frontend
  console.log("Updating contract address in frontend code...");
  updateContractAddress(contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nDeployment failed:", error);
    process.exit(1);
  });
