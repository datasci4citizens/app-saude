import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileBanner from "@/components/ui/profile-banner";
import BottomNavigationBar from "@/components/ui/navigator-bar";

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
  const navigate = useNavigate();

  const menuItems: ProfileMenuItem[] = [
    {
      title: "Histórico de diários",
      onClick: () => navigate("/my-diaries"),
      hasArrow: true,
    },
    {
      title: "Adicionar profissional da saúde",
      onClick: () => navigate("/add-professional"),
      hasArrow: true,
    },
    {
      title: "Termos e condições",
      onClick: () => navigate("/terms"),
      hasArrow: true,
    },
    {
      title: "Logout",
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/welcome");
      },
      hasArrow: false,
    },
  ];

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case "home":
        navigate("/user-main-page");
        break;
      case "meds":
        navigate("/reminders");
        break;
      case "diary":
        navigate("/diary");
        break;
      case "emergency":
        navigate("/emergency-user");
        break;
      case "profile":
        break;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Profile Banner */}
      <ProfileBanner
        name={name}
        profileImage={profileImage}
        onEditClick={onEditProfile}
      />

      {/* Menu Items */}
      <div className="z-10 h-[calc(100vh-12rem)] mt-[-15px]">
        <ul className="px-4 bg-primary rounded-xl shadow-sm overflow-hidden h-full pt-4">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <li
                className="px-4 py-4 flex justify-between items-center cursor-pointer hover:bg-gray1 transition-colors rounded-md"
                onClick={item.onClick}
              >
                <span className="text-typography font-inter text-sm">
                  {item.title}
                </span>
                {item.hasArrow && (
                  <span className="mgc_right_line text-md"></span>
                )}
              </li>
              {index < menuItems.length - 1 && (
                <div className="border-b border-gray1 mx-4"></div>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
      <BottomNavigationBar
        variant="user"
        initialActiveId="profile"
        onItemClick={handleNavigationClick}
      />
    </div>
  );
};

export default ProfilePage;
