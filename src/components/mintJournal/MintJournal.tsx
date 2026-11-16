import neon from '../../assets/macacoDeGola.png'
import emerald from '../../assets/macacoDeOculos.png'
import sage from '../../assets/macacoDeChapeu.png'
import headset from '../../assets/macacoDeHead.png'

const articles = [
    {
        image: neon,
        date: '12 de setembro',
        minutes: 6,
        title: 'Como funciona a propriedade de NFTs',
        description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
        body: 'O registro de um NFT indica qual carteira detém o token. Antes de negociar, verifique o endereço do contrato, a coleção e os direitos associados à obra.',
    },
    {
        image: emerald,
        date: '13 de setembro',
        minutes: 2,
        title: '10 artistas digitais para acompanhar',
        description: 'Conheça criadores que moldam a cultura digital.',
        body: 'Ao descobrir um artista, compare o portfólio, o histórico de publicações e os canais oficiais. Isso ajuda a encontrar as coleções originais e acompanhar novos trabalhos.',
    },
    {
        image: sage,
        date: '15 de setembro',
        minutes: 3,
        title: 'Raridade, atributos e procedência',
        description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
        body: 'A raridade descreve a frequência de um atributo dentro da coleção. A procedência diz respeito ao histórico do item, e os direitos sobre a obra dependem da licença.',
    },
    {
        image: headset,
        date: '15 de setembro',
        minutes: 2,
        title: 'Como proteger sua carteira',
        description: 'Proteja sua carteira, seus ativos e sua identidade.',
        body: 'Guarde a frase de recuperação em um lugar seguro, nunca a compartilhe e confira o endereço do site antes de conectar a carteira ou assinar uma transação.',
    },
]

function JournalCard({
    image,
    date,
    minutes,
    title,
    description,
    body,
}: (typeof articles)[number]) {
    return (
        <article className="h-full overflow-hidden rounded-lg bg-[#251710]">
            <img
                src={image}
                alt=""
                loading="lazy"
                className="aspect-[11/8] w-full object-cover"
            />

            <div className="p-4">
                <p className="text-xs leading-4 text-muted-foreground">
                    {date} <span aria-hidden="true"> | </span> Leitura de {minutes} min
                </p>

                <h3 className="mt-2 text-base leading-5 font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-4 text-muted-foreground">
                    {description}
                </p>

                <details className="mt-2 text-xs leading-5">
                    <summary className="w-fit cursor-pointer list-none font-medium text-primary [&::-webkit-details-marker]:hidden">
                        Ler mais <span aria-hidden="true">→</span>
                    </summary>
                    <p className="mt-2 text-muted-foreground">{body}</p>
                </details>
            </div>
        </article>
    )
}

export default function MintJournal() {
    return (
        <section
            aria-labelledby="mint-journal-title"
            className="mx-auto mt-16 w-[calc(100%-2rem)] max-w-[1200px] pb-16 lg:mt-24"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
            <header className="text-center">
                <h2 id="mint-journal-title" className="text-2xl font-bold sm:text-[28px]">
                    Diário da Cunhagem
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                    Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
                </p>
            </header>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {articles.map((article) => (
                    <JournalCard key={article.title} {...article} />
                ))}
            </div>
        </section>
    )
}