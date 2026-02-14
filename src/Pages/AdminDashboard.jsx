import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as XLSX from 'xlsx';

// Sub-components
import AdminStats from './Admin/AdminStats';
import AdminBookings from './Admin/AdminBookings';
import AdminTrips from './Admin/AdminTrips';
import AdminCategories from './Admin/AdminCategories';
import AdminGallery from './Admin/AdminGallery';
import AdminModal from './Admin/AdminModal';

/* --- UI Components --- */

const Toast = ({ notification, onClose }) => {
  if (!notification) return null;
  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-premium-lg animate-slide-left backdrop-blur-md border ${notification.type === 'success'
        ? 'bg-white/90 border-green-100 text-green-700'
        : 'bg-white/90 border-red-100 text-red-700'
      }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
        {notification.type === 'success' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        )}
      </div>
      <div>
        <h4 className="font-bold text-sm">{notification.type === 'success' ? 'Success' : 'Error'}</h4>
        <p className="text-xs opacity-80">{notification.message}</p>
      </div>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-in">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-6">{message}</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Auth State for Login Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);

  // UI States
  const [notification, setNotification] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, collectionName: '', id: '' });

  // Helpers
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Navigation Links
  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: '📋', count: bookings.length },
    { id: 'trips', label: 'Trip Packages', icon: '🏔️', count: trips.length },
    { id: 'categories', label: 'Categories', icon: '📦', count: categories.length },
    { id: 'gallery', label: 'Gallery', icon: '🖼️', count: galleryImages.length }
  ];

  // Auth state listener
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
    const categoriesQ = query(collection(db, "categories"), orderBy("createdAt", "desc"));
    const unsubCategories = onSnapshot(categoriesQ, (snap) => {
      setCategories(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    // Gallery
    const galleryQ = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsubGallery = onSnapshot(galleryQ, (snap) => {
      setGalleryImages(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    return () => {
      unsubBookings();
      unsubTrips();
      unsubCategories();
      unsubGallery();
    };
  }, [user]);

  // Auth Functions
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

  const handleLogout = async () => {
    await signOut(auth);
  };

  // CRUD Operations
  // CRUD Operations
  const updateStatus = async (id, s) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: s });
      showNotification(`Booking updated to ${s}`);
    } catch (error) {
      showNotification("Failed to update status", "error");
    }
  };

  const confirmDelete = (collectionName, id) => {
    setConfirmModal({ isOpen: true, collectionName, id });
  };

  const executeDelete = async () => {
    const { collectionName, id } = confirmModal;
    try {
      await deleteDoc(doc(db, collectionName, id));
      showNotification("Item deleted successfully");
      setConfirmModal({ isOpen: false, collectionName: '', id: '' });
    } catch (error) {
      showNotification("Failed to delete item", "error");
    }
  };

  // Modal Handlers
  const openAddModal = (type) => {
    setModalType(type);
    setEditItem(null);
    setFormData(type === 'gallery' ? { type: 'photo' } : {});
    setPreviewUrl(null);
    setUploadProgress(0);
    setShowModal(true);
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditItem(item);
    setFormData(item);
    setPreviewUrl(item.img || item.url);
    setUploadProgress(0);
    setShowModal(true);
  };

  // File Upload Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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

  const handleFileUpload = async (file) => {
    // Validation
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for video, 5MB for image

    if (!isImage && !isVideo) return alert('Please upload an image or video file');
    if (file.size > maxSize) return alert(`File size should be less than ${isVideo ? '50MB' : '5MB'}`);

    // Set preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    // Determines file type for gallery
    if (modalType === 'gallery') {
      const type = isVideo ? 'video' : 'photo';
      setFormData(prev => ({ ...prev, type }));
    }

    setUploading(true);

    try {
      const timestamp = Date.now();
      const fileName = `${modalType}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          console.error(error);
          setUploading(false);
          alert("Upload failed!");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (modalType === 'gallery') {
            setFormData(prev => ({ ...prev, url: downloadURL }));
          } else {
            setFormData(prev => ({ ...prev, img: downloadURL }));
          }
          setUploading(false);
        }
      );
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Error uploading file");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const collectionName = modalType === 'trip' ? 'trips' : modalType === 'category' ? 'categories' : 'gallery';

      // Data cleaning
      const dataToSave = { ...formData, createdAt: formData.createdAt || new Date().toISOString() };
      if (dataToSave.highlights && typeof dataToSave.highlights === 'string') {
        dataToSave.highlights = dataToSave.highlights.split(',').map(h => h.trim()).filter(h => h);
      }

      if (editItem) {
        await updateDoc(doc(db, collectionName, editItem.id), dataToSave);
      } else {
        await addDoc(collection(db, collectionName), dataToSave);
      }
      setShowModal(false);
      showNotification("Item saved successfully!");
    } catch (error) {
      console.error("Error saving document: ", error);
      showNotification("Failed to save. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(bookings);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, "TourPanda_Report.xlsx");
  };

  // Stats calculation
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    pending: bookings.filter(b => b.status === "Pending").length,
    trips: trips.length,
  };


  // --- Render Views ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-nature-green/20 border-t-nature-green rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl">🐼</span>
            </div>
          </div>
          <p className="font-bold text-nature-black/70 animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-nature-green/5 to-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-premium-lg w-full max-w-md border border-white/50 relative z-10 transition-all duration-500 hover:shadow-premium-xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-nature-green to-nature-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-nature-green/20 rotate-3 hover:rotate-6 transition-transform duration-300">
              <span className="text-4xl filter drop-shadow-md">🐼</span>
            </div>
            <h2 className="text-3xl font-black text-nature-black mb-2">Admin Portal</h2>
            <p className="text-gray-400 font-medium">Secured Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nature-green transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
                <input
                  type="email"
                  placeholder="admin@tourpanda.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-nature-green outline-none transition-all font-medium placeholder:text-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 hidden-scrollbar">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nature-green transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-nature-green outline-none transition-all font-medium placeholder:text-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-nature-green transition-colors"
                >
                  {passwordVisible ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-nature-green to-nature-green-light text-white py-4 rounded-xl font-bold mt-2 hover:shadow-xl hover:shadow-nature-green/20 transition-all duration-300 transform hover:-translate-y-0.5 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loginLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Main Dashboard Layout ---
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-nature-black mb-1">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 font-medium text-lg">{getGreeting()}, <span className="text-nature-green font-bold">{user?.displayName || 'Admin'}</span> 👋</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportExcel}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-nature-black font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Export Report</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <AdminStats stats={stats} />

        {/* Tab Navigation */}
        <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80 rounded-2xl p-1.5 md:p-2 mb-8 shadow-sm border border-gray-100 flex flex-wrap gap-1.5 md:gap-2 transition-all duration-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 md:gap-2.5 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === tab.id
                ? 'bg-gradient-to-r from-nature-green to-nature-green-light text-white shadow-lg shadow-nature-green/20'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-sm md:text-base">{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-md text-xs transition-colors ${activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600'
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden border border-gray-100/80 min-h-[500px]">
          {activeTab === 'bookings' && (
            <AdminBookings
              bookings={bookings}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              updateStatus={updateStatus}
              deleteItem={confirmDelete}
            />
          )}

          {activeTab === 'trips' && (
            <AdminTrips
              trips={trips}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
              deleteItem={confirmDelete}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategories
              categories={categories}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
              deleteItem={confirmDelete}
            />
          )}

          {activeTab === 'gallery' && (
            <AdminGallery
              galleryImages={galleryImages}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
              deleteItem={confirmDelete}
              setModalType={setModalType}
              setEditItem={setEditItem}
              setFormData={setFormData}
              setPreviewUrl={setPreviewUrl}
              setUploadProgress={setUploadProgress}
              setShowModal={setShowModal}
            />
          )}
        </div>
      </div>

      {/* Admin Modal */}
      <AdminModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalType={modalType}
        editItem={editItem}
        formData={formData}
        setFormData={setFormData}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        handleFileChange={handleFileChange}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        uploading={uploading}
        uploadProgress={uploadProgress}
        saving={saving}
        handleSave={handleSave}
      />

      {/* Notifications & Confirmations */}
      <Toast notification={notification} onClose={() => setNotification(null)} />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={executeDelete}
        title="Delete Item"
        message="Are you sure you want to permanently delete this item? This action cannot be undone."
      />
    </div>
  );
}