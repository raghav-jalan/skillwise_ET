import HomeHeader from "../components/home/HomeHeader"
import HomeFooter from "../components/home/HomeFooter"
import TermsOfService from "../components/TermsOfService"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />
      <main><TermsOfService /></main>
      <HomeFooter />
    </div>
  )
}
