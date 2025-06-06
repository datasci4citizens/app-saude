import React, { useState } from "react";

interface PatientButtonProps {
  variant?: "patient" | "emergency";
  name: string;
  age?: number;
  lastEmergency?: string;
  lastVisit?: string;
  active?: boolean;
  onClick?: () => void;
  onClickEmergency?: () => void;
}

const PatientButton: React.FC<PatientButtonProps> = ({
  variant = "patient",
  name,
  age,
  lastEmergency,
  lastVisit,
  active = false,
  onClick,
  onClickEmergency,
}) => {
  const isEmergency = variant === "emergency";

  return (
    <div
      className={`
                rounded-xl
                p-4
                mb-4
                w-full
                max-w-[600px]
                transition-all
                duration-200
                ease-in-out
                cursor-pointer
                hover:-translate-y-0.5
                ${isEmergency ? "bg-selection" : "bg-offwhite"}
                ${isEmergency ? "hover:shadow-[0_6px_12px_rgba(250,110,90,0.25)]" : "hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)]"}
                shadow-sm
            `}
      onClick={onClick}
    >
      <div className="flex flex-col gap-1">
        <div
          className={`
                    text-titulowindow // Changed from text-lg font-bold
                    mb-1.5
                    font-inter
                    ${isEmergency ? "text-primary-foreground" : "text-typography"}
                `}
        >
          {name}
          {age ? ` - ${age} anos` : ""}
        </div>
        <div
          className={`
                    text-desc-titulo // Changed from text-xs font-normal
                    mb-0.5
                    font-inter
                    ${isEmergency ? "text-primary-foreground" : "text-typography"}
                `}
        >
          Última consulta: {lastVisit || "Nenhuma"}
        </div>
        {isEmergency ? (
          <div
            className={`text-topicos text-primary-foreground mt-1.5 font-inter`} // Changed from font-bold text-xs
            onClick={(e) => {
              e.stopPropagation();
              if (onClickEmergency) onClickEmergency();
            }}
          >
            PEDIDO DE AJUDA ATIVO DESDE {lastEmergency}
          </div>
        ) : (
          <div
            className={`
                        text-desc-titulo // Changed from text-xs font-normal
                        mb-0.5
                        font-inter
                        ${isEmergency ? "text-primary-foreground" : "text-typography"}
                    `}
          >
            Último pedido de ajuda: {lastEmergency || "Nenhum"}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientButton;
