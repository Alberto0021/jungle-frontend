import { Link, useLocation } from '@tanstack/react-router'

export default function Header() {
    const { pathname } = useLocation()
    const isHome = pathname === '/'
    const isMarket = pathname === '/mercado' || pathname.startsWith('/mercado/')

    function navClass(active: boolean) {
        const base = 'block border-b-2 py-4'

        if (active) return `${base} border-primary font-bold text-primary`

        return `${base} border-transparent hover:text-primary`
    }

    return (
        <header className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 border-b border-[#3b271b] px-4 text-sm text-[#f4eee8]">
            <span className="font-bold tracking-widest">KURIO</span>

            <nav aria-label="Menu principal" className="flex items-center gap-8">
                <Link
                    to="/"
                    activeOptions={{ exact: true }}
                    className={navClass(isHome)}
                >
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
                <span role="img" aria-label="Carrinho com 6 itens">🛒 6</span>
                <button type="button" className="rounded bg-[#d99152] px-3 py-1.5 text-[#160e09]">
                    Entrar
                </button>
            </div>
        </header>
    )
}