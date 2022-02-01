import { Wallet, Contract } from 'ethers'
import { Web3Provider } from 'ethers/providers'
import { deployContract } from 'ethereum-waffle'

import { expandTo18Decimals } from './utilities'

import CybarV2Factory from '../../buildPermanent/CybarFactory.json'
import ICybarV2Pair from '../../buildPermanent/ICybarPair.json'

import ERC20 from '../../build/ERC20.json'
import WFTM9 from '../../build/WFTM9.json'
import CybarMigrator from '../../build/CybarMigrator.json'
import CybarRouter02 from '../../build/CybarRouter.json'
import RouterEventEmitter from '../../build/RouterEventEmitter.json'

const overrides = {
  gasLimit: 9999999
}

interface V2Fixture {
  token0: Contract
  token1: Contract
  WFTM: Contract
  WFTMPartner: Contract
  factory: Contract
  router: Contract
  routerEventEmitter: Contract
  migrator: Contract
  pair: Contract
  WETHPair: Contract
}

export async function v2Fixture(provider: Web3Provider, [wallet]: Wallet[]): Promise<V2Fixture> {
  // deploy tokens
  const tokenA = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)])
  const tokenB = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)])
  const WFTM = await deployContract(wallet, WFTM9)
  const WFTMPartner = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)])

  // deploy
  const factory = await deployContract(wallet, CybarV2Factory, [wallet.address])

  const router = await deployContract(wallet, CybarRouter02, [factory.address, WFTM.address], overrides)

  // event emitter for testing
  const routerEventEmitter = await deployContract(wallet, RouterEventEmitter, [])

  // deploy migrator
  const migrator = await deployContract(wallet, CybarMigrator, [factoryV1.address, router01.address], overrides)

  // initialize
  await factory.createPair(tokenA.address, tokenB.address)
  const pairAddress = await factory.getPair(tokenA.address, tokenB.address)
  const pair = new Contract(pairAddress, JSON.stringify(ICybarV2Pair.abi), provider).connect(wallet)

  const token0Address = await pair.token0()
  const token0 = tokenA.address === token0Address ? tokenA : tokenB
  const token1 = tokenA.address === token0Address ? tokenB : tokenA

  await factory.createPair(WFTM.address, WFTMPartner.address)
  const WETHPairAddress = await factory.getPair(WFTM.address, WFTMPartner.address)
  const WETHPair = new Contract(WETHPairAddress, JSON.stringify(ICybarV2Pair.abi), provider).connect(wallet)

  return {
    token0,
    token1,
    WFTM,
    WFTMPartner,
    factory,
    router,
    routerEventEmitter,
    migrator,
    pair,
    WETHPair
  }
}
