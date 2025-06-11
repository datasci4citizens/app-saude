// components/forms/CustomInterestForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/forms/button";
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import { TextField } from "@/components/forms/text_input";
import { useNavigate } from "react-router-dom";
import BottomNavigationBar from "@/components/ui/navigator-bar";

interface CustomInterestFormProps {
  onSubmit: (interest: {
    title: string;
    category: string;
    impact: string;
  }) => void;
  onCancel: () => void;
}

const CustomInterestForm: React.FC<CustomInterestFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("health");
  const [impact, setImpact] = useState("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title, category, impact });
    }
  };
  const navigate = useNavigate();
  const getActiveNavId = () => {
    if (location.pathname.startsWith("/user-main-page")) return "home";
    if (location.pathname.startsWith("/reminders")) return "meds";
    if (location.pathname.startsWith("/diary")) return "diary";
    if (location.pathname.startsWith("/emergency-user")) return "emergency";
    if (location.pathname.startsWith("/profile")) return "profile";
    return null;
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case "home":
        navigate("/user-main-page");
        break;
      case "meds":
        navigate("/reminders");
        break;
      case "diary":
        navigate("/diary");
        break;
      case "emergency":
        navigate("/emergency-user");
        break;
      case "profile":
        navigate("/profile");
        break;
    }
  };

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7 p-4 pt-2">
      <div className="flex flex-col gap-2">
        <TextField
          id="habit-text"
          name="habit-text"
          label="Qual é o hábito que te faz mal?"
          value={title}
          onChange={handleTextChange}
          placeholder="Ex: Passar muito tempo nas redes sociais"
          error=""
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="block text-sm font-inter font-light text-typography mb-1">
          Qual categoria esse hábito se encaixa?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <RadioCheckbox
            id="category-health"
            label="Saúde"
            checked={category === "health"}
            onCheckedChange={(checked) => {
              if (checked) setCategory("health");
            }}
          />
          <RadioCheckbox
            id="category-mental"
            label="Mental"
            checked={category === "mental"}
            onCheckedChange={(checked) => {
              if (checked) setCategory("mental");
            }}
          />
          <RadioCheckbox
            id="category-productivity"
            label="Produtividade"
            checked={category === "productivity"}
            onCheckedChange={(checked) => {
              if (checked) setCategory("productivity");
            }}
          />
          <RadioCheckbox
            id="category-other"
            label="Outros"
            checked={category === "other"}
            onCheckedChange={(checked) => {
              if (checked) setCategory("other");
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="block text-sm font-inter font-light text-typography mb-1">
          Qual o impacto desse hábito na sua vida?
        </label>
        <div className="flex flex-col gap-2">
          <RadioCheckbox
            id="impact-low"
            label="Baixo - Me incomoda um pouco"
            checked={impact === "low"}
            onCheckedChange={(checked) => {
              if (checked) setImpact("low");
            }}
          />
          <RadioCheckbox
            id="impact-medium"
            label="Médio - Afeta meu dia a dia"
            checked={impact === "medium"}
            onCheckedChange={(checked) => {
              if (checked) setImpact("medium");
            }}
          />
          <RadioCheckbox
            id="impact-high"
            label="Alto - Está prejudicando seriamente minha vida"
            checked={impact === "high"}
            onCheckedChange={(checked) => {
              if (checked) setImpact("high");
            }}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="white"
          size="responsive"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="orange"
          size="responsive"
          disabled={!title.trim()}
        >
          Adicionar
        </Button>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
      </div>
    </form>
  );
};

export default CustomInterestForm;
