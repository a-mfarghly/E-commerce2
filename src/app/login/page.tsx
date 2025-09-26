"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    
    try {
      if (!email || !password) {
        setMessage("Please enter both email and password.");
        setLoading(false);
        return;
      }

      await login(email, password);
      setMessage("Login successful! Redirecting...");
      
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      
    } catch (error: any) {
      console.error("Login error:", error);
      setMessage(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-center text-2xl font-medium text-gray-800 mb-6">
            login now
          </h2>
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email :
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-200 bg-blue-50 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="demo@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password :
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-200 bg-blue-50 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="••••••"
              />
            </div>

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-xs text-gray-500 hover:text-gray-700">
                forgot your password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "login now"}
            </button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign up now</a>
              </p>
            </div>
            
            {message && (
              <div className={`mt-4 text-sm text-center ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </div>
            )}
          </form>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 shadow-sm">
          <p className="text-center text-sm text-gray-700 font-medium mb-2">
            For testing use:
          </p>
          <div className="text-center text-xs text-gray-600 mb-3">
            <p>Email: demo@example.com</p>
            <p>Password: password</p>
          </div>
          <button
            onClick={() => {
              setEmail("demo@example.com");
              setPassword("password");
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded transition-colors"
          >
            Fill Test Credentials
          </button>
        </div>
      </div>
    </div>
  );
}

