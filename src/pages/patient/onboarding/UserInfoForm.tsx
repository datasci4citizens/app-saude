import React, { useState, useEffect } from "react";
import { Button } from "@/components/forms/button";
import { TextField } from "@/components/forms/text_input";
import { SelectField } from "@/components/forms/select_input";
import { DateField } from "@/components/forms/date_input";
import type { PersonCreate } from "@/api/models/PersonCreate";
import { useDemographicConcepts } from "@/utils/conceptLoader";

interface UserFormData extends Partial<PersonCreate> {
  social_name: string | null;
  birth_datetime: string | null;
  gender_concept: number | null;
  race_concept: number | null;
  weight: number | null;
  height: number | null;
}

interface FormErrors {
  social_name?: string;
  gender_concept?: string;
  weight?: string;
  height?: string;
  birth_datetime?: string;
  race_concept?: string;
  [key: string]: string | undefined;
}

export function UserInfoForm({
  onSubmit,
}: {
  onSubmit: (data: UserFormData) => void;
}): JSX.Element {
  const {
    genderOptions,
    raceOptions,
    isLoading: isLoadingConcepts,
    error: conceptError,
  } = useDemographicConcepts();

  const [formData, setFormData] = useState<UserFormData>({
    social_name: "",
    gender_concept: null,
    weight: null,
    height: null,
    birth_datetime: "",
    race_concept: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;

    let processedValue: string | number | null = value;

    // Convert numeric fields to numbers, handle empty strings
    if (["gender_concept", "race_concept", "weight", "height"].includes(name)) {
      processedValue = value === "" ? null : Number(value);
      // Validate that the conversion was successful for required numeric fields
      if (value !== "" && isNaN(processedValue as number)) {
        return; // Don't update state with invalid numeric values
      }
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateChange = (value: string) => {
    // Accept various date formats and normalize them
    let normalizedDate = value;
    
    // Check if input is in DD/MM/YYYY format
    const ddmmyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = value.match(ddmmyyyyPattern);

    if (match) {
      const [, day, month, year] = match;
      // Ensure day and month exist before padding
      if (day && month && year) {
        const paddedDay = day.padStart(2, '0');
        const paddedMonth = month.padStart(2, '0');
        normalizedDate = `${year}-${paddedMonth}-${paddedDay}`;
      }
    }

    setFormData(prev => ({ ...prev, birth_datetime: normalizedDate }));

    if (errors.birth_datetime) {
      setErrors(prev => ({ ...prev, birth_datetime: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.social_name?.trim()) {
      newErrors.social_name = "Nome social é obrigatório";
    }
    
    if (formData.gender_concept === null) {
      newErrors.gender_concept = "Gênero é obrigatório";
    }
    
    if (formData.race_concept === null) {
      newErrors.race_concept = "Cor/Raça é obrigatório";
    }

    // Date validation
    if (!formData.birth_datetime?.trim()) {
      newErrors.birth_datetime = "Data de nascimento é obrigatória";
    } else {
      const date = new Date(formData.birth_datetime);
      const today = new Date();
      
      if (isNaN(date.getTime())) {
        newErrors.birth_datetime = "Data inválida";
      } else if (date > today) {
        newErrors.birth_datetime = "Data não pode ser no futuro";
      } else if (date < new Date('1900-01-01')) {
        newErrors.birth_datetime = "Data muito antiga";
      }
    }

    // Optional numeric field validation
    if (formData.weight !== null && (formData.weight <= 0 || formData.weight > 1000)) {
      newErrors.weight = "Peso deve estar entre 1 e 1000 kg";
    }

    if (formData.height !== null && (formData.height <= 0 || formData.height > 300)) {
      newErrors.height = "Altura deve estar entre 1 e 300 cm";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {conceptError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
          <p>{conceptError}</p>
        </div>
      )}

      <TextField
        id="social_name"
        name="social_name"
        label="Nome social"
        value={formData.social_name || ""}
        onChange={handleChange}
        placeholder="Como prefere ser chamado(a)"
        helperText="Apenas para caso de uso interno, não compartilharemos com terceiros"
        error={errors.social_name}
        required
      />

      <SelectField
        id="gender_concept"
        name="gender_concept"
        label="Gênero"
        value={formData.gender_concept !== null ? formData.gender_concept.toString() : ""}
        onChange={handleChange}
        options={genderOptions}
        error={errors.gender_concept}
        isLoading={isLoadingConcepts}
      />

      <div className="flex flex-row gap-4 max-[294px]:flex-col">
        <TextField
          id="weight"
          name="weight"
          type="number"
          label="Peso (kg)"
          value={formData.weight !== null ? formData.weight.toString() : ""}
          onChange={handleChange}
          error={errors.weight}
          min="1"
          max="1000"
          step="0.1"
        />

        <TextField
          id="height"
          name="height"
          type="number"
          label="Altura (cm)"
          value={formData.height !== null ? formData.height.toString() : ""}
          onChange={handleChange}
          error={errors.height}
          min="1"
          max="300"
          step="1"
        />
      </div>

      <DateField
        id="birth_datetime"
        name="birth_datetime"
        label="Data de nascimento"
        value={formData.birth_datetime || ""}
        onChange={handleDateChange}
        error={errors.birth_datetime}
      />

      <SelectField
        id="race_concept"
        name="race_concept"
        label="Cor/Raça"
        value={formData.race_concept !== null ? formData.race_concept.toString() : ""}
        onChange={handleChange}
        options={raceOptions}
        error={errors.race_concept}
        isLoading={isLoadingConcepts}
      />

      <Button
        type="submit"
        variant="white"
        className="w-full mt-4 font-['Inter'] font-bold"
        disabled={isLoadingConcepts}
      >
        CONTINUAR
      </Button>
    </form>
  );
}
