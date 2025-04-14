import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Define error state interface to match form fields
interface FormErrors {
  legalName?: string;
  socialName?: string;
  birthSex?: string;
  gender?: string;
  weight?: string;
  height?: string;
  birthDate?: string;
  race?: string;
  [key: string]: string | undefined; // Allow for dynamic keys
}

// Define form data interface
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

export function UserInfoForm({onSubmit}: {onSubmit: (data: FormData) => void }): JSX.Element {
  // Form state
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
  
  // Error state
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Input style with conditional error styling
  const getInputStyle = (fieldName) => {
    const baseStyle = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#FA6E5A] focus:border-[#FA6E5A] font-['Inter'] font-normal";
    return errors[fieldName] 
      ? `${baseStyle} border-red-500 text-[#141B36]` 
      : `${baseStyle} border-gray-300 text-[#141B36]`;
  };
  
  const labelStyle = "block text-sm font-['Inter'] font-light text-[#A0A3B1] mb-1";
  const helperTextStyle = "text-xs font-['Inter'] font-light text-[#A0A3B1]";
  const errorTextStyle = "text-red-500 text-xs font-['Inter'] font-light mt-1";

  // Handle date input with formatting
  const handleDateChange = (e) => {
    let value = e.target.value;
    
    // Remove non-digits
    value = value.replace(/\D/g, '');
    
    // Apply mask as user types
    if (value.length > 0) {
      value = value.substring(0, 8); // Limit to 8 digits
      
      // Format as dd/mm/yyyy
      if (value.length > 4) {
        value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4)}`;
      } else if (value.length > 2) {
        value = `${value.substring(0, 2)}/${value.substring(2)}`;
      }
    }
    
    setFormData({ ...formData, birthDate: value });
  };
  
  // Handle other form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
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
    if (formData.weight && isNaN(formData.weight)) {
      newErrors.weight = "Peso deve ser um número";
    }
    
    if (formData.height && isNaN(formData.height)) {
      newErrors.height = "Altura deve ser um número";
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="mb-4">
        <label htmlFor="legalName" className={labelStyle}>
          Nome civil (como consta no documento)
        </label>
        <input
          type="text"
          id="legalName"
          name="legalName"
          value={formData.legalName}
          onChange={handleChange}
          className={getInputStyle("legalName")}
          placeholder="Nome completo"
        />
        {errors.legalName && (
          <p className={errorTextStyle}>{errors.legalName}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="socialName" className={labelStyle}>
          Nome social (opcional)
        </label>
        <input
          type="text"
          id="socialName"
          name="socialName"
          value={formData.socialName}
          onChange={handleChange}
          className={getInputStyle("socialName")}
          placeholder="Como prefere ser chamado(a)"
        />
        <span className={helperTextStyle}>
          Apenas para caso de uso interno, não compartilharemos com terceiros
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="birthSex" className={labelStyle}>
            Sexo de nascença
          </label>
          <select
            id="birthSex"
            name="birthSex"
            value={formData.birthSex}
            onChange={handleChange}
            className={getInputStyle("birthSex")}
          >
            <option value="" disabled>Selecione</option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
          </select>
          {errors.birthSex && (
            <p className={errorTextStyle}>{errors.birthSex}</p>
          )}
        </div>
        <div>
          <label htmlFor="gender" className={labelStyle}>
            Gênero
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={getInputStyle("gender")}
          >
            <option value="" disabled>Selecione</option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="nao-binario">Não-binário</option>
            <option value="outro">Outro</option>
            <option value="prefiro-nao-informar">Prefiro não informar</option>
          </select>
          {errors.gender && (
            <p className={errorTextStyle}>{errors.gender}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="weight" className={labelStyle}>
            Peso (kg)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className={getInputStyle("weight")}
          />
          {errors.weight && (
            <p className={errorTextStyle}>{errors.weight}</p>
          )}
        </div>
        <div>
          <label htmlFor="height" className={labelStyle}>
            Altura (m)
          </label>
          <input
            type="number"
            id="height"
            name="height"
            step="0.01"
            value={formData.height}
            onChange={handleChange}
            className={getInputStyle("height")}
          />
          {errors.height && (
            <p className={errorTextStyle}>{errors.height}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="birthDate" className={labelStyle}>
          Data de nascimento
        </label>
        <input
          type="text"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleDateChange}
          placeholder="dd/mm/aaaa"
          maxLength={10}
          className={getInputStyle("birthDate")}
        />
        {errors.birthDate && (
          <p className={errorTextStyle}>{errors.birthDate}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="race" className={labelStyle}>
          Cor/Raça
        </label>
        <select
          id="race"
          name="race"
          value={formData.race}
          onChange={handleChange}
          className={getInputStyle("race")}
        >
          <option value="" disabled>Selecione</option>
          <option value="branca">Branca</option>
          <option value="preta">Preta</option>
          <option value="parda">Parda</option>
          <option value="amarela">Amarela</option>
          <option value="indigena">Indígena</option>
        </select>
        {errors.race && (
          <p className={errorTextStyle}>{errors.race}</p>
        )}
      </div>

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