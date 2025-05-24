import React from "react";
import { useState } from "react";
import { Button } from "@/components/forms/button";
import { TextField } from "@/components/forms/text_input";
import { DateField } from "@/components/forms/date_input";
import type { ProviderCreate } from "@/api/models/ProviderCreate";

// Define types for form data - extends Provider with additional UI fields
interface ProviderFormData extends Partial<ProviderCreate> {
  //
}

interface FormErrors {
  social_name?: string;
  professional_registration?: string;
  birth_datetime?: string;
  specialty_concept?: string;
  [key: string]: string | undefined;
}

export function ProfessionalInfoForm({
  onSubmit,
}: {
  onSubmit: (data: ProviderFormData) => void;
}): JSX.Element {
  // Temporary concept ID for ACS (Community Health Agent)
  const ACS_CONCEPT_ID = 32578; // Provisional ID for ACS

  const [formData, setFormData] = useState<ProviderFormData>({
    social_name: "",
    professional_registration: null,
    birth_datetime: "",
    specialty_concept: ACS_CONCEPT_ID,
    care_site: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Validate CNES format (7 digits)
  const validateCNES = (cnes: string): boolean => {
    // Remove any non-digit characters
    const cleanCNES = cnes.replace(/\D/g, '');
    
    // CNES should have exactly 7 digits
    return cleanCNES.length === 7 && /^\d{7}$/.test(cleanCNES);
  };

  // Format CNES display (optional - adds visual separation)
  const formatCNES = (value: string): string => {
    // Remove any non-digit characters
    const cleanValue = value.replace(/\D/g, '');
    
    // Limit to 7 digits
    if (cleanValue.length <= 7) {
      return cleanValue;
    }
    return cleanValue.slice(0, 7);
  };

  // Handle input change
  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;

    // Handle CNES registration number
    if (name === "professional_registration") {
      const formattedCNES = formatCNES(value);
      setFormData({
        ...formData,
        [name]: formattedCNES ? Number(formattedCNES) : null,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Handle date change
  const handleDateChange = (value: string) => {
    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(datePattern);

    if (match) {
      const [_, day, month, year] = match;
      const isoDate = `${year}-${month}-${day}`;
      setFormData({ ...formData, birth_datetime: isoDate });
    } else {
      setFormData({ ...formData, birth_datetime: value });
    }

    if (errors.birth_datetime) {
      setErrors({ ...errors, birth_datetime: undefined });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required CNES validation
    if (!formData.professional_registration) {
      newErrors.professional_registration = "CNES é obrigatório";
    } else {
      const cnesString = formData.professional_registration.toString();
      if (!validateCNES(cnesString)) {
        newErrors.professional_registration = "CNES deve ter exatamente 7 dígitos";
      }
    }

    // Optional validation for date if provided
    if (formData.birth_datetime) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(formData.birth_datetime)) {
        newErrors.birth_datetime = "Formato de data inválido";
      }
    }

    return newErrors;
  };

  // Get display date format DD/MM/YYYY
  const getDisplayDate = () => {
    if (!formData.birth_datetime) return "";

    // Check if already in DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(formData.birth_datetime)) {
      return formData.birth_datetime;
    }

    // Convert from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = formData.birth_datetime.split("-");
    return day && month && year ? `${day}/${month}/${year}` : "";
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear errors on successful validation
    setErrors({});

    // Create a ProviderCreate-compatible object
    const finalData: ProviderFormData = {
      social_name: formData.social_name,
      birth_datetime: formData.birth_datetime,
      professional_registration: formData.professional_registration,
      specialty_concept: ACS_CONCEPT_ID,
      care_site: formData.care_site,
    };

    // Submit form data
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <TextField
        id="social_name"
        name="social_name"
        label="Nome social (opcional) caso seja diferente do civil"
        value={formData.social_name || ""}
        onChange={handleChange}
        placeholder=""
        error={errors.social_name}
      />

      <DateField
        id="birth_datetime"
        name="birth_datetime"
        label="Data de nascimento"
        value={getDisplayDate()}
        onChange={handleDateChange}
        error={errors.birth_datetime}
      />

      <TextField
        id="professional_registration"
        name="professional_registration"
        label="Número CNES"
        value={formData.professional_registration?.toString() || ""}
        onChange={handleChange}
        placeholder="1234567"
        error={errors.professional_registration}
        type="text"
        helperText="Cadastro Nacional de Estabelecimentos de Saúde (7 dígitos)"
      />

      {/* Informative text about CNES and ACS role */}
      <div className="mb-4 p-3 bg-gray1 bg-opacity-20 border border-gray2 rounded-md">
        <p className="text-typography text-sm">
          <strong>CNES</strong> é o registro oficial do Sistema Único de Saúde (SUS). 
          Você está se cadastrando como <strong>Agente Comunitário de Saúde (ACS)</strong>.
        </p>
        <p className="text-gray2 text-xs mt-1">
          Se você não possui CNES, consulte sua coordenação ou unidade de saúde.
        </p>
      </div>

      <Button
        type="submit"
        variant="white"
        className="w-full mt-4 font-inter font-bold"
      >
        CONTINUAR
      </Button>
    </form>
  );
}