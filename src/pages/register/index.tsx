import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import AuthForm from '../../components/authForm'
import AuthModal from '../../components/authModal'
import Header from '../../components/header'

const socialButtonClass =
    'flex h-10 w-full items-center justify-center gap-3 rounded-[5px] border border-[#3b271b] text-xs text-[#d6b894] hover:border-[#d99152] focus-visible:outline-2 focus-visible:outline-[#d99152]'

export default function RegisterPage() {
    const loginDialogRef = useRef<HTMLDialogElement>(null)
    const [socialMessage, setSocialMessage] = useState('')

    return (
        <>
            <div className="hidden md:block">
                <Header />
            </div>

            <main
                className="flex min-h-dvh justify-center bg-[#160e09] px-6 pt-[clamp(4rem,14dvh,8rem)] pb-[calc(2rem+env(safe-area-inset-bottom))] text-[#f4eee8] md:min-h-[calc(100dvh-56px)] md:bg-transparent md:pt-12 md:pb-12"
                style={{ fontFamily: '"Roboto Mono", monospace' }}
            >
                <section
                    aria-labelledby="register-title"
                    className="h-fit w-full max-w-[340px] md:max-w-[500px] md:rounded-lg md:border-b-[10px] md:border-[#d99152] md:bg-[#241612] md:px-20 md:py-10"
                >
                    <p className="text-center text-[28px] font-bold tracking-[0.14em] md:hidden">
                        KURIO
                    </p>

                    <h1
                        id="register-title"
                        className="mt-[clamp(2rem,8dvh,5rem)] mb-7 text-center text-sm font-bold md:mt-0 md:mb-0 md:text-xl md:text-[#d99152]"
                    >
                        <span className="md:hidden">Criar perfil de colecionador</span>
                        <span className="hidden md:inline">Criar conta</span>
                    </h1>

                    <p className="mb-6 mt-4 hidden text-center text-xs leading-relaxed md:block">
                        Crie seu perfil de colecionador e conecte uma carteira quando quiser.
                    </p>

                    <AuthForm mode="register" />

                    <div className="md:hidden">
                        <div className="mt-8 mb-3 flex items-center gap-3 text-xs">
                            <span aria-hidden="true" className="h-px flex-1 bg-[#3b271b]" />
                            Ou continue com
                            <span aria-hidden="true" className="h-px flex-1 bg-[#3b271b]" />
                        </div>

                        <div className="space-y-3">
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
                        </div>

                        {socialMessage && (
                            <p role="status" className="mt-3 text-center text-xs text-[#d99152]">
                                {socialMessage}
                            </p>
                        )}

                        <p className="mt-6 text-center text-xs text-[#d6b894]">
                            Já tem uma conta?{' '}
                            <button
                                type="button"
                                onClick={() => loginDialogRef.current?.showModal()}
                                className="min-h-11 cursor-pointer font-bold text-[#d99152] hover:underline"
                            >
                                Entre
                            </button>
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="mt-6 hidden text-center text-xs text-[#d99152] hover:underline md:block"
                    >
                        Voltar ao início
                    </Link>
                </section>
            </main>

            <AuthModal dialogRef={loginDialogRef} />
        </>
    )
}