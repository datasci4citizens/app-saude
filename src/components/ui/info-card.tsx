import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/forms/button";

type InfoCardVariant = "emergency" | "appointment" | "consultations";

// Interface para itens de consulta
interface ConsultationItem {
  doctor: string;
  time: string;
}

interface InfoCardProps {
  variant: InfoCardVariant;
  title?: string;
  name?: string;
  subtitle?: string;
  count?: number;
  date?: string;
  time?: string;
  consultations?: ConsultationItem[];
  onClick?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
  variant,
  name,
  title = "Próxima consulta",
  subtitle,
  count,
  date,
  time,
  consultations = [],
  onClick,
}) => {
  const isEmergency = variant === "emergency";
  const isConsultations = variant === "consultations";

  return (
    <Card
      className={`
        w-full 
        rounded-xl 
        h-[250px] 
        overflow-hidden
        ${isEmergency ? "bg-accent1  " : "bg-offwhite"}
      `}
    >
      <CardContent className="p-0 h-full">
        {isEmergency ? (
          /* Card de Emergência */
          <div className="flex flex-col h-full">
            {/* Conteúdo principal centralizado */}
            <div className="flex flex-col items-center pt-4 flex-grow">
              {/* Ícone de alerta */}
              <div className="mb-3">
                <span
                  role="img"
                  className="mgc_alert_diamond_line text-[60px] w-[60px] h-[60px] inline-block text-selection"
                ></span>
              </div>

              {/* Número de emergências */}
              <div className="text-4xl text-typography font-bold mb-1">{count}</div>

              {/* Texto fixo de emergências */}
              <div className="text-xs font-bold mb-4 text-typography">PEDIDOS(S) DE AJUDA</div>
            </div>

            {/* Container do botão alinhado à direita inferior */}
            <div className="mt-auto p-4 flex justify-end">
              <Button
                className="rounded-full px-6 py-2 text-sm bg-typography text-offwhite-foreground hover:bg-primary/90"
                onClick={onClick}
              >
                VER
              </Button>
            </div>
          </div>
        ) : isConsultations ? (
          /* Card de Lista de Consultas */
          <div className="flex flex-col h-full, bg-offwhite">
            {/* Cabeçalho */}
            <div className="p-4 pb-2">
              <h3 className="text-lg font-bold font-inter text-typography mb-1">
                {title}
              </h3>

              {/* Lista de consultas */}
              <div className="mt-3">
                {consultations.map((consultation, index) => (
                  <div key={index} className="mb-2">
                    <div className="text-xs font-inter text-typography mb-0.5">
                      {consultation.doctor}
                    </div>
                    <div className="text-xs text-black font-inter mb-3">
                      {consultation.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão VER com fundo laranja */}
            <div className="mt-auto p-4 pt-2 flex justify-center">
              <Button
                onClick={onClick}
                className="rounded-full px-6 py-2 text-sm bg-selection text-primary hover:bg-primary/90"
              >
                VER
              </Button>
            </div>
          </div>
        ) : (
          /* Card de Próxima Consulta (original) */
          <div className="flex flex-col h-full">
            {/* Cabeçalho */}
            <div className="flex flex-col items-center pt-4 flex-grow">
              <h3 className="text-lg font-bold font-inter text-typography mb-1">
                {title}:
              </h3>
              <p className="font-bold text-lg leading-tight font-inter text-typography">
                {name}
              </p>
              <div className="text-xs font-medium font-inter text-gray2">
                {date} - {time}
              </div>
            </div>

            {/* Botão VER com fundo laranja */}
            <div className="mt-auto p-4 flex justify-end">
              <Button
                onClick={onClick}
                className="rounded-full px-6 py-2 text-sm bg-selection text-primary hover:bg-primary/90"
              >
                VER
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
