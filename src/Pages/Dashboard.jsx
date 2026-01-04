import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

/**
 * Dashboard Component
 * 
 * User's personal dashboard to manage bookings and view stats.
 * Wraps functionality for:
 * - User authentication state monitoring
 * - Profile management
 * - Booking history visualization
 * - Activity statistics
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /**
   * Effect: Auth State Listener
   * Subscribes to Firebase Auth changes to maintain user session state.
   * Updates loading state once auth is resolved.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  /**
   * Signs out the current user and redirects to login page.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Helper: Extracts initials from display name or email.
   * Returns 'TP' (Tour Panda) as fallback.
   */
  const getUserInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      return names.length > 1
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0].substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'TP';
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const myBookings = [
    { id: 1, destination: "Hunza + Skardu", date: "Jan 15, 2026", status: "Confirmed", img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=400", price: "PKR 85,000", duration: "8 Days" },
    { id: 2, destination: "Fairy Meadows", date: "Feb 20, 2026", status: "Pending", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400", price: "PKR 45,000", duration: "5 Days" },
    { id: 3, destination: "Swat Kalam Malamjaba", date: "Mar 10, 2026", status: "Confirmed", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400", price: "PKR 28,000", duration: "3 Days" },
  ];

  const stats = [
    { label: "Total Trips", value: "12", icon: "✈️", color: "from-emerald-500 to-teal-600", trend: "+3 this year", trendUp: true },
    { label: "Countries Visited", value: "3", icon: "🌍", color: "from-amber-500 to-orange-500", trend: "Pakistan, UAE, Turkey", trendUp: null },
    { label: "Travel Miles", value: "8.5K", icon: "🛤️", color: "from-blue-500 to-indigo-600", trend: "+2.1K this month", trendUp: true },
    { label: "Saved Tours", value: "5", icon: "❤️", color: "from-rose-500 to-pink-600", trend: "2 new deals", trendUp: true },
  ];

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bookings', label: 'My Bookings', icon: '🎫' },
    { id: 'browse', label: 'Browse Tours', icon: '🏔️', link: '/' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const quickActions = [
    { label: 'Browse Tours', icon: '🏔️', link: '/', color: 'from-nature-green to-nature-green-light' },
    { label: 'Contact Support', icon: '💬', link: '/#contact', color: 'from-blue-500 to-blue-600' },
    { label: 'View Offers', icon: '🎁', link: '/#tours', color: 'from-primary to-primary-dark' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-bg-light via-white to-bg-light">
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
          <h3 className="text-nature-black font-bold text-lg mb-1">Loading Dashboard</h3>
          <p className="text-gray-400 font-medium text-sm">Preparing your adventures...</p>
          <div className="flex justify-center gap-1.5 mt-4">
            <div className="w-2 h-2 bg-nature-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-nature-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-nature-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-bg-light via-white to-bg-light">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-scale-in border border-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-100/50">
                <span className="text-4xl">👋</span>
              </div>
              <h3 className="text-2xl font-black text-nature-black mb-2">Leaving so soon?</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">Are you sure you want to logout from your TourPanda account?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 active:scale-95"
                >
                  Stay Here
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside className="w-64 xl:w-72 bg-white hidden lg:flex flex-col border-r border-gray-100 shadow-premium fixed h-full z-40">
        {/* Logo Section */}
        <div className="p-6 xl:p-8 border-b border-gray-50">
          <Link to="/" className="flex items-center gap-2 xl:gap-3 group">
            <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-nature-green to-nature-green-light rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg shadow-nature-green/20 group-hover:shadow-xl group-hover:shadow-nature-green/30 transition-all duration-300">
              <span className="text-white text-lg xl:text-xl">🐼</span>
            </div>
            <div>
              <span className="text-lg xl:text-xl font-black text-nature-black tracking-tight">Tour<span className="text-primary">Panda</span></span>
              <p className="text-[9px] xl:text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 xl:p-6 space-y-1.5 xl:space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            item.link ? (
              <Link
                key={item.id}
                to={item.link}
                className="flex items-center gap-3 xl:gap-4 p-3 xl:p-4 text-gray-500 hover:text-nature-green hover:bg-nature-green/5 rounded-xl xl:rounded-2xl transition-all duration-300 font-semibold group text-sm xl:text-base"
              >
                <span className="text-lg xl:text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <span>{item.label}</span>
                <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 xl:gap-4 p-3 xl:p-4 rounded-xl xl:rounded-2xl transition-all duration-300 font-semibold group text-sm xl:text-base ${activeNav === item.id
                  ? 'bg-gradient-to-r from-nature-green to-nature-green-light text-white shadow-lg shadow-nature-green/20'
                  : 'text-gray-500 hover:text-nature-green hover:bg-nature-green/5'
                  }`}
              >
                <span className={`text-lg xl:text-xl transition-transform ${activeNav === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {activeNav === item.id && (
                  <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            )
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 xl:p-6 border-t border-gray-50 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/30">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-nature-black text-sm truncate">{user?.displayName || 'Explorer'}</p>
              <p className="text-[10px] text-gray-400 font-medium truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 font-semibold group text-sm"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 xl:ml-72 overflow-y-auto pb-24 lg:pb-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div>
              {/* Mobile Logo */}
              <Link to="/" className="lg:hidden flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-nature-green to-nature-green-light rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🐼</span>
                </div>
                <span className="text-base font-black text-nature-black">Tour<span className="text-primary">Panda</span></span>
              </Link>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-nature-black tracking-tight">
                {getGreeting()}, <span className="text-gradient">{user?.displayName?.split(' ')[0] || 'Explorer'}!</span> 👋
              </h1>
              <p className="text-gray-400 font-medium mt-0.5 sm:mt-1 text-sm sm:text-base">Here's what's happening with your adventures</p>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notification Bell */}
              <button className="relative p-2.5 sm:p-3 bg-gray-50 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-all duration-300 group">
                <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform inline-block">🔔</span>
                <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-nature-green/10 to-primary/10 pl-3 sm:pl-4 pr-1.5 sm:pr-2 py-1.5 sm:py-2 rounded-full cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-nature-black text-sm">{user?.displayName || 'Explorer'}</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Adventure Seeker</p>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-black text-sm sm:text-base shadow-lg shadow-primary/30">
                  {getUserInitials()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Quick Actions */}
          <section className="mb-6 sm:mb-8">
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {quickActions.map((action, index) => (
                <Link
                  key={action.label}
                  to={action.link}
                  className={`group flex-shrink-0 flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r ${action.color} text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 btn-glow`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{action.icon}</span>
                  <span>{action.label}</span>
                  <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>

          {/* Stats Grid */}
          <section className="mb-8 sm:mb-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group relative bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-premium hover:shadow-premium-lg transition-all duration-500 border border-gray-50 overflow-hidden card-hover-lift card-shimmer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background Gradient Circle */}
                  <div className={`absolute -top-6 sm:-top-8 -right-6 sm:-right-8 w-20 sm:w-28 h-20 sm:h-28 bg-gradient-to-br ${stat.color} rounded-full opacity-10 group-hover:opacity-25 group-hover:scale-150 transition-all duration-700`} />

                  {/* Secondary decorative element */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-2xl sm:text-3xl icon-bounce inline-block">
                        {stat.icon}
                      </span>
                      <span className="text-gray-300 group-hover:text-nature-green transition-all duration-300 group-hover:translate-x-0.5">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black text-nature-black mb-0.5 sm:mb-1 stat-value">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-gray-500 font-semibold">{stat.label}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {stat.trendUp !== null && (
                        <span className={`text-[10px] sm:text-xs font-bold ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                          {stat.trendUp ? '↑' : '↓'}
                        </span>
                      )}
                      <p className="text-[10px] sm:text-xs text-gray-400 font-medium truncate">{stat.trend}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Bookings */}
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-nature-black">My Recent Bookings</h2>
                <p className="text-gray-400 font-medium text-xs sm:text-sm mt-0.5 sm:mt-1">Your upcoming travel adventures</p>
              </div>
              <button className="text-nature-green font-bold text-xs sm:text-sm hover:underline underline-offset-4 transition-all flex items-center gap-1.5 sm:gap-2 group">
                <span className="hidden xs:inline">View</span> All
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {myBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-lg transition-all duration-500 border border-gray-50 card-hover-lift"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <img
                      src={booking.img}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={booking.destination}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Status Badge */}
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-sm ${booking.status === 'Confirmed'
                        ? 'bg-green-500/90 text-white'
                        : 'bg-amber-500/90 text-white'
                        }`}
                    >
                      {booking.status === 'Confirmed' && '✓ '}{booking.status}
                    </span>

                    {/* Duration Badge */}
                    <span className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-bold text-nature-black">
                      {booking.duration}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <h4 className="font-black text-nature-black text-base sm:text-lg group-hover:text-nature-green transition-colors duration-300">
                      {booking.destination}
                    </h4>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{booking.date}</span>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-nature-green font-black text-lg sm:text-xl">{booking.price}</span>
                      <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-nature-green transition-colors group/btn">
                        View Details
                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {myBookings.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-premium">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">✈️</span>
                </div>
                <h3 className="text-xl font-black text-nature-black mb-2">No Bookings Yet</h3>
                <p className="text-gray-400 mb-6 max-w-sm mx-auto">Start exploring Pakistan's breathtaking destinations and book your first adventure!</p>
                <Link
                  to="/"
                  className="inline-block bg-gradient-to-r from-nature-green to-nature-green-light text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-nature-green/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Browse Tours
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-2 py-2 z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.slice(0, 5).map((item) => (
            item.link ? (
              <Link
                key={item.id}
                to={item.link}
                className="flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-300 text-gray-400 hover:text-nature-green"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-semibold">{item.label.split(' ')[0]}</span>
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-300 ${activeNav === item.id
                  ? 'text-nature-green bg-nature-green/10'
                  : 'text-gray-400 hover:text-nature-green'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-semibold">{item.label.split(' ')[0]}</span>
              </button>
            )
          ))}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-300 text-gray-400 hover:text-red-500"
          >
            <span className="text-xl">🚪</span>
            <span className="text-[10px] font-semibold">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}