import React, { useState } from 'react';
import { Button } from '@/components/forms/button';
import { TextField } from '@/components/forms/text_input';
import { SelectField } from '@/components/forms/select_input';
import { Location } from '@/api/models/Location';

// Define form data type that extends Location with form-specific fields
interface AddressFormData extends Partial<Location> {
  // Fields from Location that we'll use
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  
  // Additional form fields not in Location model
  number?: string | null;
  complement?: string | null;
}

interface FormErrors {
  address_1?: string;
  city?: string;
  state?: string;
  zip?: string;
  number?: string;
  [key: string]: string | undefined;
}

export function UserInfoForm2({onSubmit}: {onSubmit: (data: AddressFormData) => void }): JSX.Element {
  const [formData, setFormData] = useState<AddressFormData>({
    zip: '',
    state: '',
    address_1: '',
    city: '',
    number: '',
    complement: '',
    country_concept: 44508529, // Default concept ID for Brazil
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // Handle input change
  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [name]: value || null });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.zip) newErrors.zip = "CEP é obrigatório";
    if (!formData.state) newErrors.state = "Estado é obrigatório";
    if (!formData.address_1) newErrors.address_1 = "Rua é obrigatória";
    if (!formData.city) newErrors.city = "Cidade é obrigatória";
    if (!formData.number) newErrors.number = "Número é obrigatório";
    
    // Validate CEP format (00000-000)
    if (formData.zip && !/^\d{5}-?\d{3}$/.test(formData.zip)) {
      newErrors.zip = "Formato de CEP inválido";
    }
    
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
    
    // Format address_2 to include number and complement
    const number = formData.number || '';
    const complement = formData.complement || '';
    const address_2 = complement ? `${number}, ${complement}` : number;
    
    // Prepare final data with proper formatting
    const finalData: AddressFormData = {
      ...formData,
      address_2,
      // Remove form-specific fields before submitting
      number: undefined,
      complement: undefined
    };
    
    // Clear all errors on successful submission
    setErrors({});
    
    // Submit if no errors
    onSubmit(finalData);
  };
  
  // Brazilian states
  const stateOptions = [
    { value: "AC", label: "AC" },
    { value: "AL", label: "AL" },
    { value: "AP", label: "AP" },
    { value: "AM", label: "AM" },
    { value: "BA", label: "BA" },
    { value: "CE", label: "CE" },
    { value: "DF", label: "DF" },
    { value: "ES", label: "ES" },
    { value: "GO", label: "GO" },
    { value: "MA", label: "MA" },
    { value: "MT", label: "MT" },
    { value: "MS", label: "MS" },
    { value: "MG", label: "MG" },
    { value: "PA", label: "PA" },
    { value: "PB", label: "PB" },
    { value: "PR", label: "PR" },
    { value: "PE", label: "PE" },
    { value: "PI", label: "PI" },
    { value: "RJ", label: "RJ" },
    { value: "RN", label: "RN" },
    { value: "RS", label: "RS" },
    { value: "RO", label: "RO" },
    { value: "RR", label: "RR" },
    { value: "SC", label: "SC" },
    { value: "SP", label: "SP" },
    { value: "SE", label: "SE" },
    { value: "TO", label: "TO" }
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-row gap-4 max-[311px]:flex-wrap">
        <TextField 
          id="zip"
          name="zip"
          label="CEP"
          value={formData.zip || ''}
          onChange={handleChange}
          placeholder="00000-000"
          error={errors.zip}
        />
        
        <SelectField
          id="state"
          name="state"
          label="Estado"
          value={formData.state || ''}
          onChange={handleChange}
          options={stateOptions}
          error={errors.state}
        />
      </div>
      
      <TextField 
        id="address_1"
        name="address_1"
        label="Rua"
        value={formData.address_1 || ''}
        onChange={handleChange}
        placeholder="Rua Porta da Madelena"
        error={errors.address_1}
      />
      
      <TextField 
        id="city"
        name="city"
        label="Cidade"
        value={formData.city || ''}
        onChange={handleChange}
        placeholder="Sua cidade"
        error={errors.city}
      />
      
      <div className="flex flex-row gap-4 max-[311px]:flex-wrap">
        <TextField 
          id="number"
          name="number"
          label="Número"
          value={formData.number || ''}
          onChange={handleChange}
          placeholder="123"
          error={errors.number}
        />
        
        <TextField 
          id="complement"
          name="complement"
          label="Complemento (opcional)"
          value={formData.complement || ''}
          onChange={handleChange}
          placeholder="Apto 101"
        />
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