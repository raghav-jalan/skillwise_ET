import HomeHeader from "../components/home/HomeHeader"
import HomeFooter from "../components/home/HomeFooter"
import ContactForm from "../components/ContactForm"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />
      <main><ContactForm /></main>
      <HomeFooter />
    </div>
  )
}
