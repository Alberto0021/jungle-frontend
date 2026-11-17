import { useState, type ComponentProps } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import Header from '../../components/header'
import { getDemoSession } from '../../lib/demoSession'
import { useMutation } from '@tanstack/react-query'
import { saveWallets, type Wallet, type Wallets } from '../../api/wallets'


const inputClass =
    'h-10 w-full min-w-0 rounded-[3px] border border-[#3b271b] bg-transparent px-3 text-sm outline-none placeholder:text-[#bfa077] focus:border-[#d99152]'

const buttonClass =
    'min-h-10 cursor-pointer rounded-[3px] bg-[#d99152] px-4 font-bold text-[#160e09] hover:brightness-110'

function Field({
    label,
    ...props
}: ComponentProps<'input'> & { label: string }) {
    return (
        <label className="block space-y-2">
            <span>
                {label}
                {props.required && <span className="text-[#d99152]">*</span>}
            </span>
            <input {...props} className={inputClass} />
        </label>
    )
}

function WalletFields({
    prefix,
    email,
    username,
}: {
    prefix: string
    email?: string
    username?: string
}) {
    return (
        <div className="grid gap-x-7 gap-y-5 sm:grid-cols-2">
            <Field label="Nome de exibição" name={`${prefix}-displayName`} required />
            <Field label="Apelido da carteira" name={`${prefix}-nickname`} required />

            <label className="block space-y-2">
                <span>Rede<span className="text-[#d99152]">*</span></span>
                <select name={`${prefix}-network`} defaultValue="" className={inputClass} required>
                    <option value="" disabled>Selecione uma rede</option>
                    <option value="ethereum">Ethereum</option>
                    <option value="polygon">Polygon</option>
                    <option value="base">Base</option>
                </select>
            </label>

            <Field
                label="Nome do perfil"
                name={`${prefix}-profileName`}
                defaultValue={username}
                required
            />

            <Field
                label="Endereço da carteira"
                name={`${prefix}-address`}
                placeholder="Endereço da carteira"
                pattern="0x[0-9a-fA-F]{40}"
                title="Use 0x seguido de 40 caracteres hexadecimais."
                required
            />

            <div className="sm:self-end">
                {prefix === 'primary' && (
                    <Field
                        label="Carteira secundária (opcional)"
                        name="secondaryHint"
                        placeholder="ENS ou carteira secundária"
                    />
                )}
            </div>

            <label className="block space-y-2">
                <span>Tipo de carteira<span className="text-[#d99152]">*</span></span>
                <select name={`${prefix}-type`} defaultValue="" className={inputClass} required>
                    <option value="" disabled>Selecione uma carteira</option>
                    <option value="mobile">Carteira móvel</option>
                    <option value="extension">Extensão do navegador</option>
                    <option value="hardware">Carteira física</option>
                </select>
            </label>

            <Field label="Código de indicação" name={`${prefix}-referral`} required />

            <Field
                label="E-mail"
                name={`${prefix}-email`}
                type="email"
                defaultValue={email}
                required
            />

            <div>
                <label htmlFor={`${prefix}-ens`} className="mb-2 block">
                    Nome ENS<span className="text-[#d99152]">*</span>
                </label>
                <div className="flex gap-2">
                    <span className="grid place-items-center rounded-[3px] border border-[#3b271b] px-3">
                        .eth
                    </span>
                    <input id={`${prefix}-ens`} name={`${prefix}-ens`} className={inputClass} required />
                </div>
            </div>
        </div>
    )
}

function readWallet(data: FormData, prefix: 'primary' | 'secondary'): Wallet {
    const read = (field: string) =>
        String(data.get(`${prefix}-${field}`) ?? '').trim()

    return {
        displayName: read('displayName'),
        nickname: read('nickname'),
        network: read('network'),
        profileName: read('profileName'),
        address: read('address'),
        type: read('type'),
        referral: read('referral'),
        email: read('email'),
        ens: read('ens'),
    }
}

export default function WalletsPage() {
    const navigate = useNavigate()
    const session = getDemoSession()
    const [secondaryOpen, setSecondaryOpen] = useState(false)
    const [sameAsPrimary, setSameAsPrimary] = useState(false)
    const [message, setMessage] = useState('')

    const saveMutation = useMutation({
        mutationFn: (payload: { account: string; wallets: Wallets }) =>
            saveWallets(payload.account, payload.wallets),
        onSuccess: () => {
            void navigate({ to: '/pagamento' })
        },
        onError: () => setMessage('Não foi possível salvar a carteira. Confira os dados e tente novamente.'),
    })

    const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = (event) => {
        event.preventDefault()
        if (saveMutation.isPending) return

        const account = session?.email.trim().toLowerCase()
        if (!account) {
            setMessage('Entre ou crie uma conta para salvar a carteira.')
            return
        }

        const data = new FormData(event.currentTarget)
        setMessage('')

        saveMutation.mutate({
            account,
            wallets: {
                primary: readWallet(data, 'primary'),
                secondary: secondaryOpen && !sameAsPrimary
                    ? readWallet(data, 'secondary')
                    : null,
                sameAsPrimary,
                secondaryHint: String(data.get('secondaryHint') ?? '').trim(),
            },
        })
    }

    return (
        <>
            <Header />

            <main
                className="mx-auto grid w-[calc(100%_-_2rem)] max-w-[1200px] items-start gap-7 pt-8 pb-16 md:grid-cols-[minmax(180px,310px)_minmax(0,1fr)]"
                style={{ fontFamily: '"Roboto Mono", monospace' }}
            >
                <aside className="bg-[#251710] text-sm">
                    <h2 className="px-3 pt-4 pb-2 text-base font-bold">Meu perfil</h2>

                    <nav aria-label="Menu do perfil" className="text-[#d99152]">
                        <Link to="/perfil" className="flex min-h-11 items-center px-4 hover:bg-[#302017]">
                            Dados do perfil
                        </Link>
                        <Link
                            to="/perfil/carteiras"
                            aria-current="page"
                            className="flex min-h-11 items-center border-l-4 border-[#d99152] bg-[#302017] px-3"
                        >
                            Carteiras
                        </Link>

                        {['Atividade', 'Lista de interesse', 'Ofertas', 'Arquivos baixados', 'Suporte'].map((item) => (
                            <span key={item} className="flex min-h-11 items-center px-4 opacity-70">
                                {item}
                            </span>
                        ))}
                        <span className="flex min-h-11 items-center border-t border-[#503322] px-4 opacity-70">
                            Sair
                        </span>
                    </nav>
                </aside>

                <form onSubmit={handleSubmit} className="wallet-form min-w-0 text-sm">
                    <section aria-labelledby="primary-wallet">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h1 id="primary-wallet" className="font-bold">Carteira principal</h1>
                                <p className="mt-1 text-xs text-[#bfa077]">
                                    Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
                                </p>
                            </div>
                            <a href="#primary-fields" className="text-[#d99152] hover:underline">
                                Adicionar
                            </a>
                        </div>

                        <div id="primary-fields" className="scroll-mt-8">
                            <WalletFields
                                prefix="primary"
                                email={session?.email}
                                username={session?.username}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`${buttonClass} mt-6`}
                            disabled={saveMutation.isPending}
                        >
                            {saveMutation.isPending ? 'Salvando…' : 'Salvar carteira'}
                        </button>
                    </section>

                    <section aria-labelledby="secondary-wallet" className="mt-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <h2 id="secondary-wallet" className="font-bold">Carteira secundária</h2>
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={sameAsPrimary}
                                        onChange={(event) => setSameAsPrimary(event.currentTarget.checked)}
                                        className="accent-[#d99152]"
                                    />
                                    Igual à carteira principal
                                </label>
                                <button
                                    type="button"
                                    disabled={sameAsPrimary}
                                    aria-expanded={secondaryOpen && !sameAsPrimary}
                                    onClick={() => setSecondaryOpen((open) => !open)}
                                    className="cursor-pointer text-[#d99152] hover:underline disabled:opacity-50"
                                >
                                    {secondaryOpen && !sameAsPrimary ? 'Cancelar' : 'Adicionar'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-2">
                            {sameAsPrimary ? (
                                <p className="text-xs text-[#bfa077]">Usar os dados da carteira principal.</p>
                            ) : secondaryOpen ? (
                                <fieldset className="mt-5">
                                    <legend className="sr-only">Dados da carteira secundária</legend>
                                    <WalletFields
                                        prefix="secondary"
                                        email={session?.email}
                                        username={session?.username}
                                    />
                                </fieldset>
                            ) : (
                                <p className="text-xs text-[#bfa077]">
                                    Você ainda não adicionou uma carteira secundária.
                                </p>
                            )}
                        </div>
                    </section>

                    {message && <p role="status" className="mt-4 text-[#d99152]">{message}</p>}
                </form>
            </main >
        </>
    )
}