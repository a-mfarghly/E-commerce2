"use client";

import { useState, useEffect } from "react";
import { cartService, CartItem } from "@/services/clientApi";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    try {
      const cart = cartService.getCart();
      // تأكد من أن جميع العناصر في السلة صالحة قبل تعيينها
      const validCartItems = cart.filter(item => 
        item && item.product && item._id && 
        typeof item.count === 'number' && 
        typeof item.price === 'number'
      );
      setCartItems(validCartItems);
      
      const cartTotal = cartService.getCartTotal();
      setTotal(cartTotal);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    try {
      const updatedCart = cartService.updateCartItem(productId, newQuantity);
      // Filter valid items before setting state
      const validCartItems = updatedCart.filter(item => 
        item && item.product && item._id && 
        typeof item.count === 'number' && 
        typeof item.price === 'number'
      );
      setCartItems(validCartItems);
      setTotal(cartService.getCartTotal());
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = (productId: string) => {
    try {
      const updatedCart = cartService.removeFromCart(productId);
      // Filter valid items before setting state
      const validCartItems = updatedCart.filter(item => 
        item && item.product && item._id && 
        typeof item.count === 'number' && 
        typeof item.price === 'number'
      );
      setCartItems(validCartItems);
      setTotal(cartService.getCartTotal());
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="bg-gray-200 h-20 w-20 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Start adding items to your cart</p>
          <a 
            href="/products" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={item._id || `cart-item-${index}`} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.product.imageCover} 
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product.title}</h3>
                    <p className="text-sm text-gray-600">{item.product.category.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-green-600">{item.price.toLocaleString()} EGP</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.count - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          disabled={item.count <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.count}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.count + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-red-500 hover:text-red-700 p-2 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{total.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">0 EGP</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-green-600">{total.toLocaleString()} EGP</span>
              </div>
            </div>

            <a
              href="/checkout"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors text-center block mt-6"
            >
              Proceed to Checkout
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

