const { ethers } = require('hardhat');
const { expect } = require('chai');
const chai = require('chai');
const { solidity } = require('ethereum-waffle');

chai.use(solidity);

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe('Exchange', () => {
    let deployer, feeAccount, exchange, token1, user1;

    const feePercent = 1;

    beforeEach(async () => {
        const Exchange = await ethers.getContractFactory('Exchange');
        const Token = await ethers.getContractFactory('Token');

        token1 = await Token.deploy(
            'Bakugo',
            'BKG',
            1000000
        );

        accounts = await ethers.getSigners();
        deployer = accounts[0];
        feeAccount = accounts[1];
        user1 = accounts[2];

        let transaction = await token1.connect(deployer).transfer(user1.address, tokens(100));
        let result = transaction.wait();

        exchange = await Exchange.deploy(feeAccount.address, feePercent);
    });

    describe('Deployment', () => {

        it('tracks the fee account', async () => {
            expect(await exchange.feeAccount()).to.equal(feeAccount.address);
        });

        it('tracks the fee percent', async () => {
            expect(await exchange.feePercent()).to.equal(feePercent);
        });
    });

    describe('Deposit tokens', () => {
        describe('Success', () => {
            let transaction, result, amount;

            beforeEach(async() => {
                amount = tokens(10);
                // approve tokens
                transaction = await token1.connect(user1).approve(exchange.address, amount);
                result = await transaction.wait();
                // deposit tokens
                transaction = await exchange.connect(user1).depositToken(token1.address, amount);
                result = await transaction.wait();
            });

            it('transfers token to exchange', async () => {
                expect(await token1.balanceOf(exchange.address)).to.equal(amount);
            });

            it('updates user token balance', async () => {
                expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(amount);
            });

            it('emits a deposit event', async () => {
                const depositEvent = result.events.find(event => event.event === 'Deposit');
                expect(depositEvent).to.be.not.undefined;

                const depositEventArgs = depositEvent.args;
                expect(depositEventArgs.token).to.equal(token1.address);
                expect(depositEventArgs.user).to.equal(user1.address);
                expect(depositEventArgs.value).to.equal(amount);
                expect(depositEventArgs.balance.toString()).to.equal(amount.toString());
            })
        })
       
        describe('Failure', () => {
            it('fails when no tokens are not approved', async () => {
                await (expect(exchange.connect(user1).depositToken(token1.address, tokens(10)))).to.be.reverted;
            })
        })
        
    });
})