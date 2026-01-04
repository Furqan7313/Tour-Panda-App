import React, { useState, useEffect, useRef } from 'react';
import { db, auth, storage } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as XLSX from 'xlsx';

/**
 * AdminDashboard Component
 * 
 * Secure administrative interface for managing the tour application.
 * Features:
 * - User Authentication (Login/Logout)
 * - Booking Management (View, Search, Filter, Status Updates, Delete)
 * - Trip Package Management (Create, Read, Update, Delete)
 * - Category Management
 * - Gallery Management (Photo/Video Uploads)
 * - Data Export to Excel
 * - Real-time Dashboard Statistics
 */

/**
 * Static Data: Default Categories
 * Fallback values if database is empty.
 */
const defaultCategories = [
  { id: "corporate", name: "Corporate Tours", desc: "Team building & business retreats", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80" },
  { id: "academic", name: "Academic Tours", desc: "Educational trips for schools & colleges", img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80" },
  { id: "family", name: "Family Tours", desc: "Fun adventures for all ages", img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80" },
  { id: "individual", name: "Individual Tours", desc: "Solo travel experiences", img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=400&q=80" },
  { id: "local", name: "Local Sightseeing", desc: "Discover nearby attractions", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80" }
];

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("bookings");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  // File upload states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all data
  useEffect(() => {
    if (!user) return;

    // Bookings
    const bookingsQ = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubBookings = onSnapshot(bookingsQ, (snap) => {
      setBookings(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Trips
    const tripsQ = query(collection(db, "trips"), orderBy("createdAt", "desc"));
    const unsubTrips = onSnapshot(tripsQ, (snap) => {
      setTrips(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Categories
    const catsQ = query(collection(db, "categories"));
    const unsubCats = onSnapshot(catsQ, (snap) => {
      const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setCategories(data.length ? data : defaultCategories);
    });

    // Gallery
    const galleryQ = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsubGallery = onSnapshot(galleryQ, (snap) => {
      setGalleryImages(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    return () => {
      unsubBookings();
      unsubTrips();
      unsubCats();
      unsubGallery();
    };
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

  /**
   * Header Handler: Logout
   * Signs out the current admin user.
   */
  const handleLogout = () => signOut(auth);

  // CRUD Operations

  /**
   * Action: Update Booking Status
   * Changes the status of a booking (e.g., Pending -> Confirmed).
   */
  const updateStatus = async (id, s) => await updateDoc(doc(db, "bookings", id), { status: s });
  const deleteItem = async (collectionName, id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  const openAddModal = (type) => {
    setModalType(type);
    setEditItem(null);
    setFormData(getDefaultFormData(type));
    setPreviewUrl(null);
    setUploadProgress(0);
    setShowModal(true);
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditItem(item);
    setFormData(item);
    setPreviewUrl(item.img || item.url || null);
    setUploadProgress(0);
    setShowModal(true);
  };

  const getDefaultFormData = (type) => {
    switch (type) {
      case 'trip':
        return { name: '', duration: '', durationDays: 1, img: '', desc: '', highlights: '', price: '', difficulty: 'Easy', badge: '', category: 'short' };
      case 'category':
        return { name: '', desc: '', img: '' };
      case 'gallery':
        return { url: '', title: '', location: '', type: 'photo' }; // type can be 'photo', 'video', or 'reel'
      default:
        return {};
    }
  };

  /**
   * Action: File Upload
   * Handles image and video uploads to Firebase Storage.
   * Includes validation for file type and size.
   * Updates form data with the download URL upon success.
   */
  const handleFileUpload = async (file) => {
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    // Validate file type
    if (!isImage && !isVideo) {
      alert('Please upload an image (JPG, PNG, WebP) or video (MP4, WebM) file');
      return;
    }

    // Validate file size (5MB for images, 50MB for videos)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size must be less than ${isVideo ? '50MB' : '5MB'}`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Create local preview
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      // For videos, create object URL
      setPreviewUrl(URL.createObjectURL(file));
    }

    // Auto-detect media type for gallery uploads
    if (modalType === 'gallery' && !formData.type) {
      setFormData(prev => ({ ...prev, type: isVideo ? 'video' : 'photo' }));
    }

    try {
      // Create unique file name
      const timestamp = Date.now();
      const fileName = `${modalType}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, fileName);

      // Upload with progress
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          alert('Upload failed. Please try again.');
          setUploading(false);
        },
        async () => {
          // Get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Update form data based on modal type
          if (modalType === 'gallery') {
            setFormData(prev => ({ ...prev, url: downloadURL }));
          } else {
            setFormData(prev => ({ ...prev, img: downloadURL }));
          }

          setUploading(false);
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const collectionName = modalType === 'trip' ? 'trips' : modalType === 'category' ? 'categories' : 'gallery';
      const data = { ...formData, updatedAt: serverTimestamp() };

      if (modalType === 'trip' && typeof data.highlights === 'string') {
        data.highlights = data.highlights.split(',').map(h => h.trim()).filter(h => h);
      }

      if (editItem) {
        await updateDoc(doc(db, collectionName, editItem.id), data);
      } else {
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, collectionName), data);
      }
      setShowModal(false);
      setPreviewUrl(null);
    } catch (error) {
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Feature: Export to Excel
   * Generates a downloadable .xlsx file containing all booking data.
   * Uses 'xlsx' library.
   */
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(bookings);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, "TourPanda_Report.xlsx");
  };

  // Filters
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone?.includes(searchTerm) || b.tourType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    pending: bookings.filter(b => b.status === "Pending").length,
    trips: trips.length,
    categories: categories.length,
    gallery: galleryImages.length
  };

  // Navigation tabs
  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: '📋', count: stats.total },
    { id: 'trips', label: 'Trip Packages', icon: '🏔️', count: stats.trips },
    { id: 'categories', label: 'Categories', icon: '📦', count: stats.categories },
    { id: 'gallery', label: 'Gallery', icon: '🖼️', count: stats.gallery },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative w-28 h-28 mx-auto mb-8">
            {/* Outer ring with gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-nature-green/20 via-primary/10 to-nature-green/20 animate-pulse"></div>
            {/* Spinning border */}
            <div className="absolute inset-1 border-[3px] border-gray-100 rounded-full"></div>
            <div className="absolute inset-1 border-[3px] border-transparent border-t-nature-green border-r-nature-green/50 rounded-full animate-spin"></div>
            {/* Inner icon container */}
            <div className="absolute inset-3 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-nature-green via-nature-green-light to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-nature-green/30 animate-float-subtle">
                <span className="text-3xl drop-shadow-lg">🐼</span>
              </div>
            </div>
          </div>
          <h3 className="text-nature-black font-black text-xl mb-2 tracking-tight">Admin Dashboard</h3>
          <p className="text-gray-400 font-medium text-sm flex items-center justify-center gap-2">
            <span className="inline-flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-nature-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-nature-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-nature-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </span>
            <span>Initializing panel</span>
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-primary/15 via-amber-200/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-nature-green/12 via-emerald-200/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/50 to-transparent rounded-full" />

        <div className="relative w-full max-w-md animate-scale-in">
          {/* Card container with refined styling */}
          <div className="relative bg-white/95 backdrop-blur-2xl p-10 md:p-12 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] border border-gray-100/80">
            {/* Subtle top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-nature-green via-primary to-nature-green-light rounded-full" />

            <div className="text-center mb-10">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-nature-green/20 to-primary/20 rounded-3xl blur-xl animate-pulse" />
                <div className="relative w-full h-full bg-gradient-to-br from-nature-green via-nature-green-light to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-nature-green/25 animate-float">
                  <span className="text-4xl drop-shadow-lg">🐼</span>
                </div>
              </div>
              <h2 className="text-3xl font-black text-nature-black tracking-tight">Admin Portal</h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="flex -space-x-1">
                  <div className="w-2 h-2 bg-nature-green rounded-full"></div>
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-[0.2em]">TourPanda.pk • Secure Access</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-nature-green transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input type="email" placeholder="admin@tourpanda.pk" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50/80 rounded-xl outline-none border-2 border-gray-100 focus:border-nature-green focus:bg-white focus:shadow-[0_0_0_4px_rgba(45,90,39,0.1)] transition-all duration-300 font-medium text-nature-black placeholder:text-gray-400" required />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-nature-green transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input type={passwordVisible ? "text" : "password"} placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-14 py-4 bg-gray-50/80 rounded-xl outline-none border-2 border-gray-100 focus:border-nature-green focus:bg-white focus:shadow-[0_0_0_4px_rgba(45,90,39,0.1)] transition-all duration-300 font-medium text-nature-black placeholder:text-gray-400" required />
                  <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-nature-green transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={passwordVisible ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                    </svg>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loginLoading}
                className="w-full bg-gradient-to-r from-nature-green via-nature-green-light to-nature-green text-white py-4.5 rounded-xl font-bold text-base hover:shadow-2xl hover:shadow-nature-green/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-70 relative overflow-hidden group mt-2">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className={`relative ${loginLoading ? 'opacity-0' : 'opacity-100'} transition-opacity flex items-center justify-center gap-2`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In to Dashboard
                </span>
                {loginLoading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}
              </button>
            </form>

            {/* Security badge */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full">
                <svg className="w-3.5 h-3.5 text-nature-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">256-bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50/50 pt-28 pb-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-nature-green to-emerald-500 rounded-2xl blur-lg opacity-40"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-nature-green via-nature-green-light to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-2xl drop-shadow-lg">🐼</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-black text-nature-black tracking-tight">Admin Dashboard</h1>
                  <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 bg-nature-green/10 text-nature-green text-xs font-bold rounded-full">
                    <span className="w-1.5 h-1.5 bg-nature-green rounded-full animate-pulse"></span>
                    Live
                  </span>
                </div>
                <p className="text-gray-400 font-medium text-sm mt-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Manage tours, bookings & content
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={exportExcel} className="group flex items-center gap-2 bg-gradient-to-r from-primary via-amber-400 to-primary bg-[length:200%_100%] hover:bg-right text-nature-black px-5 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-500">
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export Report</span>
            </button>
            <button onClick={handleLogout} className="group flex items-center gap-2 bg-white text-red-500 border border-red-100 px-5 py-3 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 active:scale-[0.98] transition-all duration-300 shadow-sm hover:shadow-md">
              <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
          {[
            { label: 'Total Bookings', value: stats.total, icon: '📋', color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50', trend: '+12%' },
            { label: 'Confirmed', value: stats.confirmed, icon: '✅', color: 'from-emerald-500 to-green-600', bgLight: 'bg-emerald-50', trend: '+8%' },
            { label: 'Pending Review', value: stats.pending, icon: '⏳', color: 'from-amber-500 to-orange-500', bgLight: 'bg-amber-50', trend: stats.pending > 0 ? 'Action needed' : 'All clear' },
            { label: 'Trip Packages', value: stats.trips, icon: '🏔️', color: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-50', trend: 'Active' },
          ].map((stat, i) => (
            <div key={i} className="group relative bg-white p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden card-shimmer">
              {/* Decorative gradient */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.08] rounded-full blur-2xl translate-x-8 -translate-y-8 group-hover:opacity-[0.15] transition-opacity duration-500`}></div>

              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-3xl md:text-4xl font-black text-nature-black stat-value">{stat.value}</p>
                  <p className={`text-xs font-bold mt-2 ${stat.label === 'Pending Review' && stat.value > 0 ? 'text-amber-600' : 'text-gray-400'}`}>{stat.trend}</p>
                </div>
                <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg icon-bounce`}>
                  <span className="text-xl md:text-2xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-1.5 md:p-2 mb-8 shadow-sm border border-gray-100 flex flex-wrap gap-1.5 md:gap-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 md:gap-2.5 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === tab.id
                ? 'bg-gradient-to-r from-nature-green to-nature-green-light text-white shadow-lg shadow-nature-green/20'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline text-sm">{tab.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
              {/* Active indicator dot for mobile */}
              {activeTab === tab.id && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full sm:hidden"></span>}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden border border-gray-100/80">
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              {/* Enhanced Search & Filter Bar */}
              <div className="p-5 md:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by name, phone, or tour..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-gray-200 focus:border-nature-green focus:ring-2 focus:ring-nature-green/10 transition-all font-medium text-sm placeholder:text-gray-400"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {['all', 'Confirmed', 'Pending'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`relative px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${filterStatus === status
                          ? 'bg-nature-green text-white shadow-md shadow-nature-green/20'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                      >
                        {filterStatus === status && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        )}
                        {status === 'all' ? 'All' : status}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Results count */}
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-semibold text-nature-black">{filteredBookings.length}</span>
                  <span>booking{filteredBookings.length !== 1 ? 's' : ''} found</span>
                  {searchTerm && <span className="text-gray-400">for "{searchTerm}"</span>}
                </div>
              </div>

              {filteredBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white">
                        <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">No.</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Client Details</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Tour Package</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredBookings.map((b, index) => (
                        <tr
                          key={b.id}
                          className="group table-row-premium hover:bg-gradient-to-r hover:from-nature-green/[0.03] hover:to-transparent transition-all duration-300"
                        >
                          <td className="px-6 py-5">
                            <span className="w-9 h-9 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500 border border-gray-200/50">
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3.5">
                              <div className="relative">
                                <div className="w-11 h-11 bg-gradient-to-br from-nature-green to-emerald-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md">
                                  {b.fullName?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                {b.status === 'Confirmed' && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-nature-black group-hover:text-nature-green transition-colors">{b.fullName}</p>
                                <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  {b.phone}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-nature-green/10 to-emerald-500/5 text-nature-green px-3.5 py-2 rounded-lg font-semibold text-sm border border-nature-green/10">
                              <span className="text-base">🏔️</span>
                              {b.tourType}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <select
                              value={b.status}
                              onChange={(e) => updateStatus(b.id, e.target.value)}
                              className={`px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer appearance-none transition-all duration-200 ${b.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:ring-emerald-300'
                                : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:ring-amber-300'}`}
                              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em', paddingRight: '2rem' }}
                            >
                              <option value="Pending">⏳ Pending</option>
                              <option value="Confirmed">✅ Confirmed</option>
                            </select>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => deleteItem('bookings', b.id)}
                                className="group/btn p-2.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
                              >
                                <svg className="w-4.5 h-4.5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                <div className="py-20 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 to-gray-100 rounded-full"></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-5xl opacity-40">📭</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-nature-black mb-2">No Bookings Found</h3>
                  <p className="text-gray-400 max-w-sm mx-auto">Try adjusting your search terms or filter to find what you're looking for.</p>
                  <button
                    onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Trips Tab */}
          {activeTab === 'trips' && (
            <div>
              {/* Section Header */}
              <div className="p-5 md:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-nature-black">Trip Packages</h3>
                      <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">{trips.length} total</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Manage your tour packages and itineraries</p>
                  </div>
                  <button
                    onClick={() => openAddModal('trip')}
                    className="group flex items-center gap-2 bg-gradient-to-r from-nature-green to-nature-green-light text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-nature-green/20 transition-all duration-300"
                  >
                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Trip Package
                  </button>
                </div>
              </div>
              {/* Trip Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 md:p-6">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      <img src={trip.img} alt={trip.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-700" />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {/* Duration Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-nature-green text-xs font-bold rounded-lg shadow-sm">
                          {trip.duration}
                        </span>
                      </div>
                      {/* Badge if exists */}
                      {trip.badge && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-primary text-nature-black text-xs font-bold rounded-lg shadow-sm">
                            {trip.badge}
                          </span>
                        </div>
                      )}
                      {/* Price Tag */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1.5 bg-nature-green text-white text-sm font-bold rounded-lg shadow-lg">
                          PKR {trip.price}
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <h4 className="font-bold text-nature-black group-hover:text-nature-green transition-colors line-clamp-1">{trip.name}</h4>
                      <p className="text-sm text-gray-400 mt-1 mb-4 line-clamp-2">{trip.desc}</p>
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal('trip', trip)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-100 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem('trips', trip.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Empty State */}
                {trips.length === 0 && (
                  <div className="col-span-full py-16 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-purple-50 rounded-full"></div>
                      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-4xl">🏔️</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-nature-black mb-2">No Trip Packages Yet</h4>
                    <p className="text-gray-400 mb-5">Start by creating your first tour package</p>
                    <button
                      onClick={() => openAddModal('trip')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-nature-green text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create First Trip
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div>
              {/* Section Header */}
              <div className="p-5 md:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-nature-black">Tour Categories</h3>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{categories.length} types</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Organize your tours into categories</p>
                  </div>
                  <button
                    onClick={() => openAddModal('category')}
                    className="group flex items-center gap-2 bg-gradient-to-r from-nature-green to-nature-green-light text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-nature-green/20 transition-all duration-300"
                  >
                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Category
                  </button>
                </div>
              </div>
              {/* Category Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 md:p-6">
                {categories.map((cat, index) => (
                  <div
                    key={cat.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden h-36">
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      {/* Category Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="font-bold text-white text-lg drop-shadow-lg">{cat.name}</h4>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{cat.desc}</p>
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal('category', cat)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-100 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem('categories', cat.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Empty State */}
                {categories.length === 0 && (
                  <div className="col-span-full py-16 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-50 rounded-full"></div>
                      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-4xl">📦</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-nature-black mb-2">No Categories Yet</h4>
                    <p className="text-gray-400 mb-5">Create categories to organize your tours</p>
                    <button
                      onClick={() => openAddModal('category')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-nature-green text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create First Category
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div>
              {/* Section Header */}
              <div className="p-5 md:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-nature-black">Gallery & Media</h3>
                      <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-full">{galleryImages.length} media</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Upload photos, videos, and reels for your destinations</p>
                  </div>
                  <button
                    onClick={() => openAddModal('gallery')}
                    className="group flex items-center gap-2 bg-gradient-to-r from-nature-green to-nature-green-light text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-nature-green/20 transition-all duration-300"
                  >
                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Upload Media
                  </button>
                </div>
              </div>

              {/* Uploaded Gallery Images */}
              {galleryImages.length > 0 && (
                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-nature-black">Uploaded Media</h4>
                        <p className="text-xs text-gray-400">{galleryImages.length} item{galleryImages.length !== 1 ? 's' : ''} in your gallery</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((img) => (
                      <div key={img.id} className="group relative rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        {/* Always visible gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3.5">
                          <p className="text-white font-bold text-sm truncate">{img.title}</p>
                          <div className="flex items-center gap-1.5 text-white/80 text-xs mt-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {img.location}
                          </div>
                        </div>
                        {/* Hover overlay with actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditModal('gallery', img); }}
                            className="p-2.5 bg-white text-gray-700 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteItem('gallery', img.id); }}
                            className="p-2.5 bg-white text-gray-700 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        {/* Status badge */}
                        <div className="absolute top-2.5 right-2.5 px-2 py-1 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-md shadow-lg flex items-center gap-1">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Live
                        </div>
                        {/* Media type badge */}
                        {img.type && img.type !== 'photo' && (
                          <div className="absolute top-2.5 left-2.5 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded-md">
                            {img.type}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placeholder Templates */}
              <div className="p-5 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-nature-black">Gallery Slots</h4>
                    <p className="text-xs text-gray-400">6 photo slots displayed on the website. Fill them with your best shots!</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { slot: 1, label: 'Gallery Photo 1' },
                    { slot: 2, label: 'Gallery Photo 2' },
                    { slot: 3, label: 'Gallery Photo 3' },
                    { slot: 4, label: 'Gallery Photo 4' },
                    { slot: 5, label: 'Gallery Photo 5' },
                    { slot: 6, label: 'Gallery Photo 6' },
                  ].map((item, index) => {
                    const isUploaded = galleryImages.length > index;
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          if (!isUploaded) {
                            setModalType('gallery');
                            setEditItem(null);
                            setFormData({ url: '', title: '', location: '' });
                            setPreviewUrl(null);
                            setUploadProgress(0);
                            setShowModal(true);
                          }
                        }}
                        className={`relative p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${isUploaded
                          ? 'border-green-200 bg-green-50/50'
                          : 'border-gray-200 hover:border-nature-green hover:bg-nature-green/5'
                          }`}
                      >
                        <div className="flex flex-col items-center text-center">
                          {/* Status Icon */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isUploaded ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                            {isUploaded ? (
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            )}
                          </div>

                          {/* Slot Label */}
                          <p className={`font-bold text-sm ${isUploaded ? 'text-green-700' : 'text-gray-600'}`}>
                            {item.label}
                          </p>

                          {/* Status Badge */}
                          <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${isUploaded
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                            }`}>
                            {isUploaded ? '✓ Filled' : 'Empty Slot'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Empty State when no images at all */}
              {galleryImages.length === 0 && (
                <div className="p-8 text-center border-t border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-nature-green/10 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-nature-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-nature-black mb-2">Start Building Your Gallery</h4>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    Upload stunning photos from your tours. Click on any location template above or the "Add Image" button to get started.
                  </p>
                  <button
                    onClick={() => openAddModal('gallery')}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-nature-green to-nature-green-light text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-nature-green/25 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Upload Your First Photo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal with Enhanced File Upload */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setShowModal(false); setPreviewUrl(null); }}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-nature-green to-nature-green-light rounded-xl flex items-center justify-center shadow-lg shadow-nature-green/20">
                  <span className="text-lg">{modalType === 'trip' ? '🏔️' : modalType === 'category' ? '📦' : '🖼️'}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-nature-black">{editItem ? 'Edit' : 'Add New'} {modalType === 'trip' ? 'Trip Package' : modalType === 'category' ? 'Category' : 'Gallery Image'}</h3>
                  <p className="text-xs text-gray-400 font-medium">Fill in the details below</p>
                </div>
              </div>
              <button onClick={() => { setShowModal(false); setPreviewUrl(null); }} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all group">
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Professional Image Upload Section */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-nature-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Image Upload *
                </label>

                {/* Drag & Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${dragActive
                    ? 'border-nature-green bg-nature-green/5 scale-[1.02]'
                    : previewUrl
                      ? 'border-nature-green/30 bg-nature-green/5'
                      : 'border-gray-200 hover:border-nature-green/50 hover:bg-gray-50'
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={modalType === 'gallery' ? 'image/*,video/*' : 'image/*'}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {uploading ? (
                    // Upload Progress
                    <div className="py-4">
                      <div className="w-16 h-16 mx-auto mb-4 relative">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                          <circle
                            cx="32" cy="32" r="28"
                            stroke="url(#progressGradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={176}
                            strokeDashoffset={176 - (176 * uploadProgress) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                          <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#2D5016" />
                              <stop offset="100%" stopColor="#4A7C23" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-black text-nature-green">{uploadProgress}%</span>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-nature-green">Uploading...</p>
                      <p className="text-xs text-gray-400 mt-1">Please wait while your file uploads</p>
                    </div>
                  ) : previewUrl ? (
                    // Preview with Remove Option
                    <div className="relative group">
                      {(formData.type === 'video' || formData.type === 'reel' || previewUrl.includes('.mp4') || previewUrl.includes('.webm') || previewUrl.startsWith('blob:')) && modalType === 'gallery' ? (
                        <video
                          src={previewUrl}
                          className="w-full h-40 object-cover rounded-xl shadow-lg"
                          muted
                          loop
                          playsInline
                          autoPlay
                        />
                      ) : (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-xl shadow-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            setPreviewUrl(null);
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all rounded-xl flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="px-4 py-2 bg-white text-nature-black rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Replace
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl(null);
                            if (modalType === 'gallery') {
                              setFormData(prev => ({ ...prev, url: '' }));
                            } else {
                              setFormData(prev => ({ ...prev, img: '' }));
                            }
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                      {/* Media type badge */}
                      <div className="absolute bottom-2 left-2 flex gap-2">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                        {modalType === 'gallery' && (
                          <span className="bg-white/90 text-nature-black px-2 py-1 rounded-md text-xs font-bold capitalize">
                            {formData.type || 'photo'}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Empty State - Upload Prompt
                    <>
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all ${dragActive ? 'bg-nature-green/20 scale-110' : 'bg-gray-100'}`}>
                        <svg className={`w-8 h-8 transition-colors ${dragActive ? 'text-nature-green' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-gray-700 mb-1">
                        {dragActive ? 'Drop your file here!' : modalType === 'gallery' ? 'Drag & drop photo or video' : 'Drag & drop your image here'}
                      </p>
                      <p className="text-xs text-gray-400 mb-3">or click to browse from your system</p>
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-nature-green to-nature-green-light text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-nature-green/20 hover:shadow-xl transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Choose File
                      </div>
                      <p className="text-[10px] text-gray-400 mt-3">
                        {modalType === 'gallery'
                          ? 'Supports: JPG, PNG, WebP, MP4, WebM • Max: 5MB images, 50MB videos'
                          : 'Supports: JPG, PNG, WebP • Max size: 5MB'
                        }
                      </p>
                    </>
                  )}
                </div>

                {/* Or use URL option */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs text-gray-400 font-semibold uppercase">or paste image URL</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <div className="mt-3 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={modalType === 'gallery' ? (formData.url || '') : (formData.img || '')}
                    onChange={(e) => {
                      const url = e.target.value;
                      if (modalType === 'gallery') {
                        setFormData({ ...formData, url });
                      } else {
                        setFormData({ ...formData, img: url });
                      }
                      if (url) setPreviewUrl(url);
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Form Fields Based on Modal Type */}
              {modalType === 'trip' && (
                <>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Trip Name *</label><input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium" placeholder="e.g. Hunza Valley Tour" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Duration *</label><input type="text" value={formData.duration || ''} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium" placeholder="e.g. 5 Days" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Price (PKR) *</label><input type="text" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium" placeholder="e.g. 55,000" /></div>
                  </div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Description *</label><textarea value={formData.desc || ''} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} rows={3} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium resize-none" placeholder="Trip description..." /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Highlights (comma-separated)</label><input type="text" value={Array.isArray(formData.highlights) ? formData.highlights.join(', ') : formData.highlights || ''} onChange={(e) => setFormData({ ...formData, highlights: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium" placeholder="e.g. Attabad Lake, Karimabad, Eagle's Nest" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label><select value={formData.difficulty || 'Easy'} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium"><option value="Easy">Easy</option><option value="Moderate">Moderate</option><option value="Challenging">Challenging</option></select></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Badge</label><input type="text" value={formData.badge || ''} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium" placeholder="e.g. Best Seller" /></div>
                  </div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Category</label><select value={formData.category || 'short'} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium"><option value="day">Day Trip</option><option value="weekend">Weekend</option><option value="short">3-4 Days</option><option value="mid">5-6 Days</option><option value="long">Week+</option></select></div>
                </>
              )}

              {modalType === 'category' && (
                <>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Category Name *</label><input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium" placeholder="e.g. Family Tours" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Description *</label><textarea value={formData.desc || ''} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} rows={2} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium resize-none" placeholder="Short description..." /></div>
                </>
              )}

              {modalType === 'gallery' && (
                <>
                  {/* Media Type Selector */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Media Type *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'photo', label: 'Photo', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
                        { value: 'video', label: 'Video', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> },
                        { value: 'reel', label: 'Reel', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg> },
                      ].map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.value })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.type === type.value
                            ? 'border-nature-green bg-nature-green/10 text-nature-green'
                            : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                            }`}
                        >
                          {type.icon}
                          <span className="text-xs font-bold">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Title *</label><input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium" placeholder="e.g. Mountain Sunrise" /></div>
                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Location *</label><input type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-nature-green focus:bg-white transition-all font-medium" placeholder="e.g. Hunza Valley" /></div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50/50 rounded-b-3xl">
              <button onClick={() => { setShowModal(false); setPreviewUrl(null); }} className="flex-1 py-3.5 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors border border-gray-200">Cancel</button>
              <button onClick={handleSave} disabled={saving || uploading} className="flex-1 py-3.5 bg-gradient-to-r from-nature-green to-nature-green-light text-white rounded-xl font-bold hover:shadow-lg hover:shadow-nature-green/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{editItem ? 'Update' : 'Add'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}