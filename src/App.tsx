import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ComponentCatalog from "./pages/ComponentCatalog";
import UserOnboarding from "./pages/UserOnBoarding";
import Reminders from "./pages/reminders/Reminders";
import NewReminder from "./pages/reminders/NewReminder";
import ViewReminder from "./pages/reminders/ViewReminder";
import DiaryPage from './pages/Diary';
import ProfessionalOnboarding from './pages/ProfessionalOnBoarding';
import CompleteProfile from './pages/CompleteProfile';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import ProtectedRoute from './components/ProtectedRoute';
import AcsMainPage from './pages/AcsMainPage';
import UsermainPage from './pages/UserMainPage';
import EmergencyPage from './pages/EmergencyPage';
import PatientsPage from './pages/PatientsPage';

const NotFound = () => (
  <div>
    <h1>404</h1>
    <p>Oops! The page you're looking for does not exist.</p>
    <a href="/">Go back to Home</a>
  </div>
);

const router = createBrowserRouter([
  { path: '/', element: <h1>Home!</h1> },
  { path: '/login', element: <Login /> },
  { path: '/welcome', element: <Welcome /> },
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
        }} />)},
  {
    path: '/forms-prof',
    element: <ProfessionalOnboarding />,
  },
  {
    path: '/complete-profile',
    element: (
      <ProtectedRoute
        element={<CompleteProfile />}
        allowedTypes={['none']}
      />
    ),
  },{
    path: '/acs-main-page',
    element: <AcsMainPage />,
  },
  {
    path: '/user-main-page',
    element: <UsermainPage />,
  },
  {
    path: '/emergencies',
    element: <EmergencyPage />,
  },
  {
    path: '/patients',
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
