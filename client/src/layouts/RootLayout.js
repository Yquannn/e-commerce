import React, { useEffect, useState } from "react";  // Import useState and useEffect
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = ({ children, onMessageClick, onLogOut }) => {
  const location = useLocation();


  const noNavbarRoutes = ["/"]; 

  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  const [cartItemCount, setCartItemCount] = useState(0); 

  const fetchCartData = async () => {
    const email = localStorage.getItem("userEmail"); 
    if (email) {
      try {
        const fetchCartItems = await fetch(`http://localhost:3001/api/cart-items/${email}`);
        
        if (!fetchCartItems.ok) {
          throw new Error('Failed to fetch cart items.');
        }
        const data = await fetchCartItems.json();
        setCartItemCount(data.cartItems.length); 
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);
  
  return (
    <div>
   
      {shouldShowNavbar && (
        <Navbar 
          onMessageClick={onMessageClick} 
          onLogOut={onLogOut} 
          cartItemCount={cartItemCount} 
        />
      )}
      <main>{children}</main>
    </div>
  );
};

export default RootLayout;
