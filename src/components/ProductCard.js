"use client";

import { useState } from "react";
import { useWishlist } from "@/components/WishlistProvider";
import { api } from "@/services/api";

export default function ProductCard({ product }) {
  const { isInWishlist, toggle } = useWishlist();
  const active = isInWishlist(product._id);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to add items to cart');
        return;
      }
      
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existingCart.find(item => item.productId === product._id);
      
      if (existingItem) {
        existingItem.count += 1;
      } else {
        existingCart.push({
          productId: product._id,
          product: product,
          price: product.price,
          count: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
      <div className="relative">
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
            -{product.discount}%
          </div>
        )}
        <img 
          src={product.imageCover || "/placeholder.svg"} 
          alt={product.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <button 
          onClick={() => toggle(product._id)} 
          aria-label="Toggle wishlist" 
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
        >
          <svg 
            className={`w-5 h-5 transition-colors ${active ? "text-red-500 fill-current" : "text-gray-400"}`}
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{product.title}</h3>
          <p className="text-sm text-gray-500">{product.category?.name}</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{product.price} EGP</span>
            {product.priceAfterDiscount && (
              <span className="text-sm text-gray-500 line-through">{product.priceAfterDiscount} EGP</span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAddingToCart 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}


