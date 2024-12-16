// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import { Token } from './Token.sol';

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    mapping (address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    uint256 public orderCount;
    mapping(uint256 => bool) public ordersCancelled;
    mapping(uint256 => bool) public ordersFilled;

    event Deposit(
        address indexed token,
        address indexed user,
        uint256 value,
        uint256 balance
    );

    event Withdraw(
        address indexed token,
        address indexed user,
        uint256 value,
        uint256 balance
    );

    event Order (
        uint256 id, // unique identifier for order
        address indexed user, // User who made order
        address indexed tokenGet, // address of the token they receive
        uint256 valueGet, // value of the token they receive
        address indexed tokenGive, // address of the token they give
        uint256 valueGive, // value of the token they give
        uint256 timestamp // When order was created
    );

    event Cancel (
        uint256 id, // unique identifier for order
        address indexed user, // User who made order
        address indexed tokenGet, // address of the token they receive
        uint256 valueGet, // value of the token they receive
        address indexed tokenGive, // address of the token they give
        uint256 valueGive, // value of the token they give
        uint256 timestamp // When order was cancelled
    );

    event Trade(
        uint256 id, // unique identifier for order
        address indexed user, // User who filled the order
        address indexed tokenGet, // address of the token they receive
        uint256 valueGet, // value of the token they receive
        address indexed tokenGive, // address of the token they give
        uint256 valueGive, // value of the token they give
        address creator, // User who created the order
        uint256 timestamp // When order was traded
    );

    // model order
    struct _Order {
        // attributes of an order
        uint256 id; // unique identifier for order
        address user; // User who made order
        address tokenGet; // address of the token they receive
        uint256 valueGet; // value of the token they receive
        address tokenGive; // address of the token they give
        uint256 valueGive; // value of the token they give
        uint256 timestamp; // When order was created
    }

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


    // -----------------------
    // MAKE & CANCEL ORDERS

    function makeOrder(
        address _tokenGet,
        uint256 _valueGet,
        address _tokenGive,
        uint256 _valueGive'
    ) public 
    {
        // should have enought tokens to give
        require(tokens[_tokenGive][msg.sender] >= _valueGive);

        // Instantiate a new order
        orderCount++;
        orders[orderCount] = _Order(
            orderCount, // id
            msg.sender, // user
            _tokenGet, // address of the token they receive
            _valueGet, // value of the token they receive
            _tokenGive, // address of the token they give
            _valueGive, // value of the token they give
            block.timestamp // When order was created
        );

        emit Order(
            orderCount, // id
            msg.sender, // user
            _tokenGet, // address of the token they receive
            _valueGet, // value of the token they receive
            _tokenGive, // address of the token they give
            _valueGive, // value of the token they give
            block.timestamp // When order was created
        );      
    }

    function cancelOrder(uint256 _id) public {
        require(_id > 0 && _id <= orderCount);

        // fetch order
        _Order storage _order = orders[_id];

        // allow cancelling orders created via same user only
        require(_order.user == msg.sender);

        // cancel the order
        ordersCancelled[_id] = true;

        // emit event
        emit Cancel(
            _order.id, // id
            msg.sender, // user
            _order.tokenGet, // address of the token they receive
            _order.valueGet, // value of the token they receive
            _order.tokenGive, // address of the token they give
            _order.valueGive, // value of the token they give
            block.timestamp // When order was cancelled`
        );      
    }

    // ------------------
    // EXECUTING ORDERS

    function fillOrder(uint256 _id) public {
        require(_id > 0 && _id <= orderCount);
        require(!ordersFilled[_id]);
        require(!ordersCancelled[_id]);

        // fetch order
        _Order storage _order = orders[_id];

        // swapping tokens (trading)
        _trade(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.valueGet,
            _order.tokenGive,
            _order.valueGive
        );
        // mark order as filled
        ordersFilled[_order.id] = true;
    }

    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _valueGet,
        address _tokenGive,
        uint256 _valueGive
    ) internal {
        // Fee is paid by the user who fills the order
        uint256 _feeAmount = (_valueGet * feePercent) / 100;

        // user who executes the trade should have enough balance
        require(tokens[_tokenGet][msg.sender] >= (_valueGet + _feeAmount));
        
        // execute the trade
        // msg.sender is the user who filled the order, 
        // while _user is who created the order
        tokens[_tokenGet][msg.sender] -= (_valueGet + _feeAmount);
        tokens[_tokenGet][_user] += _valueGet;

        tokens[_tokenGive][_user] -= _valueGive;
        tokens[_tokenGive][msg.sender] += _valueGive;

        // charge fees
        tokens[_tokenGet][feeAccount] += _feeAmount;

        // emit event
        emit Trade(
            _orderId, // unique identifier for order
            msg.sender, // User who executes the trade
            _tokenGet, // address of the token they receive
            _valueGet, // value of the token they receive
            _tokenGive, // address of the token they give
            _valueGive, // value of the token they give
            _user, // User who created the order
            block.timestamp // When order was traded
        );
    }
}
