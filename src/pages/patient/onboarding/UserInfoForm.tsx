import type React from 'react';
import { useState } from 'react';
import type { PersonCreate } from '@/api/models/PersonCreate';
import ContinueButton from '@/components/ui/ContinueButton';
import ErrorMessage from '@/components/ui/error-message';
import { DateField } from '@/components/forms/date_input';
import { SelectField } from '@/components/forms/select_input';
import { TextField } from '@/components/forms/text_input';
import { useDemographicConcepts } from '@/utils/conceptLoader';

// Define form data type that extends Person with form-specific fields
interface UserFormData extends Partial<PersonCreate> {
  // Fields from Person that we'll use
  social_name: string | null;
  birth_datetime: string | null;
  gender_concept: number | null;
  race_concept: number | null;

  // Additional form fields not in Person model
  weight: number | null;
  height: number | null;
}

interface FormErrors {
  social_name?: string;
  gender_concept?: string;
  weight?: string;
  height?: string;
  birth_datetime?: string;
  race_concept?: string;
  [key: string]: string | undefined;
}

export function UserInfoForm({
  onSubmit,
}: {
  onSubmit: (data: UserFormData) => void;
}): JSX.Element {
  const {
    genderOptions,
    raceOptions,
    isLoading: isLoadingConcepts,
    error: conceptError,
  } = useDemographicConcepts();

  console.log('Concept loading state:', {
    isLoadingConcepts,
    conceptError,
    genderOptionsLength: genderOptions?.length,
    raceOptionsLength: raceOptions?.length,
    genderOptions,
    raceOptions,
  });

  const [formData, setFormData] = useState<UserFormData>({
    social_name: '',
    gender_concept: null,
    weight: null,
    height: null,
    birth_datetime: '',
    race_concept: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [displayDate, setDisplayDate] = useState<string>('');

  // Handle input change
  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;

    // Convert numeric fields to numbers
    if (
      name === 'gender_concept' ||
      name === 'race_concept' ||
      name === 'weight' ||
      name === 'height'
    ) {
      setFormData({ ...formData, [name]: value ? Number(value) : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Remover a chave do objeto ao invés de definir como undefined
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // Handle date change - convert DD/MM/YYYY to ISO format for backend
  const handleDateChange = (value: string) => {
    // Salvar o valor de exibição
    setDisplayDate(value);

    // Check if the input is in DD/MM/YYYY format
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(datePattern);

    if (match) {
      // Convert DD/MM/YYYY to YYYY-MM-DD format for backend
      const [_, day, month, year] = match;
      const isoDate = `${year}-${month}-${day}`;
      setFormData({ ...formData, birth_datetime: isoDate });
    } else {
      // Just store the value as is (for validation later)
      setFormData({ ...formData, birth_datetime: value });
    }

    // Remover a chave do objeto ao invés de definir como undefined
    if (errors.birth_datetime) {
      const newErrors = { ...errors };
      delete newErrors.birth_datetime;
      setErrors(newErrors);
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields - add as needed
    if (formData.gender_concept === null) newErrors.gender_concept = 'Gênero é obrigatório';
    if (formData.race_concept === null) newErrors.race_concept = 'Cor/Raça é obrigatório';

    // Validate date format
    if (!formData.birth_datetime) {
      newErrors.birth_datetime = 'Data de nascimento é obrigatória';
    } else {
      // Assuming UI still shows in DD/MM/YYYY but we store in YYYY-MM-DD
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(formData.birth_datetime)) {
        newErrors.birth_datetime = 'Formato de data inválido';
      } else {
        // Check if it's a valid date
        const date = new Date(formData.birth_datetime);
        if (Number.isNaN(date.getTime())) {
          newErrors.birth_datetime = 'Data inválida';
        } else {
          // Check if date is in future
          const today = new Date();
          if (date > today) {
            newErrors.birth_datetime = 'Data não pode ser no futuro';
          }
        }
      }
    }

    // Validate weight and height if provided
    if (formData.weight !== null && formData.weight <= 0) {
      newErrors.weight = 'Peso deve ser maior que zero';
    }

    if (formData.height !== null && formData.height <= 0) {
      newErrors.height = 'Altura deve ser maior que zero';
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

  // Revalidar os dados atuais para garantir que estão válidos
  const isFormValid = () => {
    // Check required fields
    if (formData.gender_concept === null) return false;
    if (formData.race_concept === null) return false;
    if (!formData.birth_datetime) return false;

    // Run current validation to check if data is actually valid
    const currentErrors = validateForm();
    const hasErrors = Object.keys(currentErrors).length > 0;

    return !hasErrors;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-2xl p-6 shadow-button-soft border border-card-border">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-titulo text-typography font-work-sans mb-2">Informações Pessoais</h2>
        <p className="text-desc-titulo text-muted-foreground">Nos ajude a conhecer você melhor</p>
      </div>

      {/* Error message for concept loading */}
      {conceptError && (
        <ErrorMessage
          message={conceptError}
          variant="destructive"
          closable={false}
          retryable={false}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Nome Social */}
        <div className="space-y-1">
          <TextField
            id="social_name"
            name="social_name"
            label="Nome social (opcional)"
            value={formData.social_name || ''}
            onChange={handleChange}
            placeholder="Como prefere ser chamado(a)"
            helperText="Apenas para uso interno, não compartilharemos com terceiros"
            error={errors.social_name}
          />
        </div>

        {/* Gênero */}
        <div className="space-y-1">
          <SelectField
            id="gender_concept"
            name="gender_concept"
            label="Gênero *"
            value={formData.gender_concept !== null ? formData.gender_concept.toString() : ''}
            onChange={handleChange}
            options={genderOptions}
            error={errors.gender_concept}
            isLoading={isLoadingConcepts}
          />
        </div>

        {/* Peso e Altura */}
        <div className="space-y-1">
          <label className="block text-topicos text-typography font-work-sans mb-3">
            Dados físicos (opcional)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              id="weight"
              name="weight"
              type="number"
              label="Peso (kg)"
              value={formData.weight !== null ? formData.weight.toString() : ''}
              onChange={handleChange}
              error={errors.weight}
              placeholder="Ex: 70"
            />
            <TextField
              id="height"
              name="height"
              type="number"
              label="Altura (cm)"
              value={formData.height !== null ? formData.height.toString() : ''}
              onChange={handleChange}
              error={errors.height}
              placeholder="Ex: 175"
            />
          </div>
        </div>

        {/* Data de Nascimento */}
        <div className="space-y-1">
          <DateField
            id="birth_datetime"
            name="birth_datetime"
            label="Data de nascimento *"
            value={displayDate}
            onChange={handleDateChange}
            error={errors.birth_datetime}
          />
        </div>

        {/* Cor/Raça */}
        <div className="space-y-1">
          <SelectField
            id="race_concept"
            name="race_concept"
            label="Cor/Raça *"
            value={formData.race_concept !== null ? formData.race_concept.toString() : ''}
            onChange={handleChange}
            options={raceOptions}
            error={errors.race_concept}
            isLoading={isLoadingConcepts}
          />
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
            isLoading={isLoadingConcepts}
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
