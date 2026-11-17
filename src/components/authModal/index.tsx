import { useState, type Ref } from 'react'
import { Link } from '@tanstack/react-router'
import AuthForm from '../authForm'

type AuthModalProps = {
    dialogRef: Ref<HTMLDialogElement>
}

const socialButtonClass =
    'flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-[5px] border border-[#3b271b] text-xs text-[#d6b894] hover:border-[#d99152]'

export default function AuthModal({ dialogRef }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [socialMessage, setSocialMessage] = useState('')
    const isLogin = mode === 'login'

    function changeMode(nextMode: 'login' | 'register') {
        setMode(nextMode)
        setSocialMessage('')
    }

    function modeClass(active: boolean) {
        return active
            ? 'cursor-pointer text-[#d99152]'
            : 'cursor-pointer hover:text-[#d99152]'
    }

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="auth-title"
            onClose={() => changeMode('login')}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    event.currentTarget.close()
                }
            }}
            className="fixed inset-0 m-0 h-dvh max-h-dvh w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-[#160e09] p-0 text-[#f4eee8] backdrop:bg-transparent md:m-auto md:h-auto md:max-h-[calc(100dvh_-_2rem)] md:w-[calc(100%_-_2rem)] md:max-w-[500px] md:rounded-lg md:border-b-[10px] md:border-solid md:border-b-[#d99152] md:bg-[#241612]"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
            <div className="relative min-h-full px-6 pt-[clamp(4rem,14dvh,8rem)] pb-[calc(2rem+env(safe-area-inset-bottom))] md:min-h-[590px] md:pt-11 md:pb-12">
                <form method="dialog" className="absolute top-1 right-2">
                    <button
                        type="submit"
                        aria-label="Fechar janela de acesso"
                        className="grid size-11 cursor-pointer place-items-center text-xl text-[#d99152] md:size-9"
                    >
                        ×
                    </button>
                </form>

                <p className="text-center text-[28px] font-bold tracking-[0.14em] md:hidden">
                    KURIO
                </p>

                <h2
                    id="auth-title"
                    className="mt-[clamp(2rem,8dvh,5rem)] mb-7 text-center text-sm font-bold md:sr-only"
                >
                    <span className="md:hidden">
                        {isLogin ? 'Entrar' : 'Criar perfil de colecionador'}
                    </span>
                    <span className="hidden md:inline">Acesso à conta Kurio</span>
                </h2>

                <div
                    role="group"
                    aria-label="Modo de acesso"
                    className="hidden items-center justify-center gap-2 text-xl md:flex"
                >
                    <button
                        type="button"
                        aria-pressed={isLogin}
                        onClick={() => changeMode('login')}
                        className={modeClass(isLogin)}
                    >
                        Entrar
                    </button>
                    <span aria-hidden="true" className="text-[#d99152]">|</span>
                    <button
                        type="button"
                        aria-pressed={!isLogin}
                        onClick={() => changeMode('register')}
                        className={modeClass(!isLogin)}
                    >
                        Criar conta
                    </button>
                </div>

                <p className="mx-auto mt-8 mb-6 hidden max-w-[400px] text-center text-xs leading-4 md:block">
                    {isLogin
                        ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.'
                        : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}
                </p>

                <div className="mx-auto max-w-[340px]">
                    <AuthForm key={mode} mode={mode} />

                    {!isLogin && (
                        <Link
                            to="/cadastro"
                            onClick={(event) => event.currentTarget.closest('dialog')?.close()}
                            className="mt-4 hidden text-center text-xs text-[#d99152] hover:underline md:block"
                        >
                            Abrir página de cadastro
                        </Link>
                    )}
                </div>

                <div className="mx-auto mt-8 mb-3 flex max-w-[340px] items-center gap-3 text-xs md:-mx-5 md:max-w-none">
                    <span aria-hidden="true" className="h-px flex-1 bg-[#3b271b]" />
                    Ou continue com
                    <span aria-hidden="true" className="h-px flex-1 bg-[#3b271b]" />
                </div>

                <div className="mx-auto max-w-[340px] space-y-3">
                    <button
                        type="button"
                        onClick={() => setSocialMessage('O acesso com Google ainda não está conectado.')}
                        className={socialButtonClass}
                    >
                        <span aria-hidden="true" className="text-lg font-bold text-[#4285f4]">G</span>
                        Continuar com Google
                    </button>

                    <button
                        type="button"
                        onClick={() => setSocialMessage('O acesso com Facebook ainda não está conectado.')}
                        className={socialButtonClass}
                    >
                        <span aria-hidden="true" className="text-lg font-bold text-[#5480c0]">f</span>
                        Continuar com Facebook
                    </button>

                    {socialMessage && (
                        <p role="status" className="text-center text-xs text-[#d99152]">
                            {socialMessage}
                        </p>
                    )}
                </div>

                <p className="mt-6 text-center text-xs text-[#d6b894] md:hidden">
                    {isLogin ? 'Novo na Kurio? ' : 'Já tem uma conta? '}
                    <button
                        type="button"
                        onClick={() => changeMode(isLogin ? 'register' : 'login')}
                        className="min-h-11 cursor-pointer font-bold text-[#d99152] hover:underline"
                    >
                        {isLogin ? 'Criar conta' : 'Entre'}
                    </button>
                </p>
            </div>
        </dialog>
    )
}