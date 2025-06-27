import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ComponentCatalog from './pages/ComponentCatalog';
import UserOnboarding from './pages/patient/onboarding/UserOnBoarding';
import ProfessionalOnboarding from './pages/provider/ProfessionalOnBoarding';
import CompleteProfile from './pages/patient/profile/CompleteProfile';
import ProtectedRoute from './components/ProtectedRoute';
import AcsMainPage from './pages/provider/AcsMainPage';
import UsermainPage from './pages/patient/UserMainPage';
import EmergencyPage from './pages/provider/EmergencyPage';
import EmergencyUser from './pages/patient/emergency/EmergencyUser';
import PatientsPage from './pages/provider/PatientsPage';
import ViewReminder from './pages/patient/reminders/ViewReminder';
import DiaryPage from './pages/patient/diary/Diary';
import DiaryListPage from './pages/patient/diary/DiaryListPage';
import Reminders from './pages/patient/reminders/Reminders';
import NewReminder from './pages/patient/reminders/NewReminder';
import OnboardingSlider from './pages/landing/OnboardingSlider';
import { SWRConfig } from 'swr';
import ModifyHabits from './pages/patient/diary/modify-habits';
import { ThemeProvider } from './contexts/ThemeContext';
import ViewDiaryEntry from './pages/patient/diary/ViewDiary';
import ProfilePage from './pages/patient/profile/ProfilePage';
import AcsProfilePage from './pages/provider/profile/AcsProfilePage';
import InterestPage from './pages/patient/interests/InterestsPage';
import ViewSelectedInterests from './pages/patient/ViewSelectedInterests';
import ViewPatient from './pages/provider/ViewPatient';
import ViewHelp from './pages/provider/ViewHelp';
import ViewDiary from './pages/provider/ViewDiary';
import ManageProfessionals from './pages/patient/profile/ManageProfessionals';
import TermsScreen from './pages/landing/Terms';
import { NotFound } from './pages/NotFound';
import { LandingThemeProvider } from './components/ui/LandingThemeProvider';
import AccountManager from './pages/landing/AccountManager';
import { useState } from 'react';
import SplashScreen from './components/SplashScreen';

// Componente que decide qual tela mostrar na rota "/"
const HomePage = () => {
  const [showSplash, setShowSplash] = useState(true);

  // Função chamada quando splash termina
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Se ainda está na splash, mostrar ela
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} duration={3000} />;
  }

  return <AccountManager />;
};

// SWR configuration for data fetching
<SWRConfig value={{ revalidateOnFocus: false }}>
  <App />
</SWRConfig>;

// Create a browser router instance with defined routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />, // Componente que decide qual fluxo usar
  },
  {
    path: '/accounts',
    element: <AccountManager />, // Rota específica para gerenciar contas
  },
  {
    path: '/login',
    element: <AccountManager />, // Alias para /accounts
  },
  {
    path: '/welcome',
    element: <AccountManager />, // Mantém compatibilidade
  },
  {
    path: '/components',
    element: <ComponentCatalog />, // Component catalog page
  },
  {
    path: '/forms-user',
    element: <UserOnboarding />, // User onboarding page
  },
  {
    path: '/diary',
    element: <DiaryListPage />, // Page displaying the list of diaries
  },
  {
    path: 'diary/new',
    element: <DiaryPage />, // Page to create a new diary entry
  },
  {
    path: '/diary/:diaryId',
    element: <ViewDiaryEntry />, // Page to view a specific diary entry
  },
  {
    path: '/reminders',
    element: <Reminders />, // Page for managing reminders
  },
  {
    path: '/new-reminder',
    element: <NewReminder />, // Page to create a new reminder
  },
  {
    path: '/reminder',
    element: (
      <ViewReminder // View specific reminder with details
        reminder={{
          title: 'Risperidona',
          observation: 'Tomar após refeição.',
          time: 'Alo mona',
        }}
        onDelete={() => {
          console.log('deletar');
        }}
      />
    ),
  },
  {
    path: '/forms-prof',
    element: <ProfessionalOnboarding />, // Professional onboarding page
  },
  {
    path: '/complete-profile',
    element: (
      <ProtectedRoute // Protected route for completing user profile
        element={<CompleteProfile />}
        allowedTypes={['none']}
      />
    ),
  },
  {
    path: '/acs-main-page',
    element: <AcsMainPage />, // ACS main page for providers
  },
  {
    path: '/user-main-page',
    element: <UsermainPage />, // Main page for users
  },
  {
    path: '/user-selected-interests',
    element: <ViewSelectedInterests />, // Page to view selected user interests
  },
  {
    path: '/emergencies',
    element: <EmergencyPage />, // Page for handling emergencies
  },
  {
    path: '/patients',
    element: <PatientsPage />, // Page displaying patients list
  },
  {
    path: '/emergency-user',
    element: <EmergencyUser />, // Page for emergency user actions
  },
  {
    path: '/modify-habits',
    element: <ModifyHabits />, // Page for modifying habits
  },
  {
    path: '/profile',
    element: <ProfilePage />, // User profile page
  },
  {
    path: '/acs-profile',
    element: <AcsProfilePage />, // ACS provider profile page
  },
  {
    path: '/interests',
    element: <InterestPage />, // Page for managing interests
  },
  {
    path: '/provider/patient/:id', // Route for viewing a patient by ID
    element: <ViewPatient />,
  },
  {
    path: '/provider/patient/:id/:context', // Viewing a patient with context
    element: <ViewPatient />,
  },
  {
    path: '/provider/patient/:personId/diary/:diaryId', // Viewing a specific diary for a patient
    element: <ViewDiary />,
  },
  {
    path: '/provider/help/:personId/:helpId', // Viewing a help request
    element: <ViewHelp />,
  },
  {
    path: '/manage-professionals', // Page for managing professionals
    element: <ManageProfessionals />,
  },
  {
    path: '/terms', // Terms and conditions page
    element: (
      <LandingThemeProvider>
        <TermsScreen onNext={() => {}} currentStep={1} totalSteps={1} isViewOnly={true} />
      </LandingThemeProvider>
    ),
  },
  {
    path: '*', // Catch-all route for 404 errors
    element: <NotFound />,
  },
]);

/**
 * Main application component that provides the routing and theming context.
 *
 * @returns {JSX.Element} The main application wrapped in ThemeProvider and RouterProvider.
 */
export function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-typography">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}
