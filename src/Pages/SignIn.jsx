import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, sendMagicLink } from '../firebase';

/**
 * SignIn Component
 * 
 * Handles user authentication via:
 * 1. Email/Password (Firebase Auth)
 * 2. Google OAuth (Firebase Popup)
 * 3. Magic Link (Passwordless email login)
 * 
 * Features:
 * - Form validation and error handling
 * - Interactive UI with animations
 * - Responsive layout with split view (visual + form)
 */
export default function SignIn() {
  const navigate = useNavigate();
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  /**
   * Authenticates user with email and password.
   * Redirects to dashboard on success.
   */
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Authenticates user using a social provider (Google).
   * Handles specific error cases like popup closure or existing accounts.
   * 
   * @param {object} provider - Firebase auth provider instance
   * @param {string} providerName - Name of the provider for error messages
   */
  const handleSocialSignIn = async (provider, providerName) => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Welcome to Tour_Panda:", result.user.displayName);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in cancelled');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email using a different sign-in method');
      } else {
        setError(`${providerName} sign in failed. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiates the passwordless login flow.
   * Sends a sign-in link to the user's email.
   */
  const handleMagicLink = async () => {
    if (!magicLinkEmail) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendMagicLink(magicLinkEmail);
      setMagicLinkSent(true);
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Error message helper
  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      default:
        return 'Sign in failed. Please try again';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAF5] via-white to-[#F8FAF5] p-4 md:p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-nature-green/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float" />

      {/* Floating Decorative Icons */}
      <div className="absolute top-20 left-20 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-20 w-10 h-10 bg-nature-green/10 rounded-xl flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
        <svg className="w-5 h-5 text-nature-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      </div>

      {/* Magic Link Modal */}
      {showMagicLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-up" style={{ animationDuration: '0.2s' }}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in" style={{ animationDuration: '0.3s' }}>
            {!magicLinkSent ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-nature-green mb-2">Sign in with Magic Link</h3>
                  <p className="text-gray-500 text-sm">Enter your email and we'll send you a secure link to sign in</p>
                </div>
                <input
                  type="email"
                  value={magicLinkEmail}
                  onChange={(e) => setMagicLinkEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowMagicLinkModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMagicLink}
                    disabled={loading}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-nature-green mb-2">Check your inbox!</h3>
                <p className="text-gray-500 text-sm mb-6">We sent a magic link to <strong>{magicLinkEmail}</strong></p>
                <button
                  onClick={() => {
                    setShowMagicLinkModal(false);
                    setMagicLinkSent(false);
                    setMagicLinkEmail('');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-nature-green text-white font-semibold hover:bg-nature-green-light transition-all"
                >
                  Got it!
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex bg-white rounded-[2rem] shadow-premium-lg overflow-hidden max-w-5xl w-full m-4 animate-scale-in">
        {/* Left Side: Visual Panel */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            alt="Travel background"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-nature-green/80 via-nature-green/60 to-primary/40" />

          {/* Animated Overlay Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/30 rounded-full animate-float" />
            <div className="absolute bottom-32 right-10 w-24 h-24 border-2 border-white/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-primary/30 rounded-full animate-float" style={{ animationDelay: '0.8s' }} />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-10 z-10">
            {/* TourPanda Logo - Same as Navbar */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex flex-col -space-y-1">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.25em] leading-none transition-all duration-300 group-hover:tracking-[0.3em]">Tour</span>
                <div className="flex items-center">
                  <span className="text-white text-2xl font-black group-hover:text-white/90 transition-all duration-300">Panda</span>
                  <span className="text-primary text-2xl font-black">.pk</span>
                </div>
              </div>
              {/* Decorative Panda Icon */}
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg">🐼</span>
              </div>
            </Link>

            {/* Quote Section */}
            <div className="space-y-6">
              <div className="w-16 h-1 bg-primary rounded-full" />
              <h3 className="text-3xl font-bold text-white leading-tight">
                Adventure awaits.<br />
                <span className="text-primary">Welcome back.</span>
              </h3>
              <p className="text-white/80 text-lg max-w-xs">
                Continue your journey to discover the world's most breathtaking destinations.
              </p>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-white/60 text-sm">Destinations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-white/60 text-sm">Happy Travelers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-14 relative">
          {/* Decorative Elements */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-nature-green/10 to-transparent rounded-full" />

          {/* Mobile Logo - Same as Navbar */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="flex flex-col -space-y-1">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.25em] leading-none">Tour</span>
                <div className="flex items-center">
                  <span className="text-nature-black text-2xl font-black group-hover:text-nature-green transition-all duration-300">Panda</span>
                  <span className="text-primary text-2xl font-black">.pk</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-nature-green to-nature-green/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg">🐼</span>
              </div>
            </Link>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-nature-green mb-2">Welcome Back</h2>
              <p className="text-gray-500">Enter your credentials to access your trips</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-up" style={{ animationDuration: '0.3s' }}>
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
                <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleEmailSignIn}>
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Email Address
                </label>
                <div className={`relative transition-all duration-300 ${focusedInput === 'email' ? 'transform -translate-y-0.5' : ''}`}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full p-4 pl-12 bg-gray-50/80 rounded-xl border-2 outline-none transition-all duration-300 ${focusedInput === 'email'
                      ? 'border-primary bg-white shadow-lg shadow-primary/10'
                      : 'border-transparent hover:border-gray-200'
                      }`}
                    required
                  />
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === 'email' ? 'text-primary' : 'text-gray-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </label>
                <div className={`relative transition-all duration-300 ${focusedInput === 'password' ? 'transform -translate-y-0.5' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full p-4 pl-12 pr-12 bg-gray-50/80 rounded-xl border-2 outline-none transition-all duration-300 ${focusedInput === 'password'
                      ? 'border-primary bg-white shadow-lg shadow-primary/10'
                      : 'border-transparent hover:border-gray-200'
                      }`}
                    required
                  />
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedInput === 'password' ? 'text-primary' : 'text-gray-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30" />
                    <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors">Forgot Password?</a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-nature-green to-nature-green-light text-white py-4 rounded-xl font-bold mt-2 hover:shadow-xl hover:shadow-nature-green/20 transition-all duration-300 transform hover:-translate-y-0.5 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
              <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">or continue with</span>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
            </div>

            {/* Social Login Options */}
            <div className="mt-6">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialSignIn(googleProvider, 'Google')}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl border-2 border-gray-100 flex items-center justify-center gap-3 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm">Continue with Google</span>
              </button>
            </div>

            {/* Email Magic Link Option */}
            <button
              type="button"
              onClick={() => setShowMagicLinkModal(true)}
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-3 font-semibold text-gray-600 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-sm">Sign in with Magic Link</span>
            </button>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-bold hover:text-primary-dark transition-colors relative group">
                Join for free
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}