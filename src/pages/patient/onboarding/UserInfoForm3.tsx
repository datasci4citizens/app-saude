import React, { useState, useEffect } from 'react';
import { Button } from '@/components/forms/button';
import { SelectField } from '@/components/forms/select_input';
import type { ObservationCreate } from '@/api/models/ObservationCreate';
import type { DrugExposureCreate } from '@/api/models/DrugExposureCreate';
import { ConceptService } from '@/api/services/ConceptService';
import Select from 'react-select';

// Define concept IDs for different types of observations
interface ConceptIds {
  sleepHealth: number;
  physicalExercise: number;
  eatingHabits: number;
  comorbidities: number;
  medications: number;
  substanceUse: number;
  selfReported: number;
}

// Define form data interface (user-friendly structure)
// Todos sao conceptIds como String
interface FormData {
  // Esses são selects simples (1 escolha, com concept_id em string)
  sleepHealth: string;
  physicalExercise: string;
  eatingHabits: string;

  // Listas onde cada item tem concept_id + texto
  comorbidities: string[];
  medications: string[];
  substanceUse: string[];
}

// Define the structure for API submission
export interface SubmissionData {
  observations: ObservationCreate[];
  drugExposures: DrugExposureCreate[];
}

interface FormErrors {
  sleepHealth?: string;
  physicalExercise?: string;
  eatingHabits?: string;
  comorbidities?: string;
  medications?: string;
  substanceUse?: string;
  [key: string]: string | undefined;
}

export function UserInfoForm3({onSubmit}: {onSubmit: (data: SubmissionData) => void }): JSX.Element {
  // User-friendly form data
  const [formData, setFormData] = useState<FormData>({
    sleepHealth: '',
    physicalExercise: '',
    eatingHabits: '',
    comorbidities: [],
    medications: [],
    substanceUse: []
  });
  
  // Store options for selects
  const [conceptIds] = useState<ConceptIds>({
    sleepHealth: 9000020,
    physicalExercise: 9000025,
    eatingHabits: 9000026,
    comorbidities: 9000027,
    medications: 9000028,
    substanceUse: 9000029,
    selfReported: 38000280
  });

  const [sleepHealthOptions, setSleepHealthOptions] = useState<{value: string, label: string}[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<{value: string, label: string}[]>([]);
  const [eatingHabitsOptions, setEatingHabitsOptions] = useState<{value: string, label: string}[]>([]);
  const [comorbiditiesOptions, setComorbiditiesOptions] = useState<{value: string, label: string}[]>([]);
  const [medicationOptions, setMedicationOptions] = useState<{value: string, label: string}[]>([]);
  const [substanceOptions, setSubstanceOptions] = useState<{value: string, label: string}[]>([]);
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Fetch concept IDs and options
  useEffect(() => {
    const fetchConcepts = async () => {
      setIsLoading(true);
      setFetchError(null);
      
      try {
        // Define domain concepts we want to use (these would be standard OMOP concepts)
        const FREQUENCY_CLASS = 'Frequency';
        const QUALITY_CLASS = 'Quality';
        const COMORBIDITY_CLASS = 'Comorbidity';
        const MEDICATION_CLASS = 'Medication';
        const SUBSTANCE_CLASS = 'Substance';
        
        // Get observation concept categories from the server
        const concepts = await ConceptService.apiConceptList(
          `${FREQUENCY_CLASS}, ${QUALITY_CLASS}, ${COMORBIDITY_CLASS}, ${MEDICATION_CLASS}, ${SUBSTANCE_CLASS}`,
          'pt'
        );

        // Filter and set options for each concept class
        setSleepHealthOptions(
          concepts
            .filter(concept => concept.concept_class === QUALITY_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name as string
            }))
        );

        setExerciseOptions(
          concepts
            .filter(concept => concept.concept_class === FREQUENCY_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name as string
            }))
        );

        setEatingHabitsOptions(
          concepts
            .filter(concept => concept.concept_class === QUALITY_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name as string
            }))
        );

        setComorbiditiesOptions(
          concepts
            .filter(concept => concept.concept_class === COMORBIDITY_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name as string
            }))
        );

        setMedicationOptions(
          concepts
            .filter(concept => concept.concept_class === MEDICATION_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name as string,
            }))
        );

        setSubstanceOptions(
          concepts
            .filter(concept => concept.concept_class === SUBSTANCE_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name as string,
            }))
        );
        
        console.log('Fetched observation concepts:', concepts);
      } catch (error) {
        // Set default options (in case we can't fetch the value options)
        setSleepHealthOptions([
          { value: "good", label: "Durmo bem" },
          { value: "fair", label: "Durmo razoavelmente" },
          { value: "poor", label: "Durmo mal" }
        ]);
        
        setExerciseOptions([
          { value: "regular", label: "Regularmente" },
          { value: "occasional", label: "Ocasionalmente" },
          { value: "rare", label: "Raramente" },
          { value: "never", label: "Nunca" }
        ]);
        
        setEatingHabitsOptions([
          { value: "good", label: "Me alimento bem" },
          { value: "fair", label: "Me alimento razoavelmente" },
          { value: "poor", label: "Me alimento mal" }
        ]);
        console.error('Error fetching concepts:', error);
        setFetchError('Erro ao carregar opções. Algumas funcionalidades podem estar limitadas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConcepts();
  }, []);

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
    if (!formData.sleepHealth) newErrors.sleepHealth = "Saúde de sono é obrigatório";
    if (!formData.physicalExercise) newErrors.physicalExercise = "Exercícios físicos é obrigatório";
    if (!formData.eatingHabits) newErrors.eatingHabits = "Hábitos alimentares é obrigatório";
    
    return newErrors;
  };
  
  // Transform form data into properly structured API objects
  const transformFormData = (): SubmissionData => {
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    console.log('Form data before transformation:', formData);
    
    // Create observations
    const observations: ObservationCreate[] = [
      // Sleep health observation
      {
        value_as_concept: parseInt(formData.sleepHealth),
        observation_date: now,
        observation_concept: conceptIds.sleepHealth,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported
      },
      // Physical exercise observation
      {
        value_as_concept: parseInt(formData.physicalExercise),
        observation_date: now,
        observation_concept: conceptIds.physicalExercise,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported
      },
      // Eating habits observation
      {
        value_as_concept: parseInt(formData.eatingHabits),
        observation_date: now,
        observation_concept: conceptIds.eatingHabits,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported
      },
      ...formData.comorbidities.map((conceptId) => ({
        value_as_concept: parseInt(conceptId),
        observation_date: now,
        observation_concept: conceptIds.comorbidities,
        shared_with_provider: true,
        observation_type_concept: conceptIds.selfReported
      }))
    ];
    
    const drugExposures: DrugExposureCreate[] = [
      ...formData.medications.map((conceptId) => ({
        drug_exposure_start_date: now,
        drug_exposure_end_date: null,
        stop_reason: null,
        quantity: null,
        interval_hours: null,
        dose_times: null,
        sig: null,
        person: null,
        drug_concept: parseInt(conceptId),
        drug_type_concept: conceptIds.medications
      })),
      ...formData.substanceUse.map((conceptId) => ({
        drug_exposure_start_date: now,
        drug_exposure_end_date: null,
        stop_reason: null,
        quantity: null,
        interval_hours: null,
        dose_times: null,
        sig: null,
        person: null,
        drug_concept: parseInt(conceptId),
        drug_type_concept: conceptIds.substanceUse
      }))
    ];

    console.log('Transformed data for submission:', { observations, drugExposures });
    
    return { observations, drugExposures };
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
    
    // Transform and submit the data
    const submissionData = transformFormData();
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fetchError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-3 mb-4">
          <p>{fetchError}</p>
        </div>
      )}
    
      <div className="flex flex-row gap-4 max-[311px]:flex-wrap w-full">
        <div className="flex-1">
          <SelectField
            id="sleepHealth"
            name="sleepHealth"
            label="Saúde de sono"
            value={formData.sleepHealth}
            onChange={handleChange}
            options={sleepHealthOptions}
            error={errors.sleepHealth}
            isLoading={isLoading}
          />
        </div>
        <div className="flex-1">
          <SelectField
            id="physicalExercise"
            name="physicalExercise"
            label="Exercícios físicos"
            value={formData.physicalExercise}
            onChange={handleChange}
            options={exerciseOptions}
            error={errors.physicalExercise}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <SelectField
        id="eatingHabits"
        name="eatingHabits"
        label="Hábitos alimentares"
        value={formData.eatingHabits}
        onChange={handleChange}
        options={eatingHabitsOptions}
        error={errors.eatingHabits}
        isLoading={isLoading}
      />

      <Select 
        id="comorbidities"
        name="comorbidities"
        isMulti
        value={comorbiditiesOptions.filter(opt => formData.comorbidities.includes(opt.value))}
        onChange={(selectedOptions) => {
          const selectedIds = selectedOptions.map(opt => opt.value);
          setFormData({ ...formData, comorbidities: selectedIds });
        }}
        options={comorbiditiesOptions}
        isLoading={isLoading}
        placeholder="Insira suas comorbidades, se houver"
      />
      
      <Select 
        id="medications"
        name="medications"
        placeholder="Busque remédios..."
        isMulti
        value={medicationOptions.filter(opt => formData.medications.includes(opt.value))}
        onChange={(selectedOptions) => {
          const selectedIds = selectedOptions.map(opt => opt.value);
          setFormData({ ...formData, medications: selectedIds });
        }}
        options={medicationOptions}
        isLoading={isLoading}
      />
      
      <Select 
        id="substanceUse"
        name="substanceUse"
        isMulti
        value={substanceOptions.filter(opt => formData.substanceUse.includes(opt.value))}
        onChange={(selectedOptions) => {
          const selectedIds = selectedOptions.map(opt => opt.value);
          setFormData({ ...formData, substanceUse: selectedIds });
        }}
        options={substanceOptions}
        isLoading={isLoading}
        placeholder="Busque substâncias..."
      />
      
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