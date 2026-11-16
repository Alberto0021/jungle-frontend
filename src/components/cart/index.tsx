import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { setCartItems, useCartItems } from '../../lib/cartStore'
import { nfts } from '../nftCatalog/nfts'

const recommendationIds = ['118', '314', '088', '601', '603']
const recommendations = recommendationIds.flatMap((id) => {
    const nft = nfts.find((item) => item.id === id)
    return nft ? [nft] : []
})

const columnClass = 'border-b border-border pb-2 font-medium'
const quantityButtonClass =
    'grid h-7 w-5 place-items-center rounded-full bg-primary text-base text-primary-foreground enabled:cursor-pointer disabled:opacity-60'

function formatEth(milliEth: number, decimals = 2) {
    return `${(milliEth / 1000).toFixed(decimals)} ETH`
}

function TrashIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
        >
            <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7m4-7v7" />
        </svg>
    )
}

export default function Cart() {
    const items = useCartItems()
    const [promoCode, setPromoCode] = useState('')
    const [promoMessage, setPromoMessage] = useState('')

    const rows = items.flatMap(({ id, quantity }) => {
        const nft = nfts.find((item) => item.id === id)
        if (!nft) return []

        const unitPrice = Math.round(nft.price * 1000)
        return [{ nft, quantity, unitPrice, lineTotal: unitPrice * quantity }]
    })

    const subtotal = rows.reduce((sum, row) => sum + row.lineTotal, 0)
    let networkFee = 0
    if (rows.length > 0) networkFee = 16

    function changeQuantity(id: string, delta: number) {
        setCartItems((current) =>
            current.map((item) => {
                if (item.id !== id) return item
                return { ...item, quantity: Math.max(1, item.quantity + delta) }
            }),
        )
    }

    function removeItem(id: string) {
        setCartItems((current) => current.filter((item) => item.id !== id))
    }

    return (
        <main
            className="mx-auto w-[calc(100%_-_2rem)] max-w-[1200px] pt-7"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
            <nav aria-label="Localização" className="mb-2 flex flex-wrap gap-2 text-xs">
                <Link to="/" className="hover:text-primary">Início</Link>
                <span aria-hidden="true">/</span>
                <Link to="/" hash="catalogo" className="hover:text-primary">Mercado</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">Carrinho</span>
            </nav>

            <h1 className="sr-only">Carrinho de NFTs</h1>

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-[84px]">
                <section aria-label="Itens do carrinho" className="min-w-0">
                    {rows.length === 0 && (
                        <p role="status" className="border-t border-border py-6 text-sm text-muted-foreground">
                            Seu carrinho está vazio.
                        </p>
                    )}

                    {rows.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[570px] border-separate border-spacing-y-2 text-sm">
                                <thead className="text-left text-xs">
                                    <tr>
                                        <th scope="col" className={columnClass}>NFTs</th>
                                        <th scope="col" className={columnClass}>Preço</th>
                                        <th scope="col" className={columnClass}>Edições</th>
                                        <th scope="col" className={columnClass}>Total</th>
                                        <th scope="col" className={columnClass}>
                                            <span className="sr-only">Remover</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map(({ nft, quantity, unitPrice, lineTotal }) => (
                                        <tr key={nft.id} className="bg-[#251710]">
                                            <th scope="row" className="pr-3 text-left font-normal">
                                                <Link
                                                    to="/mercado/$nftId"
                                                    params={{ nftId: nft.id }}
                                                    className="flex items-center gap-3 hover:text-primary"
                                                >
                                                    {nft.image && (
                                                        <img
                                                            src={nft.image}
                                                            alt=""
                                                            className="size-[72px] shrink-0 rounded-md object-cover"
                                                        />
                                                    )}
                                                    <span>
                                                        <span className="block font-bold">
                                                            {nft.name} #{nft.id}
                                                        </span>
                                                        <span className="block text-xs text-muted-foreground">
                                                            ID do token: #{nft.id.padStart(4, '0')}
                                                        </span>
                                                    </span>
                                                </Link>
                                            </th>
                                            <td className="whitespace-nowrap pr-3 text-muted-foreground">
                                                {formatEth(unitPrice)}
                                            </td>
                                            <td className="pr-3">
                                                <div
                                                    role="group"
                                                    aria-label={`Quantidade de ${nft.name}`}
                                                    className="flex items-center gap-2"
                                                >
                                                    <button
                                                        type="button"
                                                        aria-label="Diminuir quantidade"
                                                        disabled={quantity <= 1}
                                                        onClick={() => changeQuantity(nft.id, -1)}
                                                        className={quantityButtonClass}
                                                    >
                                                        −
                                                    </button>
                                                    <output className="min-w-4 text-center" aria-live="polite">
                                                        {quantity}
                                                    </output>
                                                    <button
                                                        type="button"
                                                        aria-label="Aumentar quantidade"
                                                        onClick={() => changeQuantity(nft.id, 1)}
                                                        className={quantityButtonClass}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap pr-3 font-bold text-primary">
                                                {formatEth(lineTotal)}
                                            </td>
                                            <td className="px-2">
                                                <button
                                                    type="button"
                                                    aria-label={`Remover ${nft.name} do carrinho`}
                                                    onClick={() => removeItem(nft.id)}
                                                    className="grid size-8 cursor-pointer place-items-center text-muted-foreground hover:text-primary"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <aside aria-labelledby="cart-summary-title" className="text-sm">
                    <h2 id="cart-summary-title" className="border-b border-border pb-2 font-bold">
                        Resumo da carteira
                    </h2>

                    <form
                        className="mt-4"
                        onSubmit={(event) => {
                            event.preventDefault()
                            setPromoMessage('Nenhum código promocional está ativo.')
                        }}
                    >
                        <label htmlFor="promo-code" className="block text-xs">
                            Código promocional
                        </label>
                        <div className="mt-1 flex">
                            <input
                                id="promo-code"
                                value={promoCode}
                                onChange={(event) => {
                                    setPromoCode(event.currentTarget.value)
                                    setPromoMessage('')
                                }}
                                required
                                placeholder="Digite o código promocional..."
                                className="min-w-0 flex-1 rounded-l-sm border border-border bg-transparent px-2 text-xs placeholder:text-muted-foreground"
                            />
                            <button
                                type="submit"
                                className="h-10 shrink-0 cursor-pointer rounded-r-sm bg-primary px-4 text-xs font-bold text-primary-foreground"
                            >
                                Aplicar
                            </button>
                        </div>
                        {promoMessage && (
                            <p role="status" className="mt-2 text-xs text-muted-foreground">
                                {promoMessage}
                            </p>
                        )}
                    </form>

                    <dl className="mt-5 space-y-2 text-xs">
                        <div className="flex justify-between gap-2">
                            <dt>Subtotal</dt>
                            <dd className="whitespace-nowrap">{formatEth(subtotal)}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                            <dt>Desconto do lançamento</dt>
                            <dd className="whitespace-nowrap">− 0.00 ETH</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                            <dt>Taxa de rede</dt>
                            <dd className="whitespace-nowrap text-right">
                                {formatEth(networkFee, 3)}
                                <span className="mt-2 block text-[10px] text-primary">Taxa estimada</span>
                            </dd>
                        </div>
                        <div className="flex justify-between gap-2 pt-4 text-sm font-bold">
                            <dt>Total</dt>
                            <dd className="whitespace-nowrap text-primary" aria-live="polite">
                                {formatEth(subtotal + networkFee, 3)}
                            </dd>
                        </div>
                    </dl>

                    {rows.length > 0 && (
                        <Link
                            to="/pagamento"
                            className="mt-4 flex h-10 w-full items-center justify-center rounded-sm bg-primary text-xs font-bold text-primary-foreground"
                        >
                            Conectar e finalizar
                        </Link>
                    )}

                    <Link
                        to="/"
                        hash="catalogo"
                        className="mt-3 block text-center text-xs text-primary hover:underline"
                    >
                        Continuar explorando
                    </Link>
                </aside>
            </div>

            <section aria-labelledby="cart-recommendations-title" className="mt-16 lg:mt-24">
                <h2
                    id="cart-recommendations-title"
                    className="border-b border-border pb-2 text-sm font-bold text-primary"
                >
                    Colecionadores também viram
                </h2>
                <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-7">
                    {recommendations.map((nft) => (
                        <li key={nft.id}>
                            <Link
                                to="/mercado/$nftId"
                                params={{ nftId: nft.id }}
                                className="block hover:text-primary"
                            >
                                {nft.image && (
                                    <div className="bg-[#251710] px-2 pt-3 pb-5">
                                        <img
                                            src={nft.image}
                                            alt=""
                                            loading="lazy"
                                            className="aspect-square w-full rounded-xl object-cover"
                                        />
                                    </div>
                                )}
                                <p className="mt-2 text-xs">{nft.name} #{nft.id}</p>
                                <p className="mt-1 text-sm font-bold text-primary">
                                    {nft.price.toFixed(2)} ETH
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div aria-hidden="true" className="mt-6 flex justify-center gap-2">
                    <span className="size-2.5 rounded-full border border-primary" />
                    <span className="size-2.5 rounded-full bg-primary" />
                    <span className="size-2.5 rounded-full border border-primary" />
                </div>
            </section>
        </main>
    )
}