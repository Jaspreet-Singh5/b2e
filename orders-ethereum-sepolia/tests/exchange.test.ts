import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { Cancel } from "../generated/schema"
import { Cancel as CancelEvent } from "../generated/Exchange/Exchange"
import { handleCancel } from "../src/exchange"
import { createCancelEvent } from "./exchange-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = BigInt.fromI32(234)
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let tokenGet = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let valueGet = BigInt.fromI32(234)
    let tokenGive = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let valueGive = BigInt.fromI32(234)
    let timestamp = BigInt.fromI32(234)
    let newCancelEvent = createCancelEvent(
      id,
      user,
      tokenGet,
      valueGet,
      tokenGive,
      valueGive,
      timestamp
    )
    handleCancel(newCancelEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Cancel created and stored", () => {
    assert.entityCount("Cancel", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Cancel",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "user",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Cancel",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenGet",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Cancel",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "valueGet",
      "234"
    )
    assert.fieldEquals(
      "Cancel",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenGive",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Cancel",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "valueGive",
      "234"
    )
    assert.fieldEquals(
      "Cancel",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
