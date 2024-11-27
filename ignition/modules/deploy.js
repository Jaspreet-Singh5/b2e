const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
 
module.exports = buildModule("DeployModule", (m) => {
  const BKG = m.contract("Token", [
    'Bakugo',
    'BKG',
    1000000
  ], { id: 'BKG' });

  const mUSDT = m.contract("Token", [
    'Mock Usdt',
    'mUSDT',
    1000000
  ], { id: 'mUSDT' });

  const mSOL = m.contract("Token", [
    'Mock Sol',
    'mSOL',
    1000000
  ], { id: 'mSOL' });

  const mETH = m.contract("Token", [
    'Mock Eth',
    'mETH',
    1000000
  ], {id: 'mETH'});

  const feeAccount = m.getAccount(1);

  const exchange = m.contract("Exchange", [feeAccount, 1]);

  return { 
    BKG, 
    mUSDT,
    mSOL,
    mETH,
    exchange 
  };
});
