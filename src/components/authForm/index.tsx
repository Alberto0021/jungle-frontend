import { useState, type ComponentProps } from 'react'
import { startDemoSession } from '../../lib/demoSession'
import { useNavigate } from '@tanstack/react-router'

type AuthFormProps = {
    mode: 'login' | 'register'
}

const fieldClass =
    'h-10 w-full rounded-[5px] border border-[#3b271b] bg-transparent px-4 text-sm text-[#f4eee8] outline-none placeholder:text-[#bfa077] focus:border-[#d99152]'

export default function AuthForm({ mode }: AuthFormProps) {
    const navigate = useNavigate()
    const isRegister = mode === 'register'
    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)

        if (isRegister && data.get('password') !== data.get('confirmPassword')) {
            setMessage('As senhas precisam ser iguais.')
            return
        }

        if (isRegister) {
            const username = String(data.get('username') ?? '').trim()
            const email = String(data.get('email') ?? '').trim()

            if (!username || !email) {
                setMessage('Informe o nome de usuário e o e-mail.')
                return
            }

            startDemoSession({ username, email })
            event.currentTarget.closest('dialog')?.close()
            void navigate({ to: '/perfil' })
            return
        }

        setMessage('O login ainda não está disponível. Use Criar conta para testar.')
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

            <div className="relative">
                <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    aria-label="Senha"
                    placeholder="Senha"
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    className={`${fieldClass} pr-12`}
                    required
                />
                <button
                    type="button"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 grid w-11 cursor-pointer place-items-center text-[#bfa077]"
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
                        {!showPassword && <path d="m3 21 18-18" />}
                    </svg>
                </button>
            </div>

            {isRegister ? (
                <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    aria-label="Confirmar senha"
                    placeholder="Confirmar senha"
                    autoComplete="new-password"
                    className={fieldClass}
                    required
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
                className="mt-3 h-11 w-full cursor-pointer rounded-[5px] bg-[#d99152] text-base font-bold text-[#160e09] hover:brightness-110"
            >
                {isRegister ? 'Criar conta' : 'Entrar'}
            </button>

            {message && (
                <p role="status" className="text-xs leading-relaxed text-[#d99152]">
                    {message}
                </p>
            )}
        </form>
    )
}