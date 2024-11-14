const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe('Token', () => {
    let token, accounts, deployer;

    beforeEach(async () => {
        const Token = await ethers.getContractFactory('Token');
        token = await Token.deploy(
            'Bakugo',
            'BKG',
            1000000
        );

        accounts = await ethers.getSigners();
        deployer = accounts[0];
    });

    describe('Deployment', () => {
        const acutalName = 'Bakugo';
        const acutalSymbol = 'BKG';
        const actualDecimals = 18;
        const actualTotalSupply = tokens(1000000);

        it('has correct name', async () => {
            const name = await token.name();
    
            expect(name).to.equal(acutalName);
        });
    
        it('has correct symbol', async () => {
            const symbol = await token.symbol();
    
            expect(symbol).to.equal(acutalSymbol);
        });
    
        it('has correct decimals', async () => {
            const decimals = await token.decimals();
            
            expect(decimals).to.equal(actualDecimals);
        });
    
        it('has correct total supply', async () => { 
            const expectedtotalSupply = await token.totalSupply();
    
            expect(expectedtotalSupply.toString()).to.equal(actualTotalSupply.toString());
        });

        it('assigns total supply to deployer', async () => {
            const balanceOfDeployer = await token.balanceOf(deployer.address);

            expect(balanceOfDeployer.toString()).to.equal(actualTotalSupply.toString());
        });
    })

})