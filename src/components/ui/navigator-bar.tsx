import React from "react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavigationBarProps {
  variant?: "user" | "acs";
  forceActiveId?: string | null;
  onItemClick?: (itemId: string) => void;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  variant = "user",
  forceActiveId = null,
  onItemClick,
}) => {
  const navItemVariants = {
    user: [
      {
        id: "home",
        label: "Casa",
        icon: (
          <span role="img" aria-label="home" className="mgc_home_4_line"></span>
        ),
      },
      {
        id: "diary",
        label: "Diário",
        icon: (
          <span role="img" aria-label="book" className="mgc_book_6_line"></span>
        ),
      },
      {
        id: "emergency",
        label: "Ajuda",
        icon: (
          <span
            role="img"
            aria-label="warning"
            className="mgc_alert_line"
          ></span>
        ),
      },
      {
        id: "profile",
        label: "Eu",
        icon: (
          <span role="img" aria-label="user" className="mgc_user_3_line"></span>
        ),
      },
    ],
    acs: [
      {
        id: "home",
        label: "Casa",
        icon: (
          <span role="img" aria-label="home" className="mgc_home_4_line"></span>
        ),
      },
      {
        id: "patients",
        label: "Pacientes",
        icon: (
          <span
            role="img"
            aria-label="patients"
            className="mgc_group_3_line"
          ></span>
        ),
      },
      {
        id: "profile",
        label: "Eu",
        icon: (
          <span role="img" aria-label="user" className="mgc_user_3_line"></span>
        ),
      },
    ],
  };

  const navItems = navItemVariants[variant];

  return (
    <div className="flex justify-around items-center py-2.5 bg-primary w-full fixed bottom-0 left-0 shadow-[0_-1px_5px_rgba(0,0,0,0.1)] border-t border-input z-50">
      {navItems.map((item) => {
        const isActive = forceActiveId === item.id;

        return (
          <button
            key={item.id}
            className={`
              flex flex-col items-center font-medium text-xs font-inter
              ${navItems.length ? `w-[${100 / navItems.length}%]` : "w-1/5"}
              focus:outline-none
            `}
            onClick={() => onItemClick?.(item.id)}
            aria-current={isActive ? "page" : undefined}
          >
            <div
              className={`
                flex justify-center items-center w-10 h-10 mb-1 text-2xl rounded-[10px]
                transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? "bg-selection text-gray2"
                    : "bg-primary text-gray2 hover:bg-primary-hover"
                }
              `}
            >
              {item.icon}
            </div>
            <div
              className={`
                text-center text-[13px] leading-3
                font-inter font-medium
                ${isActive ? "text-gray2 font-semibold" : "text-gray2"}
              `}
            >
              {item.label}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavigationBar;
