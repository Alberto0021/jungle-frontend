import heroImage from '../../assets/macacoDeOculos.png'

export default function Hero() {
    return (
        <section
            aria-labelledby="hero-title"
            className="mx-auto grid max-w-[1200px] gap-8 px-4 pt-8 md:grid-cols-[minmax(0,1fr)_min(40%,450px)] xl:grid-cols-[600px_450px] xl:justify-between xl:gap-0 xl:pl-10 xl:pr-0"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
            <div className="relative min-w-0 md:pb-16 md:pt-10">
                <p className="text-[14px] font-medium leading-4 tracking-[1.4px]">
                    Bem-vindo à Kurio
                </p>

                <h1
                    id="hero-title"
                    className="mt-3 text-[32px] font-bold leading-tight xl:text-[43px] xl:leading-[70px]"
                >
                    SEJA DONO DO FUTURO
                    <br className="hidden xl:block" />{' '}
                    DA ARTE DIGITAL
                </h1>

                <p className="max-w-[560px] text-[14px] leading-6 text-muted-foreground">
                    Descubra NFTs selecionados de criadores emergentes e consagrados.
                    Colecione arte digital rara, apoie artistas e tenha uma parte da
                    cultura da internet.
                </p>

                <a
                    href="#catalogo"
                    className="mt-8 inline-flex h-10 w-[140px] items-center justify-center rounded-[6px] bg-primary text-[16px] font-bold text-primary-foreground"
                >
                    EXPLORAR
                </a>

                <div
                    aria-hidden="true"
                    className="mt-6 flex gap-2 md:absolute md:right-0 md:bottom-[42px] md:mt-0"
                >
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="size-2 rounded-full bg-primary" />
                </div>
            </div>

            <img
                src={heroImage}
                alt="Macaco de óculos escuros e jaqueta verde"
                width={450}
                height={450}
                className="block aspect-square h-auto w-full max-w-[450px] rounded-[24px] object-cover"
            />
        </section>
    )
}