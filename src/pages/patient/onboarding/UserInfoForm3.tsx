import React, { useState, useEffect } from 'react';
import { Button } from '@/components/forms/button';
import { TextField } from '@/components/forms/text_input';
import { SelectField } from '@/components/forms/select_input';
import { Observation } from '@/api/models/Observation';
import { DrugExposure } from '@/api/models/DrugExposure';
import { ConceptService } from '@/api/services/ConceptService';
import { AutocompleteField } from '@/components/forms/autocomplete_input';

// Define concept IDs for different types of observations
interface ConceptIds {
  sleepHealth: number;
  physicalExercise: number;
  eatingHabits: number;
  comorbidities: number;
}

// Add new interface for medication selection
interface MedicationOption {
  value: number;
  label: string;
  dosageForm?: string | null;
}


// Define form data interface (user-friendly structure)
interface FormData {
  sleepHealth: string;
  physicalExercise: string;
  eatingHabits: string;
  comorbidities: string;
  medications: string;
  substanceUse: string;
  // New fields for tracking selected concepts
  selectedMedicationId: number | null;
  selectedSubstanceId: number | null;
}

// Define the structure for API submission
interface SubmissionData {
  observations: Partial<Observation>[];
  drugExposures: Partial<DrugExposure>[];
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
    comorbidities: '',
    medications: '',
    substanceUse: '',
    selectedMedicationId: null,
    selectedSubstanceId: null
  });
  
  // Store concept IDs for observations
  const [conceptIds, setConceptIds] = useState<ConceptIds>({
    sleepHealth: 0,
    physicalExercise: 0,
    eatingHabits: 0,
    comorbidities: 0
  });
  
  // Store options for selects
  const [sleepHealthOptions, setSleepHealthOptions] = useState<{value: string, label: string}[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<{value: string, label: string}[]>([]);
  const [eatingHabitsOptions, setEatingHabitsOptions] = useState<{value: string, label: string}[]>([]);
  
  // Add state for medication options
  const [medicationOptions, setMedicationOptions] = useState<MedicationOption[]>([]);
  const [substanceOptions, setSubstanceOptions] = useState<MedicationOption[]>([]);
  const [isLoadingDrugs, setIsLoadingDrugs] = useState(false);
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Fetch concept IDs and options
  useEffect(() => {
    const fetchConcepts = async () => {
      setIsLoading(true);
      setFetchError(null);
      
      try {
        // Get observation concept categories from the server
        const concepts = await ConceptService.apiConceptList('Observation', 'pt');
        
        // Define domain concepts we want to use (these would be standard OMOP concepts)
        const SLEEP_DOMAIN = 'Sleep pattern';
        const EXERCISE_DOMAIN = 'Physical activity';
        const EATING_DOMAIN = 'Nutrition';
        const COMORBIDITY_DOMAIN = 'Condition';
        
        // Filter concepts by domain
        const sleepConcept = concepts.find(c => c.concept_name === SLEEP_DOMAIN);
        const exerciseConcept = concepts.find(c => c.concept_name === EXERCISE_DOMAIN);
        const eatingConcept = concepts.find(c => c.concept_name === EATING_DOMAIN);
        const comobirdityConcept = concepts.find(c => c.concept_name === COMORBIDITY_DOMAIN);
        
        // Update concept IDs
        if (sleepConcept && exerciseConcept && eatingConcept && comobirdityConcept) {
          setConceptIds({
            sleepHealth: sleepConcept.concept_id,
            physicalExercise: exerciseConcept.concept_id,
            eatingHabits: eatingConcept.concept_id,
            comorbidities: comobirdityConcept.concept_id
          });
        } else {
          // Fallback to hardcoded concept IDs
          setConceptIds({
            sleepHealth: 4058843,  // SNOMED concept for sleep pattern
            physicalExercise: 4214956,  // SNOMED concept for physical activity
            eatingHabits: 4152300,  // SNOMED concept for eating habits
            comorbidities: 4029498   // SNOMED concept for comorbidity
          });
        }
        
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
        
        console.log('Fetched observation concepts:', concepts);
      } catch (error) {
        console.error('Error fetching concepts:', error);
        setFetchError('Erro ao carregar opções. Algumas funcionalidades podem estar limitadas.');
      } finally {
        setIsLoading(false);
      }
    };

    // Add proper drug concept fetching
    const fetchDrugConcepts = async () => {
      setIsLoadingDrugs(true);

      try {
        // Fetch medications (RxNorm concepts)
        const medications = await ConceptService.apiConceptList('Drug', 'pt');
        
        // Filter and map to options format
        const medOptions = medications
          .filter(drug => 
            // Filter based on drug vocabulary (RxNorm, etc.)
            (drug as any).vocabulary_id === 'RxNorm' && 
            drug.concept_name != null
          )
          .map(drug => ({
            value: drug.concept_id,
            label: drug.concept_name as string,
            dosageForm: drug.concept_class_id // Often contains info like "Pill", "Injection"
          }));
          
        // Filter for substances (could be alcohol, tobacco, etc)
        const substOptions = medications
          .filter(drug => 
            // Filter for substance concepts
            ((drug as any).vocabulary_id === 'RxNorm' || drug.domain_id === 'Drug') && 
            drug.concept_class_id?.toLowerCase().includes('substance') &&
            drug.concept_name != null
          )
          .map(drug => ({
            value: drug.concept_id,
            label: drug.concept_name as string
          }));
        
        setMedicationOptions(medOptions);
        setSubstanceOptions(substOptions);
        
        console.log('Fetched medication concepts:', medications);
      } catch (error) {
        console.error('Error fetching drug concepts:', error);

        // Fallback options
        setMedicationOptions([
          { value: 19019530, label: "Paracetamol 500mg" },
          { value: 1539463, label: "Dipirona 500mg" },
          { value: 1539411, label: "Ibuprofeno 600mg" }
        ]);
        
        setSubstanceOptions([
          { value: 4052175, label: "Álcool" },
          { value: 4041969, label: "Tabaco" },
          { value: 4042168, label: "Cannabis" }
        ]);
      } finally {
        setIsLoadingDrugs(false);
      }
    };

    fetchConcepts();
    fetchDrugConcepts();
  }, []);

  // Add handler for medication select
  const handleMedicationSelect = (value: string, selectedOption?: MedicationOption) => {
    setFormData({
      ...formData,
      medications: value,
      selectedMedicationId: selectedOption?.value || null
    });
    
    // Clear error
    if (errors.medications) {
      setErrors({ ...errors, medications: undefined });
    }
  };
  
  // Add handler for substance select
  const handleSubstanceSelect = (value: string, selectedOption?: MedicationOption) => {
    setFormData({
      ...formData,
      substanceUse: value,
      selectedSubstanceId: selectedOption?.value || null
    });
    
    // Clear error
    if (errors.substanceUse) {
      setErrors({ ...errors, substanceUse: undefined });
    }
  };
  
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
    
    // Create observations
    const observations: Partial<Observation>[] = [
      // Sleep health observation
      {
        value_as_string: formData.sleepHealth,
        observation_date: now,
        observation_concept: conceptIds.sleepHealth,
        shared_with_provider: true
      },
      // Physical exercise observation
      {
        value_as_string: formData.physicalExercise,
        observation_date: now,
        observation_concept: conceptIds.physicalExercise,
        shared_with_provider: true
      },
      // Eating habits observation
      {
        value_as_string: formData.eatingHabits,
        observation_date: now,
        observation_concept: conceptIds.eatingHabits,
        shared_with_provider: true
      }
    ];
    
    // Add comorbidities if provided
    if (formData.comorbidities.trim()) {
      observations.push({
        value_as_string: formData.comorbidities,
        observation_date: now,
        observation_concept: conceptIds.comorbidities,
        shared_with_provider: true
      });
    }
    
    // Create drug exposures
    const drugExposures: Partial<DrugExposure>[] = [];
    
    // Add medications if provided
    if (formData.medications.trim()) {
      drugExposures.push({
        sig: formData.medications, // Description/usage instructions
        drug_exposure_start_date: now,
        drug_concept: formData.selectedMedicationId,
        drug_type_concept: 38000177 // Patient self-reported medication
      });
    }
    
    // Add substance use if provided
    if (formData.substanceUse.trim()) {
      drugExposures.push({
        sig: formData.substanceUse, // Description of use
        drug_exposure_start_date: now,
        drug_concept: formData.selectedSubstanceId,
        drug_type_concept: 38000177 // Patient self-reported
      });
    }
    
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
      
      <TextField 
        id="comorbidities"
        name="comorbidities"
        label="Comorbidades"
        value={formData.comorbidities}
        onChange={handleChange}
        placeholder="Insira suas comorbidades, se houver"
        error={errors.comorbidities}
      />
      
      <AutocompleteField 
        id="medications"
        name="medications"
        label="Remédios usados"
        value={formData.medications}
        onChange={handleMedicationSelect}
        options={medicationOptions}
        error={errors.medications}
        isLoading={isLoadingDrugs}
        placeholder="Busque medicamentos..."
      />
      
      <AutocompleteField 
        id="substanceUse"
        name="substanceUse"
        label="Uso de substâncias (álcool, tabaco, etc)"
        value={formData.substanceUse}
        onChange={handleSubstanceSelect}
        options={substanceOptions}
        error={errors.substanceUse}
        isLoading={isLoadingDrugs}
        placeholder="Busque substâncias..."
      />
      
      <Button 
        type="submit" 
        variant="white" 
        className="w-full mt-4 font-['Inter'] font-bold"
        disabled={isLoading || isLoadingDrugs}
      >
        CONTINUAR
      </Button>

    </form>
  );
}