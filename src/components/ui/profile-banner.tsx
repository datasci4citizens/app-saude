import React from "react";
import header from "@/lib/images/header.png"

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
      className="relative bg-homebg p-6 text-primary-foreground overflow-hidden h-48 w-full shadow-md"
      onClick={onClick}
    >
      {/* Shapes decorativos - same as HomeBanner */}
      <img
        src={header}
        alt="Decorative Shape"
        className="absolute top-0 right-0 left-0 w-full h-auto z-1 pointer-events-none select-none"
      />

      {/* Conteúdo do perfil */}
      <div className="relative flex flex-col items-center justify-center h-full z-10">
        {/* Profile image */}
        <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-2">
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="mgc_user_3_line text-3xl text-white"></span>
          )}
        </div>

        {/* Name */}
        <h2 className="text-[20px] font-bold m-0 font-inter text-white text-center">
          {name}
        </h2>

        {/* Edit button - optional */}
        {onEditClick && (
          <div
            className="absolute top-6 right-6 bg-background w-10 h-10 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
          >
            <span className="mgc_pencil_line text-xl text-success"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBanner;