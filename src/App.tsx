import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';


const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Home!</h1>,
  },
  {
    path: '/login',
    element: <Login/>,
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
