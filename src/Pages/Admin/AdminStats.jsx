import React from 'react';

/**
 * AdminStats Component
 * Displays the key metrics at the top of the dashboard.
 */
export default function AdminStats({ stats }) {
    const statItems = [
        { label: 'Total Bookings', value: stats.total, icon: '📋', color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50', trend: '+12%' },
        { label: 'Confirmed', value: stats.confirmed, icon: '✅', color: 'from-emerald-500 to-green-600', bgLight: 'bg-emerald-50', trend: '+8%' },
        { label: 'Pending Review', value: stats.pending, icon: '⏳', color: 'from-amber-500 to-orange-500', bgLight: 'bg-amber-50', trend: stats.pending > 0 ? 'Action needed' : 'All clear' },
        { label: 'Trip Packages', value: stats.trips, icon: '🏔️', color: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-50', trend: 'Active' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
            {statItems.map((stat, i) => (
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
    );
}
