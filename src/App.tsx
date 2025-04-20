import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ComponentCatalog from './pages/ComponentCatalog';
import UserOnboarding from './pages/UserOnBoarding';
import ProfessionalOnboarding from './pages/ProfessionalOnBoarding';

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
    path: '/forms-user',
    element: <UserOnboarding />,
  },
  {
    path: '/forms-prof',
    element: <ProfessionalOnboarding />,
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
