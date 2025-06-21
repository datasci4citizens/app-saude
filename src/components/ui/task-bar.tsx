import type React from "react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const navItems: NavItem[] = [
  {
    label: "Casa",
    icon: (
      <span role="img" aria-label="home" className="mgc_home_4_line"></span>
    ),
    active: true,
  },
  {
    label: "Remédios e consultas",
    icon: (
      <span
        role="img"
        aria-label="calendar"
        className="mgc_calendar_line"
      ></span>
    ),
  },
  {
    label: "Diário",
    icon: (
      <span role="img" aria-label="book" className="mgc_book_6_line"></span>
    ),
  },
  {
    label: "Pedidos de Ajuda",
    icon: (
      <span
        role="img"
        aria-label="warning"
        className="mgc_emergency_flashers_line"
      ></span>
    ),
  },
  {
    label: "Eu",
    icon: (
      <span role="img" aria-label="user" className="mgc_user_2_line"></span>
    ),
  },
];

const BottomNavigationBar: React.FC = () => {
  return (
    <div className="flex justify-around items-center bg-background py-2 shadow-sm border-t border-input">
      {navItems.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col items-center text-gray2 font-medium text-xs font-inter cursor-pointer ${
            item.active ? "text-primary" : ""
          }`}
        >
          <div className="text-2xl mb-0.5 p-0.5 bg-transparent rounded-lg">
            {item.icon}
          </div>
          <div className="text-[10px]">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default BottomNavigationBar;
