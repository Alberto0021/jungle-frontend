import { useState } from 'react'
import emerald from '../../assets/macacoDeOculos.png'
import sage from '../../assets/macacoDeChapeu.png'
import neon from '../../assets/macacoDeGola.png'
import headset from '../../assets/macacoDeHead.png'
import CatalogSidebar from '../catalogSidebar/CatalogSidebar'
import NftGrid from '../nftGrid/NftGrid'


export type Nft = {
    id: string
    name: string
    price: number
    previousPrice?: number
    image?: string
    collection: string
    network: string
    recent?: boolean
    trending?: boolean
}

export type CatalogFilterValues = {
    collection: string
    network: string
    minPrice: number
    maxPrice: number
}

const nfts: Nft[] = [
    { id: '042', name: 'Emerald Ape', price: 1.19, image: emerald, collection: 'Arte digital', network: 'Ethereum', recent: true },
    { id: '009', name: 'Sage Nomad', price: 1.69, image: sage, collection: 'Colecionáveis', network: 'Polygon', recent: true },
    { id: '552', name: 'Neon Vessel', price: 1.99, previousPrice: 2.29, image: neon, collection: 'Arte digital', network: 'Ethereum', trending: true },
    { id: '118', name: 'Cosmic Bloom', price: 1.29, image: sage, collection: 'Arte digital', network: 'Solana' },
    { id: '314', name: 'Violet Nomad', price: 1.39, image: sage, collection: 'Colecionáveis', network: 'Polygon', trending: true },
    { id: '088', name: 'Ivory Baron', price: 1.79, image: neon, collection: 'Arte digital', network: 'Ethereum' },
    { id: '601', name: 'Golden Beat', price: 1.49, image: headset, collection: 'Música', network: 'Ethereum' },
    { id: '602', name: 'Golden Beat', price: 1.59, image: headset, collection: 'Música', network: 'Polygon' },
    { id: '603', name: 'Golden Beat', price: 1.89, image: headset, collection: 'Música', network: 'Solana' },
]

export default function NftCatalog() {
    const [filters, setFilters] = useState<CatalogFilterValues>({
        collection: '',
        network: '',
        minPrice: 0.02,
        maxPrice: 12.3,
    })

    const filteredNfts = nfts.filter(
        (nft) =>
            (!filters.collection || nft.collection === filters.collection) &&
            (!filters.network || nft.network === filters.network) &&
            nft.price >= filters.minPrice &&
            nft.price <= filters.maxPrice,
    )

    return (
        <section
            id="catalogo"
            aria-label="Catálogo de NFTs"
            className="mx-auto mt-12 grid w-[calc(100%-2rem)] max-w-[1200px] scroll-mt-6 items-start gap-8 lg:mt-24 lg:grid-cols-[minmax(220px,310px)_minmax(0,1fr)] lg:gap-12"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
            <CatalogSidebar
                filters={filters}
                onChange={setFilters}
                featuredImage={sage}
            />

            <NftGrid nfts={filteredNfts} />
        </section>
    )
}