/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomicfoundation/hardhat-toolbox");
module.exports = {
  solidity: "0.8.18",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      // Ensures hardhat runs in standalone mode
      chainId: 1337
    }
  },
  paths: {
    artifacts: "./client/src/artifacts"
  }
};