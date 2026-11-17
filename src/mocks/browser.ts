import { setupWorker } from 'msw/browser'
import { nftHandlers } from './handlers/nfts'
import { walletHandlers } from './handlers/wallets'
import { authHandlers } from './handlers/auth'
import { orderHandlers } from './handlers/orders'
import { nftSocketHandlers } from './socket/nfts'

export const worker = setupWorker(
    ...nftHandlers,
    ...walletHandlers,
    ...authHandlers,
    ...orderHandlers,
    ...nftSocketHandlers,
)