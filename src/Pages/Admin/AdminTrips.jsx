import React from 'react';

/**
 * AdminTrips Component
 * Grid view of all tour packages with edit/delete actions.
 */
export default function AdminTrips({ trips, openAddModal, openEditModal, deleteItem }) {
    return (
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
    );
}
