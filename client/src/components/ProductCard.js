import React, { useState } from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {

  const image = product.image_url ? `http://localhost:3001/uploads/${product.image_url}` : null;
  const email = localStorage.getItem('userEmail'); // Get email from localStorage

  const handleAddToCartClick = () => {
      onAddToCart(product.product_id, email); 
  };

  return (
    <div className="product-card">
      <div className="picture-container">
        {image ? (
          <img src={image} alt={product.name} className="product-image" />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-description">{product.description}</p>
        <p className="product-price">₱{product.price}</p>
        <button className="add-to-cart-button" onClick={handleAddToCartClick}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
