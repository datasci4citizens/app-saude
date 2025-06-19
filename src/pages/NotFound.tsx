import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/forms/button";
import image from "@/lib/images/error.png";

/**
 * NotFound component shown when a route doesn't match.
 */
export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-center h-screen w-full bg-background px-6 lg:px-20 gap-10 animate-fadeIn">
      {/* Text Section */}
      <div className="text-center lg:text-left max-w-lg animate-slide-in-from-left">
        <h1 className="text-[80px] leading-none font-bold text-destructive mb-4 font-work-sans animate-bounce">
          404
        </h1>
        <p className="text-typography text-lg font-inter mb-6">
          Oops! A página que você está procurando não existe ou foi movida.
        </p>
        <Button
          variant="orange"
          onClick={() => navigate("/")}
          className="px-6 py-3 text-desc-titulo font-semibold shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
        >
          Voltar para a página inicial
        </Button>
      </div>

      {/* Image Section */}
      <div className="max-w-md w-full animate-slide-in-from-right">
        <img
          src={image}
          alt="Ilustração de página não encontrada"
          className="w-full object-contain drop-shadow-xl transition-transform duration-700 hover:scale-105"
        />
      </div>
    </div>
  );
};
