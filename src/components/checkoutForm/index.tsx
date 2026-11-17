import { useState, useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import { getWallets } from '../../api/wallets'
import { getDemoSession, subscribeDemoSession } from '../../lib/demoSession'

const fieldClass =
    'mt-1 block w-full rounded-sm border border-[#3b271b] bg-transparent px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground'

const networkLabels: Record<string, string> = {
    ethereum: 'Ethereum',
    polygon: 'Polygon',
    base: 'Base',
}

type Wallets = Awaited<ReturnType<typeof getWallets>>

type CollectorFieldsProps = {
    wallets: Wallets | undefined
    email: string | undefined
    username: string | undefined
    loading: boolean
    failed: boolean
}

export default function CheckoutForm() {
    const session = useSyncExternalStore(subscribeDemoSession, getDemoSession)
    const email = session?.email

    const walletsQuery = useQuery({
        queryKey: ['wallets', email],
        queryFn: ({ signal }) => getWallets(email ?? '', signal),
        enabled: Boolean(email),
        retry: false,
        refetchOnWindowFocus: false,
    })

    return (
        <CollectorFields
            key={JSON.stringify([email, walletsQuery.data])}
            wallets={walletsQuery.data}
            email={email}
            username={session?.username}
            loading={walletsQuery.isLoading}
            failed={walletsQuery.isError}
        />
    )
}

function CollectorFields({
    wallets,
    email,
    username,
    loading,
    failed,
}: CollectorFieldsProps) {
    const primary = wallets?.primary
    const secondary = wallets?.sameAsPrimary ? undefined : wallets?.secondary

    const savedWallets = [
        { id: 'primary', label: 'Principal', data: primary },
        { id: 'secondary', label: 'Reserva', data: secondary },
    ] as const

    const [selected, setSelected] = useState<'primary' | 'secondary'>(
        primary ? 'primary' : 'secondary',
    )
    const [detailsOpen, setDetailsOpen] = useState(false)

    const hasSavedWallets = Boolean(primary || secondary)
    const wallet = selected === 'secondary' ? secondary : primary
    const walletType = wallet?.type === 'extension' ? 'browser' : (wallet?.type ?? '')
    const secondaryWallet = wallets?.sameAsPrimary
        ? (primary?.address ?? '')
        : (secondary?.address ?? wallets?.secondaryHint ?? '')

    return (
        <section aria-label="Carteira e perfil do colecionador">
            {loading && (
                <p role="status" className="mb-3 text-xs">
                    Carregando carteiras…
                </p>
            )}

            {failed && (
                <p role="alert" className="mb-3 text-xs">
                    Não foi possível carregar as carteiras. Preencha os campos manualmente.
                </p>
            )}

            {hasSavedWallets && (
                <div className="md:hidden">
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <h2 id="saved-wallets-title" className="text-sm font-bold">
                            Carteira conectada
                        </h2>

                        <button
                            type="button"
                            aria-controls="collector-fields"
                            aria-expanded={detailsOpen}
                            onClick={() => setDetailsOpen((open) => !open)}
                            className="min-h-11 text-xs font-bold text-primary"
                        >
                            {detailsOpen ? 'Ocultar dados' : 'Trocar carteira'}
                        </button>
                    </div>

                    <div role="group" aria-labelledby="saved-wallets-title" className="grid gap-3">
                        {savedWallets.map(({ id, label, data }) => {
                            if (!data) return null

                            const active = selected === id
                            const address = data.address
                            const shortAddress = `${address.slice(0, 6)}…${address.slice(-4)}`
                            const network = networkLabels[data.network] ?? data.network

                            return (
                                <div
                                    key={id}
                                    className="flex min-h-20 items-center rounded-xl bg-[#251710]"
                                >
                                    <button
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => setSelected(id)}
                                        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl py-3 pl-3 text-left"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`grid size-4 shrink-0 place-items-center rounded-full border ${active ? 'border-primary text-primary' : 'border-[#67432b]'
                                                }`}
                                        >
                                            {active && <span className="size-2 rounded-full bg-current" />}
                                        </span>

                                        <span className="min-w-0 space-y-1">
                                            <span className="block text-xs font-bold">{label}</span>
                                            <span className="block break-all text-xs text-muted-foreground">
                                                {id === 'primary' ? shortAddress : (data.ens || shortAddress)}
                                            </span>
                                            <span className="block text-xs text-muted-foreground">
                                                {id === 'primary' ? 'Rede principal ' : 'Rede '}{network}
                                            </span>
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        aria-label={`Abrir dados da carteira ${label}`}
                                        aria-controls="collector-fields"
                                        onClick={() => {
                                            setSelected(id)
                                            setDetailsOpen(true)
                                        }}
                                        className="grid size-11 shrink-0 place-items-center rounded-lg text-lg text-primary"
                                    >
                                        <span aria-hidden="true">⋮</span>
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div
                id="collector-fields"
                className={
                    hasSavedWallets
                        ? (detailsOpen ? 'mt-4 md:mt-0' : 'hidden md:block')
                        : undefined
                }
                onInvalidCapture={() => {
                    if (hasSavedWallets && !detailsOpen) {
                        flushSync(() => setDetailsOpen(true))
                    }
                }}
            >
                <h2 className="mb-3 text-sm font-bold">Perfil do colecionador</h2>

                <div className="grid gap-x-5 gap-y-4 text-xs sm:grid-cols-2">
                    <label>
                        Nome de exibição<span className="text-primary">*</span>
                        <input
                            key={`display-${selected}`}
                            name="displayName"
                            className={fieldClass}
                            defaultValue={wallet?.displayName ?? ''}
                            required
                        />
                    </label>

                    <label>
                        Nome de usuário<span className="text-primary">*</span>
                        <input
                            name="username"
                            className={fieldClass}
                            defaultValue={username ?? ''}
                            required
                        />
                    </label>

                    <label>
                        Rede<span className="text-primary">*</span>
                        <select
                            key={`network-${selected}`}
                            name="network"
                            className={fieldClass}
                            defaultValue={wallet?.network ?? ''}
                            required
                        >
                            <option className="bg-background" value="" disabled>Selecione uma rede</option>
                            <option className="bg-background" value="ethereum">Ethereum</option>
                            <option className="bg-background" value="polygon">Polygon</option>
                            <option className="bg-background" value="base">Base</option>
                        </select>
                    </label>

                    <label>
                        Link do perfil<span className="text-primary">*</span>
                        <input name="profileUrl" type="url" className={fieldClass} required />
                    </label>

                    <label>
                        Endereço da carteira<span className="text-primary">*</span>
                        <input
                            key={`address-${selected}`}
                            name="walletAddress"
                            className={fieldClass}
                            placeholder="Endereço da carteira"
                            defaultValue={wallet?.address ?? ''}
                            pattern="0x[0-9a-fA-F]{40}"
                            title="Use 0x seguido de 40 caracteres hexadecimais."
                            required
                        />
                    </label>

                    <label>
                        Carteira secundária
                        <input
                            name="secondaryWallet"
                            className={fieldClass}
                            placeholder="ENS ou carteira secundária (opcional)"
                            defaultValue={secondaryWallet}
                        />
                    </label>

                    <label>
                        Tipo de carteira<span className="text-primary">*</span>
                        <select
                            key={`type-${selected}`}
                            name="walletType"
                            className={fieldClass}
                            defaultValue={walletType}
                            required
                        >
                            <option className="bg-background" value="" disabled>Selecione uma carteira</option>
                            <option className="bg-background" value="browser">Carteira do navegador</option>
                            <option className="bg-background" value="mobile">Carteira móvel</option>
                            <option className="bg-background" value="hardware">Carteira física</option>
                        </select>
                    </label>

                    <label>
                        Código de indicação<span className="text-primary">*</span>
                        <input
                            key={`referral-${selected}`}
                            name="referralCode"
                            className={fieldClass}
                            defaultValue={wallet?.referral ?? ''}
                            required
                        />
                    </label>

                    <label>
                        E-mail<span className="text-primary">*</span>
                        <input
                            key={`email-${selected}`}
                            name="email"
                            type="email"
                            autoComplete="email"
                            className={fieldClass}
                            defaultValue={wallet?.email ?? email ?? ''}
                            required
                        />
                    </label>

                    <label>
                        Nome ENS<span className="text-primary">*</span>
                        <div className="mt-1 flex gap-2">
                            <input
                                key={`ens-${selected}`}
                                aria-label="Nome ENS"
                                name="ensName"
                                className={`${fieldClass} mt-0 min-w-0`}
                                defaultValue={wallet?.ens.replace(/\.eth$/i, '') ?? ''}
                                required
                            />
                            <span className="grid shrink-0 place-items-center rounded-sm border border-[#3b271b] px-3">
                                .eth
                            </span>
                        </div>
                    </label>

                    <label className="flex items-center gap-2 sm:col-span-2">
                        <input name="useAnotherWallet" type="checkbox" className="accent-[#d99152]" />
                        Usar outra carteira?
                    </label>

                    <label>
                        Observação do colecionador (opcional)
                        <textarea name="notes" rows={6} className={`${fieldClass} resize-y`} />
                    </label>
                </div>
            </div>
        </section>
    )
}