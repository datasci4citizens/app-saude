import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ComponentCatalog from './pages/ComponentCatalog';
import UserOnboarding from './pages/UserOnBoarding';
import DiaryPage from './pages/Diary';


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
    path: '/forms-user-1',
    element: <UserOnboarding />,
  },
  {
    path: '/diary',
    element: <DiaryPage />,
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
