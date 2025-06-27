import { useState, useEffect } from 'react';
import { ConceptService } from '@/api/services/ConceptService';

// Shared interfaces to represent a select option
export interface SelectOption {
  value: string | number; // The value of the option
  label: string; // The label to display for the option
}

// Base interface for loading results, includes loading and error state
interface BaseConceptLoaderResult {
  isLoading: boolean; // Indicates if the loading is in progress
  error: string | null; // Error message if an error occurs
}

// Type for the health concepts hook result
interface HealthConceptsResult extends BaseConceptLoaderResult {
  sleepHealthOptions: SelectOption[]; // Options for sleep health
  exerciseOptions: SelectOption[]; // Options for exercise
  eatingHabitsOptions: SelectOption[]; // Options for eating habits
  comorbiditiesOptions: SelectOption[]; // Options for comorbidities
  medicationOptions: SelectOption[]; // Options for medications
  substanceOptions: SelectOption[]; // Options for substances
  conceptIds: {
    // Mapping of concept IDs
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
  genderOptions: SelectOption[]; // Options for gender
  raceOptions: SelectOption[]; // Options for race
}

// Type for location concepts hook result
interface LocationConceptsResult extends BaseConceptLoaderResult {
  stateOptions: SelectOption[]; // Options for states
}

// Type for interest areas concepts hook result
interface InterestAreasConceptsResult extends BaseConceptLoaderResult {
  interestAreasOptions: SelectOption[]; // Options for interest areas
}

/**
 * Hook to load health concepts for UserInfoForm3
 *
 * @returns {HealthConceptsResult} The health concepts options and loading state.
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
    selfReported: 38000280,
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
          undefined,
          'pt',
        );

        // Process sleep health options
        setSleepHealthOptions(
          concepts
            .filter((concept) => concept.concept_class === QUALITY_CLASS)
            .map((concept) => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || '',
            })),
        );

        // Process exercise options
        setExerciseOptions(
          concepts
            .filter((concept) => concept.concept_class === FREQUENCY_CLASS)
            .map((concept) => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || '',
            })),
        );

        // Process eating habits options
        setEatingHabitsOptions(
          concepts
            .filter((concept) => concept.concept_class === QUALITY_CLASS)
            .map((concept) => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || '',
            })),
        );

        // Process comorbidities options
        setComorbiditiesOptions(
          concepts
            .filter((concept) => concept.concept_class === COMORBIDITY_CLASS)
            .map((concept) => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || '',
            })),
        );

        // Process medication options
        setMedicationOptions(
          concepts
            .filter((concept) => concept.concept_class === MEDICATION_CLASS)
            .map((concept) => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || '',
            })),
        );

        // Process substance options
        setSubstanceOptions(
          concepts
            .filter((concept) => concept.concept_class === SUBSTANCE_CLASS)
            .map((concept) => ({
              value: concept.concept_id.toString(),
              label: concept.translated_name || concept.concept_name || '',
            })),
        );
      } catch (error) {
        console.error('Error fetching health concepts:', error);
        setError('Erro ao carregar opções. Algumas funcionalidades podem estar limitadas.');

        // Set fallback options
        setSleepHealthOptions([
          { value: 'good', label: 'Durmo bem' },
          { value: 'fair', label: 'Durmo razoavelmente' },
          { value: 'poor', label: 'Durmo mal' },
        ]);

        setExerciseOptions([
          { value: 'regular', label: 'Regularmente' },
          { value: 'occasional', label: 'Ocasionalmente' },
          { value: 'rare', label: 'Raramente' },
          { value: 'never', label: 'Nunca' },
        ]);

        setEatingHabitsOptions([
          { value: 'good', label: 'Me alimento bem' },
          { value: 'fair', label: 'Me alimento razoavelmente' },
          { value: 'poor', label: 'Me alimento mal' },
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
    error,
  };
}

/**
 * Hook to load demographic concepts for UserInfoForm
 *
 * @returns {DemographicConceptsResult} The demographic concepts options and loading state.
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
        const concepts = await ConceptService.apiConceptList('Gender,Race', undefined, '297504001');

        // Process gender options
        setGenderOptions(
          concepts
            .filter((concept) => concept.concept_class === 'Gender')
            .filter((concept) => concept.concept_name != null)
            .map((concept) => ({
              value: concept.concept_id,
              label: concept.translated_name || concept.concept_name || '',
            })),
        );

        // Process race options
        setRaceOptions(
          concepts
            .filter((concept) => concept.concept_class === 'Race')
            .filter((concept) => concept.concept_name != null)
            .map((concept) => ({
              value: concept.concept_id,
              label: concept.translated_name || concept.concept_name || '',
            })),
        );
      } catch (error) {
        console.error('Error fetching demographic concepts:', error);
        setError('Erro ao carregar opções do servidor. Tente novamente mais tarde.');

        // Fallback options
        setGenderOptions([
          { value: 8532, label: 'Feminino' },
          { value: 8507, label: 'Masculino' },
          { value: 33284, label: 'Não-binário' },
          { value: 0, label: 'Outro' },
          { value: 0, label: 'Prefiro não informar' },
        ]);

        setRaceOptions([
          { value: 8527, label: 'Branca' },
          { value: 8516, label: 'Preta' },
          { value: 8514, label: 'Parda' },
          { value: 8515, label: 'Amarela' },
          { value: 38003574, label: 'Indígena' },
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
    error,
  };
}

/**
 * Hook to load location concepts for UserInfoForm2
 *
 * @returns {LocationConceptsResult} The location concepts options and loading state.
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
        const concepts = await ConceptService.apiConceptList('Brazil States', undefined, 'pt');

        // Process state options
        setStateOptions(
          concepts
            .filter((concept) => concept.concept_class === 'Brazil States')
            .filter((concept) => concept.concept_name != null)
            .map((concept) => ({
              value: concept.concept_id,
              label: concept.translated_name || concept.concept_name || '',
            })),
        );
      } catch (error) {
        console.error('Error fetching location concepts:', error);
        setError('Erro ao carregar opções do servidor. Tente novamente mais tarde.');

        // Fallback options
        setStateOptions([
          { value: 'AC', label: 'AC' },
          { value: 'SP', label: 'SP' },
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
    error,
  };
}

/**
 * Hook to load interest areas concepts for UserMainPage
 *
 * @returns {InterestAreasConceptsResult} The interest areas concepts options and loading state.
 */
export function useInterestAreasConcepts(): InterestAreasConceptsResult {
  const [interestAreasOptions, setInterestAreasOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcepts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch interest areas concepts
        const concepts = await ConceptService.apiConceptList('Interest', undefined, 'pt');

        // Process interest areas options
        setInterestAreasOptions(
          concepts
            .filter((concept) => concept.concept_class === 'Interest')
            .filter((concept) => concept.concept_name != null)
            .map((concept) => ({
              value: concept.concept_id,
              label: concept.translated_name || concept.concept_name || '',
            }))
            .filter(
              (option) =>
                option.label !== 'Área de Interesse' && option.label !== 'Interesse Personalizado',
            ),
        );
      } catch (error) {
        console.error('Error fetching interest areas concepts:', error);
        setError('Erro ao carregar áreas de interesse. Tente novamente mais tarde.');

        // Fallback options
        setInterestAreasOptions([
          { value: 1001, label: 'Saúde Mental' },
          { value: 1002, label: 'Nutrição' },
          { value: 1003, label: 'Exercício Físico' },
          { value: 1004, label: 'Saúde da Mulher' },
          { value: 1005, label: 'Saúde do Idoso' },
          { value: 1006, label: 'Saúde Infantil' },
          { value: 1007, label: 'Doenças Crônicas' },
          { value: 1008, label: 'Prevenção' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConcepts();
  }, []);

  return {
    interestAreasOptions,
    isLoading,
    error,
  };
}
