// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import { Token } from './Token.sol';

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    mapping (address => mapping(address => uint256)) public tokens;

    event Deposit(
        address token,
        address user,
        uint256 value,
        uint256 balance
    );

    event Withdraw(
        address token,
        address user,
        uint256 value,
        uint256 balance
    );

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // -------------------------
    // DEPOSIT & WITHDRAW TOKEN

    function depositToken(address _token, uint256 _value) 
        public
    {
        // transfer tokens to exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _value));
        // update user balance
        tokens[_token][msg.sender] += _value; 
        // emit an event
        emit Deposit(_token, msg.sender, _value, tokens[_token][msg.sender]);
    }

    function withdrawToken(address _token, uint256 _value) 
        public
    {
        // user has sufficient token balance
        require(tokens[_token][msg.sender] >= _value);

        // transfer tokens from exchange
        require(Token(_token).transfer(msg.sender, _value));
        // update user balance
        tokens[_token][msg.sender] -= _value; 
        // emit an event
        emit Withdraw(_token, msg.sender, _value, tokens[_token][msg.sender]);
    }

    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }

}