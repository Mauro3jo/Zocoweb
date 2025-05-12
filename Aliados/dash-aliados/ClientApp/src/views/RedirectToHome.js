import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToHome = () => {
  const navigate = useNavigate();

  // Redirige al home ("/") sin mostrar la barra lateral
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);
  return <div>Redireccionando al inicio...</div>;
};

export default RedirectToHome;
