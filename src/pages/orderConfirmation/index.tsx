import OrderConfirmation from '../../components/orderConfirmation'

export default function OrderConfirmationPage() {
    return (
        <main
            className="flex min-h-screen items-start justify-center bg-background px-4 pb-12 pt-10"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
            <OrderConfirmation />
        </main>
    )
}