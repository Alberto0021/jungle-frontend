import { Link } from '@tanstack/react-router'
import AuthForm from '../../components/authForm'
import Header from '../../components/header'

export default function RegisterPage() {
    return (
        <>
            <Header />

            <main
                className="mx-auto flex min-h-[calc(100dvh-56px)] justify-center px-4 pb-12 pt-12 text-[#f4eee8]"
                style={{ fontFamily: '"Roboto Mono", monospace' }}
            >
                <section
                    aria-labelledby="register-title"
                    className="h-fit w-full max-w-[500px] rounded-lg border-b-[10px] border-[#d99152] bg-[#241612] px-6 py-10 sm:px-20"
                >
                    <h1 id="register-title" className="text-center text-xl font-bold text-[#d99152]">
                        Criar conta
                    </h1>

                    <p className="mb-6 mt-4 text-center text-xs leading-relaxed">
                        Crie seu perfil de colecionador e conecte uma carteira quando quiser.
                    </p>

                    <AuthForm mode="register" />

                    <Link to="/" className="mt-6 block text-center text-xs text-[#d99152] hover:underline">
                        Voltar ao início
                    </Link>
                </section>
            </main>
        </>
    )
}