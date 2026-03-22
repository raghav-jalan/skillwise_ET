import HomeHeader from "../components/home/HomeHeader"
import HomeFooter from "../components/home/HomeFooter"
import HelpCenter from "../components/HelpCenter"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />
      <main><HelpCenter /></main>
      <HomeFooter />
    </div>
  )
}
