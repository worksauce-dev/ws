import { LandingHeader } from "@/features/landing/components/layout/LandingHeader";
import { HeroSection } from "@/features/landing/components/sections/HeroSection";
import { HowItWorksSection } from "@/features/landing/components/sections/HowItWorksSection";
import { FAQSection } from "@/features/landing/components/sections/FAQSection";
import { LandingFooter } from "@/features/landing/components/layout/LandingFooter";
import { ScrollToTopButton } from "@/features/landing/components/ui/ScrollToTopButton";
import { useMetadata, WORKSAUCE_METADATA_PRESETS } from "@/shared/hooks/useMetadata";

export const LandingPage = () => {
  useMetadata(WORKSAUCE_METADATA_PRESETS.landing);
  return (
    <div className="min-h-screen">
      {/* 고정 헤더 */}
      <LandingHeader />

      {/* 메인 콘텐츠 */}
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FAQSection />

        {/* 추후 추가될 섹션들 */}
        {/* <FeaturesSection /> */}
        {/* <PricingSection /> */}
        {/* <TestimonialSection /> */}
        {/* <CTASection /> */}
      </main>

      <LandingFooter />

      {/* 맨 위로 스크롤 버튼 */}
      <ScrollToTopButton />
    </div>
  );
};
