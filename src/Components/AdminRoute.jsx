import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * AdminRoute Component
 * 
 * Wraps routes that require ADMIN privileges.
 * 
 * NOTE: For production, use Custom Claims or a Firestore 'users' collection with roles.
 * Currently using an allowed email list for simplicity.
 */
const ADMIN_EMAILS = [
    'muhammad.furqan.akhtar04r@gmail.com',
    // Add other admin emails here
];

export default function AdminRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-nature-green border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium text-sm">Verifying Access...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // Check if user email is in the allowed list
    // Check if user email is in the allowed list (case-insensitive)
    // Note: This is client-side only. Firestore security rules must also enforce this for true security.
    if (!user.email || !ADMIN_EMAILS.some(email => email.toLowerCase() === user.email.toLowerCase())) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-500 mb-6">
                        You do not have permission to access the Admin Portal.
                        <br />
                        <span className="text-xs mt-2 block">Logged in as: {user.email}</span>
                    </p>
                    <div className="flex flex-col gap-3">
                        <a
                            href="/"
                            className="w-full py-3 px-4 bg-nature-green text-white rounded-xl font-bold hover:bg-nature-green-light transition-all"
                        >
                            Back to Home
                        </a>
                        <button
                            onClick={() => auth.signOut()}
                            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}
