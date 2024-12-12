import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ onMessageClick, onLogOut }) => (
  <nav>
    <h2>Shopmee</h2>
    <div>
      <Link to="/shop">Shop</Link>
      <Link to="/cart">Cart</Link>
      <Link>
        <button onClick={onMessageClick}>Messages</button>
      </Link>
      <Link to="/addProduct">Add Product</Link>
      <Link to="/createAccount">Create Account</Link>
      <Link to="/">
        <button onClick={onLogOut}>Log out</button>
      </Link>
    </div>
  </nav>
);

export default Navbar;
