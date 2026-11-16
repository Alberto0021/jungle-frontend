import { http, HttpResponse } from 'msw'
import type { ListNftsResponse } from '../../api/nfts'
import { nfts } from '../../components/nftCatalog/nfts'

export const nftHandlers = [
    http.get('/api/nfts', () => {
        const items = nfts.map(({ price, previousPrice, ...nft }) => ({
            ...nft,
            price: String(price),
            ...(previousPrice === undefined
                ? {}
                : { previousPrice: String(previousPrice) }),
        }))

        return HttpResponse.json<ListNftsResponse>({
            items,
            total: items.length,
        })
    }),
]