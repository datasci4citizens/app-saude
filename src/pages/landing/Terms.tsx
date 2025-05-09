import { Button } from "@/components/forms/button";

interface TermsScreenProps {
  onNext: () => void;
}

const TermsScreen: React.FC<TermsScreenProps> = ({ onNext }) => {
  return (
    <div className="onboarding-screen terms-screen">
      <div className="content">
        <h1>Termos e condições</h1>

        <div className="terms-text">
          <p>
            1.1- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Curabitur neque justo, lobortis ut tristique vitae, suscipit et
            nibh. Vestibulum interdum pulvinar lectus. Curabitur sagittis tortor
            ut nibh ullamcorper, in pellentesque orci ultrices. Phasellus dictum
            elit mi, sagittis sed ipsum sollicitudin, vulputate rhoncus elit.
            Duis venenatis egestas ligula, ut amet interdum sem rhoncus id. Cras
            congue tortor eu luctus lobortis. Phasellus consectetur bibendum
            libero, quis sagittis odio volutpat sit amet. Cras sit amet
            ultricies lectus.
          </p>

          <p>
            1.2- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Curabitur neque justo, lobortis ut tristique vitae, suscipit et
            nibh. Vestibulum interdum pulvinar lectus. Curabitur sagittis tortor
            ut nib ligula, sit amet interdum sem rhoncus id. Cras congue tortor
            eu luctus lobortis. Phalsipat sit amet. Cras si
          </p>
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
