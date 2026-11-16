import { useState } from 'react'

const benefits = [
    {
        letter: 'W',
        title: 'Segurança da carteira',
        description: 'Proteja sua carteira e colecione arte digital verificada com confiança.',
    },
    {
        letter: 'C',
        title: 'Criadores em destaque',
        description: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
    },
    {
        letter: 'D',
        title: 'Alertas de lançamentos',
        description: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
    },
]

const footerGroups = [
    {
        title: 'Meu perfil',
        items: ['Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse'],
    },
    {
        title: 'Central de ajuda',
        items: ['Central de ajuda', 'Como comprar NFTs', 'Carteira e segurança', 'Política do mercado', 'Denunciar item'],
    },
    {
        title: 'Coleções',
        items: ['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'],
    },
]

const socials = [
    ['Facebook', 'f'],
    ['Instagram', '◎'],
    ['Twitter', '𝕏'],
    ['LinkedIn', 'in'],
    ['YouTube', '▶'],
]

export default function Footer() {
    const [newsletterMessage, setNewsletterMessage] = useState('')

    return (
        <footer
            className="mx-auto mt-8 w-[calc(100%_-_2rem)] max-w-[1200px] text-foreground"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
            <div className="bg-[#251710]">
                <div className="grid gap-6 px-8 pt-8 pb-4 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.3fr)] lg:gap-0">
                    {benefits.map(({ letter, title, description }) => (
                        <section key={letter} className="lg:border-r lg:border-primary/60 lg:px-4">
                            <span
                                aria-hidden="true"
                                className="grid size-[74px] place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground"
                            >
                                {letter}
                            </span>
                            <h2 className="mt-2 text-base font-bold">{title}</h2>
                            <p className="mt-2 text-sm leading-[22px] text-muted-foreground">
                                {description}
                            </p>
                        </section>
                    ))}

                    <section className="lg:pl-4">
                        <h2 className="text-lg leading-[18px] font-bold">
                            Antecipe-se ao próximo lançamento
                        </h2>

                        <form
                            className="mt-3 flex"
                            onSubmit={(event) => {
                                event.preventDefault()
                                setNewsletterMessage('Cadastro demonstrativo. Nenhum e-mail foi enviado.')
                            }}
                        >
                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                aria-label="Seu e-mail"
                                placeholder="digite seu e-mail..."
                                required
                                className="min-w-0 flex-1 rounded-l-md bg-[#36210f] px-3 text-sm outline-offset-2 placeholder:text-muted-foreground/80"
                            />
                            <button
                                type="submit"
                                className="min-h-10 cursor-pointer rounded-r-md bg-primary px-4 font-bold text-primary-foreground"
                            >
                                Enviar
                            </button>
                        </form>

                        <p className="mt-3 text-xs leading-[22px] text-muted-foreground">
                            Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
                        </p>
                        <p role="status" className="text-xs text-primary">
                            {newsletterMessage}
                        </p>
                    </section>
                </div>

                <div className="grid gap-4 bg-[#36210f] px-8 py-6 text-sm sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
                    <span className="font-bold tracking-widest">KURIO</span>
                    <p>Feito para colecionadores, criadores e cultura</p>
                    <a href="mailto:contato@email.com" className="hover:text-primary">
                        contato@email.com
                    </a>
                    <a href="tel:+551140028922" className="hover:text-primary">
                        +55 11 4002 8922
                    </a>
                </div>

                <div className="grid gap-6 px-8 py-7 sm:grid-cols-2 lg:grid-cols-4">
                    {footerGroups.map(({ title, items }) => (
                        <section key={title}>
                            <h2 className="text-lg font-bold">{title}</h2>
                            <ul className="mt-2 space-y-2 text-sm">
                                {items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    ))}

                    <div>
                        <h2 className="text-lg font-bold">Redes sociais</h2>
                        <ul className="mt-3 flex flex-wrap gap-2">
                            {socials.map(([name, symbol]) => (
                                <li
                                    key={name}
                                    className="grid size-8 place-items-center rounded border border-primary/70 font-bold text-primary"
                                >
                                    <span className="sr-only">{name}</span>
                                    <span aria-hidden="true">{symbol}</span>
                                </li>
                            ))}
                        </ul>

                        <h2 className="mt-6 text-lg font-bold">Carteiras compatíveis</h2>
                        <p className="mt-1 inline-block rounded border border-primary/25 bg-[#36210f] px-2 py-1 text-[10px] text-primary">
                            METAMASK · WALLETCONNECT · COINBASE
                        </p>
                    </div>
                </div>
            </div>

            <p className="py-3 text-center text-sm">
                © 2026 Kurio. Propriedade digital para todos.
            </p>
        </footer>
    )
}