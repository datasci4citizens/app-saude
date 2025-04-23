import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text_input';
import { SelectField } from '@/components/ui/select_input';

// Define types for form data and errors
interface FormData {
  sleepHealth: string;
  physicalExercise: string;
  eatingHabits: string;
  comorbidities: string;
  medications: string;
  substanceUse: string;
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

export function UserInfoForm3({onSubmit}: {onSubmit: (data: FormData) => void }): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    sleepHealth: '',
    physicalExercise: '',
    eatingHabits: '',
    comorbidities: '',
    medications: '',
    substanceUse: '',
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
    
    // Submit if no errors
    onSubmit(formData);
  };
  
  // Options for dropdowns
  const sleepHealthOptions = [
    { value: "boa", label: "Durmo bem" },
    { value: "regular", label: "Durmo razoavelmente" },
    { value: "ruim", label: "Durmo mal" }
  ];
  
  const exerciseOptions = [
    { value: "regularmente", label: "Regularmente" },
    { value: "ocasionalmente", label: "Ocasionalmente" },
    { value: "raramente", label: "Raramente" },
    { value: "nunca", label: "Nunca" }
  ];
  
  const eatingHabitsOptions = [
    { value: "boa", label: "Me alimento bem" },
    { value: "regular", label: "Me alimento razoavelmente" },
    { value: "ruim", label: "Me alimento mal" }
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
      />
      
      <TextField 
        id="comorbidities"
        name="comorbidities"
        label="Comorbidades"
        value={formData.comorbidities}
        onChange={handleChange}
        placeholder="Insira suas comorbidades, se houver"
        error={errors.comorbidities}
      />
      
      <TextField 
        id="medications"
        name="medications"
        label="Remédios usados"
        value={formData.medications}
        onChange={handleChange}
        placeholder="Insira os remédios que você utiliza"
        error={errors.medications}
      />
      
      <TextField 
        id="substanceUse"
        name="substanceUse"
        label="Uso de substâncias tóxicas e ilícitas e frequência"
        value={formData.substanceUse}
        onChange={handleChange}
        placeholder="Insira informações sobre uso de substâncias"
        error={errors.substanceUse}
      />
      
      <Button 
        type="submit" 
        variant="white" 
        className="w-full mt-4 font-['Inter'] font-bold"
      >
        CONTINUAR
      </Button>
    </form>
  );
}