import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Trip packages for dropdown
const tripPackages = [
    { id: "hunza-skardu-8days", name: "Hunza + Skardu", duration: "8 Days", price: "85,000" },
    { id: "hunza-naran-5days", name: "Hunza + Naran Kaghan", duration: "5 Days", price: "55,000" },
    { id: "fairy-meadows-5days", name: "Fairy Meadows", duration: "5 Days", price: "45,000" },
    { id: "kumrat-valley-4days", name: "Kumrat Valley", duration: "4 Days", price: "35,000" },
    { id: "swat-kalam-3days", name: "Swat Kalam Malamjaba", duration: "3 Days", price: "28,000" },
    { id: "neelum-valley-3days", name: "Neelum Valley", duration: "3 Days", price: "25,000" },
    { id: "naran-babusar-3days", name: "Naran Babusar Top", duration: "3 Days", price: "22,000" },
    { id: "malamjabba-2days", name: "Malamjabba", duration: "2 Days", price: "18,000" },
    { id: "shogran-siripaye-2days", name: "Shogran + Siripaye", duration: "2 Days", price: "16,000" },
    { id: "sharan-forest-2days", name: "Sharan Forest", duration: "2 Days", price: "14,000" },
    { id: "mushkpori-top-1day", name: "Mushkpori Top", duration: "1 Day", price: "8,000" },
    { id: "umbrella-waterfall-1day", name: "Umbrella Waterfall", duration: "1 Day", price: "5,000" },
    { id: "khewra-salt-mine-1day", name: "Khewra Salt Mine", duration: "1 Day", price: "4,500" },
];

// Tour categories with icons
const tourCategories = [
    { id: "corporate", name: "Corporate & Industrial", icon: "🏢" },
    { id: "academic", name: "Academic Tours", icon: "🎓" },
    { id: "family", name: "Family Tours", icon: "👨‍👩‍👧‍👦" },
    { id: "individual", name: "Individual Tours", icon: "🧳" },
    { id: "local", name: "Local Sightseeing", icon: "📍" },
    { id: "custom", name: "Customized Tours", icon: "✨" },
];

export default function BookingModal({ isOpen, onClose, preSelectedPackage = null }) {
    const [status, setStatus] = useState("idle"); // idle | sending | success
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        emergencyPhone: '',
        cnic: '',
        address: '',
        tourCategory: '',
        tripPackage: preSelectedPackage || '',
        maleCount: 1,
        femaleCount: 0,
        childrenCount: 0,
        startDate: '',
        endDate: '',
        specialRequests: ''
    });

    // Calculate trip days from dates
    const calculateTripDays = () => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both days
            return diffDays > 0 ? diffDays : 0;
        }
        return 0;
    };

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Update preSelectedPackage when prop changes
    useEffect(() => {
        if (preSelectedPackage) {
            setFormData(prev => ({ ...prev, tripPackage: preSelectedPackage }));
        }
    }, [preSelectedPackage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (field, increment) => {
        setFormData(prev => ({
            ...prev,
            [field]: Math.max(0, prev[field] + increment)
        }));
    };

    const getTotalGuests = () => {
        return formData.maleCount + formData.femaleCount + formData.childrenCount;
    };

    const getSelectedPackageDetails = () => {
        return tripPackages.find(pkg => pkg.id === formData.tripPackage);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (getTotalGuests() === 0) {
            alert('Please add at least one guest');
            return;
        }

        setStatus("sending");

        try {
            await addDoc(collection(db, "bookings"), {
                ...formData,
                totalGuests: getTotalGuests(),
                tripDays: calculateTripDays(),
                status: "Pending",
                createdAt: serverTimestamp()
            });
            setStatus("success");
        } catch (error) {
            console.error("Error submitting booking:", error);
            setStatus("idle");
            alert("Failed to submit booking. Please try again.");
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            phone: '',
            emergencyPhone: '',
            cnic: '',
            address: '',
            tourCategory: '',
            tripPackage: '',
            maleCount: 0,
            femaleCount: 0,
            childrenCount: 0,
            startDate: '',
            endDate: '',
            specialRequests: ''
        });
        setStatus("idle");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-nature-black/80 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-[1.5rem] sm:rounded-[2rem] max-w-lg w-full max-h-[92vh] overflow-hidden shadow-2xl border border-white/20 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Professional Dark Theme */}
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-nature-black p-5 sm:p-6 overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-nature-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute top-3 sm:top-4 right-3 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white rounded-xl flex items-center justify-center text-white hover:text-gray-900 transition-all duration-300 hover:rotate-90 hover:shadow-lg group border border-white/20 hover:border-white"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="relative z-10">
                        {/* Badge */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">Secure Booking</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
                            Book Your <span className="text-primary">Adventure</span>
                        </h3>
                        <p className="text-primary/80 text-xs sm:text-sm font-medium">Fill in the details to reserve your spot</p>

                        {/* Package Preview Badge */}
                        {getSelectedPackageDetails() && (
                            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                <span className="text-xs font-semibold text-white">{getSelectedPackageDetails().name}</span>
                                <span className="w-1 h-1 bg-primary rounded-full" />
                                <span className="text-sm text-primary font-black">PKR {getSelectedPackageDetails().price}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-200px)]">
                    {status === "success" ? (
                        /* Success State */
                        <div className="text-center py-6 sm:py-8">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 sm:mb-6">
                                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
                                <div className="absolute inset-2 bg-green-50 rounded-full animate-pulse" />
                                <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/40">
                                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-bounce-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            <div className="mb-5">
                                <span className="text-3xl mb-2 inline-block animate-bounce">🎉</span>
                                <h4 className="text-xl sm:text-2xl font-black text-nature-green mb-1.5">Booking Confirmed!</h4>
                                <p className="text-gray-500 text-sm">Our team will contact you within 24 hours</p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 mb-5 text-left border border-gray-100 shadow-sm">
                                <h5 className="font-bold text-nature-green text-sm mb-3 flex items-center gap-2">
                                    <span className="w-5 h-5 bg-nature-green/10 rounded-lg flex items-center justify-center">📋</span>
                                    What happens next?
                                </h5>
                                <ul className="space-y-2.5">
                                    {[
                                        { icon: "📞", text: "You'll receive a confirmation call" },
                                        { icon: "🗺️", text: "Our team will finalize your itinerary" },
                                        { icon: "🎒", text: "Get ready for your adventure!" }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                                            <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">{item.icon}</span>
                                            <span className="font-medium">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={resetForm}
                                className="w-full bg-gradient-to-r from-nature-green to-nature-green-light text-white py-3.5 sm:py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-nature-green/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <span>Done</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        /* Booking Form */
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Personal Info Card */}
                            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-8 h-8 bg-nature-green/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-4 h-4 text-nature-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="text-sm font-bold text-gray-800">Personal Information</span>
                                        <p className="text-[10px] text-gray-500">Your contact details</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Full Name with Icon */}
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            required
                                            name="fullName"
                                            type="text"
                                            placeholder="Full Name *"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3.5 bg-white rounded-xl border-2 border-gray-200 focus:border-nature-green focus:ring-2 focus:ring-nature-green/20 text-gray-800 text-sm font-semibold outline-none transition-all duration-300 placeholder:text-gray-400 placeholder:font-medium hover:border-gray-300"
                                        />
                                    </div>

                                    {/* Phone Numbers Row */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {/* Primary Phone */}
                                        <div className="relative">
                                            <label className="text-[10px] font-bold text-nature-green uppercase tracking-wide block mb-1 px-1">Phone *</label>
                                            <div className="absolute left-3.5 top-[calc(50%+8px)] -translate-y-1/2 text-nature-green">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <input
                                                required
                                                name="phone"
                                                type="tel"
                                                placeholder="03XX-XXXXXXX"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-3 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-nature-green focus:ring-2 focus:ring-nature-green/20 text-gray-800 text-sm font-semibold outline-none transition-all duration-300 placeholder:text-gray-400 placeholder:font-medium hover:border-gray-300"
                                            />
                                        </div>
                                        {/* Emergency Phone */}
                                        <div className="relative">
                                            <label className="text-[10px] font-bold text-rose-500 uppercase tracking-wide block mb-1 px-1">Emergency</label>
                                            <div className="absolute left-3.5 top-[calc(50%+8px)] -translate-y-1/2 text-rose-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                name="emergencyPhone"
                                                type="tel"
                                                placeholder="03XX-XXXXXXX"
                                                value={formData.emergencyPhone}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-3 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 text-gray-800 text-sm font-semibold outline-none transition-all duration-300 placeholder:text-gray-400 placeholder:font-medium hover:border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    {/* CNIC and Address Row */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {/* CNIC */}
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                </svg>
                                            </div>
                                            <input
                                                name="cnic"
                                                type="text"
                                                placeholder="CNIC (Optional)"
                                                value={formData.cnic}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-3 py-3.5 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-nature-green focus:ring-2 focus:ring-nature-green/20 focus:bg-white text-gray-800 text-sm font-semibold outline-none transition-all duration-300 placeholder:text-gray-400 placeholder:font-medium hover:border-gray-300"
                                            />
                                        </div>
                                        {/* Address */}
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                name="address"
                                                type="text"
                                                placeholder="City / Address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-3 py-3.5 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-nature-green focus:ring-2 focus:ring-nature-green/20 focus:bg-white text-gray-800 text-sm font-semibold outline-none transition-all duration-300 placeholder:text-gray-400 placeholder:font-medium hover:border-gray-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tour Selection Card */}
                            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                    </span>
                                    <div>
                                        <span className="text-sm font-bold text-gray-800">Tour Selection</span>
                                        <p className="text-[10px] text-gray-500">Choose your adventure</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Category Select with Icon */}
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <select
                                            required
                                            name="tourCategory"
                                            value={formData.tourCategory}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-10 py-3.5 bg-white rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-800 text-sm font-semibold outline-none transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300"
                                        >
                                            <option value="">Select Tour Category *</option>
                                            {tourCategories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Package Select with Icon */}
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <select
                                            required
                                            name="tripPackage"
                                            value={formData.tripPackage}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-10 py-3.5 bg-white rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-800 text-sm font-semibold outline-none transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300"
                                        >
                                            <option value="">Select Trip Package *</option>
                                            {tripPackages.map(pkg => (
                                                <option key={pkg.id} value={pkg.id}>{pkg.name} • {pkg.duration} • PKR {pkg.price}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Guest Count Card */}
                            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </span>
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-gray-800">Travel Party</span>
                                        <p className="text-[10px] text-gray-500">Number of travelers</p>
                                    </div>
                                    <span className="text-xs font-black text-white bg-gradient-to-r from-nature-green to-nature-green-light px-3 py-1.5 rounded-full shadow-sm animate-pulse">
                                        {getTotalGuests()} Guest{getTotalGuests() !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {/* Males */}
                                    <div className="bg-white rounded-xl p-3 text-center border border-blue-100 hover:border-blue-200 transition-colors group">
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            <span className="text-lg">👨</span>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Males</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleNumberChange('maleCount', -1)}
                                                className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all font-bold text-sm active:scale-90"
                                            >
                                                −
                                            </button>
                                            <span className="w-8 text-center font-black text-nature-black text-lg">{formData.maleCount}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleNumberChange('maleCount', 1)}
                                                className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all font-bold text-sm active:scale-90"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Females */}
                                    <div className="bg-white rounded-xl p-3 text-center border border-rose-100 hover:border-rose-200 transition-colors group">
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            <span className="text-lg">👩</span>
                                            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Females</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleNumberChange('femaleCount', -1)}
                                                className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-bold text-sm active:scale-90"
                                            >
                                                −
                                            </button>
                                            <span className="w-8 text-center font-black text-nature-black text-lg">{formData.femaleCount}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleNumberChange('femaleCount', 1)}
                                                className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-bold text-sm active:scale-90"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Children */}
                                    <div className="bg-white rounded-xl p-3 text-center border border-amber-100 hover:border-amber-200 transition-colors group">
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            <span className="text-lg">👶</span>
                                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Kids</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleNumberChange('childrenCount', -1)}
                                                className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-white transition-all font-bold text-sm active:scale-90"
                                            >
                                                −
                                            </button>
                                            <span className="w-8 text-center font-black text-nature-black text-lg">{formData.childrenCount}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleNumberChange('childrenCount', 1)}
                                                className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-white transition-all font-bold text-sm active:scale-90"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Travel Details Card */}
                            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-8 h-8 bg-rose-500/10 rounded-xl flex items-center justify-center">
                                        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-gray-800">Travel Dates</span>
                                        <p className="text-[10px] text-gray-500">Select your trip duration</p>
                                    </div>
                                    {calculateTripDays() > 0 && (
                                        <div className="bg-nature-green text-white px-3 py-1 rounded-full text-xs font-bold">
                                            {calculateTripDays()} {calculateTripDays() === 1 ? 'Day' : 'Days'}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {/* Date Pickers Row */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Start Date */}
                                        <div className="relative">
                                            <label className="text-[10px] font-bold text-nature-green uppercase tracking-wide block mb-1 px-1">Start Date *</label>
                                            <div className="absolute left-3.5 top-[calc(50%+8px)] -translate-y-1/2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input
                                                required
                                                name="startDate"
                                                type="date"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full pl-10 pr-3 py-3 bg-white rounded-xl border-2 border-gray-100 focus:border-nature-green focus:bg-white text-nature-black text-sm font-medium outline-none transition-all duration-300 cursor-pointer hover:border-gray-200"
                                            />
                                        </div>

                                        {/* End Date */}
                                        <div className="relative">
                                            <label className="text-[10px] font-bold text-rose-500 uppercase tracking-wide block mb-1 px-1">End Date *</label>
                                            <div className="absolute left-3.5 top-[calc(50%+8px)] -translate-y-1/2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input
                                                required
                                                name="endDate"
                                                type="date"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                min={formData.startDate || new Date().toISOString().split('T')[0]}
                                                className="w-full pl-10 pr-3 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 text-gray-800 text-sm font-semibold outline-none transition-all duration-300 cursor-pointer hover:border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Special Requests */}
                                    <div className="relative">
                                        <textarea
                                            name="specialRequests"
                                            rows="2"
                                            placeholder="Any special requests or dietary requirements? (Optional)"
                                            value={formData.specialRequests}
                                            onChange={handleChange}
                                            className="w-full p-3.5 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-nature-green focus:ring-2 focus:ring-nature-green/20 focus:bg-white text-gray-800 text-sm font-semibold outline-none transition-all duration-300 resize-none placeholder:text-gray-400 placeholder:font-medium hover:border-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="w-full bg-gradient-to-r from-nature-green via-nature-green to-nature-green-light text-white py-4 rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-nature-green/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2.5 group relative overflow-hidden"
                            >
                                {/* Button Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                {status === "sending" ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Processing Booking...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Confirm Booking</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {/* Security Badge */}
                            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">Secure Booking</span>
                                </div>
                                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span className="font-medium">Instant Confirmation</span>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
