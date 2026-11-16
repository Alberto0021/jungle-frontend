import { useState } from 'react'
import type { CatalogFilterValues } from '../nftCatalog'


const collections = [
    ['Arte digital', 33],
    ['Fotografia', 12],
    ['Música', 65],
    ['Arte 3D', 39],
    ['Colecionáveis', 23],
    ['Generativa', 17],
    ['Jogos', 19],
    ['Assinaturas', 13],
    ['Utilidade', 18],
] as const

const networks = [
    ['Ethereum', 119],
    ['Polygon', 78],
    ['Solana', 86],
] as const

const MIN_PRICE = 0.02
const MAX_PRICE = 12.3

const formatPrice = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})

const rangeClassName = [
    'pointer-events-none absolute inset-x-0 top-0 m-0 h-6 w-full appearance-none bg-transparent',
    'focus-visible:z-30 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-primary',
    '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none',
    '[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-grab',
    '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2',
    '[&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-primary',
    '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-3',
    '[&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full',
    '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background',
    '[&::-moz-range-thumb]:bg-primary',
].join(' ')

type CatalogFiltersProps = {
    filters: CatalogFilterValues
    onChange: (filters: CatalogFilterValues) => void
}

type FilterOptionsProps = {
    label: string
    options: readonly (readonly [string, number])[]
    selected: string
    onSelect: (value: string) => void
}

function FilterOptions({
    label,
    options,
    selected,
    onSelect,
}: FilterOptionsProps) {
    return (
        <fieldset>
            <legend className="text-lg font-bold">{label}</legend>

            <ul className="mt-2">
                {options.map(([name, count]) => (
                    <li key={name}>
                        <button
                            type="button"
                            aria-pressed={selected === name}
                            onClick={() => onSelect(selected === name ? '' : name)}
                            className={`flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 px-3 text-left text-sm hover:text-primary ${selected === name
                                ? 'text-primary'
                                : 'text-muted-foreground'
                                }`}
                        >
                            <span>{name}</span>
                            <span>({count})</span>
                        </button>
                    </li>
                ))}
            </ul>
        </fieldset>
    )
}

export default function CatalogFilters({
    filters,
    onChange,
}: CatalogFiltersProps) {
    const [minPrice, setMinPrice] = useState(filters.minPrice)
    const [maxPrice, setMaxPrice] = useState(filters.maxPrice)

    return (
        <form
            className="space-y-8 bg-[#251710] p-5"
            onSubmit={(event) => {
                event.preventDefault()
                onChange({ ...filters, minPrice, maxPrice })
            }}
        >
            <FilterOptions
                label="Coleções"
                options={collections}
                selected={filters.collection}
                onSelect={(collection) => onChange({ ...filters, collection })}
            />

            <fieldset>
                <legend className="text-lg font-bold">Faixa de preço</legend>

                <div className="mt-2 grid gap-2 px-3">
                    <div className="relative flex h-6 items-center">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-2 h-[3px] rounded-full bg-primary"
                        />

                        <input
                            type="range"
                            aria-label="Preço mínimo em ETH"
                            aria-valuetext={`${formatPrice.format(minPrice)} ETH`}
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            step={0.01}
                            value={minPrice}
                            onChange={(event) =>
                                setMinPrice(
                                    Math.min(event.currentTarget.valueAsNumber, maxPrice),
                                )
                            }
                            className={`${rangeClassName} ${minPrice === MAX_PRICE ? 'z-20' : 'z-0'
                                }`}
                        />

                        <input
                            type="range"
                            aria-label="Preço máximo em ETH"
                            aria-valuetext={`${formatPrice.format(maxPrice)} ETH`}
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            step={0.01}
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(
                                    Math.max(event.currentTarget.valueAsNumber, minPrice),
                                )
                            }
                            className={`${rangeClassName} z-10`}
                        />
                    </div>

                    <p className="text-sm">
                        Preço: {formatPrice.format(minPrice)} –{' '}
                        {formatPrice.format(maxPrice)} ETH
                    </p>

                    <button
                        type="submit"
                        className="w-fit cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
                    >
                        Aplicar
                    </button>
                </div>
            </fieldset>

            <FilterOptions
                label="Rede"
                options={networks}
                selected={filters.network}
                onSelect={(network) => onChange({ ...filters, network })}
            />
        </form>
    )
}