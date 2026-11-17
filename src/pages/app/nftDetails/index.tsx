import { useState } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import { nfts } from '../../../components/nftCatalog/nfts'
import type { Nft } from '../../../components/nftCatalog'
import { getNftById } from '../../../api/nfts'
import { addToCart } from '../../../lib/cartStore'
import DetailSkeleton from './DetailSkeleton'

type Panel = 'details' | 'reviews'

const editions = ['1/1', '1/10', '1/50', 'ABERTA'] as const
type Edition = (typeof editions)[number]

const editionLimits: Record<Edition, number> = {
    '1/1': 1,
    '1/10': 10,
    '1/50': 50,
    ABERTA: Infinity,
}

type ProductDetails = {
    collection: string
    attributes: string
    description: string
    reviewCount: number
    rating: number
}

const detailsById: Partial<Record<string, ProductDetails>> = {
    '042': {
        collection: 'Kurio Apes',
        attributes: 'Óculos, Esmeralda, Raro',
        description:
            'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
        reviewCount: 19,
        rating: 4,
    },
}

function getProductDetails(nft: Nft): ProductDetails {
    return detailsById[nft.id] ?? {
        collection: nft.collection,
        attributes: 'Não informados',
        description: `${nft.name} é um colecionável digital da categoria ${nft.collection}, disponível na rede ${nft.network}.`,
        reviewCount: 0,
        rating: 0,
    }
}

function panelClass(active: boolean) {
    const base = 'cursor-pointer border-b-2 pb-2'

    return active
        ? `${base} border-primary font-bold text-primary`
        : `${base} border-transparent hover:text-primary`
}

function editionClass(active: boolean) {
    const base = 'cursor-pointer rounded-full border px-2 py-0.5 text-xs'

    return active
        ? `${base} border-primary text-primary`
        : `${base} border-border text-muted-foreground`
}

function NftGallery({ image, name }: { image: string | undefined; name: string }) {
    const [selected, setSelected] = useState(0)
    const [zoomed, setZoomed] = useState(false)

    if (!image) {
        return (
            <div className="grid aspect-square place-items-center rounded-lg bg-[#251710] text-sm text-muted-foreground">
                Imagem indisponível
            </div>
        )
    }

    const images = [image, image, image, image]

    return (
        <div className="grid min-w-0 grid-cols-1 items-start gap-3 md:grid-cols-[100px_minmax(0,1fr)] md:gap-7">
            <div role="group" aria-label="Miniaturas do NFT" className="hidden gap-3 md:grid">
                {images.map((thumbnail, index) => (
                    <button
                        key={index}
                        type="button"
                        aria-label={`Selecionar miniatura ${index + 1}`}
                        aria-pressed={selected === index}
                        onClick={() => {
                            setSelected(index)
                            setZoomed(false)
                        }}
                        className="aspect-square cursor-pointer overflow-hidden rounded-lg border border-transparent aria-pressed:border-primary"
                    >
                        <img src={thumbnail} alt="" className="size-full object-cover" />
                    </button>
                ))}
            </div>

            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#251710] md:rounded-lg md:p-5">
                <div className="size-full overflow-hidden rounded-[24px]">
                    <img
                        src={images[selected] ?? image}
                        alt={name}
                        data-zoomed={zoomed}
                        className="size-full object-cover transition-transform data-[zoomed=true]:scale-150"
                    />
                </div>
                <button
                    type="button"
                    aria-label="Ampliar imagem"
                    aria-pressed={zoomed}
                    onClick={() => setZoomed((value) => !value)}
                    className="absolute top-3 right-3 grid size-8 cursor-pointer place-items-center rounded-full bg-background/80"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
                        <circle cx="10.5" cy="10.5" r="6.5" />
                        <path d="m15.5 15.5 5 5" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

function ShareLinks({ name }: { name: string }) {
    const pageUrl = encodeURIComponent(window.location.href)

    return (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-bold">Compartilhar este NFT:</span>

            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no LinkedIn"
                className="hover:text-primary"
            >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path d="M2 8h4v14H2zm2-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm5 6h4v2c1-1.5 2.4-2.3 4.1-2.3 3.4 0 4.9 2 4.9 5.8V22h-4v-8c0-1.9-.7-2.8-2.2-2.8-1.7 0-2.8 1.2-2.8 3V22H9z" />
                </svg>
            </a>

            <a
                href={`mailto:?subject=${encodeURIComponent(name)}&body=${pageUrl}`}
                aria-label="Compartilhar por e-mail"
                className="hover:text-primary"
            >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                </svg>
            </a>

            <a
                href={`https://twitter.com/intent/tweet?url=${pageUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no Twitter"
                className="hover:text-primary"
            >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path d="M23.954 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723 9.99 9.99 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482A13.96 13.96 0 0 1 1.64 3.162a4.916 4.916 0 0 0 1.52 6.556 4.9 4.9 0 0 1-2.228-.616v.062a4.917 4.917 0 0 0 3.946 4.818 4.94 4.94 0 0 1-2.22.084 4.923 4.923 0 0 0 4.6 3.417A9.867 9.867 0 0 1 0 19.52a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.01-7.503 14.01-14.01 0-.213-.005-.425-.014-.636a10.02 10.02 0 0 0 2.46-2.548z" />
                </svg>
            </a>
        </div>
    )
}

function RelatedNfts({ nft }: { nft: Nft }) {
    const otherNfts = nfts.filter((item) => item.id !== nft.id)
    const relatedNfts = [
        ...otherNfts.filter((item) => item.collection === nft.collection),
        ...otherNfts.filter((item) => item.collection !== nft.collection),
    ].slice(0, 5)

    if (relatedNfts.length === 0) return null

    return (
        <section className="mt-20" aria-labelledby="related-nfts-title">
            <h2 id="related-nfts-title" className="border-b border-border pb-2 text-sm font-bold text-primary">
                Mais desta coleção
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {relatedNfts.map((item) => (
                    <li key={item.id}>
                        <Link
                            to="/mercado/$nftId"
                            params={{ nftId: item.id }}
                            className="block hover:text-primary"
                        >
                            {item.image && (
                                <div className="rounded-md bg-[#251710] p-2">
                                    <img
                                        src={item.image}
                                        alt=""
                                        loading="lazy"
                                        className="aspect-square w-full rounded-md object-cover"
                                    />
                                </div>
                            )}
                            <p className="mt-2 text-xs">{item.name} #{item.id}</p>
                            <p className="mt-1 text-sm font-bold text-primary">
                                {item.price.toFixed(2)} ETH
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}

function NftProduct({ nft }: { nft: Nft }) {
    const navigate = useNavigate()
    const [favorite, setFavorite] = useState(false)
    const [panel, setPanel] = useState<Panel>('details')
    const [edition, setEdition] = useState<Edition>('1/50')
    const [quantity, setQuantity] = useState(1)

    const details = getProductDetails(nft)
    const name = `${nft.name} #${nft.id}`
    const tokenId = nft.id.padStart(4, '0')
    const quantityLimit = editionLimits[edition]
    const priceLabel = `${nft.price.toFixed(2)} ETH`
    const quantityButtonClass =
        'grid size-9 place-items-center rounded-full bg-primary text-xl text-primary-foreground enabled:cursor-pointer disabled:opacity-60 md:h-12 md:w-8 md:text-2xl'

    function selectEdition(value: Edition) {
        setEdition(value)
        setQuantity(1)
    }

    function openReviews() {
        setPanel('reviews')
        document.getElementById('nft-information')?.scrollIntoView()
    }

    function renderPanel() {
        if (panel === 'reviews') {
            return (
                <p>
                    {details.reviewCount === 0
                        ? 'Este NFT ainda não tem avaliações cadastradas.'
                        : 'As avaliações deste NFT são demonstrativas.'}
                </p>
            )
        }

        return (
            <div className="space-y-3">
                <p>{details.description}</p>
                <p>
                    A procedência de um NFT pode ser verificada pelo histórico do token
                    na blockchain. Os direitos sobre a arte dependem da licença da coleção.
                </p>
                <p><strong className="text-foreground">Rede:</strong> {nft.network}</p>
                <p><strong className="text-foreground">Token:</strong> #{tokenId}</p>
                <p><strong className="text-foreground">Coleção:</strong> {details.collection}</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid items-start gap-4 md:gap-8 lg:grid-cols-[minmax(0,48fr)_minmax(0,50fr)]">
                <div className="relative min-w-0">
                    <button
                        type="button"
                        aria-label="Favoritar"
                        aria-pressed={favorite}
                        onClick={() => setFavorite((value) => !value)}
                        className="absolute right-0 -top-[58px] grid size-11 cursor-pointer place-items-center rounded-full bg-[#251710] text-xl text-primary md:hidden"
                    >
                        <span aria-hidden="true">{favorite ? '♥' : '♡'}</span>
                    </button>

                    <NftGallery image={nft.image} name={name} />
                </div>

                <section aria-labelledby="nft-title" className="min-w-0">
                    <h1 id="nft-title" className="text-xl leading-tight font-bold md:text-[28px] md:leading-9">
                        {name}
                    </h1>

                    <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border pb-2">
                        <p className="hidden items-baseline gap-3 md:flex">
                            <strong className="whitespace-nowrap text-sm text-primary">
                                {priceLabel}
                            </strong>
                            {nft.previousPrice !== undefined && (
                                <del className="text-sm text-muted-foreground">
                                    {nft.previousPrice.toFixed(2)} ETH
                                </del>
                            )}
                        </p>

                        <button
                            type="button"
                            onClick={openReviews}
                            className="flex cursor-pointer items-center gap-1.5 text-left text-sm hover:text-primary"
                        >
                            <span aria-hidden="true" className="shrink-0 tracking-[2px]">
                                <span className="text-primary">{'★'.repeat(details.rating)}</span>
                                <span className="text-muted-foreground">{'★'.repeat(5 - details.rating)}</span>
                            </span>
                            <span>{details.reviewCount} avaliações de colecionadores</span>
                        </button>
                    </div>

                    <h2 className="mt-3 text-sm font-bold">Sobre este NFT:</h2>
                    <p className="mt-2 max-w-[570px] text-sm leading-6 text-muted-foreground">
                        {details.description}
                    </p>

                    <fieldset className="mt-2">
                        <legend className="text-sm font-bold">Edição:</legend>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {editions.map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={edition === value}
                                    className={editionClass(edition === value)}
                                    onClick={() => selectEdition(value)}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <div className="fixed inset-x-0 bottom-0 z-30 flex flex-wrap items-center justify-between gap-2 border-t border-border bg-[#251710] px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:static md:mt-3 md:gap-3 md:border-0 md:bg-transparent md:p-0">
                        <div role="group" aria-label="Quantidade" className="flex items-center gap-2 md:gap-3">
                            <button
                                type="button"
                                aria-label="Diminuir quantidade"
                                disabled={quantity <= 1}
                                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                                className={quantityButtonClass}
                            >
                                −
                            </button>
                            <output aria-live="polite">{quantity}</output>
                            <button
                                type="button"
                                aria-label="Aumentar quantidade"
                                disabled={quantity >= quantityLimit}
                                onClick={() => setQuantity((value) => Math.min(quantityLimit, value + 1))}
                                className={quantityButtonClass}
                            >
                                +
                            </button>
                        </div>

                        <strong className="whitespace-nowrap text-sm text-primary md:hidden">
                            {priceLabel}
                        </strong>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    addToCart(nft.id, quantity)
                                    void navigate({ to: '/carrinho' })
                                }}
                                className="h-11 cursor-pointer rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground md:h-10 md:w-[130px] md:rounded-md md:px-0"
                            >
                                COMPRAR
                            </button>

                            <button
                                type="button"
                                aria-label="Favoritar"
                                aria-pressed={favorite}
                                onClick={() => setFavorite((value) => !value)}
                                className="hidden h-10 w-[130px] cursor-pointer items-center justify-center gap-2 rounded-md border border-primary text-sm text-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground md:inline-flex"
                            >
                                <span aria-hidden="true" className="text-xl">{favorite ? '♥' : '♡'}</span>
                                <span>Favoritar</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <p>ID do token: #{tokenId}</p>
                        <p>Coleção: {details.collection}</p>
                        <p>Atributos: {details.attributes}</p>
                    </div>
                    <ShareLinks name={name} />
                </section>
            </div>

            <section id="nft-information" aria-label="Informações do NFT" className="mt-16 scroll-mt-6">
                <div role="group" aria-label="Informações exibidas" className="flex flex-wrap gap-x-6 border-b border-border text-sm">
                    <button
                        type="button"
                        aria-pressed={panel === 'details'}
                        onClick={() => setPanel('details')}
                        className={panelClass(panel === 'details')}
                    >
                        Detalhes do NFT
                    </button>
                    <button
                        type="button"
                        aria-pressed={panel === 'reviews'}
                        onClick={() => setPanel('reviews')}
                        className={panelClass(panel === 'reviews')}
                    >
                        Avaliações de colecionadores ({details.reviewCount})
                    </button>
                </div>
                <div className="mt-4 text-sm leading-6 text-muted-foreground">
                    {renderPanel()}
                </div>
            </section>

            <RelatedNfts nft={nft} />
        </>
    )
}

export default function NftDetails() {
    const { nftId } = useParams({ from: '/mercado/$nftId' })
    const nftQuery = useQuery({
        queryKey: ['nfts', 'detail', nftId],
        queryFn: ({ signal }) => getNftById(nftId, signal),
        retry: false,
    })

    function renderContent() {
        if (nftQuery.isPending) {
            return <DetailSkeleton />
        }
        if (nftQuery.isError) {
            const error = nftQuery.error
            const notFound = isAxiosError(error) && error.response?.status === 404

            return (
                <>
                    <h1 role="alert" className="text-2xl font-bold">
                        {notFound ? 'NFT não encontrado' : 'Não foi possível carregar o NFT'}
                    </h1>
                    {!notFound && (
                        <button
                            type="button"
                            onClick={() => void nftQuery.refetch()}
                            className="mt-4 mr-4 cursor-pointer text-primary underline"
                        >
                            Tentar novamente
                        </button>
                    )}
                    <Link to="/" hash="catalogo" className="mt-4 inline-block text-primary">
                        Voltar ao catálogo
                    </Link>
                </>
            )
        }

        const { price, previousPrice, ...item } = nftQuery.data
        const nft: Nft = {
            ...item,
            price: Number(price),
            ...(previousPrice === undefined ? {} : { previousPrice: Number(previousPrice) }),
        }

        return <NftProduct key={nft.id} nft={nft} />
    }

    return (
        <>
            <div className="hidden md:block">
                <Header />
            </div>

            <header className="flex min-h-14 items-center px-4 md:hidden">
                <Link
                    to="/"
                    hash="catalogo"
                    aria-label="Voltar ao catálogo"
                    className="grid size-11 place-items-center rounded-full bg-[#251710] text-primary"
                >
                    <span aria-hidden="true">←</span>
                </Link>
            </header>

            <main
                className="mx-auto w-[calc(100%_-_2rem)] max-w-[1200px] pt-2 pb-[calc(8rem+env(safe-area-inset-bottom))] md:pt-8 md:pb-12"
                style={{ fontFamily: '"Roboto Mono", monospace' }}
            >
                <nav aria-label="Localização" className="mb-3 hidden gap-2 text-sm font-bold md:flex">
                    <Link to="/" className="hover:text-primary">Início</Link>
                    <span aria-hidden="true">/</span>
                    <Link to="/" hash="catalogo" className="hover:text-primary">Mercado</Link>
                </nav>

                {renderContent()}
            </main>

            <div className="hidden md:block">
                <Footer />
            </div>
        </>
    )
}