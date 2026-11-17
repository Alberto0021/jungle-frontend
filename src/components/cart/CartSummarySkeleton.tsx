import { Skeleton } from '../ui/skeleton'

export default function CartSummarySkeleton() {
    return (
        <div role="status" className="space-y-4">
            <span className="sr-only">Carregando resumo do carrinho…</span>

            <Skeleton className="h-10 w-full" />

            <div className="space-y-3">
                {Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="flex justify-between gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>

            <div className="flex justify-between gap-4 border-t border-[#3b271b] pt-4">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-20" />
            </div>

            <Skeleton className="h-11 w-full rounded-full md:rounded-sm" />
        </div>
    )
}