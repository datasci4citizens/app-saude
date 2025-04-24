import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ComponentCatalog from './pages/ComponentCatalog';
import UserOnboarding from './pages/UserOnBoarding';
import AcsMainPage from './pages/AcsMainPage';
import UsermainPage from './pages/UserMainPage';

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
    path: '/AcsMainPage',
    element: <AcsMainPage />,
  },
  {
    path: '/UserMainPage',
    element: <UsermainPage />,
  },
  {
    path: '/forms-user-1',
    element: <UserOnboarding />,
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
