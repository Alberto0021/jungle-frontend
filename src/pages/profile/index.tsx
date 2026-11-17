import { useState, useSyncExternalStore, type ComponentProps } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Header from '../../components/header'
import { getDemoSession, subscribeDemoSession } from '../../lib/demoSession'
import { getProfile, saveProfile } from '../../api/profile'

const inputClass =
    'h-10 w-full min-w-0 rounded-[3px] border border-[#3b271b] bg-transparent px-3 outline-none focus:border-[#d99152]'

const buttonClass =
    'min-h-10 cursor-pointer rounded-[3px] bg-[#d99152] px-5 font-bold text-[#160e09] hover:brightness-110'

function Field({ label, ...props }: ComponentProps<'input'> & { label: string }) {
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

function PasswordField({ label, name }: { label: string; name: string }) {
    const [visible, setVisible] = useState(false)

    return (
        <div>
            <label htmlFor={name} className="mb-2 block">{label}</label>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={visible ? 'text' : 'password'}
                    autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
                    className={`${inputClass} pr-20`}
                />
                <button
                    type="button"
                    onClick={() => setVisible((value) => !value)}
                    aria-label={`${visible ? 'Ocultar' : 'Mostrar'}: ${label}`}
                    className="absolute inset-y-0 right-3 cursor-pointer text-xs text-[#bfa077]"
                >
                    {visible ? 'Ocultar' : 'Mostrar'}
                </button>
            </div>
        </div>
    )
}

export default function ProfilePage() {
    const navigate = useNavigate()
    const session = useSyncExternalStore(subscribeDemoSession, getDemoSession)
    const [avatar, setAvatar] = useState('')
    const [message, setMessage] = useState('')

    const queryClient = useQueryClient()
    const profileKey = ['profile', session?.email] as const

    const profileQuery = useQuery({
        queryKey: profileKey,
        queryFn: ({ signal }) => getProfile(signal),
        enabled: Boolean(session),
        retry: false,
    })

    const saveMutation = useMutation({
        mutationFn: saveProfile,
        onSuccess: (profile) => {
            queryClient.setQueryData(profileKey, profile)
            void navigate({ to: '/perfil/carteiras' })
        },
        onError: () => setMessage('Não foi possível salvar o perfil. Tente novamente.'),
    })

    const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = (event) => {
        event.preventDefault()

        if (!session) {
            setMessage('Entre na sua conta para salvar o perfil.')
            return
        }

        if (saveMutation.isPending || profileQuery.isLoading) return

        const data = new FormData(event.currentTarget)
        const current = String(data.get('currentPassword') ?? '')
        const next = String(data.get('newPassword') ?? '')
        const confirmation = String(data.get('confirmNewPassword') ?? '')

        if (next || confirmation) {
            if (!current || !next || !confirmation) {
                setMessage('Preencha os três campos para alterar a senha.')
                return
            }

            if (next !== confirmation) {
                setMessage('A nova senha e a confirmação precisam ser iguais.')
                return
            }

            setMessage('A troca de senha ainda não está conectada à API.')
            return
        }

        setMessage('')
        saveMutation.mutate({
            displayName: String(data.get('displayName') ?? '').trim(),
            ensName: String(data.get('ensName') ?? '').trim(),
            walletNickname: String(data.get('walletNickname') ?? '').trim(),
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
                        <Link
                            to="/perfil"
                            aria-current="page"
                            className="flex min-h-11 items-center border-l-4 border-[#d99152] bg-[#302017] px-3"
                        >
                            Dados do perfil
                        </Link>
                        <Link
                            to="/perfil/carteiras"
                            className="flex min-h-11 items-center px-4 hover:bg-[#302017]"
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

                <section aria-labelledby="profile-title" className="min-w-0 text-sm">
                    <h1 id="profile-title" className="mb-8 font-bold">
                        Perfil do colecionador
                    </h1>

                    <form
                        key={JSON.stringify([session?.email, profileQuery.data])}
                        onSubmit={handleSubmit}
                        onChange={() => setMessage('')}
                    >
                        <div className="grid gap-7 sm:grid-cols-2">
                            <Field
                                label="Nome de exibição"
                                name="displayName"
                                defaultValue={profileQuery.data?.displayName ?? ''}
                                required
                            />
                            <Field
                                label="Nome de usuário"
                                name="username"
                                value={session?.username ?? ''}
                                readOnly
                            />
                            <Field
                                label="E-mail"
                                name="email"
                                type="email"
                                value={session?.email ?? ''}
                                readOnly
                            />

                            <div>
                                <label htmlFor="ensName" className="mb-2 block">
                                    Nome ENS<span className="text-[#d99152]">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <span className="grid place-items-center rounded-[3px] border border-[#3b271b] px-3">
                                        .eth
                                    </span>
                                    <input
                                        id="ensName"
                                        name="ensName"
                                        defaultValue={profileQuery.data?.ensName ?? ''}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                            </div>

                            <Field
                                label="Apelido da carteira"
                                name="walletNickname"
                                defaultValue={profileQuery.data?.walletNickname ?? ''}
                                required
                            />

                            <div>
                                <p className="mb-2">Avatar</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    {avatar ? (
                                        <img
                                            src={avatar}
                                            alt="Prévia do avatar"
                                            className="size-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span
                                            aria-hidden="true"
                                            className="grid size-12 place-items-center rounded-full bg-[#302017] text-[#d99152]"
                                        >
                                            ♙
                                        </span>
                                    )}

                                    <label className={`${buttonClass} inline-flex items-center focus-within:outline`}>
                                        Alterar
                                        <input
                                            type="file"
                                            aria-label="Alterar avatar"
                                            accept="image/png,image/jpeg,image/webp"
                                            className="sr-only"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files?.[0]
                                                event.currentTarget.value = ''
                                                if (!file) return

                                                const reader = new FileReader()
                                                reader.onload = () => {
                                                    if (typeof reader.result === 'string') {
                                                        setAvatar(reader.result)
                                                    }
                                                }
                                                reader.readAsDataURL(file)
                                            }}
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        disabled={!avatar}
                                        onClick={() => setAvatar('')}
                                        className="cursor-pointer disabled:cursor-default disabled:opacity-60"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-7 sm:grid-cols-2">
                            <fieldset className="min-w-0 space-y-6">
                                <legend className="mb-4 font-bold">Alterar senha</legend>
                                <PasswordField label="Senha atual" name="currentPassword" />
                                <PasswordField label="Nova senha" name="newPassword" />
                                <PasswordField label="Confirmar nova senha" name="confirmNewPassword" />
                            </fieldset>
                        </div>

                        <button
                            type="submit"
                            disabled={saveMutation.isPending || profileQuery.isLoading}
                            className={`${buttonClass} mt-8 min-w-[130px]`}
                        >
                            {saveMutation.isPending ? 'Salvando…' : 'Salvar'}
                        </button>

                        {message && (
                            <p role="status" className="mt-4 text-[#d99152]">{message}</p>
                        )}
                    </form>
                </section>
            </main>
        </>
    )
}