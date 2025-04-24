import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ComponentCatalog from './pages/ComponentCatalog';
import UserOnboarding from './pages/UserOnBoarding';
import AcsMainPage from './pages/AcsMainPage';
import UsermainPage from './pages/UserMainPage';
import EmergencyPage from './pages/EmergencyPage';

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
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
