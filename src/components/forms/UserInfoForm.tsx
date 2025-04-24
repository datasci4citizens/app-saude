import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text_input';
import { SelectField } from '@/components/ui/select_input';
import { DateField } from '@/components/ui/date_input';

// Define types for form data and errors
interface FormData {
  legalName: string;
  social_name: string;
  biological_sex: string;
  gender_identity: string;
  weight: string;
  height: string;
  birth: string;
  race_concept: string;
}

interface FormErrors {
  legalName?: string;
  social_name?: string;
  biological_sex?: string;
  gender_identity?: string;
  weight?: string;
  height?: string;
  birth?: string;
  race_concept?: string;
  [key: string]: string | undefined;
}

export function UserInfoForm({onSubmit}: {onSubmit: (data: FormData) => void }): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    legalName: '',
    social_name: '',
    biological_sex: '',
    gender_identity: '',
    weight: '',
    height: '',
    birth: '',
    race_concept: '',
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
  
  // Handle date change
  interface DateChangeEvent {
    target: {
      value: string;
    };
  }

  const handleDateChange = (value: string) => {
    setFormData({ ...formData, birth: value });
    
    // Clear error when user starts typing
    if (errors.birth) {
      setErrors({ ...errors, birth: undefined });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.legalName.trim()) newErrors.legalName = "Nome civil é obrigatório";
    if (!formData.biological_sex) newErrors.biological_sex = "Sexo de nascença é obrigatório";
    if (!formData.gender_identity) newErrors.gender_identity = "Gênero é obrigatório";
    if (!formData.race_concept) newErrors.race_concept = "Cor/Raça é obrigatório";
    
    // Validate date format (dd/mm/yyyy)
    // checks if date is empty
    if (!formData.birth) {
      newErrors.birth = "Data de nascimento é obrigatória";
    } else {
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!datePattern.test(formData.birth)) {
        newErrors.birth = "Formato inválido. Use dd/mm/aaaa";
      } else {
        // Check if date is valid
        const [day, month, year] = formData.birth.split('/').map(Number);
        if (day && month && year) {
          const date = new Date(year, month - 1, day);
          if (
            date.getFullYear() === year && 
            date.getMonth() + 1 === month && 
            date.getDate() === day
          ) {
            // Check if date is in the future
            const today = new Date();
            if (date > today) {
              newErrors.birth = "Data não pode ser no futuro";
            }
          } else {
            newErrors.birth = "Data inválida";
          }
        } else {
          newErrors.birth = "Data inválida";
        }
      }
    }
    
    // Validate weight and height if provided
    if (formData.weight && isNaN(Number(formData.weight))) {
      newErrors.weight = "Peso deve ser um número";
    }
    
    if (formData.height && isNaN(Number(formData.height))) {
      newErrors.height = "Altura deve ser um número";
    }
    
    return newErrors;
  };

  // Add missing submit handler
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
  
  // gender_identity options
  const gender_identityOptions = [
    { value: "feminino", label: "Feminino" },
    { value: "masculino", label: "Masculino" },
    { value: "nao-binario", label: "Não-binário" },
    { value: "outro", label: "Outro" },
    { value: "prefiro-nao-informar", label: "Prefiro não informar" }
  ];
  
  // Birth sex options
  const biological_sexOptions = [
    { value: "feminino", label: "Feminino" },
    { value: "masculino", label: "Masculino" }
  ];
  
  // race_concept options
  const race_conceptOptions = [
    { value: "branca", label: "Branca" },
    { value: "preta", label: "Preta" },
    { value: "parda", label: "Parda" },
    { value: "amarela", label: "Amarela" },
    { value: "indigena", label: "Indígena" }
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField 
        id="legalName"
        name="legalName"
        label="Nome civil (como consta no documento)"
        value={formData.legalName}
        onChange={handleChange}
        placeholder="Nome completo"
        error={errors.legalName}
      />
      
      <TextField 
        id="social_name"
        name="social_name"
        label="Nome social (opcional)"
        value={formData.social_name}
        onChange={handleChange}
        placeholder="Como prefere ser chamado(a)"
        helperText="Apenas para caso de uso interno, não compartilharemos com terceiros"
        error={errors.social_name}
      />
      
      <div className="flex flex-row gap-4 max-[311px]:flex-wrap">
        <div className="flex-1">
          <SelectField
            id="biological_sex"
            name="biological_sex"
            label={<div className="min-h-[40px]">Sexo de nascença</div>}
            value={formData.biological_sex}
            onChange={handleChange}
            options={biological_sexOptions}
            error={errors.biological_sex}
          />
        </div>
        <div className="flex-1">    
          <SelectField
            id="gender_identity"
            name="gender_identity"
            label={<div className="min-h-[40px]">Gênero</div>}
            value={formData.gender_identity}
            onChange={handleChange}
            options={gender_identityOptions}
            error={errors.gender_identity}
          />
        </div>
      </div>
      
      <div className="flex flex-row gap-4 max-[294px]:flex-wrap">
        <TextField 
          id="weight"
          name="weight"
          type="number"
          label="Peso (kg)"
          value={formData.weight}
          onChange={handleChange}
          error={errors.weight}
        />
        
        <TextField 
          id="height"
          name="height"
          type="number"
          // step="0.01" // Removed as 'step' is not supported by TextFieldProps
          label="Altura (m)"
          value={formData.height}
          onChange={handleChange}
          error={errors.height}
        />
      </div>
      
      <DateField 
        id="birth"
        name="birth"
        label="Data de nascimento"
        value={formData.birth}
        onChange={handleDateChange}
        error={errors.birth}
      />
      
      <SelectField
        id="race_concept"
        name="race_concept"
        label="Cor/Raça"
        value={formData.race_concept}
        onChange={handleChange}
        options={race_conceptOptions}
        error={errors.race_concept}
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