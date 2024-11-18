const { ethers } = require('hardhat');
const { expect } = require('chai');
const chai = require('chai');
const { solidity } = require('ethereum-waffle');

chai.use(solidity);

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe('Token', () => {
    let token, accounts, deployer, receiver, exchange;

    beforeEach(async () => {
        const Token = await ethers.getContractFactory('Token');
        token = await Token.deploy(
            'Bakugo',
            'BKG',
            1000000
        );

        accounts = await ethers.getSigners();
        deployer = accounts[0];
        receiver = accounts[1];
        // TODO: create a exchange contract
        exchange = accounts[2];
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
    });

    describe('Sending Token', () => {
        let amount, transaction, result;

        describe('Success', () => {
            beforeEach(async () => {
                amount = tokens(100);
                // transfer tokens
                transaction = await token.connect(deployer).transfer(receiver.address, amount);
                result = await transaction.wait();
            });
    
            it('transfers token balances', async () => {
                // ensure tokens transfered i.e. balance changed
                const receiverBal = await token.balanceOf(receiver.address);
                const deployerBal = await token.balanceOf(deployer.address);
    
                expect(receiverBal.toString()).to.equal(amount.toString());
                expect(deployerBal.toString()).to.equal(tokens(999900).toString());
            });
    
            it('emits a transfer event', () => {
                const transferEvent = result.events.find(e => e.event === 'Transfer');
                expect(transferEvent).to.not.undefined;
    
                const args = transferEvent?.args;
                expect(args.from).to.equal(deployer.address);
                expect(args.to).to.equal(receiver.address);
                expect(args.value.toString()).to.equal(amount.toString());
            });
        });

        describe('Failure', () => {
            it('rejects insufficient balances', async () => {
                const invalidAmount = tokens(200000000000);
                await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted;
            })

            it('rejects invalid recipent', async () => {
                const amount = tokens(100);

                await expect(token.connect(deployer)
                    .transfer(
                        '0x0000000000000000000000000000000000000000', 
                        amount
                    )).to.be.reverted;
            })
        });
    });

    describe('Approving tokens', () => {
        describe('Success', () => {
            let amount, transaction, result;

            beforeEach(async () => {
                amount = tokens(100);
                // transfer tokens
                transaction = await token.connect(deployer).approve(exchange.address, amount);
                result = await transaction.wait();
            });

            it('allocates an allowance for delegated token spending', async () => {
                expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount);
            });

            it('emits an approval event', () => {
                const approvalEvent = result.events.find(e => e.event === 'Approval');
                const {
                    owner,
                    spender,
                    value
                } = approvalEvent.args;
                
                expect(owner).to.equal(deployer.address);
                expect(spender).to.equal(exchange.address);
                expect(value).to.equal(amount);
            })
        });

        describe('Failure', () => {
            it('rejects invalid recipent', async () => {
                const amount = tokens(100);

                await expect(token.connect(deployer)
                    .approve(
                        '0x0000000000000000000000000000000000000000', 
                        amount
                    )).to.be.reverted;
            })
        });
    })

})