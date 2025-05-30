import React from "react";
import header from "@/lib/images/header.png"

interface HomeBannerProps {
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  onIconClick?: () => void;
}

const HomeBanner: React.FC<HomeBannerProps> = ({
  title = "Registro diário",
  subtitle = "Registre agora",
  onClick,
  onIconClick,
}) => {
  return (
    <div
      className="relative bg-homebg p-6 text-primary-foreground overflow-hidden h-40 w-full cursor-pointer shadow-md"
      onClick={onClick}
    >
      {/* Shapes decorativos */}
      <img
        src={header}
        alt="Decorative Shape"
        className="absolute top-0 right-0 left-0 w-full h-auto z-1 pointer-events-none select-none"
      />

      {/* Conteúdo */}
      <div className="relative flex justify-between items-start h-full z-10">
        <div>
          <h2 className="text-[28px] font-bold m-0 mb-1 font-inter">{title}</h2>
          <p className="text-xs m-0 opacity-90 tracking-wider font-inter font-medium">
            {subtitle}
          </p>
        </div>

        {/* Ícone de editar com evento de clique próprio */}
        <div
          className="bg-background w-11 h-11 rounded-full flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation(); // Impede que o clique ative também o onClick do banner
            if (onIconClick) onIconClick();
          }}
        >
          <span className="mgc_pencil_line text-2xl text-success"></span>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;

// Usage example - Comentando para evitar erros
/* 
const handleBannerClick = () => {
  console.log('Banner clicked');
};

const handleBannerIconClick = () => {
  console.log('Icon clicked');
};

<HomeBanner
    title="Registro diário"
    subtitle="Cheque registro dos seus pacientes"
    onClick={handleBannerClick}
    onIconClick={handleBannerIconClick}
/>
*/
