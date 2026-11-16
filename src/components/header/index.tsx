import { Link, useLocation } from '@tanstack/react-router'

export default function Header() {
    const { pathname } = useLocation()
    const isHome = pathname === '/'
    const isMarket =
        pathname === '/mercado' ||
        pathname.startsWith('/mercado/') ||
        pathname === '/carrinho'

    function navClass(active: boolean) {
        const base = 'block border-b-2 py-4'

        if (active) return `${base} border-primary font-bold text-primary`

        return `${base} border-transparent hover:text-primary`
    }

    return (
        <header className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 border-b border-[#3b271b] px-4 text-sm text-[#f4eee8]">
            <span className="font-bold tracking-widest">KURIO</span>

            <nav aria-label="Menu principal" className="flex items-center gap-8">
                <Link to="/" activeOptions={{ exact: true }} className={navClass(isHome)}>
                    Início
                </Link>

                <Link
                    to="/"
                    hash="catalogo"
                    activeOptions={{ exact: true, includeHash: true }}
                    className={navClass(isMarket)}
                >
                    Mercado
                </Link>

                <span>Criadores</span>
                <span>Aprenda</span>
            </nav>

            <div className="flex items-center gap-5">
                <span role="img" aria-label="Busca">⌕</span>

                <Link
                    to="/carrinho"
                    aria-label="Abrir carrinho"
                    className="inline-flex items-center hover:text-primary"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-5"
                    >
                        <path d="M2 3h3l3 12h10l3-9H6" />
                        <circle cx="9" cy="20" r="1" />
                        <circle cx="18" cy="20" r="1" />
                    </svg>
                </Link>

                <button type="button" className="rounded bg-[#d99152] px-3 py-1.5 text-[#160e09]">
                    Entrar
                </button>
            </div>
        </header>
    )
}