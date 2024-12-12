import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar"; // Adjust the path if needed

const RootLayout = ({ children, onMessageClick }) => {
  const location = useLocation();

  const noNavbarRoutes = ["/"];

  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {shouldShowNavbar && <Navbar onMessageClick={onMessageClick} />}
      <main>{children}</main>
    </div>
  );
};

export default RootLayout;
