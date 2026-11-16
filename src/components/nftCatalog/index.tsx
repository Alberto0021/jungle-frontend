import { useState } from 'react'
import sage from '../../assets/macacoDeChapeu.png'
import NftGrid from '../nftGrid'
import { nfts } from './nfts'
import CatalogSidebar from '../catalogSidebar'

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