require("dotenv").config();
require("@nomicfoundation/hardhat-ignition-ethers");
require("@nomicfoundation/hardhat-ignition");
require("@nomiclabs/hardhat-ethers");

const privateKeys = process.env.PRIVATE_KEYS || '';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {},
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: privateKeys.split(','),
    },
    amoy: {
      url: `https://polygon-amoy.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: privateKeys.split(','),
    }
  }
};
