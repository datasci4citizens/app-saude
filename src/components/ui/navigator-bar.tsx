import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface BottomNavigationBarProps {
  variant?: 'user' | 'acs';
  forceActiveId?: string | null;
  onItemClick?: (itemId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  variant = 'user',
  forceActiveId = null,
  onItemClick,
}) => {
  const navigate = useNavigate();

  const navItemVariants: Record<'user' | 'acs', NavItem[]> = {
    user: [
      {
        id: 'home',
        label: 'Casa',
        icon: <span role="img" aria-label="home" className="mgc_home_4_line" />,
        path: '/user-main-page',
      },
      //      {
      //        id: 'meds',
      //        label: 'Lembretes',
      //        icon: <span role="img" aria-label="calendar" className="mgc_calendar_line" />,
      //        path: '/reminders',
      //      },
      {
        id: 'diary',
        label: 'Diário',
        icon: <span role="img" aria-label="book" className="mgc_book_6_line" />,
        path: '/diary',
      },
      {
        id: 'emergency',
        label: 'Ajuda',
        icon: <span role="img" aria-label="warning" className="mgc_alert_line" />,
        path: '/emergency-user',
      },
      {
        id: 'profile',
        label: 'Eu',
        icon: <span role="img" aria-label="user" className="mgc_user_3_line" />,
        path: '/profile',
      },
    ],
    acs: [
      {
        id: 'home',
        label: 'Casa',
        icon: <span role="img" aria-label="home" className="mgc_home_4_line" />,
        path: '/acs-main-page',
      },
      {
        id: 'patients',
        label: 'Pacientes',
        icon: <span role="img" aria-label="patients" className="mgc_group_3_line" />,
        path: '/patients',
      },

      {
        id: 'profile',
        label: 'Eu',
        icon: <span role="img" aria-label="user" className="mgc_user_3_line" />,
        path: '/acs-profile',
      },
    ],
  };

  const navItems = navItemVariants[variant];

  const handleItemClick = (item: NavItem) => {
    // If onItemClick is provided, call it with the item id
    if (onItemClick) {
      onItemClick(item.id);
    } else {
      // Default behavior: navigate to the path
      navigate(item.path);
    }
  };

  return (
    <div className="flex justify-around items-center py-3 bg-bottom-nav w-full fixed bottom-0 left-0 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-bottom-nav-border z-50 backdrop-blur-sm">
      {navItems.map((item) => {
        const isActive = forceActiveId === item.id;

        return (
          <button
            key={item.id}
            className={`
              flex flex-col items-center font-medium text-xs font-inter
              ${navItems.length ? `w-[${100 / navItems.length}%]` : 'w-1/5'}
              focus:outline-none focus:ring-2 focus:ring-bottom-nav-active focus:ring-opacity-50 rounded-lg
              transition-all duration-200 ease-in-out
              hover:scale-105 active:scale-95
            `}
            onClick={() => handleItemClick(item)}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Container do ícone com melhor feedback visual */}
            <div
              className={`
                flex justify-center items-center w-11 h-11 mb-1.5 text-2xl rounded-xl
                transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? 'bg-bottom-nav-active text-white shadow-lg shadow-bottom-nav-active/25 scale-110'
                    : 'bg-transparent text-bottom-nav-foreground hover:bg-bottom-nav-active/10 hover:text-bottom-nav-active'
                }
              `}
            >
              {item.icon}
            </div>

            {/* Label com melhor tipografia */}
            <div
              className={`
                text-center text-[11px] leading-3
                font-inter transition-all duration-200
                ${
                  isActive
                    ? 'text-bottom-nav-active font-semibold'
                    : 'text-bottom-nav-foreground font-medium'
                }
              `}
            >
              {item.label}
            </div>

            {/* Indicador visual para item ativo */}
            {isActive && (
              <div className="w-1 h-1 bg-bottom-nav-active rounded-full mt-0.5 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavigationBar;
