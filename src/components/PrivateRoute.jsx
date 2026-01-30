import React from "react";
import { Navigate } from "react-router-dom";
import { authAPI } from "../services/api";

function PrivateRoute({ children }) {
  const user = authAPI.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
