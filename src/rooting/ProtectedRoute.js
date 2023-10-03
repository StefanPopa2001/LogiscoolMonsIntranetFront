import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Dataservice from "../dataservice/dataservice";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Dataservice.verifyToken();
        setIsAuthenticated(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la vérification du token", error);
        if (error.response && error.response.status === 401) {
          // Supprimer le cookie
          document.cookie =
            "AUTH_COOKIE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    const handleCookieChange = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("AUTH_COOKIE="))
        ?.split("=")[1];

      if (token) {
        fetchData();
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    // Ajouter un écouteur d'événement pour détecter les changements dans le cookie
    window.addEventListener("change", handleCookieChange);

    // Appeler la vérification du token au montage initial
    handleCookieChange();

    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener("change", handleCookieChange);
    };
  }, [location]);

  if (isLoading) {
    return <div>Loading...</div>; // ou votre composant de chargement
  }

  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  return children;
};

export default ProtectedRoute;
