import DiaryInfoForm from '@/pages/patient/diary/DiaryInfoForm';
import Header from '@/components/ui/header';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigationBar from '@/components/ui/navigator-bar';

export default function DiaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    navigate(-1); // This goes back one page in history
  };

  // Determine active navigation item based on current route
  const getActiveNavId = () => {
    if (location.pathname.startsWith('/user-main-page')) return 'home';
    if (location.pathname.startsWith('/reminders')) return 'meds';
    if (location.pathname.startsWith('/diary')) return 'diary';
    if (location.pathname.startsWith('/emergency-user')) return 'emergency';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return null;
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto bg-background pb-24">
        {' '}
        {/* Added pb-20 for bottom spacing */}
        <Header title="Novo Diário" onBackClick={handleBackClick} />
        <div className="w-full mt-4 px-4 md:px-8 py-4 ">
          <DiaryInfoForm />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
        />
      </div>
    </>
  );
}
