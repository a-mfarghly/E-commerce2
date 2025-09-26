// Mock data for the e-commerce application
export interface Product {
  _id: string;
  title: string;
  price: number;
  priceAfterDiscount?: number;
  description: string;
  imageCover: string;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  brand: {
    _id: string;
    name: string;
  };
  ratingsAverage: number;
  ratingsQuantity: number;
  quantity: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  count: number;
  price: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

// Mock products data
export const mockProducts: Product[] = [
  {
    _id: "1",
    title: "iPhone 14 Pro",
    price: 25000,
    priceAfterDiscount: 23000,
    description: "Latest iPhone with advanced camera system",
    imageCover: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"],
    category: { _id: "cat1", name: "Electronics" },
    brand: { _id: "brand1", name: "Apple" },
    ratingsAverage: 4.8,
    ratingsQuantity: 150,
    quantity: 10
  },
  {
    _id: "2",
    title: "Samsung Galaxy S23",
    price: 20000,
    description: "Powerful Android smartphone",
    imageCover: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
    images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400"],
    category: { _id: "cat1", name: "Electronics" },
    brand: { _id: "brand2", name: "Samsung" },
    ratingsAverage: 4.6,
    ratingsQuantity: 120,
    quantity: 15
  },
  {
    _id: "3",
    title: "MacBook Pro 16\"",
    price: 45000,
    priceAfterDiscount: 42000,
    description: "Professional laptop for developers and creators",
    imageCover: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"],
    category: { _id: "cat2", name: "Computers" },
    brand: { _id: "brand1", name: "Apple" },
    ratingsAverage: 4.9,
    ratingsQuantity: 89,
    quantity: 5
  },
  {
    _id: "4",
    title: "Nike Air Max 270",
    price: 3500,
    description: "Comfortable running shoes",
    imageCover: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
    category: { _id: "cat3", name: "Fashion" },
    brand: { _id: "brand3", name: "Nike" },
    ratingsAverage: 4.4,
    ratingsQuantity: 200,
    quantity: 25
  },
  {
    _id: "5",
    title: "Sony WH-1000XM4",
    price: 8000,
    priceAfterDiscount: 7200,
    description: "Noise-canceling wireless headphones",
    imageCover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"],
    category: { _id: "cat1", name: "Electronics" },
    brand: { _id: "brand4", name: "Sony" },
    ratingsAverage: 4.7,
    ratingsQuantity: 95,
    quantity: 12
  },
  {
    _id: "6",
    title: "Adidas Ultraboost 22",
    price: 4200,
    description: "Premium running shoes with boost technology",
    imageCover: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
    category: { _id: "cat3", name: "Fashion" },
    brand: { _id: "brand5", name: "Adidas" },
    ratingsAverage: 4.5,
    ratingsQuantity: 180,
    quantity: 20
  }
];

// Mock categories data
export const mockCategories: Category[] = [
  {
    _id: "cat1",
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400"
  },
  {
    _id: "cat2",
    name: "Computers",
    slug: "computers",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400"
  },
  {
    _id: "cat3",
    name: "Fashion",
    slug: "fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"
  }
];

// Mock brands data
export const mockBrands: Brand[] = [
  {
    _id: "brand1",
    name: "Apple",
    slug: "apple",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400"
  },
  {
    _id: "brand2",
    name: "Samsung",
    slug: "samsung",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400"
  },
  {
    _id: "brand3",
    name: "Nike",
    slug: "nike",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
  },
  {
    _id: "brand4",
    name: "Sony",
    slug: "sony",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
  },
  {
    _id: "brand5",
    name: "Adidas",
    slug: "adidas",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"
  }
];

// Mock user data
export const mockUser: User = {
  _id: "user1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+20123456789"
};

