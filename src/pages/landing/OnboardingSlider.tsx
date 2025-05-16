import { useState } from "react";
import LandingScreen from "./Landing";
import TermsScreen from "./Terms";
import EntryOptionsScreen from "./EntryOption";
import "./landing.css";

const OnboardingSlider = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handleNext = () => {
    if (currentStep < 2 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAnimating(false);
      }, 500);
    }
  };

  const handleComplete = (userType: string) => {
    if (userType == "professional") {
      window.location.href = "/forms-prof";
    } else {
      window.location.href = "/forms-user";
    }
  };

  return (
    <div className="onboarding-slider">
      <div className="slider-background" />

      <div
        className="slider-container"
        style={{ transform: `translateY(-${currentStep * (100 / 3)}%)` }}
      >
        <LandingScreen onNext={handleNext} />
        <TermsScreen onNext={handleNext} />
        <EntryOptionsScreen onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default OnboardingSlider;
