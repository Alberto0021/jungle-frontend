import { useSyncExternalStore } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getWallets } from '../../api/wallets'
import { getDemoSession, subscribeDemoSession } from '../../lib/demoSession'

const fieldClass =
    'mt-1 block w-full rounded-sm border border-[#3b271b] bg-transparent px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground'

const textFields = [
    { name: 'displayName', label: 'Nome de exibição', required: true },
    { name: 'username', label: 'Nome de usuário', required: true },
] as const

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

    const wallets = walletsQuery.data
    const wallet = wallets?.primary
    const walletType = wallet?.type === 'extension' ? 'browser' : (wallet?.type ?? '')
    const secondaryWallet = wallets?.sameAsPrimary
        ? (wallet?.address ?? '')
        : (wallets?.secondary?.address ?? wallets?.secondaryHint ?? '')

    return (
        <section
            key={JSON.stringify([email, wallet, secondaryWallet])}
            aria-labelledby="collector-profile-title"
        >
            <h2 id="collector-profile-title" className="mb-3 text-sm font-bold">
                Perfil do colecionador
            </h2>

            {walletsQuery.isLoading && (
                <p role="status" className="mb-3 text-xs">Carregando carteira…</p>
            )}

            {walletsQuery.isError && (
                <p role="alert" className="mb-3 text-xs">
                    Não foi possível carregar a carteira. Você pode preencher os campos manualmente.
                </p>
            )}

            <div className="grid gap-x-5 gap-y-4 text-xs sm:grid-cols-2">
                {textFields.map(({ name, label, required }) => (
                    <label key={name}>
                        {label}{required && <span className="text-primary">*</span>}
                        <input
                            name={name}
                            className={fieldClass}
                            required={required}
                            defaultValue={
                                name === 'displayName'
                                    ? (wallet?.displayName ?? '')
                                    : (session?.username ?? '')
                            }
                        />
                    </label>
                ))}

                <label>
                    Rede<span className="text-primary">*</span>
                    <select
                        name="network"
                        className={fieldClass}
                        required
                        defaultValue={wallet?.network ?? ''}
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
                        name="walletAddress"
                        className={fieldClass}
                        placeholder="Endereço da carteira"
                        defaultValue={wallet?.address ?? ''}
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
                        name="walletType"
                        className={fieldClass}
                        required
                        defaultValue={walletType}
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
                        name="referralCode"
                        className={fieldClass}
                        defaultValue={wallet?.referral ?? ''}
                        required
                    />
                </label>

                <label>
                    E-mail<span className="text-primary">*</span>
                    <input
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
        </section>
    )
}