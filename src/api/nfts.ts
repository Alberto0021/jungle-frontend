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

export type ListNftsResponse = {
    items: Nft[]
    total: number
}

export async function listNfts(signal?: AbortSignal) {
    const { data } = await axios.get<ListNftsResponse>('/api/nfts', { signal })
    return data
}