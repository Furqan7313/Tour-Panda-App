import React from 'react';

/**
 * AdminGallery Component
 * Grid view of gallery images and media uploads.
 */
export default function AdminGallery({
    galleryImages,
    openAddModal,
    openEditModal,
    deleteItem,
    setModalType,
    setEditItem,
    setFormData,
    setPreviewUrl,
    setUploadProgress,
    setShowModal
}) {
    return (
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
    );
}
