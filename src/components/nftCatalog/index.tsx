import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { listNfts } from '../../api/nfts'
import sage from '../../assets/macacoDeChapeu.png'
import CatalogSidebar from '../catalogSidebar'
import NftGrid from '../nftGrid'

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

const homeRouteApi = getRouteApi('/')
const defaultMinPrice = 0.02
const defaultMaxPrice = 12.3

export default function NftCatalog() {
    const search = homeRouteApi.useSearch()
    const navigate = homeRouteApi.useNavigate()

    const filters: CatalogFilterValues = {
        collection: search.collection ?? '',
        network: search.network ?? '',
        minPrice: search.minPrice ?? defaultMinPrice,
        maxPrice: search.maxPrice ?? defaultMaxPrice,
    }

    const nftQuery = useQuery({
        queryKey: ['nfts', filters],
        queryFn: ({ signal }) => listNfts(signal, filters),
    })

    function setFilters(next: CatalogFilterValues) {
        void navigate({
            to: '/',
            search: {
                collection: next.collection || undefined,
                network: next.network || undefined,
                minPrice: next.minPrice === defaultMinPrice ? undefined : next.minPrice,
                maxPrice: next.maxPrice === defaultMaxPrice ? undefined : next.maxPrice,
            },
            hash: 'catalogo',
            replace: true,
            resetScroll: false,
        })
    }

    function renderGrid() {
        if (nftQuery.isPending) {
            return <p role="status">Carregando NFTs…</p>
        }

        if (nftQuery.isError && !nftQuery.data) {
            return (
                <div>
                    <p role="alert">Não foi possível carregar os NFTs.</p>
                    <button
                        type="button"
                        onClick={() => void nftQuery.refetch()}
                        className="mt-3 cursor-pointer text-primary underline"
                    >
                        Tentar novamente
                    </button>
                </div>
            )
        }

        const items: Nft[] = (nftQuery.data?.items ?? []).map(
            ({ price, previousPrice, ...nft }) => ({
                ...nft,
                price: Number(price),
                ...(previousPrice === undefined
                    ? {}
                    : { previousPrice: Number(previousPrice) }),
            }),
        )

        return <NftGrid nfts={items} />
    }

    return (
        <section
            id="catalogo"
            aria-label="Catálogo de NFTs"
            className="mx-auto mt-4 grid w-[calc(100%_-_2rem)] md:mt-12 max-w-[1200px] scroll-mt-6 items-start gap-8 lg:mt-24 lg:grid-cols-[minmax(220px,310px)_minmax(0,1fr)] lg:gap-12"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
            <div id="filtros-mobile" className="hidden target:block md:block">
            <CatalogSidebar
                filters={filters}
                onChange={setFilters}
                featuredImage={sage}
            />

            </div>

            {renderGrid()}
        </section>
    )
}