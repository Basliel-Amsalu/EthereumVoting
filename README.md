# Ethereum Voting DApp

A decentralized voting application built on Ethereum blockchain technology. This application allows for secure, transparent, and tamper-proof voting with real-time results.

![Ethereum Voting DApp](client/public/voting-app-screenshot.png)

## Features

- **Secure Blockchain Voting**: All votes are recorded on the Ethereum blockchain, ensuring immutability and transparency
- **Real-time Results**: View voting results as they happen
- **Admin Controls**: Authorized administrators can manage the voting process
- **Candidate Management**: Add candidates with names and proposals
- **Voter Registration**: Register voters with different voting weights
- **Time-based Voting**: Set specific start and end times for voting periods
- **Responsive UI**: Modern interface that works on desktop and mobile devices

## Technology Stack

- **Smart Contracts**: Solidity
- **Blockchain Development**: Hardhat
- **Frontend**: React, TypeScript, Vite
- **UI Components**: Shadcn/UI
- **Blockchain Interaction**: ethers.js
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask browser extension

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ethereum-voting.git
   cd ethereum-voting
   ```

2. Install dependencies:
   ```
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   HARDHAT_CHAIN_ID=31337
   PRIVATE_KEY=your_private_key_here
   ```

## Running the Application

### Start the Local Blockchain

```
npx hardhat node
```

### Deploy the Smart Contract

In a new terminal:

```
npx hardhat run scripts/deploy.cjs --network localhost
```

Note the contract address that is output after deployment.

### Start the Frontend

```
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## Using the Application

### Admin Functions

1. **Connect Wallet**: Click "Connect Wallet" and select your MetaMask account
2. **Add Candidates**: Go to the Admin tab and add candidates with their names and proposals
3. **Register Voters**: Register voters by entering their Ethereum addresses
4. **Start Voting**: Set the end time for the voting period and click "Start Voting"
5. **End Voting**: Manually end the voting period if needed

### Voter Functions

1. **Connect Wallet**: Click "Connect Wallet" and select your MetaMask account
2. **View Candidates**: Browse the list of candidates and their proposals
3. **Cast Vote**: Select a candidate and click "Vote" (only registered voters can vote)
4. **View Results**: Go to the Results tab to see the current voting results

## Smart Contract Details

The voting system is powered by a Solidity smart contract with the following key functions:

- `addCandidate(string name, string proposal)`: Add a new candidate
- `registerVoter(address voter, uint weight)`: Register a voter with a specific weight
- `vote(uint candidateId)`: Cast a vote for a specific candidate
- `startVoting(uint startTime, uint endTime)`: Start the voting period
- `endVoting()`: End the voting period
- `getWinner()`: Get the current winner based on vote count

## Development

### Modifying the Smart Contract

If you make changes to the smart contract:

1. Compile the contract:
   ```
   npx hardhat compile
   ```

2. Deploy the updated contract:
   ```
   npx hardhat run scripts/deploy.cjs --network localhost
   ```

3. Update the contract address in your frontend code if needed.

### Running Tests

```
npx hardhat test
```

## Deployment to a Public Network

To deploy to a public network like Ethereum Mainnet, Goerli, or Sepolia:

1. Update your `.env` file with the appropriate variables:
   ```
   PRIVATE_KEY=your_private_key_here
   INFURA_API_KEY=your_infura_api_key
   ```

2. Deploy to the desired network:
   ```
   npx hardhat run scripts/deploy.cjs --network goerli
   ```

3. Update the contract address and network in your frontend code.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- [Hardhat](https://hardhat.org/)
- [ethers.js](https://docs.ethers.io/)
- [React](https://reactjs.org/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
