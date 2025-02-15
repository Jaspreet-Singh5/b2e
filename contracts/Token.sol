// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.27;

import 'hardhat/console.sol';

contract Token {
    string public name;
    string public symbol; 
    uint8 public constant decimals = 18; 
    uint256 public totalSupply;

    // track account balances
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function _transfer(address _from, address _to, uint256 _value) 
        internal
    {
        require(_to != address(0));
        require(balanceOf[_from] >= _value);

        // deduct tokens from deployer
        balanceOf[_from] -= _value;
        // credit tokens to receiver
        balanceOf[_to] += _value;

        // emit event
        emit Transfer(_from, _to, _value);
    }

    function transfer(address _to, uint256 _value) 
        public 
        returns (bool success) 
    {

        _transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) 
        public 
        returns (bool success)
    {
        require(_spender != address(0));
        require(balanceOf[msg.sender] >= _value);
        
        // Allows _spender to withdraw from your account multiple times, 
        // up to the _value amount. If this function is called again it overwrites the current allowance with _value.            
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) 
        public
        returns (bool success)
    {
        require(allowance[_from][msg.sender] >= _value);


        // reset allowance
        allowance[_from][msg.sender] -= _value;
        
        _transfer(_from, _to, _value);

        return true;
    }
}
