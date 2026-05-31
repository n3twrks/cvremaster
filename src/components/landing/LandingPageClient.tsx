'use client'

import NavBar from './landing-sections/NavBar'
import HeroSection from './landing-sections/HeroSection'
import HowItWorksSection from './landing-sections/HowItWorksSection'
import TemplateShowcaseSection from './landing-sections/TemplateShowcaseSection'
import FeaturesSection from './landing-sections/FeaturesSection'
import TryItNowSection from './landing-sections/TryItNowSection'
import WhySection from './landing-sections/WhySection'
import CTABannerSection from './landing-sections/CTABannerSection'
import FooterSection from './landing-sections/FooterSection'

export default function LandingPageClient() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <NavBar />
      <HeroSection />
      <HowItWorksSection />
      <TemplateShowcaseSection />
      <FeaturesSection />
      <TryItNowSection />
      <WhySection />
      <CTABannerSection />
      <FooterSection />
    </div>
  )
}
