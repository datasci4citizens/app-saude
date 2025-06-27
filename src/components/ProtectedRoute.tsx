import { Navigate } from 'react-router-dom';
import { type ReactElement } from 'react';
import { getCurrentAccount } from '../pages/landing/AccountManager';

function getUserType() {
  return getCurrentAccount()?.role || 'none';
}

interface ProtectedRouteProps {
  element: ReactElement;
  allowedTypes: string[];
}

export default function ProtectedRoute({ element, allowedTypes }: ProtectedRouteProps) {
  const userType = getUserType();

  if (!allowedTypes.includes(userType)) {
    return <Navigate to="/login" replace />;
  }

  return element;
}
