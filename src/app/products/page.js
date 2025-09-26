"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [priceRange, setPriceRange] = useState({ from: "", to: "" });
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts();
        setProducts(data?.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const categories = [
    { name: "All Products", count: products.length },
    { name: "Electronics", count: 8 },
    { name: "Fashion", count: 4 }
  ];
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const clearFilters = () => {
    setSelectedCategory("All Products");
    setPriceRange({ from: "", to: "" });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">All Products</h1>
      </div>
      
      <div className="relative">
        <button 
          onClick={toggleFilters}
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          <span>Filters</span>
        </button>
        
        <div className={`${showFilters ? 'block' : 'hidden'} absolute z-10 w-full sm:w-80 bg-white rounded-lg shadow-md`}>
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a product..."
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div 
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-3 py-2 rounded-lg cursor-pointer text-sm ${
                      selectedCategory === category.name 
                        ? "bg-green-100 text-green-800" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {category.name} ({category.count})
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="From"
                  value={priceRange.from}
                  onChange={(e) => setPriceRange({...priceRange, from: e.target.value})}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                />
                <input
                  type="text"
                  placeholder="To"
                  value={priceRange.to}
                  onChange={(e) => setPriceRange({...priceRange, to: e.target.value})}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                />
              </div>
            </div>
            
            <button
              onClick={clearFilters}
              className="w-full py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
        
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(8).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 h-80 animate-pulse">
              <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
              <div className="bg-gray-200 h-4 rounded-md mb-2 w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded-md mb-4 w-1/2"></div>
              <div className="bg-gray-200 h-8 rounded-md w-full"></div>
            </div>
          ))
        ) : (
          products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))
        )}
      </div>
    </div>
  );
}


