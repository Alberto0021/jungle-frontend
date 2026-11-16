export default function Header() {
    return (
        <header className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 border-b border-[#3b271b] px-4 text-sm text-[#f4eee8]">
            <span className="font-bold tracking-widest">KURIO</span>

            <nav aria-label="Menu principal" className="flex items-center gap-8">
                <a
                    href="/"
                    aria-current="page"
                    className="border-b-2 border-[#d99152] py-4 font-bold text-[#d99152]"
                >
                    Início
                </a>
                <span>Mercado</span>
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