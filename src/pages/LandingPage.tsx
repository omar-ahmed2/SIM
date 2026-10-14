import React, { useState } from 'react'
import { Navbar } from '../components/landing/Navbar'
import { HeroSection } from '../components/landing/HeroSection'
import { ClinicalImpactSection } from '../components/landing/ClinicalImpactSection'
import { QuadTelemetryBento } from '../components/landing/QuadTelemetryBento'
import { OnboardingStepsSection } from '../components/landing/OnboardingStepsSection'
import { CaregiverTestimonialSection } from '../components/landing/CaregiverTestimonialSection'
import { PrivacySafeguardsSection } from '../components/landing/PrivacySafeguardsSection'
import { FaqSection } from '../components/landing/FaqSection'
import { CtaBannerSection } from '../components/landing/CtaBannerSection'
import { Footer } from '../components/landing/Footer'
import { VideoModal } from '../components/landing/VideoModal'
import type { ClinicianUser } from '../types/auth'

interface LandingPageProps {
  currentUser?: ClinicianUser | null
  onNavigateSignIn?: () => void
  onNavigateSignUp?: () => void
  onNavigateDashboard?: () => void
  onSignOut?: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  onNavigateSignIn,
  onNavigateSignUp,
  onNavigateDashboard,
  onSignOut,
}) => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  const handleOpenDemo = () => setIsDemoModalOpen(true)
  const handleCloseDemo = () => setIsDemoModalOpen(false)

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        onSignInClick={onNavigateSignIn}
        onSignUpClick={onNavigateSignUp}
        onNavigateDashboard={onNavigateDashboard}
        onSignOut={onSignOut}
      />

      {/* Main Semantic Content Area */}
      <main id="main-content" className="flex-1">
        {/* Hero Section with Live Telemetry HUD */}
        <HeroSection id="features" onOpenDemo={handleOpenDemo} />

        {/* Clinical Evidence & Impact Stats */}
        <ClinicalImpactSection />

        {/* 4-Modality Telemetry Bento Architecture */}
        <QuadTelemetryBento />

        {/* Zero-Invasive 4-Step Bedside Deployment */}
        <OnboardingStepsSection />

        {/* Pediatric & Neonatal Human-Centered Care Testimonial */}
        <CaregiverTestimonialSection />

        {/* Responsible AI & Zero-Trust Privacy Safeguards */}
        <PrivacySafeguardsSection />

        {/* Frequently Asked Questions Accordion */}
        <FaqSection />

        {/* Final Conversion CTA Banner */}
        <CtaBannerSection />
      </main>

      {/* Trust & Compliance Footer */}
      <Footer currentUser={currentUser} onNavigateDashboard={onNavigateDashboard} />

      {/* Interactive Demonstration Video Modal */}
      <VideoModal isOpen={isDemoModalOpen} onClose={handleCloseDemo} />
    </div>
  )
}
export default LandingPage
