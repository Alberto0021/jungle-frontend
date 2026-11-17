import { Link } from '@tanstack/react-router'
import Cart from '../../components/cart'
import Footer from '../../components/footer'
import Header from '../../components/header'

export default function CartPage() {
    return (
        <>
            <div className="hidden md:block">
                <Header />
            </div>

            <header className="relative flex min-h-14 items-center justify-center border-b border-border px-14 md:hidden">
                <Link
                    to="/"
                    aria-label="Voltar ao início"
                    className="absolute left-3 grid size-11 place-items-center rounded-full bg-[#251710] text-primary"
                >
                    <span aria-hidden="true">←</span>
                </Link>
                <h1 className="text-center text-sm font-bold">
                    Carrinho de NFTs
                </h1>
            </header>

            <Cart />

            <div className="hidden md:block">
                <Footer />
            </div>
        </>
    )
}