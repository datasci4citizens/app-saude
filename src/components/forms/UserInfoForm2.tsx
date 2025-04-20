import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text_input';
import { SelectField } from '@/components/ui/select_input';

// Define types for form data and errors
interface FormData {
  occupation: string;
  cep: string;
  state: string;
  street: string;
  city: string;
  number: string;
  complement: string;
}

interface FormErrors {
    occupation?: string;
    cep?: string;
    state?: string;
    street?: string;
    city?: string;
    number?: string;
    [key: string]: string | undefined;
  }
  
  export function UserInfoForm2({onSubmit}: {onSubmit: (data: FormData) => void }): JSX.Element {
    const [formData, setFormData] = useState<FormData>({
      occupation: '',
      cep: '',
      state: '',
      street: '',
      city: '',
      number: '',
      complement: '',
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
      if (!formData.occupation.trim()) newErrors.occupation = "Profissão é obrigatória";
      if (!formData.cep.trim()) newErrors.cep = "CEP é obrigatório";
      if (!formData.state.trim()) newErrors.state = "Estado é obrigatório";
      if (!formData.street.trim()) newErrors.street = "Rua é obrigatória";
      if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória";
      if (!formData.number.trim()) newErrors.number = "Número é obrigatório";
      
      // Validate CEP format (00000-000)
      if (formData.cep.trim() && !/^\d{5}-?\d{3}$/.test(formData.cep)) {
        newErrors.cep = "Formato de CEP inválido";
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
      
      // Clear all errors on successful submission
      setErrors({});
      
      // Submit if no errors
      onSubmit(formData);
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField 
          id="occupation"
          name="occupation"
          label="Profissão"
          value={formData.occupation}
          onChange={handleChange}
          placeholder="Sua profissão"
          error={errors.occupation}
        />
        
        <div className="flex flex-row gap-4 max-[311px]:flex-wrap">
          <TextField 
            id="cep"
            name="cep"
            label="CEP"
            value={formData.cep}
            onChange={handleChange}
            placeholder="00000-000"
            error={errors.cep}
          />
          
          <SelectField
            id="state"
            name="state"
            label="Estado"
            value={formData.state}
            onChange={handleChange}
            options={stateOptions}
            error={errors.state}
          />
        </div>
        
        <TextField 
          id="street"
          name="street"
          label="Rua"
          value={formData.street}
          onChange={handleChange}
          placeholder="Rua Porta da Madelena"
          error={errors.street}
        />
        
        <TextField 
          id="city"
          name="city"
          label="Cidade"
          value={formData.city}
          onChange={handleChange}
          placeholder="Sua cidade"
          error={errors.city}
        />
        
        <div className="flex flex-row gap-4 max-[311px]:flex-wrap">
          <TextField 
            id="number"
            name="number"
            label="Número"
            value={formData.number}
            onChange={handleChange}
            placeholder="123"
            error={errors.number}
          />
          
          <TextField 
            id="complement"
            name="complement"
            label="Complemento (opcional)"
            value={formData.complement}
            onChange={handleChange}
            placeholder="Apto 101"
            error={errors.complement}
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