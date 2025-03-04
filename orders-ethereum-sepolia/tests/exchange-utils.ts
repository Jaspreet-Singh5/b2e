import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Cancel,
  Deposit,
  Order,
  Trade,
  Withdraw
} from "../generated/Exchange/Exchange"

export function createCancelEvent(
  id: BigInt,
  user: Address,
  tokenGet: Address,
  valueGet: BigInt,
  tokenGive: Address,
  valueGive: BigInt,
  timestamp: BigInt
): Cancel {
  let cancelEvent = changetype<Cancel>(newMockEvent())

  cancelEvent.parameters = new Array()

  cancelEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam("tokenGet", ethereum.Value.fromAddress(tokenGet))
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam(
      "valueGet",
      ethereum.Value.fromUnsignedBigInt(valueGet)
    )
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam("tokenGive", ethereum.Value.fromAddress(tokenGive))
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam(
      "valueGive",
      ethereum.Value.fromUnsignedBigInt(valueGive)
    )
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return cancelEvent
}

export function createDepositEvent(
  token: Address,
  user: Address,
  value: BigInt,
  balance: BigInt
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam(
      "balance",
      ethereum.Value.fromUnsignedBigInt(balance)
    )
  )

  return depositEvent
}

export function createOrderEvent(
  id: BigInt,
  user: Address,
  tokenGet: Address,
  valueGet: BigInt,
  tokenGive: Address,
  valueGive: BigInt,
  timestamp: BigInt
): Order {
  let orderEvent = changetype<Order>(newMockEvent())

  orderEvent.parameters = new Array()

  orderEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  orderEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  orderEvent.parameters.push(
    new ethereum.EventParam("tokenGet", ethereum.Value.fromAddress(tokenGet))
  )
  orderEvent.parameters.push(
    new ethereum.EventParam(
      "valueGet",
      ethereum.Value.fromUnsignedBigInt(valueGet)
    )
  )
  orderEvent.parameters.push(
    new ethereum.EventParam("tokenGive", ethereum.Value.fromAddress(tokenGive))
  )
  orderEvent.parameters.push(
    new ethereum.EventParam(
      "valueGive",
      ethereum.Value.fromUnsignedBigInt(valueGive)
    )
  )
  orderEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return orderEvent
}

export function createTradeEvent(
  id: BigInt,
  user: Address,
  tokenGet: Address,
  valueGet: BigInt,
  tokenGive: Address,
  valueGive: BigInt,
  creator: Address,
  timestamp: BigInt
): Trade {
  let tradeEvent = changetype<Trade>(newMockEvent())

  tradeEvent.parameters = new Array()

  tradeEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam("tokenGet", ethereum.Value.fromAddress(tokenGet))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "valueGet",
      ethereum.Value.fromUnsignedBigInt(valueGet)
    )
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam("tokenGive", ethereum.Value.fromAddress(tokenGive))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "valueGive",
      ethereum.Value.fromUnsignedBigInt(valueGive)
    )
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return tradeEvent
}

export function createWithdrawEvent(
  token: Address,
  user: Address,
  value: BigInt,
  balance: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "balance",
      ethereum.Value.fromUnsignedBigInt(balance)
    )
  )

  return withdrawEvent
}
