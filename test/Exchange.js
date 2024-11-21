const { ethers } = require('hardhat');
const { expect } = require('chai');
const chai = require('chai');
const { solidity } = require('ethereum-waffle');

chai.use(solidity);

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe('Exchange', () => {
    let deployer, feeAccount, exchange, token1, user1, token2, user2;

    const feePercent = 1;

    beforeEach(async () => {
        const Exchange = await ethers.getContractFactory('Exchange');
        const Token = await ethers.getContractFactory('Token');

        token1 = await Token.deploy(
            'Bakugo',
            'BKG',
            1000000
        );

        token2 = await Token.deploy(
            'Mock Usdt',
            'mUSDT',
            1000000
        );

        accounts = await ethers.getSigners();
        deployer = accounts[0];
        feeAccount = accounts[1];
        user1 = accounts[2];
        user2 = accounts[3];

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

    describe('Withdraw tokens', () => {
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
                // withdraw tokens
                transaction = await exchange.connect(user1).withdrawToken(token1.address, amount);
                result = await transaction.wait();
            });

            it('transfers token from exchange', async () => {
                expect(await token1.balanceOf(exchange.address)).to.equal(0);
            });

            it('updates user token balance', async () => {
                expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(0);
            });

            it('emits a withdraw event', async () => {
                const withdrawEvent = result.events.find(event => event.event === 'Withdraw');
                expect(withdrawEvent).to.be.not.undefined;

                const withdrawEventArgs = withdrawEvent.args;
                expect(withdrawEventArgs.token).to.equal(token1.address);
                expect(withdrawEventArgs.user).to.equal(user1.address);
                expect(withdrawEventArgs.value).to.equal(amount);
                expect(withdrawEventArgs.balance).to.equal(0);
            })
        })
       
        describe('Failure', () => {
            it('fails for insufficient user balance', async () => {
                await (expect(exchange.connect(user1).withdrawToken(token1.address, tokens(10)))).to.be.reverted;
            })
        })
        
    });

    describe('Check Balance', () => {
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

        it('returns user balance', async () => {
            expect(await token1.balanceOf(exchange.address)).to.equal(amount);
        });
    });

    describe('Make orders', async () => {
        let transaction, result, amount;

        describe('Success', async () => {
            beforeEach(async () => {
                amount = tokens(10);
                // approve tokens
                transaction = await token1.connect(user1).approve(exchange.address, amount);
                result = await transaction.wait();
                // deposit tokens
                transaction = await exchange.connect(user1).depositToken(token1.address, amount);
                result = await transaction.wait();

                transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount);
                result = await transaction.wait();
            });

            it('tracks the newly created order', async () => {
                expect(await exchange.orderCount()).to.equal(1);
            });

            it('emits an order event', async () => {
                const orderEvent = result.events.find(event => event.event === 'Order');
                expect(orderEvent).to.not.be.undefined;

                const orderEventArgs = orderEvent.args;
                expect(orderEventArgs.id).to.equal(1);
                expect(orderEventArgs.user).to.equal(user1.address);
                expect(orderEventArgs.tokenGet).to.equal(token2.address);
                expect(orderEventArgs.valueGet).to.equal(amount);
                expect(orderEventArgs.tokenGive).to.equal(token1.address);
                expect(orderEventArgs.valueGive).to.equal(amount);
                expect(orderEventArgs.timestamp).to.be.least(1);

            })
        });

        describe('Failure', async () => { 
            it('rejects order for insufficient user token balance', async () => {
                await expect(exchange.connect(user1).makeOrder(token2.address, tokens(1), token1.address, tokens(1))).to.be.reverted;
            })
        });
    });

    describe('Order actions', async () => {
        let transaction, result, amount;

        beforeEach(async () => {
            amount = tokens(10);
            // approve tokens
            transaction = await token1.connect(user1).approve(exchange.address, amount);
            result = await transaction.wait();
            // deposit tokens
            transaction = await exchange.connect(user1).depositToken(token1.address, amount);
            result = await transaction.wait();
            // make order
            transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount);
            result = await transaction.wait();
        });

        describe('Cancel orders', async () => {

            describe('Success', async () => {

                beforeEach(async () => {
                    // cancel order
                    transaction = await exchange.connect(user1).cancelOrder(1);
                    result = await transaction.wait();
                });
    
                it('cancels the order', async () => {
                    expect(await exchange.ordersCancelled(1)).to.equal(true);
                });
    
                it('emits a cancel event', async () => {
                    const cancelEvent = result.events.find(event => event.event === 'Cancel');
                    expect(cancelEvent).to.not.be.undefined;
    
                    const cancelEventArgs = cancelEvent.args;
                    expect(cancelEventArgs.id).to.equal(1);
                    expect(cancelEventArgs.user).to.equal(user1.address);
                    expect(cancelEventArgs.tokenGet).to.equal(token2.address);
                    expect(cancelEventArgs.valueGet).to.equal(amount);
                    expect(cancelEventArgs.tokenGive).to.equal(token1.address);
                    expect(cancelEventArgs.valueGive).to.equal(amount);
                    expect(cancelEventArgs.timestamp).to.be.least(1);
                })
            });
            
            describe('Failure', async () => { 
                it('rejects order via a different user', async () => {
                    await expect(exchange.connect(user2).cancelOrder(1)).to.be.reverted;
                });

                it('rejects invalid order', async () => {
                    await expect(exchange.connect(user1).cancelOrder(999999999)).to.be.reverted;
                });
            });
        });

    })
})