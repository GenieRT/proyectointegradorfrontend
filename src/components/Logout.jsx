import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());

    // Redirigir al usuario a la página de login
    window.location.href = "/login";
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Cerrar Sesión
    </button>
  );
};

export default Logout;
