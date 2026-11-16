import { Link, useLocation } from '@tanstack/react-router'
import { useCartItems } from '../../lib/cartStore'

function navClass(active: boolean) {
    const base = 'block border-b-2 py-4'

    if (active) return `${base} border-primary font-bold text-primary`

    return `${base} border-transparent hover:text-primary`
}

export default function Header() {
    const { pathname } = useLocation()
    const items = useCartItems()
    const itemCount = items.reduce((total, item) => total + item.quantity, 0)

    const isHome = pathname === '/'
    const isMarket =
        pathname === '/mercado' ||
        pathname.startsWith('/mercado/') ||
        pathname === '/carrinho'

    return (
        <header
            className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 border-b border-[#3b271b] px-4 text-sm text-[#f4eee8]"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
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

            <div className="flex shrink-0 items-center gap-5">
                <span role="img" aria-label="Busca" className="inline-flex">
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="size-[18px]"
                    >
                        <circle cx="10.5" cy="10.5" r="7.5" />
                        <path d="m16 16 5 5" />
                    </svg>
                </span>

                <Link
                    to="/carrinho"
                    aria-label={`Abrir carrinho (${itemCount} itens)`}
                    className="relative inline-flex size-[22px] items-center justify-center hover:text-primary"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-[22px]"
                    >
                        <path d="M2 3h2l2.8 11a2 2 0 0 0 1.9 1.5h9.1a2 2 0 0 0 1.9-1.5L22 7H5" />
                        <circle cx="9" cy="20" r="1" />
                        <circle cx="18" cy="20" r="1" />
                    </svg>

                    <span
                        aria-hidden="true"
                        className="absolute -right-1 top-0 grid h-[13px] min-w-[13px] place-items-center rounded-full bg-[#d99152] px-0.5 text-[8px] leading-none text-[#160e09] ring-1 ring-[#160e09]"
                    >
                        {itemCount}
                    </span>
                </Link>

                <button
                    type="button"
                    className="inline-flex h-7 w-20 cursor-pointer items-center justify-center gap-1 rounded-[5px] bg-[#d99152] text-xs font-medium leading-none text-[#160e09]"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-[15px]"
                    >
                        <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8M10 12h11m-4-4 4 4-4 4" />
                    </svg>
                    Entrar
                </button>
            </div>
        </header>
    )
}