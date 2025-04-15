import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ComponentCatalog from './pages/ComponentCatalog';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Home!</h1>,
  },
  {
    path: '/components',
    element: <ComponentCatalog />,
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
