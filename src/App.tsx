import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import CompleteProfile from './pages/CompleteProfile';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  { path: '/', element: <h1>Home!</h1> },
  { path: '/login', element: <Login /> },
  { path: '/welcome', element: <Welcome /> },
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
