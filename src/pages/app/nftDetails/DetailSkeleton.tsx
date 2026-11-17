import { Skeleton } from '../../../components/ui/skeleton'

export default function DetailSkeleton() {
    return (
        <section
            role="status"
            className="mx-auto w-[calc(100%_-_2rem)] max-w-[1200px] py-8"
        >
            <span className="sr-only">Carregando detalhe do NFT…</span>

            <div
                aria-hidden="true"
                className="grid items-start gap-6 md:grid-cols-2 md:gap-8"
            >
                <Skeleton className="aspect-square w-full rounded-xl" />

                <div className="space-y-5">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/4" />

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>

                    <Skeleton className="h-11 w-full" />
                </div>
            </div>
        </section>
    )
}