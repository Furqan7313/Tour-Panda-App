import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 1. Check Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Data if Authenticated
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setBookings(data);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Invalid Admin Credentials");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  // --- Functions for table actions ---
  const updateStatus = async (id, s) => await updateDoc(doc(db, "bookings", id), { status: s });
  const deleteBooking = async (id) => window.confirm("Are you sure you want to delete this booking?") && await deleteDoc(doc(db, "bookings", id));

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(bookings);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, "TourPanda_Report.xlsx");
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone?.includes(searchTerm) ||
      b.tourType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    pending: bookings.filter(b => b.status === "Pending").length,
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-light via-white to-bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-nature-green/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-nature-green rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-b-primary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-gradient-to-br from-nature-green to-nature-green-light rounded-2xl flex items-center justify-center shadow-lg shadow-nature-green/30">
                <span className="text-2xl">🐼</span>
              </div>
            </div>
          </div>
          <h3 className="text-nature-black font-bold text-lg mb-1">Admin Dashboard</h3>
          <p className="text-gray-400 font-medium text-sm">Loading management panel...</p>
          <div className="flex justify-center gap-1.5 mt-4">
            <div className="w-2 h-2 bg-nature-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-nature-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-nature-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // --- Login Screen ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-light via-white to-nature-green/5 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-nature-green/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/5 rounded-full animate-float" />

        <div className="relative w-full max-w-md animate-scale-in">
          {/* Card */}
          <div className="bg-white/90 backdrop-blur-xl p-10 md:p-12 rounded-[2.5rem] shadow-premium-lg border border-white/50">
            {/* Logo */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-nature-green to-nature-green-light rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-nature-green/20 animate-float">
                <span className="text-4xl">🐼</span>
              </div>
              <h2 className="text-3xl font-black text-nature-black tracking-tight">Admin Portal</h2>
              <p className="text-gray-400 font-semibold text-sm uppercase tracking-widest mt-3">
                TourPanda.pk • Secure Login
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-nature-green transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-gray-50/50 rounded-2xl outline-none border-2 border-gray-100 focus:border-nature-green focus:bg-white focus:shadow-lg focus:shadow-nature-green/10 transition-all duration-300 font-semibold text-nature-black placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-nature-green transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 bg-gray-50/50 rounded-2xl outline-none border-2 border-gray-100 focus:border-nature-green focus:bg-white focus:shadow-lg focus:shadow-nature-green/10 transition-all duration-300 font-semibold text-nature-black placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-nature-green transition-colors"
                >
                  {passwordVisible ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-nature-green to-nature-green-light text-white py-5 rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-nature-green/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className={`${loginLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                  Sign In to Dashboard
                </span>
                {loginLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </form>

            {/* Security Badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs font-semibold">256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Dashboard Screen ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light via-white to-bg-light pt-28 pb-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-nature-green to-nature-green-light rounded-2xl flex items-center justify-center shadow-xl shadow-nature-green/25">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-nature-black tracking-tight">
                  Booking Management
                </h1>
                <p className="text-gray-400 font-medium text-sm mt-1">Manage all your tour bookings in one place</p>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-[4.5rem] mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-nature-green/10 text-nature-green rounded-full text-xs font-bold">
                <span className="w-1.5 h-1.5 bg-nature-green rounded-full animate-pulse"></span>
                Live Sync
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportExcel}
              className="group flex items-center gap-2.5 bg-gradient-to-r from-primary to-amber-400 text-nature-black px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span className="text-lg group-hover:rotate-12 transition-transform duration-300">📊</span>
              Export Excel
            </button>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2.5 bg-white text-red-500 border-2 border-red-100 px-6 py-3.5 rounded-2xl font-bold hover:bg-red-50 hover:border-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-red-500/5"
            >
              <span className="text-lg group-hover:translate-x-0.5 transition-transform duration-300">🚪</span>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {/* Total Bookings */}
          <div className="group bg-white p-6 rounded-3xl shadow-premium hover:shadow-premium-lg transition-all duration-500 border border-gray-50 card-hover-lift card-shimmer overflow-hidden relative">
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-10 group-hover:opacity-25 group-hover:scale-150 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-2xl icon-bounce">📋</span>
              </div>
              <div className="flex-1">
                <p className="text-3xl font-black text-nature-black stat-value">{stats.total}</p>
                <p className="text-sm text-gray-500 font-semibold">Total Bookings</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmed */}
          <div className="group bg-white p-6 rounded-3xl shadow-premium hover:shadow-premium-lg transition-all duration-500 border border-gray-50 card-hover-lift card-shimmer overflow-hidden relative">
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full opacity-10 group-hover:opacity-25 group-hover:scale-150 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-2xl icon-bounce">✅</span>
              </div>
              <div className="flex-1">
                <p className="text-3xl font-black text-nature-black stat-value">{stats.confirmed}</p>
                <p className="text-sm text-gray-500 font-semibold">Confirmed</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-700" style={{ width: stats.total > 0 ? `${(stats.confirmed / stats.total) * 100}%` : '0%' }} />
                  </div>
                  <span className="text-xs font-bold text-emerald-600">{stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="group bg-white p-6 rounded-3xl shadow-premium hover:shadow-premium-lg transition-all duration-500 border border-gray-50 card-hover-lift card-shimmer overflow-hidden relative">
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full opacity-10 group-hover:opacity-25 group-hover:scale-150 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-2xl icon-bounce">⏳</span>
              </div>
              <div className="flex-1">
                <p className="text-3xl font-black text-nature-black stat-value">{stats.pending}</p>
                <p className="text-sm text-gray-500 font-semibold">Pending</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700" style={{ width: stats.total > 0 ? `${(stats.pending / stats.total) * 100}%` : '0%' }} />
                  </div>
                  <span className="text-xs font-bold text-amber-600">{stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-3xl p-5 mb-8 shadow-premium border border-gray-50 flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-nature-green transition-colors duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, or tour type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-gray-50/50 rounded-2xl outline-none border-2 border-transparent focus:border-nature-green focus:bg-white focus:shadow-lg focus:shadow-nature-green/10 transition-all duration-300 font-semibold text-nature-black placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All', icon: '📋', count: bookings.length },
              { value: 'Confirmed', label: 'Confirmed', icon: '✅', count: stats.confirmed },
              { value: 'Pending', label: 'Pending', icon: '⏳', count: stats.pending },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`group flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 ${filterStatus === filter.value
                  ? 'bg-gradient-to-r from-nature-green to-nature-green-light text-white shadow-lg shadow-nature-green/25 scale-[1.02]'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:scale-[1.02]'
                  }`}
              >
                <span className="group-hover:scale-110 transition-transform duration-300">{filter.icon}</span>
                <span className="hidden sm:inline">{filter.label}</span>
                <span className={`hidden md:inline-flex items-center justify-center min-w-[1.5rem] h-6 text-xs rounded-full px-1.5 ${filterStatus === filter.value ? 'bg-white/20' : 'bg-gray-200 text-gray-600'}`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-premium-lg overflow-hidden border border-gray-50">
          {filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-nature-green to-nature-green-light text-white">
                    <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider">#</th>
                    <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider">Client Info</th>
                    <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider">Tour Type</th>
                    <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider">Status</th>
                    <th className="px-6 py-5 font-bold text-sm uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBookings.map((b, index) => (
                    <tr
                      key={b.id}
                      className="group hover:bg-nature-green/5 transition-all duration-300"
                    >
                      <td className="px-6 py-5">
                        <span className="w-8 h-8 bg-gray-100 group-hover:bg-nature-green/10 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500 group-hover:text-nature-green transition-colors">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-nature-green/10 to-primary/10 rounded-2xl flex items-center justify-center font-black text-nature-green text-lg">
                            {b.fullName?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-nature-black text-base">{b.fullName}</p>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              <span>📞</span> {b.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 bg-nature-green/10 text-nature-green px-4 py-2 rounded-xl font-bold text-sm">
                          <span>🏔️</span>
                          {b.tourType}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide outline-none cursor-pointer transition-all duration-300 border-2 ${b.status === 'Confirmed'
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 hover:border-green-300'
                            : 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 hover:border-amber-300'
                            }`}
                        >
                          <option value="Pending">⏳ Pending</option>
                          <option value="Confirmed">✅ Confirmed</option>
                        </select>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 hover:scale-110 active:scale-95 transition-all duration-300"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteBooking(b.id)}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:scale-110 active:scale-95 transition-all duration-300"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="py-20 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl opacity-50">📭</span>
              </div>
              <h3 className="text-xl font-bold text-nature-black mb-2">No Bookings Found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'When customers book tours, they will appear here.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredBookings.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-6">
              <p className="text-gray-500 text-sm font-medium">
                Showing <span className="text-nature-green font-bold text-base">{filteredBookings.length}</span> of{' '}
                <span className="font-bold text-base text-nature-black">{bookings.length}</span> bookings
              </p>
              {filterStatus !== 'all' && (
                <span className="text-xs bg-nature-green/10 text-nature-green px-3 py-1 rounded-full font-bold">
                  Filtered: {filterStatus}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                Live sync with Firebase
              </p>
              <span className="text-gray-300">•</span>
              <p className="text-xs text-gray-400">Last updated: Just now</p>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}