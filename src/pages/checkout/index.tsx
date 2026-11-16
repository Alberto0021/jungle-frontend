import { Link, useNavigate } from '@tanstack/react-router'
import Header from '../../components/header'
import CheckoutForm from '../../components/checkoutForm'
import CheckoutSummary from '../../components/checkoutSummary'
import Footer from '../../components/footer'

export default function CheckoutPage() {
    const navigate = useNavigate()

    return (
        <>
            <Header />

            <main
                className="mx-auto w-[calc(100%_-_2rem)] max-w-[1200px] pt-7"
                style={{ fontFamily: '"Roboto Mono", monospace' }}
            >
                <nav aria-label="Localização" className="mb-5 flex flex-wrap gap-2 text-xs">
                    <Link to="/" className="hover:text-primary">
                        Início
                    </Link>
                    <span aria-hidden="true">/</span>
                    <Link to="/" hash="catalogo" className="hover:text-primary">
                        Mercado
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">Pagamento</span>
                </nav>

                <h1 className="sr-only">Pagamento</h1>

                <form
                    noValidate
                    onSubmit={(event) => {
                        event.preventDefault()
                        void navigate({ to: '/confirmacao' })
                    }}
                    className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]"
                >
                    <CheckoutForm />
                    <CheckoutSummary />
                </form>
            </main>

            <Footer />
        </>
    )
}