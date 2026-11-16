import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Nft } from '../nftCatalog'

const views = [
    { value: 'all', label: 'Todos os NFTs' },
    { value: 'recent', label: 'Novos lançamentos' },
    { value: 'trending', label: 'Em alta' },
] as const

type View = (typeof views)[number]['value']

function matchesView(nft: Nft, view: View) {
    if (view === 'recent') return nft.recent === true
    if (view === 'trending') return nft.trending === true

    return true
}

function getViewButtonClass(isSelected: boolean) {
    const baseClass = 'cursor-pointer border-b-2 pb-1'

    if (isSelected) {
        return `${baseClass} border-primary text-primary`
    }

    return `${baseClass} border-transparent`
}

function NftImage({ nft }: { nft: Nft }) {
    if (!nft.image) {
        return (
            <div className="grid aspect-square place-items-center rounded-xl text-xs text-muted-foreground">
                Imagem indisponível
            </div>
        )
    }

    return (
        <img
            src={nft.image}
            alt=""
            loading="lazy"
            className="aspect-square w-full rounded-xl object-cover"
        />
    )
}

function NftCard({ nft }: { nft: Nft }) {
    return (
        <Link
            to="/mercado/$nftId"
            params={{ nftId: nft.id }}
            className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
            <article>
                <div className="bg-[#251710] px-1 py-5">
                    <NftImage nft={nft} />
                </div>

                <h2 className="mt-2 text-sm">{nft.name} #{nft.id}</h2>

                <p className="mt-1 flex flex-wrap gap-3 text-base">
                    <strong className="text-primary">
                        {nft.price.toFixed(2)} ETH
                    </strong>

                    {nft.previousPrice !== undefined && (
                        <del className="text-muted-foreground">
                            {nft.previousPrice.toFixed(2)} ETH
                        </del>
                    )}
                </p>
            </article>
        </Link>
    )
}

function NftResults({ nfts }: { nfts: Nft[] }) {
    if (nfts.length === 0) {
        return (
            <p role="status" className="py-8 text-sm text-muted-foreground">
                Nenhum NFT encontrado para os filtros selecionados.
            </p>
        )
    }

    return (
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {nfts.map((nft) => (
                <li key={nft.id}>
                    <NftCard nft={nft} />
                </li>
            ))}
        </ul>
    )
}

export default function NftGrid({ nfts }: { nfts: Nft[] }) {
    const [view, setView] = useState<View>('all')
    const [sort, setSort] = useState('recent')

    const visibleNfts = nfts.filter((nft) => matchesView(nft, view))

    if (sort === 'lowest') visibleNfts.sort((a, b) => a.price - b.price)
    if (sort === 'highest') visibleNfts.sort((a, b) => b.price - a.price)

    return (
        <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm">
                <div
                    role="group"
                    aria-label="Exibição do catálogo"
                    className="flex flex-wrap gap-x-5 gap-y-2"
                >
                    {views.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={view === value}
                            onClick={() => setView(value)}
                            className={getViewButtonClass(view === value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <label className="flex flex-wrap items-center gap-1">
                    Ordenar por:
                    <select
                        value={sort}
                        onChange={(event) => setSort(event.currentTarget.value)}
                        className="cursor-pointer bg-background text-foreground"
                    >
                        <option value="recent">Listados recentemente</option>
                        <option value="lowest">Menor preço</option>
                        <option value="highest">Maior preço</option>
                    </select>
                </label>
            </div>

            <NftResults nfts={visibleNfts} />
        </div>
    )
}