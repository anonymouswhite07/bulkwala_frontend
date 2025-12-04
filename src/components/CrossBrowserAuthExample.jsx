// Example Component Showing Cross-Browser Authentication
// This demonstrates the proper way to handle auth in iOS Safari and all other browsers
// Compatible with Vercel frontend + Render backend

import React, { useState } from 'react';
import useCrossBrowserAuth from '@/hooks/useCrossBrowserAuth';

const CrossBrowserAuthExample = () => {
  const { 
    user, 
    isLoggedIn, 
    isLoading, 
    error, 
    login, 
    logout, 
    sendOtp, 
    verifyOtp 
  } = useCrossBrowserAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    
    if (result.success) {
      alert('Login successful!');
    } else {
      alert(`Login failed: ${result.error}`);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const result = await sendOtp(phone);
    
    if (result.success) {
      setShowOtpForm(true);
      alert('OTP sent successfully!');
    } else {
      alert(`Failed to send OTP: ${result.error}`);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const result = await verifyOtp({ phone, otp });
    
    if (result.success) {
      alert('OTP verified successfully!');
      setShowOtpForm(false);
    } else {
      alert(`OTP verification failed: ${result.error}`);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Cross-Browser Auth</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {isLoggedIn ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 rounded">
            <h3 className="font-semibold">Welcome, {user?.name}!</h3>
            <p className="text-sm text-gray-600">Email: {user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <h3 className="font-semibold">Email Login</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Login with Email
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>
          
          {/* OTP Login Form */}
          {!showOtpForm ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <h3 className="font-semibold">OTP Login</h3>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <h3 className="font-semibold">Verify OTP</h3>
              <input
                type="tel"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => setShowOtpForm(false)}
                className="w-full py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Back
              </button>
            </form>
          )}
        </div>
      )}
      
      {/* Cross-Browser Compatibility Notes */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold text-blue-800">Cross-Browser Compatibility</h4>
        <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>Uses <code className="bg-blue-100 px-1 rounded">withCredentials: true</code> for all requests</li>
          <li>Sets cookies with <code className="bg-blue-100 px-1 rounded">SameSite=None; Secure</code></li>
          <li>Handles cross-origin requests properly</li>
          <li>Works on iOS Safari, Chrome, Firefox, and all browsers</li>
          <li>Compatible with Vercel frontend + Render backend</li>
        </ul>
      </div>
    </div>
  );
};

export default CrossBrowserAuthExample;