import Header from '../components/Header'
import Footer from '../components/Footer'
import LearningProcess from '../components/LearningProcess'

export default function LearningProcessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main>
        <LearningProcess />
      </main>
      <Footer />
    </div>
  )
}
