import React from "react";
import { Link } from "react-router-dom"; // Make sure Link is imported correctly
import "../styles/Navbar.css"; 

const Navbar = ({ onMessageClick, onLogOut, cartItemCount }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2 className="brand-name">Shopmee</h2>
        <div className="nav-links">
          <Link to="/shop" className="nav-item">Shop</Link>
          <Link to="/cart" className="nav-item cart-link">
            Cart
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>
          <button onClick={onMessageClick} className="nav-item">Message</button>
          <Link to="/addProduct" className="nav-item">Product</Link>
          <Link to="/createAccount" className="nav-item">Account</Link>
          <button onClick={onLogOut} className="nav-item logout-btn">Log Out</button> {/* LogOut button */}
        </div>
      </div>   
    </nav>
  );
};

export default Navbar;
