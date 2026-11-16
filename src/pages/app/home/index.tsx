import Footer from '../../../components/footer'
import Header from '../../../components/header'
import Hero from '../../../components/hero'
import MintJournal from '../../../components/mintJournal'
import NftCatalog from '../../../components/nftCatalog'
import NftPromos from '../../../components/nftPromos'



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