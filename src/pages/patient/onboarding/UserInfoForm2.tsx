import type React from 'react';
import { useState } from 'react';
import ContinueButton from '@/components/ui/ContinueButton';
import ErrorMessage from '@/components/ui/error-message';
import { TextField } from '@/components/forms/text_input';
import { SelectField } from '@/components/forms/select_input';
import { useLocationConcepts } from '@/utils/conceptLoader';

// Define form data type that extends Location with form-specific fields
export interface AddressFormData extends Partial<Location> {
  // Fields from Location that we'll use
  address_1?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;

  // Additional form fields not in Location model
  street?: string | null; // Added separate street field
  number?: string | null;
  complement?: string | null;
}

interface FormErrors {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  number?: string;
  [key: string]: string | undefined;
}

export function UserInfoForm2({
  onSubmit,
}: {
  onSubmit: (data: AddressFormData) => void;
}): JSX.Element {
  const { stateOptions, isLoading, error: conceptError } = useLocationConcepts();

  const [formData, setFormData] = useState<AddressFormData>({
    zip: '',
    state: '',
    street: '',
    city: '',
    number: '',
    complement: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Handle input change
  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    setFormData({ ...formData, [name]: value || null });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.zip) newErrors.zip = 'CEP é obrigatório';
    if (!formData.state) newErrors.state = 'Estado é obrigatório';
    if (!formData.street) newErrors.street = 'Rua é obrigatória';
    if (!formData.city) newErrors.city = 'Cidade é obrigatória';
    if (!formData.number) newErrors.number = 'Número é obrigatório';

    // Validate CEP format (00000-000)
    if (formData.zip && !/^\d{5}-?\d{3}$/.test(formData.zip)) {
      newErrors.zip = 'Formato de CEP inválido';
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

    // Format all address parts into address_1 using a format that's easy to parse
    // Format: "street, number, complement"
    const street = formData.street || '';
    const number = formData.number || '';
    const complement = formData.complement ? `, ${formData.complement}` : '';

    // Combine into a single string with consistent delimiter for backend parsing
    const address_1 = `${street}, ${number}${complement}`;

    // Prepare final data with proper formatting
    const finalData: AddressFormData = {
      ...formData,
      address_1, // Set the combined address
      // Remove form-specific fields before submitting
      street: undefined,
      number: undefined,
      complement: undefined,
    };

    // Clear all errors on successful submission
    setErrors({});

    // Submit if no errors
    onSubmit(finalData);
  };

  // Check if form is valid for enabling button
  const isFormValid = () => {
    return (
      formData.zip &&
      formData.state &&
      formData.street &&
      formData.city &&
      formData.number &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-2xl p-6 shadow-button-soft border border-card-border">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-titulo text-typography font-work-sans mb-2">Endereço</h2>
        <p className="text-desc-titulo text-muted-foreground">Informe seu endereço completo</p>
      </div>

      {/* Error message for concept loading */}
      {conceptError && (
        <ErrorMessage
          message="Erro ao carregar os estados. Tente novamente."
          variant="destructive"
          closable={false}
          retryable={false}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* CEP e Estado */}
        <div className="space-y-1">
          <label className="block text-topicos text-typography font-work-sans mb-3">
            Localização
          </label>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              id="zip"
              name="zip"
              label="CEP *"
              value={formData.zip || ''}
              onChange={handleChange}
              placeholder="00000-000"
              error={errors.zip}
            />
            <SelectField
              id="state"
              name="state"
              label="Estado *"
              value={formData.state || ''}
              onChange={handleChange}
              options={stateOptions}
              error={errors.state}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Rua */}
        <div className="space-y-1">
          <TextField
            id="street"
            name="street"
            label="Rua *"
            value={formData.street || ''}
            onChange={handleChange}
            placeholder="Ex: Rua das Flores"
            error={errors.street}
          />
        </div>

        {/* Cidade */}
        <div className="space-y-1">
          <TextField
            id="city"
            name="city"
            label="Cidade *"
            value={formData.city || ''}
            onChange={handleChange}
            placeholder="Ex: São Paulo"
            error={errors.city}
          />
        </div>

        {/* Número e Complemento */}
        <div className="space-y-1">
          <label className="block text-topicos text-typography font-work-sans mb-3">
            Detalhes do endereço
          </label>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              id="number"
              name="number"
              label="Número *"
              value={formData.number || ''}
              onChange={handleChange}
              placeholder="Ex: 123"
              error={errors.number}
            />
            <TextField
              id="complement"
              name="complement"
              label="Complemento"
              value={formData.complement || ''}
              onChange={handleChange}
              placeholder="Ex: Apto 101"
            />
          </div>
        </div>

        {/* Progress indicator */}
        <div className="bg-muted rounded-full p-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-3 py-2">
            <span>Campos obrigatórios preenchidos</span>
            <span
              className={`font-medium ${isFormValid() ? 'text-success' : 'text-muted-foreground'}`}
            >
              {isFormValid() ? '✓ Completo' : 'Pendente'}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <ContinueButton
            isEnabled={!!isFormValid()}
            text="CONTINUAR"
            isLoading={isLoading}
            loadingText="Carregando..."
          />
        </div>

        {/* Helper text */}
        <div className="text-center">
          <p className="text-desc-campos text-muted-foreground">* Campos obrigatórios</p>
        </div>
      </form>
    </div>
  );
}
