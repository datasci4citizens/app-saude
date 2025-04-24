import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ComponentCatalog from './pages/ComponentCatalog';
import UserOnboarding from './pages/UserOnBoarding';
import AcsMainPage from './pages/AcsMainPage';
import UsermainPage from './pages/UserMainPage';
import EmergencyPage from './pages/EmergencyPage';
import PatientsPage from './pages/PatientsPage';
import Login from './pages/Login';


const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Home!</h1>,
  },
  {
    path: '/components',
    element: <ComponentCatalog />,
  },
  {
    path: '/acs-main-page',
    element: <AcsMainPage />,
  },
  {
    path: '/user-main-page',
    element: <UsermainPage />,
  },
  {
    path: '/forms-user-1',
    element: <UserOnboarding />,
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
    path: '/login',
    element: <Login/>,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
