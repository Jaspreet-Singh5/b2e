require("dotenv").config();
require("@nomicfoundation/hardhat-ignition-ethers");
require("@nomicfoundation/hardhat-ignition");
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    localhost: {}
  }
};
