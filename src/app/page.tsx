import { TopNav } from "@/components/layout/TopNav";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CustomersSection } from "@/components/sections/CustomersSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { FloatingDock } from "@/components/ui/FloatingDock";
import { landingContent } from "@/content/landing";

export default function HomePage() {
  return (
    <main className="relative overflow-x-clip">
      <TopNav nav={landingContent.nav} />
      <HeroSection content={landingContent.hero} />
      <BenefitsSection content={landingContent.benefits} />
      <FeaturesSection content={landingContent.features} />
      <ServicesSection content={landingContent.services} />
      <ProcessSection content={landingContent.process} />
      <ProjectsSection content={landingContent.projects} />
      <CustomersSection content={landingContent.customers} />
      <PricingSection content={landingContent.pricing} />
      <ContactSection content={landingContent.contact} />
      <FAQSection content={landingContent.faq} />
      <FooterSection content={landingContent.footer} />

      <FloatingDock primary={landingContent.floatingActions.getOrb} secondary={landingContent.floatingActions.madeIn} />
    </main>
  );
}
