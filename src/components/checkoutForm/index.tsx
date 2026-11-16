const fieldClass =
    'mt-1 block w-full rounded-sm border border-[#3b271b] bg-transparent px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground'

const textFields = [
    { name: 'displayName', label: 'Nome de exibição', required: true },
    { name: 'username', label: 'Nome de usuário', required: true },
] as const

export default function CheckoutForm() {
    return (
        <section aria-labelledby="collector-profile-title">
            <h2 id="collector-profile-title" className="mb-3 text-sm font-bold">
                Perfil do colecionador
            </h2>

            <div className="grid gap-x-5 gap-y-4 text-xs sm:grid-cols-2">
                {textFields.map(({ name, label, required }) => (
                    <label key={name}>
                        {label}<span className="text-primary">*</span>
                        <input name={name} className={fieldClass} required={required} />
                    </label>
                ))}

                <label>
                    Rede<span className="text-primary">*</span>
                    <select name="network" className={fieldClass} required defaultValue="">
                        <option className="bg-background" value="" disabled>Selecione uma rede</option>
                        <option className="bg-background" value="ethereum">Ethereum</option>
                        <option className="bg-background" value="polygon">Polygon</option>
                        <option className="bg-background" value="base">Base</option>
                    </select>
                </label>

                <label>
                    Link do perfil<span className="text-primary">*</span>
                    <input name="profileUrl" type="url" className={fieldClass} required />
                </label>

                <label>
                    Endereço da carteira<span className="text-primary">*</span>
                    <input
                        name="walletAddress"
                        className={fieldClass}
                        placeholder="Endereço da carteira"
                        required
                    />
                </label>

                <label>
                    Carteira secundária
                    <input
                        name="secondaryWallet"
                        className={fieldClass}
                        placeholder="ENS ou carteira secundária (opcional)"
                    />
                </label>

                <label>
                    Tipo de carteira<span className="text-primary">*</span>
                    <select name="walletType" className={fieldClass} required defaultValue="">
                        <option className="bg-background" value="" disabled>Selecione uma carteira</option>
                        <option className="bg-background" value="browser">Carteira do navegador</option>
                        <option className="bg-background" value="mobile">Carteira móvel</option>
                        <option className="bg-background" value="hardware">Carteira física</option>
                    </select>
                </label>

                <label>
                    Código de indicação<span className="text-primary">*</span>
                    <input name="referralCode" className={fieldClass} required />
                </label>

                <label>
                    E-mail<span className="text-primary">*</span>
                    <input name="email" type="email" autoComplete="email" className={fieldClass} required />
                </label>

                <label>
                    Nome ENS<span className="text-primary">*</span>
                    <div className="mt-1 flex gap-2">
                        <input
                            aria-label="Nome ENS"
                            name="ensName"
                            className={`${fieldClass} mt-0 min-w-0`}
                            required
                        />
                        <span className="grid shrink-0 place-items-center rounded-sm border border-[#3b271b] px-3">
                            .eth
                        </span>
                    </div>
                </label>

                <label className="flex items-center gap-2 sm:col-span-2">
                    <input name="useAnotherWallet" type="checkbox" className="accent-[#d99152]" />
                    Usar outra carteira?
                </label>

                <label>
                    Observação do colecionador (opcional)
                    <textarea name="notes" rows={6} className={`${fieldClass} resize-y`} />
                </label>
            </div>
        </section>
    )
}