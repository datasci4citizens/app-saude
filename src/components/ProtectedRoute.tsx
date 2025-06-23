import { Navigate } from 'react-router-dom';

function getUserType() {
  return localStorage.getItem('role');
}

export default function ProtectedRoute({ element, allowedTypes }) {
  const userType = getUserType();

  if (!allowedTypes.includes(userType)) {
    return <Navigate to="/login" replace />;
  }

  return element;
}
