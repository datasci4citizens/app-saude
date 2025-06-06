import React, { useState, useEffect } from "react";
import { Button } from "@/components/forms/button";
import { TextField } from "@/components/forms/text_input";
import { SelectField } from "@/components/forms/select_input";
import { useLocationConcepts } from "@/utils/conceptLoader";

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
  const {
    stateOptions,
    isLoading,
    error: conceptError,
  } = useLocationConcepts();

  const [formData, setFormData] = useState<AddressFormData>({
    zip: "",
    state: "",
    street: "", // Changed from address_1 to street
    city: "",
    number: "",
    complement: "",
    // country_concept: 44508529, // Default concept ID for Brazil
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Handle input change
  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
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
    if (!formData.street) newErrors.street = "Rua é obrigatória"; // Changed to street
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

    // Format all address parts into address_1 using a format that's easy to parse
    // Format: "street, number, complement"
    const street = formData.street || "";
    const number = formData.number || "";
    const complement = formData.complement ? `, ${formData.complement}` : "";

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

  // Define the SelectOption type
  interface SelectOption {
    value: string | number;
    label: string;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-row gap-4 max-[311px]:flex-wrap">
        <TextField
          id="zip"
          name="zip"
          label="CEP"
          value={formData.zip || ""}
          onChange={handleChange}
          placeholder="00000-000"
          error={errors.zip}
        />

        <SelectField
          id="state"
          name="state"
          label="Estado"
          value={formData.state || ""}
          onChange={handleChange}
          options={stateOptions}
          error={errors.state}
          isLoading={false} // Placeholder for loading state
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
      />

      <TextField
        id="city"
        name="city"
        label="Cidade"
        value={formData.city || ""}
        onChange={handleChange}
        placeholder="Sua cidade"
        error={errors.city}
      />

      <div className="flex flex-row gap-4 max-[311px]:flex-wrap">
        <TextField
          id="number"
          name="number"
          label="Número"
          value={formData.number || ""}
          onChange={handleChange}
          placeholder="123"
          error={errors.number}
        />

        <TextField
          id="complement"
          name="complement"
          label="Complemento"
          value={formData.complement || ""}
          onChange={handleChange}
          placeholder="Apto 101"
        />
      </div>

      <Button
        type="submit"
        variant="white"
        className="w-full mt-4 font-['Inter'] font-bold mb-4"
      >
        CONTINUAR
      </Button>
    </form>
  );
}
