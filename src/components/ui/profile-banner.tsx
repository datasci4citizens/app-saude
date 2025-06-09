import React from "react";
import header from "@/lib/images/header.png";

interface ProfileBannerProps {
  name?: string;
  profileImage?: string;
  onClick?: () => void;
  onEditClick?: () => void;
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({
  name = "Nome",
  profileImage,
  onClick,
  onEditClick,
}) => {
  return (
    <div
      className="relative bg-homebg p-6 text-primary-foreground overflow-hidden h-48 w-full shadow-md flex items-center"
      onClick={onClick}
    >
      {/* Shapes decorativos - same as HomeBanner */}
      <img
        src={header}
        alt="Decorative Shape"
        className="absolute top-0 right-0 left-0 w-full h-auto z-1 pointer-events-none select-none"
      />

      {/* Conteúdo do perfil */}
        <div className="absolute z-10 w-28 left-1/2 -translate-x-1/2 top-10 flex flex-col items-center">
          {/* Profile image */}
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white bg-white bg-opacity-10 backdrop-blur-sm">
            {profileImage ? (
              <img
                src={profileImage}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="mgc_user_3_line text-4xl text-white flex items-center justify-center w-full h-full"></span>
            )}
          </div>
          {/* Name (opcional) */}
          <p className="mt-2 text-white font-semibold text-center leading-snug break-words max-w-[160px]">
            {name}
          </p>


        {/* Edit button - optional */}
        {onEditClick && (
          <div
            className="absolute -top-2 -right-2 bg-background w-8 h-8 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
          >
            <span className="mgc_pencil_line text-base text-success"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBanner;
