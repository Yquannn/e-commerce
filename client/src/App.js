import React, { useState } from "react";
import { Route, Routes } from "react-router-dom"; // Don't wrap in Router here
import RootLayout from "./layouts/RootLayout.js";
import Home from "./pages/Home.js";
import CartPage from "./pages/Cart.js";
import MessageModal from "./modals/Messages";
import AddProduct from "./pages/AddProduct.js";
import CreateAccount from "./pages/CreateAccount.js";
import LogInUser from "./pages/LogInUser.js";

const App = () => {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const toggleMessageModal = () => {
    setIsMessageModalOpen((prev) => !prev);
  };

  const handleLogOut = () => {
    localStorage.clear(); 
    alert("You have been logged out/quit.");
    window.location.href = "/"; 
  };

  return (
    <>
      <RootLayout onMessageClick={toggleMessageModal} onLogOut={handleLogOut} />
      <Routes>
        <Route index element={<LogInUser />} />
        <Route path="shop" element={<Home />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="addProduct" element={<AddProduct />} />
        <Route path="signup" element={<CreateAccount />} />
      </Routes>
      {isMessageModalOpen && (
        <MessageModal isOpen={isMessageModalOpen} toggleModal={toggleMessageModal} />
      )}
    </>
  );
};

export default App;
