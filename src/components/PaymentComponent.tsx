"use client";

import { useState, useEffect } from "react";
import { cartService, paymentService, authService, CartItem } from "@/services/clientApi";

interface FormData {
  // Shipping Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  
  // Payment Method
  paymentMethod: "card" | "cash";
  
  // Card Details
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

export default function PaymentComponent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Egypt",
    
    // Payment Method
    paymentMethod: "card",
    
    // Card Details
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: ""
  });

  const steps = [
    { id: 1, name: "Shipping Information", icon: "📍", active: currentStep === 1 },
    { id: 2, name: "Payment Information", icon: "💳", active: currentStep === 2 },
    { id: 3, name: "Order Review", icon: "✓", active: currentStep === 3 }
  ];

  useEffect(() => {
    fetchCartItems();
    loadUserData();
  }, []);

  const loadUserData = () => {
    const user = authService.getCurrentUser();
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        phone: user.phone || ''
      }));
    }
  };

  const fetchCartItems = () => {
    try {
      const cart = cartService.getCart();
      setCartItems(cart);
      
      const cartSubtotal = cartService.getCartTotal();
      const cartTax = cartSubtotal * 0.14; // 14% VAT in Egypt
      const cartTotal = cartSubtotal + cartTax;
      
      setSubtotal(cartSubtotal);
      setTax(cartTax);
      setTotal(cartTotal);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && 
                 formData.phone && formData.address && formData.city && formData.country);
      case 2:
        if (formData.paymentMethod === 'cash') return true;
        return !!(formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardName);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      const paymentData = {
        amount: total,
        currency: 'EGP',
        paymentMethod: formData.paymentMethod,
        cardDetails: formData.paymentMethod === 'card' ? {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardName: formData.cardName
        } : undefined
      };

      const paymentResponse = await paymentService.processPayment(paymentData);

      if (paymentResponse.success) {
        // Clear cart on successful payment
        cartService.clearCart();
        
        setPaymentResult({
          success: true,
          message: `Payment successful! Transaction ID: ${paymentResponse.transactionId}`
        });

        // Redirect to success page after 3 seconds
        setTimeout(() => {
          window.location.href = '/orders?success=true';
        }, 3000);
      } else {
        setPaymentResult({
          success: false,
          message: paymentResponse.error || 'Payment failed. Please try again.'
        });
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      setPaymentResult({
        success: false,
        message: error.message || 'An error occurred while processing your payment.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (paymentResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            paymentResult.success ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {paymentResult.success ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className={`text-xl font-semibold mb-2 ${
            paymentResult.success ? 'text-green-600' : 'text-red-600'
          }`}>
            {paymentResult.success ? 'Payment Successful!' : 'Payment Failed'}
          </h2>
          <p className="text-gray-600 mb-6">{paymentResult.message}</p>
          {paymentResult.success ? (
            <p className="text-sm text-gray-500">Redirecting to orders page...</p>
          ) : (
            <button
              onClick={() => setPaymentResult(null)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Indicator */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.active 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : currentStep > step.id
                    ? 'bg-green-100 border-green-600 text-green-600'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <span className="text-sm font-medium">{step.icon}</span>
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.active ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">📍</span>
                    <h2 className="text-xl font-semibold">Shipping Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Street and number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="Egypt">Egypt</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <a
                      href="/cart"
                      className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      ← Back to Cart
                    </a>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">💳</span>
                    <h2 className="text-xl font-semibold">Payment Information</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Payment Method *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.paymentMethod === 'card' 
                            ? 'border-green-600 bg-green-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === 'card'}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value as 'card' | 'cash')}
                            className="sr-only"
                          />
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">💳</div>
                            <div>
                              <div className="font-medium">Credit/Debit Card</div>
                              <div className="text-sm text-gray-600">Pay with your card</div>
                            </div>
                          </div>
                        </label>
                        
                        <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          formData.paymentMethod === 'cash' 
                            ? 'border-green-600 bg-green-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={formData.paymentMethod === 'cash'}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value as 'card' | 'cash')}
                            className="sr-only"
                          />
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">💵</div>
                            <div>
                              <div className="font-medium">Cash on Delivery</div>
                              <div className="text-sm text-gray-600">Pay when you receive</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              value={formData.expiryDate}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                }
                                handleInputChange('expiryDate', value);
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                              placeholder="123"
                              maxLength={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange('cardName', e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">✓</span>
                    <h2 className="text-xl font-semibold">Order Review</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Shipping Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4 text-sm">
                        <p><strong>{formData.firstName} {formData.lastName}</strong></p>
                        <p>{formData.email}</p>
                        <p>{formData.phone}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.postalCode}</p>
                        <p>{formData.country}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
                      <div className="bg-gray-50 rounded-lg p-4 text-sm">
                        <p>
                          {formData.paymentMethod === 'card' ? (
                            <>💳 Credit/Debit Card ending in {formData.cardNumber.slice(-4)}</>
                          ) : (
                            <>💵 Cash on Delivery</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        'Complete Order'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <a href="/cart" className="text-green-600 hover:text-green-700 text-sm">
                ← Edit Cart
              </a>
            </div>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-3">
                  <img 
                    src={item.product.imageCover} 
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{item.product.title}</h3>
                    <p className="text-gray-600 text-sm">Qty: {item.count}</p>
                    <p className="font-semibold text-green-600">{item.price.toLocaleString()} EGP</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{subtotal.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (14%)</span>
                <span className="font-medium">{tax.toLocaleString()} EGP</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-green-600">{total.toLocaleString()} EGP</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center text-sm text-green-600">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                Secure and encrypted payment
              </div>
              <div className="flex items-center text-sm text-green-600">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                Customer data protection
              </div>
              <div className="flex items-center text-sm text-green-600">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                Money back guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

