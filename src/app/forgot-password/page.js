"use client";

import { useState } from "react";
import { api } from "@/services/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitEmail(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await api.forgotPassword({ email });
      setStep(2);
      setMessage("Reset code sent to your email. Please check your inbox.");
    } catch (e) {
      setMessage(e.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitCode(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await api.verifyResetCode({ resetCode: code });
      setStep(3);
      setMessage("Code verified successfully. Please enter your new password.");
    } catch (e) {
      setMessage(e.message || "Invalid reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitNewPassword(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await api.resetPassword({ email, newPassword });
      setMessage("Password reset successfully! You can now login with your new password.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (e) {
      setMessage(e.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 && "Enter your email address and we'll send you a reset code"}
            {step === 2 && "Enter the reset code sent to your email"}
            {step === 3 && "Enter your new password"}
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {step === 1 && (
            <form onSubmit={submitEmail} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}
          
          {step === 2 && (
            <form onSubmit={submitCode} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Reset Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Enter reset code"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}
          
          {step === 3 && (
            <form onSubmit={submitNewPassword} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Enter new password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
          
          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm ${
              message.includes("successfully") || message.includes("sent") 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
            }`}>
              {message}
            </div>
          )}
          
          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-green-600 hover:text-green-500">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


