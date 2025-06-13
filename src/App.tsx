import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ComponentCatalog from "./pages/ComponentCatalog";
import UserOnboarding from "./pages/patient/onboarding/UserOnBoarding";
import ProfessionalOnboarding from "./pages/provider/ProfessionalOnBoarding";
import CompleteProfile from "./pages/patient/profile/CompleteProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import AcsMainPage from "./pages/provider/AcsMainPage";
import UsermainPage from "./pages/patient/UserMainPage";
import EmergencyPage from "./pages/provider/EmergencyPage";
import EmergencyUser from "./pages/patient/emergency/EmergencyUser";
import PatientsPage from "./pages/provider/PatientsPage";
import ViewReminder from "./pages/patient/reminders/ViewReminder";
import DiaryPage from "./pages/patient/diary/Diary";
import DiaryListPage from "./pages/patient/diary/DiaryListPage";
import Reminders from "./pages/patient/reminders/Reminders";
import NewReminder from "./pages/patient/reminders/NewReminder";
import OnboardingSlider from "./pages/landing/OnboardingSlider";
import { SWRConfig } from "swr";
import ModifyHabits from "./pages/patient/diary/modify-habits";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import ViewDiaryEntry from "./pages/patient/diary/ViewDiary";
import ProfilePage from "./pages/patient/profile/ProfilePage";
import AcsProfilePage from "./pages/provider/profile/AcsProfilePage";
import InterestPage from "./pages/patient/interests/InterestsPage";
import ViewSelectedInterests from "./pages/patient/ViewSelectedInterests";
import ViewPatient from "./pages/provider/ViewPatient"; // Import ViewPatient
import ViewHelp from "./pages/provider/ViewHelp"; // Import ViewHelp
import ViewDiary from "./pages/provider/ViewDiary"; // Import ViewDiary
import ManageProfessionals from "./pages/patient/profile/ManageProfessionals";
import TermsScreen from "./pages/landing/Terms";

const NotFound = () => (
  <div>
    <h1>404</h1>
    <p>Oops! The page you're looking for does not exist.</p>
    <a href="/">Go back to Home</a>
  </div>
);

<SWRConfig value={{ revalidateOnFocus: false }}>
  <App />
</SWRConfig>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <OnboardingSlider />,
  },
  {
    path: "/login",
    element: <OnboardingSlider />,
  },
  {
    path: "/welcome",
    element: <OnboardingSlider />,
  },
  {
    path: "/components",
    element: <ComponentCatalog />,
  },
  {
    path: "/forms-user",
    element: <UserOnboarding />,
  },
  {
    path: "/diary",
    element: <DiaryListPage />,
  },
  {
    path: "diary/new",
    element: <DiaryPage />,
  },
  {
    path: "/diary/:diaryId",
    element: <ViewDiaryEntry />,
  },

  {
    path: "/diary/:diaryId",
    element: <ViewDiaryEntry />,
  },
  {
    path: "/reminders",
    element: <Reminders />,
  },
  {
    path: "/new-reminder",
    element: <NewReminder />,
  },

  {
    path: "/reminder",
    element: (
      <ViewReminder
        reminder={{
          title: "Risperidona",
          observation: "Tomar após refeição.",
          time: "Alo mona",
        }}
        onDelete={() => {
          console.log("deletar");
        }}
      />
    ),
  },
  {
    path: "/forms-prof",
    element: <ProfessionalOnboarding />,
  },
  {
    path: "/complete-profile",
    element: (
      <ProtectedRoute element={<CompleteProfile />} allowedTypes={["none"]} />
    ),
  },
  {
    path: "/acs-main-page",
    element: <AcsMainPage />,
  },
  {
    path: "/user-main-page",
    element: <UsermainPage />,
  },
  {
    path: "/user-selected-interests",
    element: <ViewSelectedInterests />,
  },
  {
    path: "/emergencies",
    element: <EmergencyPage />,
  },
  {
    path: "/patients",
    element: <PatientsPage />,
  },
  {
    path: "/emergency-user",
    element: <EmergencyUser />,
  },
  {
    path: "/modify-habits",
    element: <ModifyHabits />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/acs-profile",
    element: <AcsProfilePage />,
  },
  {
    path: "/interests",
    element: <InterestPage />,
  },
  {
    path: "/provider/patient/:id", // Route for viewing a patient
    element: <ViewPatient />,
  },
  {
    path: "/provider/patient/:id/:context", // Route for viewing a patient with context (e.g., emergency)
    element: <ViewPatient />,
  },
  {
    path: "/provider/patient/:personId/diary/:diaryId", // Route for viewing a specific diary
    element: <ViewDiary />,
  },
  {
    path: "/provider/help/:personId/:helpId", // Route for viewing a help request
    element: <ViewHelp />,
  },
  {
    path: "/manage-professionals",
    element: <ManageProfessionals />,
  },
  {
    path: "/terms",
    element: <TermsScreen onNext={() => {}} currentStep={1} totalSteps={1} isViewOnly={true}/>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-primary text-typography">
        <RouterProvider router={router} />
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
      </div>
    </ThemeProvider>
  );
}
