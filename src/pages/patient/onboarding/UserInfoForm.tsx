import type React from "react";
import { useState } from "react";
import type { PersonCreate } from "@/api/models/PersonCreate";
import { Button } from "@/components/forms/button";
import { DateField } from "@/components/forms/date_input";
import { SelectField } from "@/components/forms/select_input";
import { TextField } from "@/components/forms/text_input";
import { useDemographicConcepts } from "@/utils/conceptLoader";

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

	const [formData, setFormData] = useState<UserFormData>({
		social_name: "",
		gender_concept: null,
		weight: null,
		height: null,
		birth_datetime: "",
		race_concept: null,
	});

	const [errors, setErrors] = useState<FormErrors>({});

	// Handle input change
	const handleChange: React.ChangeEventHandler<
		HTMLInputElement | HTMLSelectElement
	> = (e) => {
		const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;

		// Convert numeric fields to numbers
		if (
			name === "gender_concept" ||
			name === "race_concept" ||
			name === "weight" ||
			name === "height"
		) {
			setFormData({ ...formData, [name]: value ? Number(value) : null });
		} else {
			setFormData({ ...formData, [name]: value });
		}

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors({ ...errors, [name]: undefined });
		}
	};

	// Handle date change - convert DD/MM/YYYY to ISO format for backend
	const handleDateChange = (value: string) => {
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

		// Clear error when user starts typing
		if (errors.birth_datetime) {
			setErrors({ ...errors, birth_datetime: undefined });
		}
	};

	const validateForm = (): FormErrors => {
		const newErrors: FormErrors = {};

		// Required fields - add as needed
		if (formData.gender_concept === null)
			newErrors.gender_concept = "Gênero é obrigatório";
		if (formData.race_concept === null)
			newErrors.race_concept = "Cor/Raça é obrigatório";

		// Validate date format
		if (!formData.birth_datetime) {
			newErrors.birth_datetime = "Data de nascimento é obrigatória";
		} else {
			// Assuming UI still shows in DD/MM/YYYY but we store in YYYY-MM-DD
			const datePattern = /^\d{4}-\d{2}-\d{2}$/;
			if (!datePattern.test(formData.birth_datetime)) {
				newErrors.birth_datetime = "Formato de data inválido";
			} else {
				// Check if it's a valid date
				const date = new Date(formData.birth_datetime);
				if (Number.isNaN(date.getTime())) {
					newErrors.birth_datetime = "Data inválida";
				} else {
					// Check if date is in future
					const today = new Date();
					if (date > today) {
						newErrors.birth_datetime = "Data não pode ser no futuro";
					}
				}
			}
		}

		// Validate weight and height if provided
		if (formData.weight !== null && formData.weight <= 0) {
			newErrors.weight = "Peso deve ser maior que zero";
		}

		if (formData.height !== null && formData.height <= 0) {
			newErrors.height = "Altura deve ser maior que zero";
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {conceptError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
          <p>{conceptError}</p>
        </div>
      )}

      <TextField
        id="social_name"
        name="social_name"
        label="Nome social (opcional)"
        value={formData.social_name || ""}
        onChange={handleChange}
        placeholder="Como prefere ser chamado(a)"
        helperText="Apenas para caso de uso interno, não compartilharemos com terceiros"
        error={errors.social_name}
      />

      <SelectField
        id="gender_concept"
        name="gender_concept"
        label="Gênero"
        value={
          formData.gender_concept !== null
            ? formData.gender_concept.toString()
            : ""
        }
        onChange={handleChange}
        options={genderOptions}
        error={errors.gender_concept}
        isLoading={isLoadingConcepts}
      />

      <div className="flex flex-row gap-4 max-[294px]:flex-wrap">
        <TextField
          id="weight"
          name="weight"
          type="number"
          label="Peso (kg)"
          value={formData.weight !== null ? formData.weight.toString() : ""}
          onChange={handleChange}
          error={errors.weight}
        />

        <TextField
          id="height"
          name="height"
          type="number"
          label="Altura (cm)"
          value={formData.height !== null ? formData.height.toString() : ""}
          onChange={handleChange}
          error={errors.height}
        />
      </div>

      <DateField
        id="birth_datetime"
        name="birth_datetime"
        label="Data de nascimento"
        value={formData.birth_datetime || ""}
        onChange={handleDateChange}
        error={errors.birth_datetime}
      />

      <SelectField
        id="race_concept"
        name="race_concept"
        label="Cor/Raça"
        value={
          formData.race_concept !== null ? formData.race_concept.toString() : ""
        }
        onChange={handleChange}
        options={raceOptions}
        error={errors.race_concept}
        isLoading={isLoadingConcepts}
      />

      <Button
        type="submit"
        variant="gradient"
        className="w-full mt-4 font-['Inter'] font-bold mb-4"
      >
        CONTINUAR
      </Button>
    </form>
  );
}
