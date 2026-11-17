import { useState, type ComponentProps } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { loginAccount, registerAccount } from '../../api/auth'
import { startDemoSession } from '../../lib/demoSession'

type AuthFormProps = {
    mode: 'login' | 'register'
}

const fieldClass =
    'h-10 w-full rounded-[5px] border border-[#3b271b] bg-transparent px-4 text-sm text-[#f4eee8] outline-none placeholder:text-[#bfa077] focus:border-[#d99152]'

function PasswordField({
    name,
    label,
    autoComplete,
}: {
    name: 'password' | 'confirmPassword'
    label: string
    autoComplete: 'new-password' | 'current-password'
}) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="relative">
            <input
                name={name}
                type={visible ? 'text' : 'password'}
                aria-label={label}
                placeholder={label}
                autoComplete={autoComplete}
                className={`${fieldClass} pr-12`}
                required
            />
            <button
                type="button"
                aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`}
                onClick={() => setVisible((previous) => !previous)}
                className="absolute inset-y-0 right-0 grid w-11 cursor-pointer place-items-center rounded-[5px] text-[#bfa077] focus-visible:outline-2 focus-visible:outline-[#d99152]"
            >
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
                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="2.5" />
                    {!visible && <path d="m3 21 18-18" />}
                </svg>
            </button>
        </div>
    )
}

export default function AuthForm({ mode }: AuthFormProps) {
    const navigate = useNavigate()
    const isRegister = mode === 'register'
    const [message, setMessage] = useState('')

    const authMutation = useMutation({
        mutationFn: ({
            username,
            email,
            password,
        }: {
            username: string
            email: string
            password: string
        }) =>
            isRegister
                ? registerAccount({ username, email, password })
                : loginAccount({ email, password }),
    })

    const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = async (event) => {
        event.preventDefault()
        if (authMutation.isPending) return

        const form = event.currentTarget
        const dialog = form.closest('dialog')
        const data = new FormData(form)
        const username = String(data.get('username') ?? '').trim()
        const email = String(data.get('email') ?? '').trim()
        const password = String(data.get('password') ?? '')

        setMessage('')

        if (isRegister && password !== data.get('confirmPassword')) {
            setMessage('As senhas precisam ser iguais.')
            return
        }

        try {
            const account = await authMutation.mutateAsync({ username, email, password })
            startDemoSession(account)
            dialog?.close()

            if (isRegister) {
                void navigate({ to: '/perfil' })
            }
        } catch (error) {
            const apiMessage = isAxiosError<{ message: string }>(error)
                ? error.response?.data?.message
                : undefined

            setMessage(apiMessage ?? 'Não foi possível acessar sua conta. Tente novamente.')
        }
    }

    return (
        <form onSubmit={handleSubmit} onChange={() => setMessage('')} className="space-y-3">
            {isRegister && (
                <input
                    name="username"
                    aria-label="Nome de usuário"
                    placeholder="Nome de usuário"
                    autoComplete="username"
                    className={fieldClass}
                    required
                />
            )}

            <input
                name="email"
                type="email"
                aria-label="E-mail"
                placeholder={isRegister ? 'Digite seu e-mail' : 'contato@email.com'}
                autoComplete={isRegister ? 'email' : 'username'}
                className={fieldClass}
                required
            />

            <PasswordField
                name="password"
                label="Senha"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
            />

            {isRegister ? (
                <PasswordField
                    name="confirmPassword"
                    label="Confirmar senha"
                    autoComplete="new-password"
                />
            ) : (
                <button
                    type="button"
                    onClick={() => setMessage('A recuperação de senha ainda não está disponível.')}
                    className="ml-auto block cursor-pointer text-sm text-[#d99152] hover:underline"
                >
                    Esqueceu a senha?
                </button>
            )}

            <button
                type="submit"
                disabled={authMutation.isPending}
                className="mt-3 h-11 w-full cursor-pointer rounded-[5px] bg-[#d99152] text-base font-bold text-[#160e09] hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
            >
                {authMutation.isPending ? (
                    isRegister ? 'Criando perfil…' : 'Entrando…'
                ) : isRegister ? (
                    <>
                        <span className="md:hidden">Criar perfil</span>
                        <span className="hidden md:inline">Criar conta</span>
                    </>
                ) : (
                    'Entrar'
                )}
            </button>

            {message && (
                <p role="status" className="text-xs leading-relaxed text-[#d99152]">
                    {message}
                </p>
            )}
        </form>
    )
}