import Footer from '../../../components/footer/Footer'
import Header from '../../../components/header/Header'
import Hero from '../../../components/hero/Hero'
import MintJournal from '../../../components/mintJournal/MintJournal'
import NftCatalog from '../../../components/nftCatalog/NftCatalog'
import NftPromos from '../../../components/nftPromos/NftPromos'


export default function Home() {
    return (
        <>
            <Header />

            <main>
                <Hero />
                <NftCatalog />
                <NftPromos />
                <MintJournal />
            </main>

            <Footer />
        </>
    )
}