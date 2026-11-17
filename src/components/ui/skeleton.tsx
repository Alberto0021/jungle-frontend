import type { ComponentProps } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            data-slot="skeleton"
            aria-hidden="true"
            className={twMerge(clsx('kurio-skeleton rounded-md bg-[#302017]', className))}
            {...props}
        />
    )
}

export function NftCatalogSkeleton() {
    return (
        <div role="status">
            <span className="sr-only">Carregando NFTs…</span>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }, (_, index) => (
                    <div key={index} className="space-y-3">
                        <Skeleton className="aspect-square w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                ))}
            </div>
        </div>
    )
}