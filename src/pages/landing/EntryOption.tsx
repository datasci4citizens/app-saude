import { Button } from "@/components/forms/button";
import { SelectableOption } from "@/components/ui/selectable-button";
import { useState } from "react";

const EntryOptionsScreen = ({ onComplete }) => {
  const [userType, setUserType] = useState("");

  const handleContinue = () => {
    if (userType) {
      onComplete(userType);
    }
  };

  return (
    <div className="onboarding-screen entry-options-screen">
      <div className="content">
        <h1>Entrar como:</h1>

        <div className="options-container flex flex-col items-center gap-3 w-full">
          <SelectableOption
            label="Usuário/paciente"
            selected={userType === "patient"}
            onClick={() => setUserType("patient")}
          />

          <SelectableOption
            label="Profissional de saúde ou ACS"
            selected={userType === "professional"}
            onClick={() => setUserType("professional")}
          />
        </div>

        <Button
          type="submit"
          variant="white"
          onClick={handleContinue}
          className="w-full mt-4 font-['Inter'] font-bold button-bottom"
        >
          CONTINUAR
        </Button>

        <div className="progress-indicator">
          <div className="indicator" />
          <div className="indicator" />
          <div className="indicator active" />
        </div>
      </div>
    </div>
  );
};

export default EntryOptionsScreen;
