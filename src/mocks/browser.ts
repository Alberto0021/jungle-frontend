import { setupWorker } from 'msw/browser'
import { nftHandlers } from './handlers/nfts'
import { walletHandlers } from './handlers/wallets'

export const worker = setupWorker(...nftHandlers, ...walletHandlers)