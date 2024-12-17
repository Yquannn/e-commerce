import React from "react";
import { Link } from "react-router-dom"; // Make sure Link is imported correctly
import "../styles/Navbar.css";
import "@fortawesome/fontawesome-free/css/all.css"; // FontAwesome for icons

const Navbar = ({ onMessageClick, onLogOut, cartItemCount }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2 className="brand-name">Shopmee</h2>
        <div className="nav-links">
          <Link to="/shop" className="nav-item">
            <i className="fas fa-shopping-bag nav-icon"></i>
          </Link>
          <Link to="/cart" className="nav-item cart-link">
            <i className="fas fa-shopping-cart nav-icon"></i>
            <span className="cart-label">
              {cartItemCount > 0 ? `${cartItemCount}` : "0"}
            </span>
          </Link>
          <button onClick={onMessageClick} className="nav-item">
            <i className="fas fa-envelope nav-icon"></i>
          </button>
          <Link to="/addProduct" className="nav-item">
            <i className="fas fa-plus-circle nav-icon"></i>
          </Link>
          {/* <Link to="/createAccount" className="nav-item">
            <i className="fas fa-user-plus nav-icon"></i>
          </Link> */}
          <button onClick={onLogOut} className="nav-item logout-btn">
            <i className="fas fa-sign-out-alt nav-icon"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
