import { setupWorker } from 'msw/browser'
import { nftHandlers } from './handlers/nfts'

export const worker = setupWorker(...nftHandlers)