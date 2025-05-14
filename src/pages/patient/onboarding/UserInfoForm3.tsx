import React, { useState, useEffect } from 'react';
import { Button } from '@/components/forms/button';
import { SelectField } from '@/components/forms/select_input';
import type { ObservationCreate } from '@/api/models/ObservationCreate';
import type { DrugExposureCreate } from '@/api/models/DrugExposureCreate';
import {useHealthConcepts} from '@/utils/conceptLoader';
import { MultiSelectCustom } from '@/components/forms/multi_select_custom';

// later create a theme file with css values with methods for getting colors and use them  here
// for easily changing color theme
const customSelectStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#FA6E5A' : '#A0A3B1', // orange when focused, gray_buttons otherwise
    boxShadow: state.isFocused ? '0 0 0 1px #FA6E5A' : provided.boxShadow,
    '&:hover': {
      borderColor: state.isFocused ? '#FA6E5A' : '#A0A3B1'
    }
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#FA6E5A' : state.isFocused ? 'rgba(255, 115, 32, 0.1)' : null,
    color: state.isSelected ? 'white' : provided.color
  })
};

// Define form data interface (user-friendly structure)
// Todos sao conceptIds como String
interface FormData {
  // Esses são selects simples (1 escolha, com concept_id em string)
  sleepHealth: string;
  physicalExercise: string;
  eatingHabits: string;

  // Listas onde cada item tem concept_id + texto
  comorbidities: string[];
  medications: string[];
  substanceUse: string[];
}

// Define the structure for API submission
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

export function UserInfoForm3({onSubmit}: {onSubmit: (data: SubmissionData) => void }): JSX.Element {
  // User-friendly form data
  const {
    sleepHealthOptions,
    exerciseOptions,
    eatingHabitsOptions,
    comorbiditiesOptions,
    medicationOptions,
    substanceOptions,
    conceptIds,
    isLoading,
    error: fetchError
  } = useHealthConcepts();
  
  const [formData, setFormData] = useState<FormData>({
    sleepHealth: '',
    physicalExercise: '',
    eatingHabits: '',
    comorbidities: [],
    medications: [],
    substanceUse: []
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Handle input change
  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.sleepHealth) newErrors.sleepHealth = "Saúde de sono é obrigatório";
    if (!formData.physicalExercise) newErrors.physicalExercise = "Exercícios físicos é obrigatório";
    if (!formData.eatingHabits) newErrors.eatingHabits = "Hábitos alimentares é obrigatório";
    
    return newErrors;
  };
  
  // Transform form data into properly structured API objects
  const transformFormData = (): SubmissionData => {
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    console.log('Form data before transformation:', formData);
    
    // Create observations
    const observations: ObservationCreate[] = [
      // Sleep health observation
      {
        value_as_concept: parseInt(formData.sleepHealth),
        observation_date: now,
        observation_concept: conceptIds.sleepHealth,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported
      },
      // Physical exercise observation
      {
        value_as_concept: parseInt(formData.physicalExercise),
        observation_date: now,
        observation_concept: conceptIds.physicalExercise,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported
      },
      // Eating habits observation
      {
        value_as_concept: parseInt(formData.eatingHabits),
        observation_date: now,
        observation_concept: conceptIds.eatingHabits,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported
      },
      ...formData.comorbidities.map((conceptId) => ({
        value_as_concept: parseInt(conceptId),
        observation_date: now,
        observation_concept: conceptIds.comorbidities,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported
      }))
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
        drug_type_concept: conceptIds.medications
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
        drug_type_concept: conceptIds.substanceUse
      }))
    ];

    console.log('Transformed data for submission:', { observations, drugExposures });
    
    return { observations, drugExposures };
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
    
    // Clear all errors on successful submission
    setErrors({});
    
    // Transform and submit the data
    const submissionData = transformFormData();
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fetchError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-3 mb-4">
          <p>{fetchError}</p>
        </div>
      )}
    
      <div className="flex flex-row gap-4 max-[311px]:flex-wrap w-full">
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
          setFormData({ ...formData, comorbidities: selectedValues });
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
          setFormData({ ...formData, medications: selectedValues });
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
          setFormData({ ...formData, substanceUse: selectedValues });
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