import React from 'react';

/**
 * AdminCategories Component
 * Grid view of tour categories.
 */
export default function AdminCategories({ categories, openAddModal, openEditModal, deleteItem }) {
    return (
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
    );
}
