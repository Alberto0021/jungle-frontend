import axios from 'axios'

export type Nft = {
    id: string
    name: string
    price: string
    previousPrice?: string
    image?: string
    collection: string
    network: string
    recent?: boolean
    trending?: boolean
}

export type ListNftsParams = {
    collection?: string
    network?: string
    minPrice?: number
    maxPrice?: number
}

export type ListNftsResponse = {
    items: Nft[]
    total: number
}

export async function listNfts(signal?: AbortSignal, filters?: ListNftsParams) {
    const { data } = await axios.get<ListNftsResponse>('/api/nfts', {
        signal,
        params: {
            collection: filters?.collection || undefined,
            network: filters?.network || undefined,
            minPrice: filters?.minPrice,
            maxPrice: filters?.maxPrice,
        },
    })

    return data
}

export async function getNftById(nftId: string, signal?: AbortSignal) {
    const { data } = await axios.get<Nft>(
        `/api/nfts/${encodeURIComponent(nftId)}`,
        { signal },
    )

    return data
}