import HomeHeader from "../components/home/HomeHeader"
import HomeFooter from "../components/home/HomeFooter"
import PartnersList from "../components/PartnersList"
import PartnerTestimonials from "../components/PartnerTestimonials"

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />
      <main>
        <div className="py-12 border-b border-gray-100">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              Our Partners & Collaborations
            </h1>
            <p className="mt-4 text-base text-gray-600 max-w-2xl mx-auto">
              We work with leading organizations to empower communities through skill development.
            </p>
          </div>
        </div>
        <PartnersList />
        <PartnerTestimonials />
      </main>
      <HomeFooter />
    </div>
  )
}
