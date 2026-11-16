import CatalogFilters from "../catalogFilters"
import type { CatalogFilterValues } from "../nftCatalog"


type CatalogSidebarProps = {
    filters: CatalogFilterValues
    onChange: (filters: CatalogFilterValues) => void
    featuredImage?: string
}

export default function CatalogSidebar({
    filters,
    onChange,
    featuredImage,
}: CatalogSidebarProps) {
    return (
        <aside aria-label="Filtros e NFT em destaque" className="flex flex-col gap-6">
            <CatalogFilters filters={filters} onChange={onChange} />

            <article className="bg-[#281910]">
                <div className="px-5 pt-6 pb-2">
                    <h2 className="text-xl font-bold text-primary">
                        NFT EM DESTAQUE
                    </h2>
                    <p className="mt-2 text-center text-lg font-bold">
                        OFERTA LIMITADA
                    </p>
                </div>

                {featuredImage && (
                    <img
                        src={featuredImage}
                        alt="Sage Nomad, NFT em destaque"
                        loading="lazy"
                        className="aspect-square w-full rounded-[20px] object-cover"
                    />
                )}
            </article>
        </aside>
    )
}