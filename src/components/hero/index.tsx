import heroImage from '../../assets/macacoDeOculos.png'

export default function Hero() {
    return (
        <section
            aria-labelledby="hero-title"
            className="mx-5 mt-3 grid max-w-[1200px] grid-cols-[minmax(0,1fr)_38%] items-center gap-3 rounded-3xl bg-[linear-gradient(135deg,#68452c,#251710)] px-3 py-3 md:mx-auto md:mt-0 md:grid-cols-[minmax(0,1fr)_min(40%,450px)] md:gap-8 md:rounded-none md:bg-none md:px-4 md:pb-0 md:pt-8 xl:grid-cols-[600px_450px] xl:justify-between xl:gap-0 xl:pl-10 xl:pr-0"
            style={{ fontFamily: '"Roboto Mono", monospace' }}
        >
            <div className="relative min-w-0 md:pb-16 md:pt-10">
                <p className="text-[14px] font-medium leading-4 tracking-[1.4px]">
                    Bem-vindo à Kurio
                </p>

                <h1
                    id="hero-title"
                    className="mt-1 text-base font-bold leading-tight md:mt-3 md:text-[32px] xl:text-[43px] xl:leading-[70px]"
                >
                    <span className="md:hidden">SEJA DONO DA CULTURA DIGITAL</span>
                    <span className="hidden md:inline">
                        SEJA DONO DO FUTURO
                        <br className="hidden xl:block" />{' '}
                        DA ARTE DIGITAL
                    </span>
                </h1>

                <p className="max-w-[560px] text-[11px] leading-4 text-muted-foreground md:text-[14px] md:leading-6">
                    <span className="md:hidden">
                        Descubra NFTs selecionados de criadores do mundo todo.
                    </span>
                    <span className="hidden md:inline">
                        Descubra NFTs selecionados de criadores emergentes e consagrados.
                        Colecione arte digital rara, apoie artistas e tenha uma parte da
                        cultura da internet.
                    </span>
                </p>

                <a
                    href="#catalogo"
                    className="mt-1 inline-flex text-xs font-bold text-primary md:mt-8 md:h-10 md:w-[140px] md:items-center md:justify-center md:rounded-[6px] md:bg-primary md:text-[16px] md:text-primary-foreground"
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