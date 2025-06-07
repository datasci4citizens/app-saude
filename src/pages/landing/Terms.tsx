import { Button } from "@/components/forms/button";
import TermsText from "./TermsText";

interface TermsScreenProps {
  onNext: () => void;
}

const TermsScreen: React.FC<TermsScreenProps> = ({ onNext }) => {
  return (
    <div className="onboarding-screen terms-screen">
      <div className="content">
        <h1>Termos e condições</h1>

        <div className="terms-text">
          <TermsText></TermsText>
        </div>
        <Button
          type="submit"
          variant="white"
          onClick={onNext}
          className="w-full mt-4 font-['Inter'] font-bold button-bottom"
        >
          CONTINUAR
        </Button>

        <div className="progress-indicator">
          <div className="indicator" />
          <div className="indicator active" />
          <div className="indicator" />
        </div>
      </div>
    </div>
  );
};

export default TermsScreen;
