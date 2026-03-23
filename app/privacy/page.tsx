import HomeHeader from "../components/home/HomeHeader"
import HomeFooter from "../components/home/HomeFooter"
import PrivacyPolicy from "../components/PrivacyPolicy"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />
      <main><PrivacyPolicy /></main>
      <HomeFooter />
    </div>
  )
}
