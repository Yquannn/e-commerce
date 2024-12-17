import React from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const image = product.image_url ? `http://localhost:3001/uploads/${product.image_url}` : null;
  const email = localStorage.getItem('userEmail'); 

  const handleAddToCartClick = () => {
    if (email) {
      onAddToCart(product.product_id, email); 
      window.location.reload(); 
    } else {
      alert('You are using a guest account. Please log in.');
      window.location.href = "/"; // Redirect to the sign-up page
     
      
    }
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
