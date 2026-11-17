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
                    onSubmit={handleSubmit}
                    className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]"
                >
                    <CheckoutForm />
                    <CheckoutSummary />
                </form>

                {message && <p role="status" className="mt-4 text-sm">{message}</p>}
            </main>

            <AuthModal dialogRef={authDialogRef} />
            <Footer />
        </>
    )
}