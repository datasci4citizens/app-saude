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
import Reminders from "./pages/patient/reminders/Reminders";
import NewReminder from "./pages/patient/reminders/NewReminder";
import OnboardingSlider from "./pages/landing/OnboardingSlider";
import { SWRConfig } from "swr";
import AddProfessionalPage from "./pages/patient/profile/AddProfessionalPage";
import ModifyHabits from "./pages/patient/diary/modify-habits";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import ViewDiaryUser from "./pages/patient/diary/ViewDiaryUser";
import ViewPatientDiaries from "./pages/patient/diary/ViewDiaryProvider";
import ViewDiaryEntry from "./pages/patient/diary/ViewDiary";
import ProfilePage from "./pages/patient/profile/ProfilePage";
import AcsProfilePage from "./pages/provider/profile/AcsProfilePage";
import CreateNewInterest from "./pages/patient/CreateNewInterest";
import ViewSelectedInterests from "./pages/patient/ViewSelectedInterests";
import EditInterest from "./pages/patient/EditInterest";
import ViewPatient from "./pages/provider/ViewPatient"; // Import ViewPatient



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
    element: <DiaryPage />,
  },
  {
    path: "/view-diary-user",
    element: <ViewDiaryUser />,
  },
    {
    path: "/view-diary-provider",
    element: <ViewPatientDiaries />,
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
    path: "/view-diary-user",
    element: <ViewDiaryUser />,
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
    path: "/user-create-interest",
    element: <CreateNewInterest />,
  },
  {
    path: "/user-selected-interests",
    element: <ViewSelectedInterests />,
  },
  {
    path: "/user-edit-interest/:interestId",
    element: <EditInterest />,
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
    path: "/add-professional",
    element: <AddProfessionalPage />,
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
    path: "/provider/patient/:id", // Route for viewing a patient
    element: <ViewPatient />,
  },
  {
    path: "/provider/patient/:id/:context", // Route for viewing a patient with context (e.g., emergency)
    element: <ViewPatient />,
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
        <div className="fixed top-20 right-4">
          <ThemeToggle />
        </div>
      </div>
    </ThemeProvider>
  );
}
