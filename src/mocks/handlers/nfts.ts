import { http, HttpResponse } from 'msw'
import type { ListNftsResponse } from '../../api/nfts'
import { nfts } from '../../components/nftCatalog/nfts'

type CatalogNft = (typeof nfts)[number]

const priceOverrides = new Map<string, number>()

export function setMockNftPrice(id: string, price: number): boolean {
    if (!Number.isFinite(price) || price < 0) return false
    if (!nfts.some((nft) => nft.id === id)) return false

    priceOverrides.set(id, price)
    return true
}

function getCurrentPrice(nft: CatalogNft): number {
    return priceOverrides.get(nft.id) ?? nft.price
}

function serializeNft(nft: CatalogNft): ListNftsResponse['items'][number] {
    const { previousPrice, ...fields } = nft

    return {
        ...fields,
        price: String(getCurrentPrice(nft)),
        ...(previousPrice === undefined
            ? {}
            : { previousPrice: String(previousPrice) }),
    }
}

export const nftHandlers = [
    http.get('/api/nfts', ({ request }) => {
        const params = new URL(request.url).searchParams
        const collection = params.get('collection')
        const network = params.get('network')
        const min = params.get('minPrice')
        const max = params.get('maxPrice')
        const minPrice = min === null ? 0 : Number(min)
        const maxPrice = max === null ? Infinity : Number(max)

        if (
            (min !== null && (min.trim() === '' || !Number.isFinite(minPrice))) ||
            (max !== null && (max.trim() === '' || !Number.isFinite(maxPrice))) ||
            minPrice < 0 ||
            maxPrice < minPrice
        ) {
            return HttpResponse.json(
                { message: 'Faixa de preço inválida.' },
                { status: 400 },
            )
        }

        const items = nfts
            .filter((nft) => {
                if (collection && nft.collection !== collection) return false
                if (network && nft.network !== network) return false

                const price = getCurrentPrice(nft)
                return price >= minPrice && price <= maxPrice
            })
            .map(serializeNft)

        return HttpResponse.json<ListNftsResponse>({
            items,
            total: items.length,
        })
    }),

    http.get('/api/nfts/:id', ({ params }) => {
        const nft = nfts.find((item) => item.id === params.id)

        if (!nft) {
            return HttpResponse.json(
                { message: 'NFT não encontrado.' },
                { status: 404 },
            )
        }

        return HttpResponse.json(serializeNft(nft))
    }),
]