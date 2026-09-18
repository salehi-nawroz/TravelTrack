import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import SpinnerFullPage from "../components/SpinnerFullPage";

function ProtectRoute({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/");
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <SpinnerFullPage />;

  return isAuthenticated ? children : null;
}

export default ProtectRoute;
