import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthLayout({ children, authentication = true }) {
  const authStatus = useSelector((state) => state.auth.status);

  // Protected route but user not logged in → go to login
  if (authentication && !authStatus) {
    return <Navigate to="/login" />;
  }

  // Public route but user already logged in → go to home
  if (!authentication && authStatus) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
}
