import { useId, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useCartItems } from '../../lib/cartStore'
import { nfts } from '../nftCatalog/nfts'

const wallets = [
    { value: 'walletconnect', label: 'WalletConnect', icon: 'W' },
    { value: 'metamask', label: 'MetaMask', icon: 'M' },
    { value: 'coinbase', label: 'Coinbase Wallet', icon: null },
]

function formatEth(milliEth: number, decimals = 2) {
    return `${(milliEth / 1000).toFixed(decimals)} ETH`
}

export default function CheckoutSummary() {
    const items = useCartItems()
    const [summaryOpen, setSummaryOpen] = useState(false)
    const detailsId = useId()

    const rows = items.flatMap(({ id, quantity }) => {
        const nft = nfts.find((item) => item.id === id)
        if (!nft) return []

        return [{ nft, quantity, total: Math.round(nft.price * 1000) * quantity }]
    })

    const subtotal = rows.reduce((sum, row) => sum + row.total, 0)
    const networkFee = rows.length > 0 ? 16 : 0

    return (
        <aside aria-label="Resumo e opções de pagamento" className="grid min-w-0 text-xs">
            <fieldset className="min-w-0 space-y-3 md:order-3 md:mt-3 md:space-y-2">
                <legend className="mb-3 w-full text-sm font-bold md:mb-2 md:text-center">
                    Carteira e rede
                </legend>

                {wallets.map(({ value, label, icon }) => (
                    <label
                        key={value}
                        className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-[#251710] px-3 py-2 md:min-h-0 md:gap-2 md:rounded-sm md:border-[#3b271b] md:bg-transparent md:has-[:checked]:border-primary"
                    >
                        <span
                            aria-hidden="true"
                            className="order-1 grid size-8 shrink-0 place-items-center rounded-full border border-[#3b271b] bg-[#302017] font-bold text-primary md:hidden"
                        >
                            {icon ?? (
                                <svg
                                    viewBox="0 0 24 24"
                                    className="size-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <rect x="3" y="5" width="18" height="14" rx="4" />
                                    <path d="M21 9h-5a3 3 0 0 0 0 6h5" />
                                    <circle cx="16" cy="12" r=".75" fill="currentColor" />
                                </svg>
                            )}
                        </span>

                        <span className="order-2 flex-1 md:order-none md:flex-none">
                            {label}
                        </span>

                        <input
                            type="radio"
                            name="paymentWallet"
                            value={value}
                            required
                            defaultChecked={value === 'coinbase'}
                            className="order-3 size-3.5 shrink-0 appearance-none rounded-full border border-[#67432b] checked:border-primary checked:bg-[radial-gradient(circle,var(--color-primary)_0_35%,transparent_40%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:order-first md:size-auto md:appearance-auto md:checked:bg-none md:accent-[#d99152]"
                        />
                    </label>
                ))}
            </fieldset>

            <dl className="mt-3 text-sm font-bold md:order-2 md:border-t md:border-[#3b271b] md:px-3 md:pt-3">
                <div className="flex items-baseline justify-end gap-5 md:justify-between md:gap-3">
                    <dt>
                        Total<span className="md:hidden">:</span>
                    </dt>
                    <dd className="text-primary">{formatEth(subtotal + networkFee, 3)}</dd>
                </div>
            </dl>

            <button
                type="button"
                aria-expanded={summaryOpen}
                aria-controls={detailsId}
                onClick={() => setSummaryOpen((open) => !open)}
                className="mt-1 min-h-11 text-right text-[11px] text-muted-foreground underline-offset-4 hover:text-primary hover:underline md:hidden"
            >
                {summaryOpen ? 'Ocultar resumo do pedido' : 'Ver resumo do pedido'}
            </button>

            {rows.length === 0 && (
                <p className="py-3 text-muted-foreground md:hidden">
                    Seu carrinho está vazio.{' '}
                    <Link to="/carrinho" className="text-primary underline">
                        Voltar ao carrinho
                    </Link>
                </p>
            )}

            <div
                id={detailsId}
                className={summaryOpen ? 'md:order-1' : 'hidden md:order-1 md:block'}
            >
                <h2 className="mb-2 text-sm font-bold">Seus NFTs</h2>

                <div className="flex justify-between border-b border-[#3b271b] pb-2">
                    <span>NFTs</span>
                    <span>Subtotal</span>
                </div>

                {rows.length === 0 && (
                    <p className="hidden py-4 text-muted-foreground md:block">
                        Seu carrinho está vazio.{' '}
                        <Link to="/carrinho" className="text-primary underline">
                            Voltar ao carrinho
                        </Link>
                    </p>
                )}

                <ul className="mt-2 space-y-2">
                    {rows.map(({ nft, quantity, total }) => (
                        <li
                            key={nft.id}
                            className="flex items-center justify-between gap-2 bg-[#251710] pr-2"
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                {nft.image && (
                                    <img
                                        src={nft.image}
                                        alt=""
                                        className="size-14 shrink-0 rounded-sm object-cover"
                                    />
                                )}

                                <div className="min-w-0">
                                    <p className="truncate font-bold">
                                        {nft.name} #{nft.id}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        ID do token: #{nft.id.padStart(4, '0')} (×{quantity})
                                    </p>
                                </div>
                            </div>

                            <strong className="shrink-0 text-primary">
                                {formatEth(total)}
                            </strong>
                        </li>
                    ))}
                </ul>

                <p className="mt-3 text-center text-muted-foreground">
                    Tem um código promocional?{' '}
                    <Link to="/carrinho" className="text-primary hover:underline">
                        Aplique aqui.
                    </Link>
                </p>

                <dl className="mt-3 space-y-2">
                    <div className="flex justify-between gap-3">
                        <dt>Subtotal</dt>
                        <dd>{formatEth(subtotal)}</dd>
                    </div>

                    <div className="flex justify-between gap-3">
                        <dt>Desconto do lançamento</dt>
                        <dd>− 0.00 ETH</dd>
                    </div>

                    <div className="flex justify-between gap-3">
                        <dt>Taxa de rede</dt>
                        <dd className="text-right">
                            {formatEth(networkFee, 3)}
                            <span className="mt-1 block text-[10px] text-primary">
                                Taxa estimada
                            </span>
                        </dd>
                    </div>
                </dl>
            </div>

            <button
                type="submit"
                disabled={rows.length === 0}
                className="mt-4 hidden h-10 w-full rounded-md bg-primary text-xs font-bold text-primary-foreground enabled:cursor-pointer disabled:opacity-50 md:order-4 md:block"
            >
                Confirmar compra
            </button>
        </aside>
    )
}