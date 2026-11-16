import { Link } from '@tanstack/react-router'
import { useCartItems } from '../../lib/cartStore'
import { nfts } from '../nftCatalog/nfts'

const wallets = [
    { value: 'walletconnect', label: 'WalletConnect' },
    { value: 'metamask', label: 'MetaMask' },
    { value: 'coinbase', label: 'Coinbase Wallet' },
]

function formatEth(milliEth: number, decimals = 2) {
    return `${(milliEth / 1000).toFixed(decimals)} ETH`
}

export default function CheckoutSummary() {
    const items = useCartItems()

    const rows = items.flatMap(({ id, quantity }) => {
        const nft = nfts.find((item) => item.id === id)
        if (!nft) return []

        return [{ nft, quantity, total: Math.round(nft.price * 1000) * quantity }]
    })

    const subtotal = rows.reduce((sum, row) => sum + row.total, 0)
    let networkFee = 0
    if (rows.length > 0) networkFee = 16

    return (
        <aside aria-labelledby="checkout-summary-title" className="min-w-0 text-xs">
            <h2 id="checkout-summary-title" className="mb-2 text-sm font-bold">Seus NFTs</h2>

            <div className="flex justify-between border-b border-[#3b271b] pb-2">
                <span>NFTs</span>
                <span>Subtotal</span>
            </div>

            {rows.length === 0 && (
                <p className="py-4 text-muted-foreground">
                    Seu carrinho está vazio.{' '}
                    <Link to="/carrinho" className="text-primary underline">Voltar ao carrinho</Link>
                </p>
            )}

            <ul className="mt-2 space-y-2">
                {rows.map(({ nft, quantity, total }) => (
                    <li key={nft.id} className="flex items-center justify-between gap-2 bg-[#251710] pr-2">
                        <div className="flex min-w-0 items-center gap-2">
                            {nft.image && (
                                <img src={nft.image} alt="" className="size-14 shrink-0 rounded-sm object-cover" />
                            )}
                            <div className="min-w-0">
                                <p className="truncate font-bold">{nft.name} #{nft.id}</p>
                                <p className="text-[10px] text-muted-foreground">
                                    ID do token: #{nft.id.padStart(4, '0')} (×{quantity})
                                </p>
                            </div>
                        </div>
                        <strong className="shrink-0 text-primary">{formatEth(total)}</strong>
                    </li>
                ))}
            </ul>

            <p className="mt-3 text-center text-muted-foreground">
                Tem um código promocional?{' '}
                <Link to="/carrinho" className="text-primary hover:underline">Aplique aqui.</Link>
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
                        <span className="mt-1 block text-[10px] text-primary">Taxa estimada</span>
                    </dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-[#3b271b] px-3 pt-3 text-sm font-bold">
                    <dt>Total</dt>
                    <dd className="text-primary">{formatEth(subtotal + networkFee, 3)}</dd>
                </div>
            </dl>

            <fieldset className="mt-3 space-y-2">
                <legend className="mb-2 w-full text-center text-sm font-bold">Carteira e rede</legend>

                {wallets.map(({ value, label }) => (
                    <label
                        key={value}
                        className="flex cursor-pointer items-center gap-2 rounded-sm border border-[#3b271b] px-3 py-2 has-[:checked]:border-primary"
                    >
                        <input
                            type="radio"
                            name="paymentWallet"
                            value={value}
                            required
                            defaultChecked={value === 'coinbase'}
                            className="accent-[#d99152]"
                        />
                        {label}
                    </label>
                ))}
            </fieldset>

            <button
                type="submit"
                disabled={rows.length === 0}
                className="mt-4 h-10 w-full rounded-md bg-primary text-xs font-bold text-primary-foreground enabled:cursor-pointer disabled:opacity-50"
            >
                Confirmar compra
            </button>
        </aside>
    )
}