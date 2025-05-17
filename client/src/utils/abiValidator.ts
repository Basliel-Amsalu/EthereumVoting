// import { Interface } from "ethers";
// import { VOTING_ABI } from "../lib/contracts";

// /**
//  * Utility to validate the ABI against TypeScript interfaces
//  */
// export function validateABI(): { valid: boolean; errors: string[] } {
//   const errors: string[] = [];
  
//   try {
//     // Try to parse the ABI using ethers.js
//     const contractInterface = new Interface(VOTING_ABI);
//     console.log("ABI parsed successfully");
    
//     // Check for required functions
//     const requiredFunctions = [
//       "addCandidate",
//       "registerVoter",
//       "startVoting",
//       "endVoting",
//       "vote",
//       "getVotingStatus",
//       "getCandidates",
//       "getTimeRemaining",
//       "getVoter",
//       "getTotalVotes",
//       "getTotalVoters",
//       "getStartTime",
//       "getEndTime",
//       "isAdmin",
//       "getWinner"
//     ];
    
//     // Check if all required functions exist in the ABI
//     for (const funcName of requiredFunctions) {
//       if (!contractInterface.hasFunction(funcName)) {
//         errors.push(`Missing function in ABI: ${funcName}`);
//       }
//     }
    
//     // Log all available functions for debugging
//     console.log("Available functions in ABI:");
//     Object.keys(contractInterface.functions).forEach(key => {
//       console.log(`- ${key}`);
//     });
    
//     return {
//       valid: errors.length === 0,
//       errors
//     };
//   } catch (error) {
//     console.error("Error validating ABI:", error);
//     return {
//       valid: false,
//       errors: [`ABI validation error: ${error instanceof Error ? error.message : String(error)}`]
//     };
//   }
// }

// /**
//  * Check if the ABI matches the expected interface
//  */
// export function checkABICompatibility(): void {
//   const result = validateABI();
  
//   if (result.valid) {
//     console.log("✅ ABI is valid and matches the expected interface");
//   } else {
//     console.error("❌ ABI validation failed with errors:");
//     result.errors.forEach(error => console.error(`- ${error}`));
//   }
// }
