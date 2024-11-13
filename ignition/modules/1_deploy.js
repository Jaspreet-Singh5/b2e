const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
// require("@nomicfoundation/hardhat-ignition-ethers");
 
module.exports = buildModule("TokenkModule", (m) => {
  const token = m.contract("Token", []);

  return { token };
});
