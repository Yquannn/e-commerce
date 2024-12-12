import React from 'react';
import ProductCard from './ProductCard';

const products = [
  {
    id: 1,
    name: 'Wireless Earbuds',
    description: 'High-quality sound with noise cancellation.',
    price: 59.99,
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Track your fitness and stay connected.',
    price: 149.99,
    image: 'https://via.placeholder.com/300',
  },
];

const handleAddToCart = (productId) => {
  alert(`Product with ID ${productId} added to cart!`);
};

const ProductList = () => (
  <div className="product-list">
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        onAddToCart={handleAddToCart}
      />
    ))}
  </div>
);

export default ProductList;
