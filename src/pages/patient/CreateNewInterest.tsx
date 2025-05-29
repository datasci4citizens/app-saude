import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";

interface FormData {
  custom_interest_name: string;
  value_as_string: string;
}

interface FormErrors {
  custom_interest_name?: string;
  value_as_string?: string;
}

export default function CreateNewInterest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    custom_interest_name: "",
    value_as_string: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.custom_interest_name.trim()) {
      newErrors.custom_interest_name = "Nome do interesse é obrigatório";
    } else if (formData.custom_interest_name.trim().length < 3) {
      newErrors.custom_interest_name = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.value_as_string.trim()) {
      newErrors.value_as_string = "Descrição é obrigatória";
    } else if (formData.value_as_string.trim().length < 10) {
      newErrors.value_as_string = "Descrição deve ter pelo menos 10 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create custom interest area
      const newInterestArea: InterestArea = {
        observation_concept_id: null, // Custom interests don't have a predefined concept ID
        custom_interest_name: formData.custom_interest_name.trim(),
        value_as_string: formData.value_as_string.trim(),
        triggers: []
      };

      await InterestAreasService.personInterestAreasCreate(newInterestArea);
      
      // Navigate back to main page on success
      navigate("/user-main-page");
    } catch (error) {
      console.error("Error creating custom interest:", error);
      setSubmitError("Erro ao criar interesse personalizado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/user-main-page");
  };

  return (
    <div className="bg-primary h-full" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        title="Criar Interesse Personalizado"
        showBackButton={true}
        onBackClick={handleBack}
      />

      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Error message */}
          {submitError && (
            <div className="p-3 bg-destructive bg-opacity-10 border border-destructive text-white rounded-md">
              <p>{submitError}</p>
            </div>
          )}

          {/* Custom Interest Name */}
          <TextField
            id="custom_interest_name"
            name="custom_interest_name"
            label="Nome do Interesse"
            value={formData.custom_interest_name}
            onChange={handleChange}
            placeholder="Ex: Saúde Mental, Nutrição Esportiva"
            error={errors.custom_interest_name}
            helperText="Dê um nome claro e conciso para seu interesse"
          />

          {/* Description */}
          <TextField
            id="value_as_string"
            name="value_as_string"
            label="Descrição"
            value={formData.value_as_string}
            onChange={handleChange}
            placeholder="Descreva detalhadamente seu interesse..."
            error={errors.value_as_string}
            helperText="Explique o que você gostaria de acompanhar ou aprender"
          />

          {/* Information box */}
          <div className="p-4 bg-gray1 bg-opacity-20 border border-gray2 rounded-md">
            <p className="text-typography text-sm">
              <strong>Dica:</strong> Interesses personalizados permitem que você 
              acompanhe tópicos específicos que não estão nas opções padrão. 
              Seu profissional de saúde poderá ver este interesse e fornecer 
              informações relevantes.
            </p>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            variant="white"
            className="w-full mt-4 font-inter font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "CRIANDO..." : "CRIAR INTERESSE"}
          </Button>
        </form>
      </div>
    </div>
  );
}