import { Link } from '@tanstack/react-router'
import { getConfirmedOrderItems } from '../../lib/cartStore'
import { nfts } from '../nftCatalog/nfts'

function formatEth(milliEth: number, decimals = 2) {
    return `${(milliEth / 1000).toFixed(decimals)} ETH`
}

function ThankYouIcon() {

    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 56 68"
            className="mx-auto h-[68px] w-14 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21 8 3-3a6 6 0 0 1 8 0l3 3M7 24l-5 6v34a2 2 0 0 0 2 2h48a2 2 0 0 0 2-2V30l-5-6" />
            <path d="M7 35V10a2 2 0 0 1 2-2h38a2 2 0 0 1 2 2v25" />
            <path d="m2 30 18 18m34-18L36 48M2 64l22-22a6 6 0 0 1 8 0l22 22" />
            <text
                x="28"
                y="24"
                textAnchor="middle"
                fill="currentColor"
                stroke="none"
                fontSize="11"
                fontWeight="700"
            >
                THANK
                <tspan x="28" dy="11">YOU</tspan>
            </text>
        </svg>
    )
}

export default function OrderConfirmation() {
    const items = getConfirmedOrderItems()

    const rows = items.flatMap(({ id, quantity }) => {
        const nft = nfts.find((item) => item.id === id)
        if (!nft) return []

        return {
            nft,
            quantity,
            subtotal: Math.round(nft.price * 1000) * quantity,
        }
    })

    const subtotal = rows.reduce((sum, row) => sum + row.subtotal, 0)
    const networkFee = rows.length > 0 ? 16 : 0
    const total = formatEth(subtotal + networkFee, 3)

    return (
        <section
            aria-labelledby="confirmation-title"
            className="relative w-full max-w-[476px] border-b-8 border-primary bg-[#251710] text-[#f4eee8]"
        >
            <Link
                to="/"
                aria-label="Fechar confirmação e voltar ao início"
                className="absolute right-2 top-1 grid size-8 place-items-center text-lg text-primary hover:text-foreground"
            >
                ×
            </Link>

            <header className="px-6 pb-4 pt-4 text-center">
                <ThankYouIcon />
                <h1 id="confirmation-title" className="mt-2 text-sm font-bold text-muted-foreground">
                    {rows.length > 0 ? 'Resumo do seu pedido' : 'Nenhum pedido para confirmar'}
                </h1>
            </header>

            {rows.length === 0 ? (
                <div className="border-t border-border px-6 py-8 text-center text-sm">
                    <Link to="/carrinho" className="text-primary underline">
                        Voltar ao carrinho
                    </Link>
                </div>
            ) : (
                <>
                    <dl className="grid grid-cols-2 gap-y-3 border-y border-primary/60 px-4 py-3 text-xs text-muted-foreground sm:grid-cols-[1.28fr_1.15fr_1fr_.85fr]">
                        <div className="px-3">
                            <dt className="font-bold">ID da transação</dt>
                            <dd>Não gerado</dd>
                        </div>
                        <div className="border-l border-primary/60 px-3">
                            <dt>Data</dt>
                            <dd>—</dd>
                        </div>
                        <div className="px-3 sm:border-l sm:border-primary/60">
                            <dt>Total</dt>
                            <dd className="whitespace-nowrap">{total}</dd>
                        </div>
                        <div className="border-l border-primary/60 px-3">
                            <dt className="font-bold">Carteira</dt>
                            <dd>Não conectada</dd>
                        </div>
                    </dl>

                    <div className="px-4 pb-10 pt-4 sm:px-9">
                        <h2 className="mb-1 text-[13px] font-bold">Detalhes da transação</h2>

                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-border">
                                <tr>
                                    <th scope="col" className="pb-2">NFTs</th>
                                    <th scope="col" className="px-2 pb-2 text-center">Edições</th>
                                    <th scope="col" className="pb-2 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(({ nft, quantity, subtotal: lineSubtotal }) => (
                                    <tr key={nft.id}>
                                        <th scope="row" className="py-1.5 pr-2 text-left font-normal">
                                            <div className="flex items-center gap-2.5">
                                                {nft.image && (
                                                    <img
                                                        src={nft.image}
                                                        alt=""
                                                        className="size-11 shrink-0 rounded-md object-cover sm:size-14"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-bold">{nft.name} #{nft.id}</p>
                                                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                                                        ID do token: #{nft.id.padStart(4, '0')}
                                                    </p>
                                                </div>
                                            </div>
                                        </th>
                                        <td className="whitespace-nowrap px-2 text-center text-muted-foreground">
                                            (× {quantity})
                                        </td>
                                        <td className="whitespace-nowrap text-right text-sm font-bold text-primary">
                                            {formatEth(lineSubtotal)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <dl className="ml-auto mt-1 grid max-w-[264px] grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-sm">
                            <dt>Taxa de rede</dt>
                            <dd className="text-right">{formatEth(networkFee, 3)}</dd>
                            <dt className="font-bold">Total</dt>
                            <dd className="text-right font-bold text-primary">{total}</dd>
                        </dl>

                        <p className="mt-2 border-t border-border pt-2 text-center text-xs leading-[18px] text-muted-foreground">
                            Pedido de demonstração. Nenhum pagamento foi enviado
                            e nenhum NFT foi transferido para a carteira.
                        </p>

                        <div className="mt-4 flex justify-center">
                            <button
                                type="button"
                                disabled
                                className="h-10 rounded bg-primary px-4 text-[13px] font-bold text-primary-foreground"
                            >
                                Ver no Etherscan
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    )
}