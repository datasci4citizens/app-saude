import React from "react";

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
      className="relative bg-homeblob2 p-6 text-primary-foreground overflow-hidden h-48 w-full shadow-md"
      onClick={onClick}
    >
      {/* Shapes decorativos - same as HomeBanner */}
      <div className="absolute -top-[50px] right-5 w-[120px] h-[120px] rounded-full bg-white bg-opacity-10 z-[1]"></div>
      <div className="absolute top-10 -right-5 w-[100px] h-[100px] rounded-full bg-white bg-opacity-10 z-[1]"></div>
      <div className="absolute -bottom-10 left-[30%] w-[180px] h-[180px] rounded-full bg-white bg-opacity-10 z-[1]"></div>

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