import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ComponentCatalog from './pages/ComponentCatalog';
import UserOnboarding from './pages/UserOnBoarding';
import AcsMainPage from './pages/AcsMainPage';

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
    path: '/forms-user-1',
    element: <UserOnboarding />,
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
