import React from "react";
import ProfileBanner from "../../../components/ui/profile-banner";

interface ProfileMenuItem {
  title: string;
  onClick: () => void;
  hasArrow?: boolean;
}

interface ProfilePageProps {
  name?: string;
  profileImage?: string;
  onEditProfile?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  name = "Nome",
  profileImage,
  onEditProfile,
}) => {
  const menuItems: ProfileMenuItem[] = [
    {
      title: "Histórico de diários",
      onClick: () => console.log("Navegando para histórico de diários"),
      hasArrow: true,
    },
    {
      title: "Adicionar profissional da saúde/Agente Comunitário de Saúde (ACS)",
      onClick: () => console.log("Navegando para adicionar profissional"),
      hasArrow: true,
    },
    {
      title: "Termos e condições",
      onClick: () => console.log("Navegando para termos e condições"),
      hasArrow: true,
    },
    {
      title: "Logout",
      onClick: () => console.log("Realizando logout"),
      hasArrow: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Profile Banner */}
      <ProfileBanner
        name={name}
        profileImage={profileImage}
        onEditClick={onEditProfile}
      />

      {/* Menu Items */}
      <div className="mt-[-10px] z-10 h-[calc(100vh-12rem)] pt-6">
        <ul className="px-4 bg-white rounded-xl shadow-sm overflow-hidden h-full">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <li
                className="px-4 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={item.onClick}
              >
                <span className="text-gray-800 font-inter text-sm">
                  {item.title}
                </span>
                {item.hasArrow && (
                  <span className="mgc_right_line text-md">
                  </span>
                )}
              </li>
              {index < menuItems.length - 1 && (
                <div className="border-b border-gray-100 mx-4"></div>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;