import React from 'react';

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
  onIconClick
}) => {
  return (
    <div 
      className="relative bg-success p-6 text-primary-foreground overflow-hidden h-40 w-full cursor-pointer shadow-md"
      onClick={onClick}
    >
      {/* Shapes decorativos */}
      <div className="absolute -top-[50px] right-5 w-[120px] h-[120px] rounded-full bg-white bg-opacity-10 z-[1]"></div>
      <div className="absolute top-10 -right-5 w-[100px] h-[100px] rounded-full bg-white bg-opacity-10 z-[1]"></div>
      <div className="absolute -bottom-10 left-[30%] w-[180px] h-[180px] rounded-full bg-white bg-opacity-10 z-[1]"></div>
      
      {/* Conteúdo */}
      <div className="relative flex justify-between items-start h-full z-10">
        <div>
          <h2 className="text-[28px] font-bold m-0 mb-1 font-inter">{title}</h2>
          <p className="text-xs m-0 opacity-90 tracking-wider font-inter font-medium">{subtitle}</p>
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