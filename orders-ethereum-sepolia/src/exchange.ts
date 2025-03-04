import {
  Cancel as CancelEvent,
  Deposit as DepositEvent,
  Order as OrderEvent,
  Trade as TradeEvent,
  Withdraw as WithdrawEvent
} from "../generated/Exchange/Exchange"
import { Cancel, Deposit, Order, Trade, Withdraw } from "../generated/schema"

export function handleCancel(event: CancelEvent): void {
  let entity = new Cancel(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.user = event.params.user
  entity.tokenGet = event.params.tokenGet
  entity.valueGet = event.params.valueGet
  entity.tokenGive = event.params.tokenGive
  entity.valueGive = event.params.valueGive
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.user = event.params.user
  entity.value = event.params.value
  entity.balance = event.params.balance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrder(event: OrderEvent): void {
  let entity = new Order(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.user = event.params.user
  entity.tokenGet = event.params.tokenGet
  entity.valueGet = event.params.valueGet
  entity.tokenGive = event.params.tokenGive
  entity.valueGive = event.params.valueGive
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTrade(event: TradeEvent): void {
  let entity = new Trade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.user = event.params.user
  entity.tokenGet = event.params.tokenGet
  entity.valueGet = event.params.valueGet
  entity.tokenGive = event.params.tokenGive
  entity.valueGive = event.params.valueGive
  entity.creator = event.params.creator
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.user = event.params.user
  entity.value = event.params.value
  entity.balance = event.params.balance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
