import { LandingHeader } from "@/features/landing/components/layout/LandingHeader";
import { HeroSection } from "@/features/landing/components/sections/HeroSection";
import { LandingFooter } from "@/features/landing/components/layout/LandingFooter";
import { usePageSEO, WORKSAUCE_SEO_PRESETS } from "@/shared/hooks/usePageSEO";

export const LandingPage = () => {
  usePageSEO(WORKSAUCE_SEO_PRESETS.landing);
  return (
    <div className="min-h-screen">
      {/* 고정 헤더 */}
      <LandingHeader />

      {/* 메인 콘텐츠 */}
      <main>
        <HeroSection />

        {/* 추후 추가될 섹션들 */}
        {/* <FeaturesSection /> */}
        {/* <PricingSection /> */}
        {/* <TestimonialSection /> */}
        {/* <CTASection /> */}
      </main>

      <LandingFooter />
    </div>
  );
};
