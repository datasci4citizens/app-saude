import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text_input';
import { FileUploader } from '@/components/ui/file-uploader';

// Define types for form data and errors
interface FormData {
  civilName: string;
  socialName: string;
  professionalEmail: string;
  registrationNumber: string;
  document: File | null;
}

interface FormErrors {
  civilName?: string;
  socialName?: string;
  professionalEmail?: string;
  registrationNumber?: string;
  document?: string;
  [key: string]: string | undefined;
}

export default function ProfessionalInfoForm({onSubmit}: {onSubmit: (data: FormData) => void}): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    civilName: '',
    socialName: '',
    professionalEmail: '',
    registrationNumber: '',
    document: null
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // Handle input change
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  // Handle file upload
  const handleFileChange = (file: File | null) => {
    setFormData({ ...formData, document: file });
    
    // Clear error when user uploads a file
    if (errors.document) {
      setErrors({ ...errors, document: undefined });
    }
  };
  
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.civilName.trim()) newErrors.civilName = "Nome civil é obrigatório";
    if (!formData.professionalEmail.trim()) newErrors.professionalEmail = "Email profissional é obrigatório";
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = "Número de registro é obrigatório";
    if (!formData.document) newErrors.document = "Documento comprobatório é obrigatório";
    
    // Email validation
    if (formData.professionalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.professionalEmail)) {
      newErrors.professionalEmail = "Email inválido";
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
    
    // Submit form data
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
    <TextField 
      id="civilName"
      name="civilName"
      label="Nome civil (como consta no documento)"
      value={formData.civilName}
      onChange={handleChange}
      placeholder=""
      error={errors.civilName}
    />
    
    <TextField 
      id="socialName"
      name="socialName"
      label="Nome social (opcional) caso seja diferente do civil, em concordância com 'identidade de gênero'"
      value={formData.socialName}
      onChange={handleChange}
      placeholder=""
      error={errors.socialName}
    />
    
    <TextField 
      id="professionalEmail"
      name="professionalEmail"
      label="Email profissional"
      value={formData.professionalEmail}
      onChange={handleChange}
      placeholder=""
      error={errors.professionalEmail}
      type="email"
    />
    
    <TextField 
      id="registrationNumber"
      name="registrationNumber"
      label="Número de registro no conselho profissional ou identificação funcional"
      value={formData.registrationNumber}
      onChange={handleChange}
      placeholder=""
      error={errors.registrationNumber}
    />
    
    <div className="mb-4">
      <label className="block text-gray-500 text-sm mb-2">
        Documento comprobatório digitalizado (carteira do conselho, comprovante de vínculo empregatício, etc)
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