import { useNavigate } from "react-router-dom";
import HomeBanner from "@/components/ui/home-banner";
import InfoCard from "@/components/ui/info-card";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import useSWR from "swr";

import { DrugExposureService } from "@/api/services/DrugExposureService";
import { ConceptService } from "@/api/services/ConceptService";
import { VisitOccurrenceService } from "@/api/services/VisitOccurrenceService";
import { ApiService } from "@/api/services/ApiService";
import { PersonService } from "@/api/services/PersonService";
import { ProviderService } from "@/api/services/ProviderService";

import type { ConceptRetrieve } from "@/api/models/ConceptRetrieve";
import type { DrugExposureRetrieve } from "@/api";
import type { VisitOccurrenceRetrieve } from "@/api/models/VisitOccurrenceRetrieve";

// Fetch medications for a specific person
const medicationsFetcher = async (keys: [string, number]) => {
  const [_keyName, person_id] = keys;

  const allDrugExposures = await DrugExposureService.apiDrugExposureList();

  // Filter for the specific person and type concept
  return allDrugExposures.filter(
    (exposure) =>
      exposure.person === person_id && exposure.drug_type_concept === 9000028,
  );
};

// Fetch medication names using concept IDs
const medicationsNameFetcher = async (
  key: string,
  drugExposures: DrugExposureRetrieve[],
) => {
  if (!drugExposures || drugExposures.length === 0) return [];

  const drugNames: ConceptRetrieve[] = [];
  for (const exposure of drugExposures) {
    if (exposure.drug_concept) {
      try {
        const conceptData = await ConceptService.apiConceptRetrieve(
          Number(exposure.drug_concept),
        );
        drugNames.push(conceptData);
      } catch (error) {
        console.error(
          `Failed to fetch concept for drug_concept ${exposure.drug_concept}:`,
          error,
        );
      }
    }
  }
  return drugNames;
};

const idFetcher = async () => {
  const id = await ApiService.apiUserEntityRetrieve();
  return id.person_id;
};

// Fetch consultations for a specific person and provider
const consultationsFetcher = async (keys: [string, number, number]) => {
  const [_keyName, person_id, provider_id] = keys;

  const allVisitOccurrences =
    await VisitOccurrenceService.apiVisitOccurrenceList();

  // Filter for the specific person and provider
  return allVisitOccurrences.filter(
    (visit) => visit.person === person_id && visit.provider === provider_id,
  );
};

// Fetch provider names using provider IDs
const providerNameFetcher = async (key: string, providerId: number) => {
  try {
    const providerData = await ProviderService.apiProviderRetrieve(providerId);
    return providerData.social_name || `Provider ${providerId}`;
  } catch (error) {
    console.error(
      `Failed to fetch provider for provider_id ${providerId}:`,
      error,
    );
    return `Provider ${providerId}`;
  }
};

// Fetch consultations with provider names
const consultationsWithProviderNamesFetcher = async (
  keys: [string, number, number],
) => {
  const consultations = await consultationsFetcher(keys);

  const consultationsWithNames = await Promise.all(
    consultations.map(async (visit) => {
      const providerName = visit.provider
        ? await providerNameFetcher("providerName", visit.provider)
        : "Unknown Provider";

      return {
        doctor: providerName, // Nome do provider
        time: visit.visit_start_date
          ? new Date(visit.visit_start_date).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            }) // Data e hora formatadas
          : "Horário não definido",
      };
    }),
  );

  return consultationsWithNames;
};

export default function AcsMainPage() {
  const navigate = useNavigate();

  // Fetch person_id using SWR
  const {
    data: person_id,
    error: personIdError,
    isLoading: isPersonIdLoading,
  } = useSWR("userId", idFetcher);
  const provider_id = 1; // Definir o provider_id que queremos usar

  // Funções de navegação
  const handleEmergencyClick = () => {
    navigate("/emegency-user");
  };

  const handleAppointmentClick = () => {
    navigate("/reminders");
  };

  const handleBannerIconClick = () => {
    navigate("/diary");
  };

  // Fetch medication exposures
  const {
    data: drugExposures,
    error: drugExposuresError,
    isLoading: isDrugExposuresLoading,
  } = useSWR(["drugExposureFiltered", person_id], medicationsFetcher);

  // Fetch medication names only if we have drugExposures
  const {
    data: medicationNames,
    error: medicationNamesError,
    isLoading: isMedicationNamesLoading,
  } = useSWR(drugExposures ? ["medicationNames", drugExposures] : null, (key) =>
    medicationsNameFetcher(key, drugExposures),
  );

  // Fetch consultations with provider names
  const {
    data: consultationItems,
    error: consultationsError,
    isLoading: isConsultationsLoading,
  } = useSWR(
    ["consultations", person_id, provider_id],
    consultationsWithProviderNamesFetcher,
  );

  // Handle loading state
  if (
    isDrugExposuresLoading ||
    isMedicationNamesLoading ||
    isConsultationsLoading
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading data...
      </div>
    );
  }

  // Handle error states
  if (drugExposuresError) {
    return (
      <div className="text-selection p-4">
        Error fetching drug exposures: {drugExposuresError.message}
      </div>
    );
  }

  if (medicationNamesError) {
    return (
      <div className="text-selection p-4">
        Error fetching medication names: {medicationNamesError.message}
      </div>
    );
  }

  if (consultationsError) {
    return (
      <div className="text-selection p-4">
        Error fetching consultations: {consultationsError.message}
      </div>
    );
  }

  // Prepare medication data for display - use translated_name as fallback if concept_name is null
  const medicationItems =
    medicationNames?.map((concept) => ({
      doctor:
        concept.concept_name || concept.translated_name || "Unknown Medication",
      time: "Daily", // You might want to fetch actual dosage information
    })) || [];

  const handleNavigationClick = (itemId) => {
    switch (itemId) {
      case "home":
        // Já estamos na home
        break;
      case "meds":
        navigate("/reminders");
        break;
      case "diary":
        navigate("/diary");
        break;
      case "emergency":
        navigate("/emergency-user");
        break;
      case "profile":
        navigate("/add-professional");
        break;
    }
  };

  return (
    <div className="bg-primary h-full pb-24" style={{ minHeight: "100vh" }}>
      {/* Banner superior */}
      <HomeBanner
        title="Registro diário"
        subtitle="Cheque registro dos seus pacientes"
        onIconClick={handleBannerIconClick}
      />

      {/* Container para os cards */}
      <div className="px-4 py-5 flex justify-center gap-4">
        {/* Card de Medicamentos - usando dados da API */}
        <InfoCard
          variant="consultations"
          title="Remédios"
          consultations={
            medicationItems.length > 0
              ? medicationItems
              : [{ doctor: "Nenhum medicamento encontrado", time: "" }]
          }
          onClick={handleAppointmentClick}
        />

        {/* Card de Próxima Consulta */}
        <InfoCard
          variant="consultations"
          title="Consultas"
          consultations={
            consultationItems.length > 0
              ? consultationItems
              : [{ doctor: "Nenhuma consulta encontrada", time: "" }]
          }
          onClick={handleAppointmentClick}
        />
      </div>

      {/* Barra de navegação */}
      <BottomNavigationBar
        variant="user"
        initialActiveId="home"
        onItemClick={handleNavigationClick}
      />
    </div>
  );
}
