import React, { useRef } from 'react';

/**
 * AdminModal Component
 * Shared modal for Adding/Editing Trips, Categories, and Gallery Items.
 */
export default function AdminModal({
    showModal,
    setShowModal,
    modalType,
    editItem,
    formData,
    setFormData,
    previewUrl,
    setPreviewUrl,
    handleFileChange,
    handleDrag,
    handleDrop,
    uploading,
    uploadProgress,
    saving,
    handleSave
}) {
    const fileInputRef = useRef(null);

    if (!showModal) return null;

    return (
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
                            className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${previewUrl
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
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all bg-gray-100`}>
                                        <svg className={`w-8 h-8 transition-colors text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 mb-1">
                                        {modalType === 'gallery' ? 'Drag & drop photo or video' : 'Drag & drop your image here'}
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
    );
}
