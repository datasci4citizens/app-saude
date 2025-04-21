import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ComponentCatalog from './pages/ComponentCatalog';
import UserOnboarding from './pages/UserOnBoarding';
import Reminders from './pages/reminders/Reminders';
import NewReminder from './pages/reminders/NewReminder';
import ViewReminder from './pages/reminders/ViewReminder';

const NotFound = () => (
  <div>
    <h1>404</h1>
    <p>Oops! The page you're looking for does not exist.</p>
    <a href="/">Go back to Home</a>
  </div>
);

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
    path: '/reminders',
    element: <Reminders />,
  },
  {
    path: '/new-reminder',
    element: <NewReminder />,
  },
  {
    path: '/reminder',
    element: <ViewReminder reminder={{
      title: "Risperidona",
      observation: "Tomar após refeição.",
      time: "Alo mona"
    }} onDelete={() => {console.log("deletar")}}/>,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
