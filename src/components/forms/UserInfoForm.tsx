import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text_input';
import { SelectField } from '@/components/ui/select_input';
import { DateField } from '@/components/ui/date_input';

// Define types for form data and errors
interface FormData {
  legalName: string;
  socialName: string;
  birthSex: string;
  gender: string;
  weight: string;
  height: string;
  birthDate: string;
  race: string;
}

interface FormErrors {
  legalName?: string;
  socialName?: string;
  birthSex?: string;
  gender?: string;
  weight?: string;
  height?: string;
  birthDate?: string;
  race?: string;
  [key: string]: string | undefined;
}

export function UserInfoForm({onSubmit}: {onSubmit: (data: FormData) => void }): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    legalName: '',
    socialName: '',
    birthSex: '',
    gender: '',
    weight: '',
    height: '',
    birthDate: '',
    race: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  // Handle date change
  const handleDateChange = (value) => {
    setFormData({ ...formData, birthDate: value });
    
    // Clear error when user starts typing
    if (errors.birthDate) {
      setErrors({ ...errors, birthDate: null });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.legalName.trim()) newErrors.legalName = "Nome civil é obrigatório";
    if (!formData.birthSex) newErrors.birthSex = "Sexo de nascença é obrigatório";
    if (!formData.gender) newErrors.gender = "Gênero é obrigatório";
    if (!formData.race) newErrors.race = "Cor/Raça é obrigatório";
    
    // Validate date format (dd/mm/yyyy)
    if (!formData.birthDate) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
    } else {
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!datePattern.test(formData.birthDate)) {
        newErrors.birthDate = "Formato inválido. Use dd/mm/aaaa";
      } else {
        // Check if date is valid
        const [day, month, year] = formData.birthDate.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        if (
          date.getFullYear() !== year || 
          date.getMonth() + 1 !== month || 
          date.getDate() !== day
        ) {
          newErrors.birthDate = "Data inválida";
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
  
  // Gender options
  const genderOptions = [
    { value: "feminino", label: "Feminino" },
    { value: "masculino", label: "Masculino" },
    { value: "nao-binario", label: "Não-binário" },
    { value: "outro", label: "Outro" },
    { value: "prefiro-nao-informar", label: "Prefiro não informar" }
  ];
  
  // Birth sex options
  const birthSexOptions = [
    { value: "feminino", label: "Feminino" },
    { value: "masculino", label: "Masculino" }
  ];
  
  // Race options
  const raceOptions = [
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
        id="socialName"
        name="socialName"
        label="Nome social (opcional)"
        value={formData.socialName}
        onChange={handleChange}
        placeholder="Como prefere ser chamado(a)"
        helperText="Apenas para caso de uso interno, não compartilharemos com terceiros"
        error={errors.socialName}
      />
      
      <div className="flex flex-row gap-4 max-[311px]:flex-wrap">
        
          <SelectField
            id="birthSex"
            name="birthSex"
            label="Sexo de nascença"
            value={formData.birthSex}
            onChange={handleChange}
            options={birthSexOptions}
            error={errors.birthSex}
          />
        
          <SelectField
            id="gender"
            name="gender"
            label="Gênero"
            value={formData.gender}
            onChange={handleChange}
            options={genderOptions}
            error={errors.gender}
          />
        
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
          step="0.01"
          label="Altura (m)"
          value={formData.height}
          onChange={handleChange}
          error={errors.height}
        />
      </div>
      
      <DateField 
        id="birthDate"
        name="birthDate"
        label="Data de nascimento"
        value={formData.birthDate}
        onChange={handleDateChange}
        error={errors.birthDate}
      />
      
      <SelectField
        id="race"
        name="race"
        label="Cor/Raça"
        value={formData.race}
        onChange={handleChange}
        options={raceOptions}
        error={errors.race}
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