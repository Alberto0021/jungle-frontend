import { useRef, useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import AuthModal from '../../components/authModal'
import Header from '../../components/header'
import CheckoutForm from '../../components/checkoutForm'
import CheckoutSummary from '../../components/checkoutSummary'
import Footer from '../../components/footer'
import { createOrder } from '../../api/orders'
import { applyConfirmedOrder, useCartItems } from '../../lib/cartStore'
import { getDemoSession } from '../../lib/demoSession'

export default function CheckoutPage() {
    const navigate = useNavigate()
    const authDialogRef = useRef<HTMLDialogElement>(null)
    const items = useCartItems()
    const [message, setMessage] = useState('')
    const submitting = useRef(false)
    const attempt = useRef<{ signature: string; id: string } | null>(null)

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        if (submitting.current) return

        const session = getDemoSession()
        if (!session) {
            authDialogRef.current?.showModal()
            return
        }

        if (items.length === 0) {
            void navigate({ to: '/carrinho' })
            return
        }

        const form = event.currentTarget
        if (!form.reportValidity()) return

        const address = new FormData(form).get('walletAddress')
        const walletAddress = typeof address === 'string' ? address.trim() : ''

        if (!/^0x[0-9a-fA-F]{40}$/.test(walletAddress)) {
            setMessage('Informe um endereço de carteira válido.')
            return
        }

        const snapshot = items.map(({ id, quantity }) => ({ id, quantity }))
        const signature = JSON.stringify([session.email, snapshot, walletAddress])
        const previous = attempt.current
        const currentAttempt =
            previous && previous.signature === signature
                ? previous
                : { signature, id: crypto.randomUUID() }

        attempt.current = currentAttempt
        submitting.current = true
        setMessage('Confirmando compra…')

        try {
            const order = await createOrder(snapshot, currentAttempt.id, walletAddress)
            if (getDemoSession() !== session) return

            if (order.status !== 'confirmed') {
                setMessage('O pedido não foi confirmado. Seu carrinho foi mantido.')
                return
            }

            applyConfirmedOrder(order)
            attempt.current = null
            setMessage('')
            void navigate({ to: '/confirmacao' })
        } catch {
            if (getDemoSession() === session) {
                setMessage('Não foi possível confirmar a compra. Seu carrinho foi mantido.')
            }
        } finally {
            submitting.current = false
        }
    }

    return (
        <>
            <div className="hidden md:block">
                <Header />
            </div>

            <header className="flex min-h-14 items-center gap-3 px-4 md:hidden">
                <Link
                    to="/carrinho"
                    aria-label="Voltar ao carrinho"
                    className="grid size-11 shrink-0 place-items-center"
                >
                    <span
                        aria-hidden="true"
                        className="grid size-8 place-items-center rounded-full bg-[#302017] text-primary"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="size-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path
                                d="m14 6-6 6 6 6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </Link>

                <h1 className="text-base font-bold">Pagamento com carteira</h1>
            </header>

            <main
                className="mx-auto w-[calc(100%_-_2rem)] max-w-[1200px] pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pt-7 md:pb-0"
                style={{ fontFamily: '"Roboto Mono", monospace' }}
            >
                <nav
                    aria-label="Localização"
                    className="mb-5 hidden flex-wrap gap-2 text-xs md:flex"
                >
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

                <h1 className="hidden md:sr-only md:block">Pagamento</h1>

                <form
                    id="checkout-form"
                    noValidate
                    onSubmit={handleSubmit}
                    className="grid items-start gap-6 md:gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]"
                >
                    <div className="contents">
                        <div className="min-w-0 md:contents">
                            <CheckoutForm />
                        </div>

                        <div className="min-w-0 md:contents">
                            <CheckoutSummary />
                        </div>
                    </div>
                </form>

                {message && (
                    <p role="status" className="mt-4 text-sm">
                        {message}
                    </p>
                )}

                <div className="fixed inset-x-0 bottom-0 z-40 bg-background px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
                    <button
                        type="submit"
                        form="checkout-form"
                        className="flex h-11 w-full items-center justify-center rounded-full bg-[linear-gradient(90deg,#d99152,#b47846)] text-xs font-bold text-primary-foreground"
                    >
                        Confirmar compra
                    </button>
                </div>
            </main>

            <AuthModal dialogRef={authDialogRef} />

            <div className="hidden md:block">
                <Footer />
            </div>
        </>
    )
}