import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import HabitCard from "@/components/ui/habit-card";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/forms/text_input";
import { Eye } from "lucide-react";
import type { InterestArea, InterestAreaTrigger } from "@/api";

interface UserInterest {
  observation_id?: number;
  provider_name?: string;
  shared?: boolean;
  interest_area: InterestArea;
  triggerResponses?: Record<string, string>;
}

interface CollapsibleInterestCardProps {
  interest: UserInterest;
  isOpen: boolean;
  onToggle: () => void;
  onSharingToggle: (shared: boolean) => void;
  onTriggerResponseChange: (triggerName: string, response: string) => void;
  readOnly?: boolean;
}

const CollapsibleInterestCard: React.FC<CollapsibleInterestCardProps> = ({
  interest,
  isOpen,
  onToggle,
  onSharingToggle,
  onTriggerResponseChange,
  readOnly = false,
}) => {
  const interestName = interest.interest_area.name || "Interesse";

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("input") ||
      (e.target as HTMLElement).closest("[role='switch']")
    ) {
      return;
    }
    onToggle();
  };

  // Get response for a specific trigger by name
  const getResponseForTrigger = (triggerName: string): string | undefined => {
    return interest.triggerResponses?.[triggerName];
  };

  return (
    <div className="space-y-3">
      {/* Card principal clicável */}
      <div
        onClick={handleCardClick}
        className={readOnly ? "cursor-default" : "cursor-pointer"}
      >
        <HabitCard
          title={interestName}
          isAttentionPoint={interest.interest_area.is_attention_point}
          providerName={interest.provider_name}
          isOpen={isOpen}
          readOnly={readOnly}
        />
      </div>

      {/* Toggle de compartilhamento */}
      <div className="flex items-center justify-end gap-2 pr-2">
        {readOnly ? (
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {interest.shared
                ? "Compartilhado com profissionais"
                : "Não compartilhado"}
            </span>
          </div>
        ) : (
          <>
            <span className="text-sm text-gray-500 italic">
              Compartilhar com profissionais
            </span>
            <Switch
              checked={interest.shared || false}
              onCheckedChange={onSharingToggle}
            />
          </>
        )}
      </div>

      {/* Área collapsible com triggers */}
      <AnimatePresence initial={false}>
        {isOpen &&
          interest.interest_area.triggers &&
          interest.interest_area.triggers.length > 0 && (
            <motion.div
              key="triggers-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden ml-4 space-y-4 border-l-2 border-gray2 pl-4"
            >
              {interest.interest_area.triggers.map((trigger, index) => (
                <TriggerItem
                  key={`${interest.interest_area.name}-trigger-${index}`}
                  trigger={trigger}
                  response={getResponseForTrigger(trigger.name)}
                  onResponseChange={(response) =>
                    onTriggerResponseChange(trigger.name, response)
                  }
                  readOnly={readOnly}
                />
              ))}
            </motion.div>
          )}
      </AnimatePresence>

      {/* Mensagem quando não há triggers */}
      <AnimatePresence initial={false}>
        {isOpen &&
          (!interest.interest_area.triggers ||
            interest.interest_area.triggers.length === 0) && (
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
  trigger: InterestAreaTrigger;
  response?: string;
  onResponseChange: (response: string) => void;
  readOnly?: boolean;
}> = ({ trigger, response, onResponseChange, readOnly = false }) => {
  const triggerTitle = trigger.name;

  return (
    <div className="space-y-2">
      {/* Título do trigger */}
      <HabitCard
        title={triggerTitle}
        className="bg-selection inline-block w-auto min-w-fit max-w-full text-sm"
        readOnly={readOnly}
      />

      {/* Campo de texto para resposta */}
      {readOnly ? (
        <div className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200 min-h-[60px]">
          {response ? (
            <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
          ) : (
            <p className="text-gray-400 italic">Sem resposta registrada</p>
          )}
        </div>
      ) : (
        <TextField
          id={`trigger-${trigger.name}`}
          name={`trigger-${trigger.name}`}
          value={response || ""}
          onChange={(e) => onResponseChange(e.target.value)}
          placeholder={`Responda sobre: ${triggerTitle}`}
          className="border-gray-300 border-2 focus:border-orange-400"
          multiline={true}
          rows={2}
        />
      )}
    </div>
  );
};

export default CollapsibleInterestCard;
