import { Link } from '@tanstack/react-router'
import Footer from '../../../components/footer'
import Header from '../../../components/header'
import Hero from '../../../components/hero'
import MintJournal from '../../../components/mintJournal'
import NftCatalog from '../../../components/nftCatalog'
import NftPromos from '../../../components/nftPromos'

export default function Home() {
    return (
        <>
            <div className="hidden md:block">
                <Header />
            </div>

            <div className="mx-5 mt-5 flex gap-2 md:hidden">
                <a
                    href="#catalogo"
                    className="flex min-h-11 flex-1 items-center gap-2 rounded-xl bg-[#251710] px-4 text-sm text-muted-foreground"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="size-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <circle cx="10.5" cy="10.5" r="6.5" />
                        <path d="m16 16 4 4" />
                    </svg>
                    Explorar coleções
                </a>

                <a
                    href="#filtros-mobile"
                    aria-label="Filtros"
                    className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground"
                >
                    ☷
                </a>
            </div>

            <main className="pb-20 md:pb-0">
                <Hero />
                <NftCatalog />
                <NftPromos />
                <MintJournal />
            </main>

            <div className="hidden md:block">
                <Footer />
            </div>

            <nav
                aria-label="Navegação mobile"
                className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 rounded-t-3xl bg-[#251710] px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-[#cfad88] md:hidden"
            >
                <Link
                    to="/"
                    aria-label="Início"
                    aria-current="page"
                    className="grid min-h-11 place-items-center text-primary"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
                        <path d="M3 10.5 12 3l9 7.5V21h-6v-7H9v7H3z" />
                    </svg>
                </Link>

                <a
                    href="#catalogo"
                    aria-label="Catálogo"
                    className="grid min-h-11 place-items-center"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <rect x="4" y="4" width="16" height="16" rx="4" />
                        <path d="M4 12h16M12 4v16" />
                    </svg>
                </a>

                <Link
                    to="/carrinho"
                    aria-label="Carrinho"
                    className="grid min-h-11 place-items-center"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M2 4h3l3 11h11l2-8H6" />
                        <circle cx="9" cy="20" r="1" />
                        <circle cx="18" cy="20" r="1" />
                    </svg>
                </Link>

                <Link
                    to="/perfil"
                    aria-label="Perfil"
                    className="grid min-h-11 place-items-center"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M4 21v-2a8 8 0 0 1 16 0v2z" />
                    </svg>
                </Link>
            </nav>
        </>
    )
}