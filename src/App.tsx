import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ComponentCatalog from "./pages/ComponentCatalog";
import UserOnboarding from "./pages/patient/onboarding/UserOnBoarding";
import ProfessionalOnboarding from "./pages/provider/ProfessionalOnBoarding";
import CompleteProfile from "./pages/patient/profile/CompleteProfile";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import ProtectedRoute from "./components/ProtectedRoute";
import AcsMainPage from "./pages/provider/AcsMainPage";
import UsermainPage from "./pages/patient/UserMainPage";
import EmergencyPage from "./pages/patient/emergency/EmergencyPage";
import PatientsPage from "./pages/provider/PatientsPage";
import ViewReminder from "./pages/patient/reminders/ViewReminder";
import DiaryPage from "./pages/patient/diary/Diary";
import Reminders from "./pages/patient/reminders/Reminders";
import NewReminder from "./pages/patient/reminders/NewReminder";
import { SWRConfig } from 'swr';

const NotFound = () => (
  <div>
    <h1>404</h1>
    <p>Oops! The page you're looking for does not exist.</p>
    <a href="/">Go back to Home</a>
  </div>
);

<SWRConfig value={{ revalidateOnFocus: false }}>
  <App />
</SWRConfig>

const router = createBrowserRouter([
  { path: "/", element: <h1>Home!</h1> },
  { path: "/login", element: <Login /> },
  { path: "/welcome", element: <Welcome /> },
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
    path: "/emergencies",
    element: <EmergencyPage />,
  },
  {
    path: "/patients",
    element: <PatientsPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}