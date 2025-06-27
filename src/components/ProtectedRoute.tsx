import { Navigate } from 'react-router-dom';
import { type ReactElement } from 'react';
import { useAccount } from '@/contexts/AppContext';

function getUserType() {
  const { currentAccount } = useAccount();
  return currentAccount?.role || 'none';
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
