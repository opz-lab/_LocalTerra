import 'jest-extended'
import { SuperTest, Test } from 'supertest'
import { setupAgent, terminateAPITest } from './lib/agent'

const NORMAL_ACCOUNT = 'terra1940nsxkz62snd3azk3a9j79m4qd3qvwnrf2xvj'
const VESTING_ACCOUNT = 'terra1qz27yu74kvv0xvxqlzhggdfkzkn2gg7fmez3we'

describe('Account', () => {
  let agent: SuperTest<Test>
  let connection

  beforeAll(async () => {
    ({ agent, connection } = await setupAgent())
  })

  afterAll(async () => {
    await terminateAPITest({ connection })
  })

  test('invalid address', async () => {
    await agent.get(`/v1/bank/${NORMAL_ACCOUNT}@$`).expect(400)
  })

  test('normal account', async () => {
    const { body } = await agent.get(`/v1/bank/${NORMAL_ACCOUNT}`).expect(200)
    const balances: Balance[] = [
      {
        denom: 'uluna',
        available: expect.any(String),
        delegatedVesting: '0',
        delegatable: expect.any(String),
        freedVesting: '0',
        unbonding: '0',
        remainingVesting: '0'
      }
    ]

    expect(body.balance).toIncludeAllMembers(balances)
    expect(body.vesting).toBeDefined()
    expect(body.delegations).toBeDefined()
    expect(body.unbondings).toBeDefined()
  })

  test('vesting account', async () => {
    const { body } = await agent.get(`/v1/bank/${VESTING_ACCOUNT}`).expect(200)

    const vestingAnswer = [
      {
        denom: 'uluna',
        schedules: [
          {
            amount: '10000000000',
            endTime: 1596428301000,
            freedRate: expect.any(Number),
            ratio: 0.2,
            startTime: 1587788301000
          },
          {
            amount: '10000000000',
            endTime: 1605068301000,
            freedRate: expect.any(Number),
            ratio: 0.2,
            startTime: 1596428302000
          },
          {
            amount: '10000000000',
            endTime: 1613708301000,
            freedRate: expect.any(Number),
            ratio: 0.2,
            startTime: 1605068302000
          },
          {
            amount: '10000000000',
            endTime: 1622348301000,
            freedRate: expect.any(Number),
            ratio: 0.2,
            startTime: 1613708302000
          },
          {
            amount: '10000000000',
            endTime: 1630988301000,
            freedRate: expect.any(Number),
            ratio: 0.2,
            startTime: 1622348302000
          }
        ],
        total: '50000000000'
      }
    ]

    expect(body.vesting).toIncludeAllMembers(vestingAnswer)
  })
})
