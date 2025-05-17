const fs = require('fs');
const path = require('path');

/**
 * Updates the contract address in the frontend code
 * @param {string} contractAddress - The address of the deployed contract
 */
function updateContractAddress(contractAddress) {
  if (!contractAddress) {
    console.error('❌ No contract address provided');
    process.exit(1);
  }

  // Path to the contracts.ts file
  const contractsFilePath = path.join(__dirname, '../client/src/lib/contracts.ts');

  try {
    // Check if the file exists
    if (!fs.existsSync(contractsFilePath)) {
      console.error(`❌ File not found: ${contractsFilePath}`);
      process.exit(1);
    }

    // Read the current file
    let content = fs.readFileSync(contractsFilePath, 'utf8');

    // Regular expression to match the HARDHAT_VOTING_CONTRACT_ADDRESS constant
    const addressRegex = /(export const HARDHAT_VOTING_CONTRACT_ADDRESS =\s*)"([^"]+)"/;

    // Check if the pattern exists in the file
    if (!addressRegex.test(content)) {
      console.error(`❌ Could not find HARDHAT_VOTING_CONTRACT_ADDRESS in ${contractsFilePath}`);
      process.exit(1);
    }

    // Replace the address
    const updatedContent = content.replace(
      addressRegex,
      `$1"${contractAddress}"`
    );

    // Write the updated content back to the file
    fs.writeFileSync(contractsFilePath, updatedContent);

    console.log(`✅ Contract address updated in ${contractsFilePath}`);
    console.log(`✅ New address: ${contractAddress}`);
  } catch (error) {
    console.error(`❌ Error updating contract address: ${error.message}`);
    process.exit(1);
  }
}

// If this script is run directly
if (require.main === module) {
  // Get the contract address from command line arguments
  const contractAddress = process.argv[2];
  updateContractAddress(contractAddress);
}

module.exports = { updateContractAddress };
