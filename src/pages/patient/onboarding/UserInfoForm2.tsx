import React, { useState } from "react";
import { Button } from "@/components/forms/button";
import { TextField } from "@/components/forms/text_input";
import { SelectField } from "@/components/forms/select_input";
import { useLocationConcepts } from "@/utils/conceptLoader";

export interface AddressFormData {
  address_1?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  street?: string | null;
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
  const {
    stateOptions,
    isLoading,
    error: conceptError,
  } = useLocationConcepts();

  const [formData, setFormData] = useState<AddressFormData>({
    zip: "",
    state: "",
    street: "",
    city: "",
    number: "",
    complement: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    
    // Format CEP automatically
    let processedValue = value;
    if (name === 'zip') {
      // Remove non-digits and format CEP
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 8) {
        processedValue = digits.length > 5 
          ? `${digits.slice(0, 5)}-${digits.slice(5)}` 
          : digits;
      } else {
        return; // Don't update if more than 8 digits
      }
    }

    setFormData(prev => ({ ...prev, [name]: processedValue || null }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.zip?.trim()) {
      newErrors.zip = "CEP é obrigatório";
    } else if (!/^\d{5}-?\d{3}$/.test(formData.zip)) {
      newErrors.zip = "Formato de CEP inválido (ex: 12345-678)";
    }

    if (!formData.state?.trim()) {
      newErrors.state = "Estado é obrigatório";
    }

    if (!formData.street?.trim()) {
      newErrors.street = "Rua é obrigatória";
    }

    if (!formData.city?.trim()) {
      newErrors.city = "Cidade é obrigatória";
    }

    if (!formData.number?.trim()) {
      newErrors.number = "Número é obrigatório";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Format address_1 field for backend
    const street = formData.street?.trim() || "";
    const number = formData.number?.trim() || "";
    const complement = formData.complement?.trim();
    
    const addressParts = [street, number];
    if (complement) {
      addressParts.push(complement);
    }
    
    const address_1 = addressParts.join(", ");

    const finalData: AddressFormData = {
      ...formData,
      address_1,
      // Keep individual fields for potential future use
    };

    setErrors({});
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {conceptError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
          <p>{conceptError}</p>
        </div>
      )}

      <div className="flex flex-row gap-4 max-[311px]:flex-col">
        <TextField
          id="zip"
          name="zip"
          label="CEP"
          value={formData.zip || ""}
          onChange={handleChange}
          placeholder="12345-678"
          error={errors.zip}
          maxLength={9}
          required
        />

        <SelectField
          id="state"
          name="state"
          label="Estado"
          value={formData.state || ""}
          onChange={handleChange}
          options={stateOptions}
          error={errors.state}
          isLoading={isLoading}
        />
      </div>

      <TextField
        id="street"
        name="street"
        label="Rua"
        value={formData.street || ""}
        onChange={handleChange}
        placeholder="Rua Porta da Madelena"
        error={errors.street}
        required
      />

      <TextField
        id="city"
        name="city"
        label="Cidade"
        value={formData.city || ""}
        onChange={handleChange}
        placeholder="Sua cidade"
        error={errors.city}
        required
      />

      <div className="flex flex-row gap-4 max-[311px]:flex-col">
        <TextField
          id="number"
          name="number"
          label="Número"
          value={formData.number || ""}
          onChange={handleChange}
          placeholder="123"
          error={errors.number}
          required
        />

        <TextField
          id="complement"
          name="complement"
          label="Complemento (opcional)"
          value={formData.complement || ""}
          onChange={handleChange}
          placeholder="Apto 101"
        />
      </div>

      <Button
        type="submit"
        variant="white"
        className="w-full mt-4 font-['Inter'] font-bold"
        disabled={isLoading}
      >
        CONTINUAR
      </Button>
    </form>
  );
}