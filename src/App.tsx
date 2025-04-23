import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ComponentCatalog from './pages/ComponentCatalog';
import UserOnboarding from './pages/UserOnBoarding';
import ProfessionalOnboarding from './pages/ProfessionalOnBoarding';
import CompleteProfile from './pages/CompleteProfile';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import ProtectedRoute from './components/ProtectedRoute';

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
    path: '/PacientMainPage',
    element: (
      <ProtectedRoute
        element={<h1>Pacient Page</h1>}
        allowedTypes={['person']}
      />
    ),
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
