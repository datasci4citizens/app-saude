import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/forms/button';
import { TextField } from '@/components/forms/text_input';
import { DateField } from '@/components/forms/date_input';
import { FileUploader } from '@/components/ui/file-uploader';
import type { ProviderCreate } from '@/api/models/ProviderCreate';

// Define types for form data - extends Provider with additional UI fields
interface ProviderFormData extends Partial<ProviderCreate> {
  // Additional form fields not in Provider model
  document?: File | null;  // Document upload
}

interface FormErrors {
  social_name?: string;
  professional_registration?: string;
  birth_datetime?: string;
  specialty_concept?: string;
  document?: string;
  [key: string]: string | undefined;
}

export function ProfessionalInfoForm({onSubmit}: {onSubmit: (data: ProviderFormData) => void}): JSX.Element {
  // Temporary concept ID for ACS (Community Health Agent)
  const ACS_CONCEPT_ID = 32578; // Provisional ID for ACS
  
  const [formData, setFormData] = useState<ProviderFormData>({
    social_name: '',
    professional_registration: null,
    birth_datetime: '',
    specialty_concept: ACS_CONCEPT_ID,
    care_site: null,
    document: null
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Handle input change
  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric fields properly
    if (name === 'professional_registration') {
      setFormData({ 
        ...formData, 
        [name]: value ? Number(value) : null 
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
  
  // Handle file upload
  const handleFileChange = (file: File | null) => {
    setFormData({ ...formData, document: file });
    
    if (errors.document) {
      setErrors({ ...errors, document: undefined });
    }
  };
  
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.professional_registration) newErrors.professional_registration = "Número de matrícula é obrigatório";
    if (!formData.document) newErrors.document = "Documento comprobatório é obrigatório";
    
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
    if (!formData.birth_datetime) return '';
    
    // Check if already in DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(formData.birth_datetime)) {
      return formData.birth_datetime;
    }
    
    // Convert from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = formData.birth_datetime.split('-');
    return day && month && year ? `${day}/${month}/${year}` : '';
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
    // Only include fields that are part of the ProviderCreate model
    const finalData: ProviderFormData = {
      social_name: formData.social_name,
      birth_datetime: formData.birth_datetime,
      professional_registration: formData.professional_registration,
      specialty_concept: ACS_CONCEPT_ID,
      care_site: formData.care_site,
      document: formData.document  // Keep this for the form handler
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
        value={formData.social_name || ''}
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
        label="Número de matrícula ou identificação funcional"
        value={formData.professional_registration?.toString() || ''}
        onChange={handleChange}
        placeholder="Número de matrícula ACS"
        error={errors.professional_registration}
        type="number"
      />
      
      {/* Informative text about role instead of dropdown */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-800">
          Você está se cadastrando como <strong>Agente Comunitário de Saúde (ACS)</strong>.
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-500 text-sm mb-2">
          Documento comprobatório (crachá, contracheque ou declaração da UBS)
        </label>
        <FileUploader
          onChange={handleFileChange}
          error={errors.document}
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