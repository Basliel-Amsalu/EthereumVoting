import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { exec } from "child_process";

// This function runs the Hardhat node to simulate a local blockchain
function startHardhatNode() {
  exec("npx hardhat node", (error, stdout, stderr) => {
    if (error) {
      console.error(`Hardhat node error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Hardhat stderr: ${stderr}`);
      return;
    }
    console.log(`Hardhat node output: ${stdout}`);
  });
}

// This function deploys the smart contract to the local Hardhat node
function deploySmartContract() {
  exec("npx hardhat run scripts/deploy.cjs --network localhost", (error, stdout, stderr) => {
    if (error) {
      console.error(`Deployment error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Deployment stderr: ${stderr}`);
      return;
    }
    console.log(`Deployment output: ${stdout}`);
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the local Hardhat node for blockchain simulation
  startHardhatNode();
  
  // Deploy the smart contract after a short delay to ensure node is ready
  setTimeout(() => {
    deploySmartContract();
  }, 5000);

  // Basic API routes if needed
  app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'Blockchain voting system is running' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
