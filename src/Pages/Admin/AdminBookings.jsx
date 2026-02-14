import React from 'react';
import * as XLSX from 'xlsx';

/**
 * AdminBookings Component
 * Handles the display, filtering, and status updates for bookings.
 */
export default function AdminBookings({
    bookings,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    updateStatus,
    deleteItem
}) {

    // State for viewing details
    const [selectedBooking, setSelectedBooking] = React.useState(null);

    // Filters logic
    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.phone?.includes(searchTerm) || b.tourType?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || b.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
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
                                <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Tour Info</th>
                                <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Travel Date</th>
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
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-nature-black">{b.tourType}</span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                {b.people} Guests
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                            {formatDate(b.travelDate || b.date)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <select
                                            value={b.status}
                                            onChange={(e) => updateStatus(b.id, e.target.value)}
                                            className={`px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer appearance-none transition-all duration-200 shadow-sm ${b.status === 'Confirmed'
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
                                                onClick={() => setSelectedBooking(b)}
                                                className="group/btn p-2.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                                                title="View Details"
                                            >
                                                <svg className="w-4.5 h-4.5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => deleteItem('bookings', b.id)}
                                                className="group/btn p-2.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
                                                title="Delete"
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

            {/* View Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-nature-green to-emerald-600 p-6 flex items-center justify-between text-white shrink-0">
                            <div>
                                <h3 className="text-xl font-bold">Booking Details</h3>
                                <p className="text-white/80 text-sm mt-1">ID: #{selectedBooking.id.slice(-6)}</p>
                            </div>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Customer Info */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4 border-b pb-2">Customer Information</h4>
                                    <div className="space-y-4">
                                        <div className="group">
                                            <p className="text-sm text-gray-500">Full Name</p>
                                            <p className="font-bold text-gray-900 group-hover:text-nature-green transition-colors">{selectedBooking.fullName || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email Address</p>
                                            <p className="font-medium text-gray-800">{selectedBooking.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="font-medium text-gray-800">{selectedBooking.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="font-medium text-gray-800">{selectedBooking.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Trip Info */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4 border-b pb-2">Trip Details</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Tour Package</p>
                                            <div className="inline-flex items-center gap-2 mt-1">
                                                <span className="w-2 h-2 rounded-full bg-nature-green"></span>
                                                <p className="font-bold text-gray-900 text-lg">{selectedBooking.tourType || 'Custom Trip'}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">Travel Date</p>
                                                <p className="font-bold text-nature-black/80">{formatDate(selectedBooking.travelDate || selectedBooking.date)}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">Guests</p>
                                                <p className="font-bold text-nature-black/80">{selectedBooking.people || 1} People</p>
                                            </div>
                                        </div>
                                        {selectedBooking.price && (
                                            <div>
                                                <p className="text-sm text-gray-500">Total Price</p>
                                                <p className="font-black text-nature-green text-2xl">PKR {selectedBooking.price}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            {selectedBooking.message && (
                                <div className="mt-8">
                                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4 border-b pb-2">Special Requests / Notes</h4>
                                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-amber-800 text-sm leading-relaxed">
                                        "{selectedBooking.message}"
                                    </div>
                                </div>
                            )}

                            {/* Meta Info */}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                                <span>Booked on: {formatDate(selectedBooking.createdAt)}</span>
                                <span className={`px-2 py-1 rounded-md font-bold ${selectedBooking.status === 'Confirmed'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>{selectedBooking.status}</span>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => deleteItem('bookings', selectedBooking.id)}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Delete Booking
                            </button>
                            {selectedBooking.status !== 'Confirmed' ? (
                                <button
                                    onClick={() => {
                                        updateStatus(selectedBooking.id, 'Confirmed');
                                        setSelectedBooking({ ...selectedBooking, status: 'Confirmed' });
                                    }}
                                    className="px-6 py-2.5 bg-nature-green text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-nature-green/20 transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Confirm Booking
                                </button>
                            ) : (
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="px-6 py-2.5 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition-all"
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
