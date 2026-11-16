import emerald from '../../assets/macacoDeOculos.png'
import neon from '../../assets/macacoDeGola.png'

const promos = [
    {
        image: emerald,
        title: 'Lançamentos gênesis de edição limitada',
        description:
            'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    },
    {
        image: neon,
        title: 'Arte digital selecionada e muito mais',
        description:
            'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
    },
]

function PromoCard({ image, title, description }: (typeof promos)[number]) {
    return (
        <article className="grid overflow-hidden rounded-lg bg-[#251710] sm:grid-cols-[49%_1fr]">
            <img
                src={image}
                alt=""
                loading="lazy"
                className="h-52 w-full rounded-2xl object-cover sm:h-full sm:min-h-[250px]"
            />

            <div className="flex flex-col items-end justify-center px-6 py-6 text-right">
                <h3 className="text-lg leading-6 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
                <a
                    href="#catalogo"
                    aria-label={`Explorar: ${title}`}
                    className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
                >
                    Explorar <span aria-hidden="true">→</span>
                </a>
            </div>
        </article>
    )
}

export default function NftPromos() {
    return (
        <section
            aria-labelledby="nft-promos-title"
            className="mx-auto mt-16 grid w-[calc(100%-2rem)] max-w-[1200px] gap-7 lg:mt-24 lg:grid-cols-2"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
            <h2 id="nft-promos-title" className="sr-only">
                Destaques do catálogo
            </h2>

            {promos.map((promo) => (
                <PromoCard key={promo.title} {...promo} />
            ))}
        </section>
    )
}