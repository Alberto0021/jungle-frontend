import Header from '../../../components/header/Header'
import Hero from '../../../components/hero/Hero'
import NftCatalog from '../../../components/nftCatalog/NftCatalog'


export default function Home() {
    return (
        <>
            <Header />

            <main>
                <Hero />
                <NftCatalog />
            </main>
        </>
    )
}