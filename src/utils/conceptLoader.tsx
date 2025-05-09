import { useState, useEffect } from 'react';
import { ConceptService } from '@/api/services/ConceptService';

// Shared interfaces
export interface SelectOption {
  value: string | number;
  label: string;
}

interface BaseConceptLoaderResult {
  isLoading: boolean;
  error: string | null;
}

// Type for the health concepts hook result
interface HealthConceptsResult extends BaseConceptLoaderResult {
  sleepHealthOptions: SelectOption[];
  exerciseOptions: SelectOption[];
  eatingHabitsOptions: SelectOption[];
  comorbiditiesOptions: SelectOption[];
  medicationOptions: SelectOption[];
  substanceOptions: SelectOption[];
  conceptIds: {
    sleepHealth: number;
    physicalExercise: number;
    eatingHabits: number;
    comorbidities: number;
    medications: number;
    substanceUse: number;
    selfReported: number;
  };
}

// Type for demographic concepts hook result
interface DemographicConceptsResult extends BaseConceptLoaderResult {
  genderOptions: SelectOption[];
  raceOptions: SelectOption[];
}

// Type for location concepts hook result
interface LocationConceptsResult extends BaseConceptLoaderResult {
  stateOptions: SelectOption[];
}

/**
 * Hook to load health concepts for UserInfoForm3
 */
export function useHealthConcepts(): HealthConceptsResult {
  // Options for selects
  const [sleepHealthOptions, setSleepHealthOptions] = useState<SelectOption[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<SelectOption[]>([]);
  const [eatingHabitsOptions, setEatingHabitsOptions] = useState<SelectOption[]>([]);
  const [comorbiditiesOptions, setComorbiditiesOptions] = useState<SelectOption[]>([]);
  const [medicationOptions, setMedicationOptions] = useState<SelectOption[]>([]);
  const [substanceOptions, setSubstanceOptions] = useState<SelectOption[]>([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Define default concept IDs
  const conceptIds = {
    sleepHealth: 9000020,
    physicalExercise: 9000025,
    eatingHabits: 9000026,
    comorbidities: 9000027,
    medications: 9000028,
    substanceUse: 9000029,
    selfReported: 38000280
  };

  useEffect(() => {
    const fetchConcepts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Define concept classes we want to fetch
        const FREQUENCY_CLASS = 'Frequency';
        const QUALITY_CLASS = 'Quality';
        const COMORBIDITY_CLASS = 'Comorbidity';
        const MEDICATION_CLASS = 'Medication';
        const SUBSTANCE_CLASS = 'Substance';
        
        // Get concepts from the server
        const concepts = await ConceptService.apiConceptList(
          `${FREQUENCY_CLASS}, ${QUALITY_CLASS}, ${COMORBIDITY_CLASS}, ${MEDICATION_CLASS}, ${SUBSTANCE_CLASS}`,
          'pt'
        );

        // Process sleep health options
        setSleepHealthOptions(
          concepts
            .filter(concept => concept.concept_class === QUALITY_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || ''
            }))
        );

        // Process exercise options
        setExerciseOptions(
          concepts
            .filter(concept => concept.concept_class === FREQUENCY_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || ''
            }))
        );

        // Process eating habits options
        setEatingHabitsOptions(
          concepts
            .filter(concept => concept.concept_class === QUALITY_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || ''
            }))
        );

        // Process comorbidities options
        setComorbiditiesOptions(
          concepts
            .filter(concept => concept.concept_class === COMORBIDITY_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || ''
            }))
        );

        // Process medication options
        setMedicationOptions(
          concepts
            .filter(concept => concept.concept_class === MEDICATION_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || ''
            }))
        );

        // Process substance options
        setSubstanceOptions(
          concepts
            .filter(concept => concept.concept_class === SUBSTANCE_CLASS)
            .map(concept => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || ''
            }))
        );
      } catch (error) {
        console.error('Error fetching health concepts:', error);
        setError('Erro ao carregar opções. Algumas funcionalidades podem estar limitadas.');
        
        // Set fallback options
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchConcepts();
  }, []);

  return {
    sleepHealthOptions,
    exerciseOptions,
    eatingHabitsOptions,
    comorbiditiesOptions,
    medicationOptions,
    substanceOptions,
    conceptIds,
    isLoading,
    error
  };
}

/**
 * Hook to load demographic concepts for UserInfoForm
 */
export function useDemographicConcepts(): DemographicConceptsResult {
  const [genderOptions, setGenderOptions] = useState<SelectOption[]>([]);
  const [raceOptions, setRaceOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcepts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch gender and race concepts
        const concepts = await ConceptService.apiConceptList('Gender,Race', 'pt');
        
        // Process gender options
        setGenderOptions(
          concepts
            .filter(concept => concept.concept_class === 'Gender')
            .filter(concept => concept.concept_name != null)
            .map(concept => ({
              value: concept.concept_id,
              label: concept.translated_name || concept.concept_name || ''
            }))
        );
        
        // Process race options
        setRaceOptions(
          concepts
            .filter(concept => concept.concept_class === 'Race')
            .filter(concept => concept.concept_name != null)
            .map(concept => ({
              value: concept.concept_id,
              label: concept.translated_name || concept.concept_name || ''
            }))
        );
      } catch (error) {
        console.error('Error fetching demographic concepts:', error);
        setError('Erro ao carregar opções do servidor. Tente novamente mais tarde.');
        
        // Fallback options
        setGenderOptions([
          { value: 8532, label: "Feminino" },
          { value: 8507, label: "Masculino" },
          { value: 33284, label: "Não-binário" },
          { value: 0, label: "Outro" },
          { value: 0, label: "Prefiro não informar" }
        ]);
        
        setRaceOptions([
          { value: 8527, label: "Branca" },
          { value: 8516, label: "Preta" },
          { value: 8514, label: "Parda" },
          { value: 8515, label: "Amarela" },
          { value: 38003574, label: "Indígena" }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConcepts();
  }, []);

  return {
    genderOptions,
    raceOptions,
    isLoading,
    error
  };
}

/**
 * Hook to load location concepts for UserInfoForm2
 */
export function useLocationConcepts(): LocationConceptsResult {
  const [stateOptions, setStateOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcepts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch location concepts
        const concepts = await ConceptService.apiConceptList('Brazil States', 'pt');
        
        // Process state options
        setStateOptions(
          concepts
            .filter(concept => concept.concept_class === 'Brazil States')
            .filter(concept => concept.concept_name != null)
            .map(concept => ({
              value: concept.concept_id,
              label: concept.translated_name || concept.concept_name || ''
            }))
        );
      } catch (error) {
        console.error('Error fetching location concepts:', error);
        setError('Erro ao carregar opções do servidor. Tente novamente mais tarde.');
        
        // Fallback options
        setStateOptions([
          { value: "AC", label: "AC" },
          { value: "SP", label: "SP" }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConcepts();
  }, []);

  return {
    stateOptions,
    isLoading,
    error
  };
}