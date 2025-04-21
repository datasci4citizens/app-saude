import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import CompleteProfile from './pages/CompleteProfile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Home!</h1>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/welcome',
    element: <Welcome />,
  },
  {
    path: '/complete-profile',
    element: <CompleteProfile/>,
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
