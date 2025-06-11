import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import HabitCard from "@/components/ui/habit-card";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/forms/text_input";

interface Trigger {
  trigger_name: string;
  custom_trigger_name: string | null;
  observation_concept_id: number;
  trigger_id: number;
  value_as_string: string | null;
  response?: string;
  shared?: boolean;
}

interface UserInterest {
  interest_area_id: number;
  interest_name?: string;
  custom_interest_name?: string;
  value_as_string?: string;
  is_attention_point?: boolean;
  provider_name?: string;
  response?: string;
  shared?: boolean;
  triggers?: Trigger[];
}

interface CollapsibleInterestCardProps {
  interest: UserInterest;
  isOpen: boolean;
  onToggle: () => void;
  onResponseChange: (response: string) => void;
  onSharingToggle: (shared: boolean) => void;
  onTriggerResponseChange: (triggerId: number, response: string) => void;
}

const CollapsibleInterestCard: React.FC<CollapsibleInterestCardProps> = ({
  interest,
  isOpen,
  onToggle,
  onResponseChange,
  onSharingToggle,
  onTriggerResponseChange,
}) => {
  const interestName =
    interest.interest_name ||
    interest.custom_interest_name ||
    interest.value_as_string ||
    "Interesse";

  const handleCardClick = (e: React.MouseEvent) => {
    // Evita toggle quando clica em elementos interativos
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("input") ||
      (e.target as HTMLElement).closest("[role='switch']")
    ) {
      return;
    }
    onToggle();
  };

  return (
    <div className="space-y-3">
      {/* Card principal clicável */}
      <div onClick={handleCardClick} className="cursor-pointer">
        <HabitCard
          title={interestName}
          isAttentionPoint={interest.is_attention_point}
          providerName={interest.provider_name}
          isOpen={isOpen}
        />
      </div>

      {/* Toggle de compartilhamento */}
      <div className="flex items-center justify-end gap-2 pr-2">
        <span className="text-sm text-gray-2 italic">
          Compartilhar com profissionais
        </span>
        <Switch
          checked={interest.shared || false}
          onCheckedChange={onSharingToggle}
          size="sm"
        />
      </div>

      {/* Área collapsible com triggers */}
      <AnimatePresence initial={false}>
        {isOpen && interest.triggers && interest.triggers.length > 0 && (
          <motion.div
            key="triggers-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden ml-4 space-y-4 border-l-2 border-gray2 pl-4"
          >
            {interest.triggers.map((trigger) => (
              <TriggerItem
                key={trigger.trigger_id}
                trigger={trigger}
                interestId={interest.interest_area_id}
                onResponseChange={(response) =>
                  onTriggerResponseChange(trigger.trigger_id, response)
                }
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensagem quando não há triggers */}
      <AnimatePresence initial={false}>
        {isOpen && (!interest.triggers || interest.triggers.length === 0) && (
          <motion.div
            key="no-triggers"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden ml-4 pl-4 border-l-2 border-gray2"
          >
            <div className="py-4 text-center">
              <p className="text-sm text-gray2 italic">
                Nenhuma pergunta específica para este interesse
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente separado para cada trigger
const TriggerItem: React.FC<{
  trigger: Trigger;
  interestId: number;
  onResponseChange: (response: string) => void;
}> = ({ trigger, interestId, onResponseChange }) => {
  const triggerTitle =
    trigger.trigger_name ||
    trigger.custom_trigger_name ||
    "Pergunta relacionada";

  return (
    <div className="space-y-2">
      {/* Título do trigger */}
      <HabitCard
        title={triggerTitle}
        className="bg-selection inline-block w-auto min-w-fit max-w-full text-sm"
      />

      {/* Campo de texto para resposta */}
      <TextField
        id={`trigger-${interestId}-${trigger.trigger_id}`}
        name={`trigger-${interestId}-${trigger.trigger_id}`}
        value={trigger.response || ""}
        onChange={(e) => onResponseChange(e.target.value)}
        placeholder={`Responda sobre: ${triggerTitle}`}
        className="border-gray2 border-2 focus:border-selection"
        multiline={true}
        rows={2}
      />
    </div>
  );
};

export default CollapsibleInterestCard;
