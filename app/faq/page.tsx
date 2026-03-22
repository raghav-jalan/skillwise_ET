import Header from '../components/Header'
import Footer from '../components/Footer'
import FAQ from '../components/FAQ'

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main>
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
