import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ComponentCatalog from './pages/ComponentCatalog';
import UserOnboarding from './pages/UserOnBoarding';
import ProfessionalOnboarding from './pages/ProfessionalOnBoarding';
import CompleteProfile from './pages/CompleteProfile';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import ProtectedRoute from './components/ProtectedRoute';
import AcsMainPage from './pages/AcsMainPage';
import UsermainPage from './pages/UserMainPage';
import EmergencyPage from './pages/EmergencyPage';
import PatientsPage from './pages/PatientsPage';

const router = createBrowserRouter([
  { path: '/', element: <h1>Home!</h1> },
  { path: '/login', element: <Login /> },
  { path: '/welcome', element: <Welcome /> },
  {
    path: '/components',
    element: <ComponentCatalog />,
  },
  {
    path: '/forms-user',
    element: <UserOnboarding />,
  },
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
  },
  {
    path: '/AcsMainPage',
    element: (
      <ProtectedRoute
        element={<h1>Acs Page</h1>}
        allowedTypes={['provider']}
      />
    ),
  },
  {
    path: '/UserMainPage',
    element: (
      <ProtectedRoute
        element={<h1>User Page</h1>}
        allowedTypes={['person']}
      />
    ),
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
]);

export function App() {
  return <RouterProvider router={router} />;
}
