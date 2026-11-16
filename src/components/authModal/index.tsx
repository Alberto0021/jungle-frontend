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

    function changeMode(nextMode: 'login' | 'register') {
        setMode(nextMode)
        setSocialMessage('')
    }

    function modeClass(active: boolean) {
        if (active) return 'cursor-pointer text-[#d99152]'
        return 'cursor-pointer hover:text-[#d99152]'
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
            className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-[500px] overflow-y-auto rounded-lg border-0 border-b-[10px] border-solid border-b-[#d99152] bg-[#241612] p-0 text-[#f4eee8] backdrop:bg-transparent"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
            <div className="relative min-h-[590px] px-5 pb-12 pt-11">
                <form method="dialog" className="absolute right-2 top-1">
                    <button
                        type="submit"
                        aria-label="Fechar janela de acesso"
                        className="grid size-9 cursor-pointer place-items-center text-xl text-[#d99152]"
                    >
                        ×
                    </button>
                </form>

                <h2 id="auth-title" className="sr-only">
                    Acesso à conta Kurio
                </h2>

                <div
                    role="group"
                    aria-label="Modo de acesso"
                    className="flex items-center justify-center gap-2 text-xl"
                >
                    <button
                        type="button"
                        aria-pressed={mode === 'login'}
                        onClick={() => changeMode('login')}
                        className={modeClass(mode === 'login')}
                    >
                        Entrar
                    </button>
                    <span aria-hidden="true" className="text-[#d99152]">|</span>
                    <button
                        type="button"
                        aria-pressed={mode === 'register'}
                        onClick={() => changeMode('register')}
                        className={modeClass(mode === 'register')}
                    >
                        Criar conta
                    </button>
                </div>

                <p className="mx-auto mb-6 mt-8 max-w-[400px] text-center text-xs leading-4">
                    {mode === 'login'
                        ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.'
                        : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}
                </p>

                <div className="mx-auto max-w-[340px]">
                    <AuthForm key={mode} mode={mode} />

                    {mode === 'register' && (
                        <Link
                            to="/cadastro"
                            onClick={(event) => event.currentTarget.closest('dialog')?.close()}
                            className="mt-4 block text-center text-xs text-[#d99152] hover:underline"
                        >
                            Abrir página de cadastro
                        </Link>
                    )}
                </div>

                <div className="-mx-5 mb-3 mt-6 flex items-center gap-3 text-xs">
                    <span className="h-px flex-1 bg-[#3b271b]" />
                    Ou continue com
                    <span className="h-px flex-1 bg-[#3b271b]" />
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
            </div>
        </dialog>
    )
}