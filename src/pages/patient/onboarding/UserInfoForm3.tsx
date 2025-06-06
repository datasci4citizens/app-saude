import React, { useState } from "react";
import { Button } from "@/components/forms/button";
import { SelectField } from "@/components/forms/select_input";
import type { ObservationCreate } from "@/api/models/ObservationCreate";
import type { DrugExposureCreate } from "@/api/models/DrugExposureCreate";
import { useHealthConcepts } from "@/utils/conceptLoader";
import { MultiSelectCustom } from "@/components/forms/multi_select_custom";

interface FormData {
  sleepHealth: string;
  physicalExercise: string;
  eatingHabits: string;
  comorbidities: string[];
  medications: string[];
  substanceUse: string[];
}

export interface SubmissionData {
  observations: ObservationCreate[];
  drugExposures: DrugExposureCreate[];
}

interface FormErrors {
  sleepHealth?: string;
  physicalExercise?: string;
  eatingHabits?: string;
  comorbidities?: string;
  medications?: string;
  substanceUse?: string;
  [key: string]: string | undefined;
}

export function UserInfoForm3({
  onSubmit,
}: {
  onSubmit: (data: SubmissionData) => void;
}): JSX.Element {
  const {
    sleepHealthOptions,
    exerciseOptions,
    eatingHabitsOptions,
    comorbiditiesOptions,
    medicationOptions,
    substanceOptions,
    conceptIds,
    isLoading,
    error: fetchError,
  } = useHealthConcepts();

  const [formData, setFormData] = useState<FormData>({
    sleepHealth: "",
    physicalExercise: "",
    eatingHabits: "",
    comorbidities: [],
    medications: [],
    substanceUse: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.sleepHealth) {
      newErrors.sleepHealth = "Saúde de sono é obrigatório";
    }
    if (!formData.physicalExercise) {
      newErrors.physicalExercise = "Exercícios físicos é obrigatório";
    }
    if (!formData.eatingHabits) {
      newErrors.eatingHabits = "Hábitos alimentares é obrigatório";
    }

    return newErrors;
  };

  const transformFormData = (): SubmissionData => {
    const now = new Date().toISOString().split("T")[0];

    // Validate conceptIds exist before using them
    if (!conceptIds) {
      throw new Error("Concept IDs not loaded");
    }

    const observations: ObservationCreate[] = [
      {
        value_as_concept: parseInt(formData.sleepHealth),
        observation_date: now,
        observation_concept: conceptIds.sleepHealth,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported,
      },
      {
        value_as_concept: parseInt(formData.physicalExercise),
        observation_date: now,
        observation_concept: conceptIds.physicalExercise,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported,
      },
      {
        value_as_concept: parseInt(formData.eatingHabits),
        observation_date: now,
        observation_concept: conceptIds.eatingHabits,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported,
      },
      ...formData.comorbidities.map((conceptId) => ({
        value_as_concept: parseInt(conceptId),
        observation_date: now,
        observation_concept: conceptIds.comorbidities,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported,
      })),
    ];

    const drugExposures: DrugExposureCreate[] = [
      ...formData.medications.map((conceptId) => ({
        drug_exposure_start_date: now,
        drug_exposure_end_date: null,
        stop_reason: null,
        quantity: null,
        interval_hours: null,
        dose_times: null,
        sig: null,
        person: null,
        drug_concept: parseInt(conceptId),
        drug_type_concept: conceptIds.medications,
      })),
      ...formData.substanceUse.map((conceptId) => ({
        drug_exposure_start_date: now,
        drug_exposure_end_date: null,
        stop_reason: null,
        quantity: null,
        interval_hours: null,
        dose_times: null,
        sig: null,
        person: null,
        drug_concept: parseInt(conceptId),
        drug_type_concept: conceptIds.substanceUse,
      })),
    ];

    return { observations, drugExposures };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setErrors({});
      const submissionData = transformFormData();
      onSubmit(submissionData);
    } catch (error) {
      console.error("Error transforming form data:", error);
      setErrors({ sleepHealth: "Erro ao processar dados. Tente novamente." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fetchError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-3 mb-4">
          <p>{fetchError}</p>
        </div>
      )}

      <div className="flex flex-row gap-4 max-[311px]:flex-col w-full">
        <div className="flex-1">
          <SelectField
            id="sleepHealth"
            name="sleepHealth"
            label="Saúde de sono"
            value={formData.sleepHealth}
            onChange={handleChange}
            options={sleepHealthOptions}
            error={errors.sleepHealth}
            isLoading={isLoading}
          />
        </div>
        <div className="flex-1">
          <SelectField
            id="physicalExercise"
            name="physicalExercise"
            label="Exercícios físicos"
            value={formData.physicalExercise}
            onChange={handleChange}
            options={exerciseOptions}
            error={errors.physicalExercise}
            isLoading={isLoading}
          />
        </div>
      </div>

      <SelectField
        id="eatingHabits"
        name="eatingHabits"
        label="Hábitos alimentares"
        value={formData.eatingHabits}
        onChange={handleChange}
        options={eatingHabitsOptions}
        error={errors.eatingHabits}
        isLoading={isLoading}
      />

      <MultiSelectCustom
        id="comorbidities"
        name="comorbidities"
        label="Comorbidades"
        value={formData.comorbidities}
        onChange={(selectedValues) => {
          setFormData(prev => ({ ...prev, comorbidities: selectedValues }));
        }}
        options={comorbiditiesOptions}
        isLoading={isLoading}
        placeholder="Insira suas comorbidades, se houver"
        error={errors.comorbidities}
      />

      <MultiSelectCustom
        id="medications"
        name="medications"
        label="Medicamentos"
        value={formData.medications}
        onChange={(selectedValues) => {
          setFormData(prev => ({ ...prev, medications: selectedValues }));
        }}
        options={medicationOptions}
        isLoading={isLoading}
        placeholder="Busque remédios..."
        error={errors.medications}
      />

      <MultiSelectCustom
        id="substanceUse"
        name="substanceUse"
        label="Substâncias"
        value={formData.substanceUse}
        onChange={(selectedValues) => {
          setFormData(prev => ({ ...prev, substanceUse: selectedValues }));
        }}
        options={substanceOptions}
        isLoading={isLoading}
        placeholder="Busque substâncias..."
        error={errors.substanceUse}
      />

      <Button
        type="submit"
        variant="white"
        className="w-full mt-4 font-['Inter'] font-bold"
        disabled={isLoading}
      >
        CONTINUAR
      </Button>
    </form>
  );
}