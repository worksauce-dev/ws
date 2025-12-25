import { useState, useEffect } from "react";

const ONBOARDING_COMPLETED_KEY = "worksauce_onboarding_completed";

export function useOnboardingTour() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if onboarding has been completed before
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_COMPLETED_KEY);

    if (!hasCompletedOnboarding) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const completeTour = () => {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    setShowTour(false);
  };

  const skipTour = () => {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
    setShowTour(true);
  };

  return {
    showTour,
    completeTour,
    skipTour,
    resetTour,
  };
}
