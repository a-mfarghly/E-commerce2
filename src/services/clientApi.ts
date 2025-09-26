import { 
  mockProducts, 
  mockCategories, 
  mockBrands, 
  mockUser,
  Product, 
  Category, 
  Brand, 
  CartItem as CartItemType, 
  User 
} from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Re-export the CartItem type
export type CartItem = CartItemType;

export const cartService = {
  getCart: (): CartItem[] => {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  },

  addToCart: (productId: string, quantity: number = 1): CartItem[] => {
    const cart = cartService.getCart();
    const product = mockProducts.find(p => p._id === productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    const existingItem = cart.find(item => item.product._id === productId);
    
    if (existingItem) {
      existingItem.count += quantity;
    } else {
      cart.push({
        _id: `cart_${Date.now()}`,
        product,
        count: quantity,
        price: product.priceAfterDiscount || product.price
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  updateCartItem: (productId: string, quantity: number): CartItem[] => {
    const cart = cartService.getCart();
    const itemIndex = cart.findIndex(item => item.product._id === productId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].count = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return cart;
  },

  removeFromCart: (productId: string): CartItem[] => {
    const cart = cartService.getCart();
    const updatedCart = cart.filter(item => item.product._id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
  },

  clearCart: (): void => {
    localStorage.removeItem('cart');
  },

  getCartTotal: (): number => {
    const cart = cartService.getCart();
    return cart.reduce((total, item) => total + (item.price * item.count), 0);
  },

  getCartItemsCount: (): number => {
    const cart = cartService.getCart();
    return cart.reduce((total, item) => total + item.count, 0);
  }
};

export const wishlistService = {
  getWishlist: (): string[] => {
    try {
      const wishlist = localStorage.getItem('wishlist');
      return wishlist ? JSON.parse(wishlist) : [];
    } catch {
      return [];
    }
  },

  toggleWishlist: (productId: string): string[] => {
    const wishlist = wishlistService.getWishlist();
    const index = wishlist.indexOf(productId);
    
    if (index !== -1) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    return wishlist;
  },

  isInWishlist: (productId: string): boolean => {
    const wishlist = wishlistService.getWishlist();
    return wishlist.includes(productId);
  }
};

export const authService = {
  getCurrentUser: (): User | null => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await delay(1000);
    
    if (email && password) {
      const user = { ...mockUser, email };
      const token = `mock_token_${Date.now()}`;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      return { user, token };
    }
    
    throw new Error('Invalid email or password');
  },

  register: async (userData: { name: string; email: string; password: string; phone?: string }): Promise<{ user: User; token: string }> => {
    await delay(1000);
    
    const user: User = {
      _id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    };
    
    const token = `mock_token_${Date.now()}`;
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    
    return { user, token };
  },

  logout: (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export const paymentService = {
  processPayment: async (paymentData: {
    amount: number;
    currency: string;
    method: string;
    shippingInfo?: any;
    paymentInfo?: any;
  }): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
    await delay(2000);
    
    if (paymentData.method === 'cash') {
      return {
        success: true,
        transactionId: `cash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    }
    
    const success = Math.random() > 0.1;
    
    if (success) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Payment failed. Please try again or use a different payment method.'
      };
    }
  }
};

export const api = {
  getProducts: async (query: string = ""): Promise<{ data: Product[] }> => {
    await delay(500);
    let products = [...mockProducts];
    
    if (query) {
      const searchTerm = query.toLowerCase();
      products = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.name.toLowerCase().includes(searchTerm) ||
        product.brand.name.toLowerCase().includes(searchTerm)
      );
    }
    
    return { data: products };
  },

  getProduct: async (id: string): Promise<{ data: Product }> => {
    await delay(300);
    const product = mockProducts.find(p => p._id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return { data: product };
  },

  getCategories: async (): Promise<{ data: Category[] }> => {
    await delay(300);
    return { data: mockCategories };
  },

  getBrands: async (): Promise<{ data: Brand[] }> => {
    await delay(300);
    return { data: mockBrands };
  },

  signup: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    return authService.register(userData);
  },

  login: async (credentials: { email: string; password: string }) => {
    return authService.login(credentials.email, credentials.password);
  },

  getCart: async (): Promise<{ data: { cartItems: CartItem[] } }> => {
    await delay(300);
    return { data: { cartItems: cartService.getCart() } };
  },

  addToCart: async (productId: string): Promise<{ data: { cartItems: CartItem[] } }> => {
    await delay(300);
    const cartItems = cartService.addToCart(productId);
    return { data: { cartItems } };
  },

  removeFromCart: async (productId: string): Promise<{ data: { cartItems: CartItem[] } }> => {
    await delay(300);
    const cartItems = cartService.removeFromCart(productId);
    return { data: { cartItems } };
  },

  updateCartItem: async (productId: string, quantity: number): Promise<{ data: { cartItems: CartItem[] } }> => {
    await delay(300);
    const cartItems = cartService.updateCartItem(productId, quantity);
    return { data: { cartItems } };
  },

  createOrder: async (orderData: any): Promise<{ data: any }> => {
    await delay(1000);
    
    cartService.clearCart();
    
    return {
      data: {
        _id: `order_${Date.now()}`,
        ...orderData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    };
  },

  getWishlist: async (): Promise<{ data: string[] }> => {
    await delay(300);
    return { data: wishlistService.getWishlist() };
  },

  toggleWishlist: async (productId: string): Promise<{ data: string[] }> => {
    await delay(300);
    const wishlist = wishlistService.toggleWishlist(productId);
    return { data: wishlist };
  },

  processPayment: async (paymentData: any): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
    return paymentService.processPayment(paymentData);
  }

};
