import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, addProduct, deleteProduct, updateProduct } from "../services/productService";
import { 
    Plus, Trash2, Pencil, X, ImagePlus, CheckCircle, 
    Loader2, LayoutDashboard, Package, Settings, LogOut, Store 
} from "lucide-react";

const CATEGORIES = ["Toys", "Phone Cases", "Accessories", "Stationery", "Other"];
const emptyForm = { productName: "", description: "", price: "", deliveryDetails: "", category: "Toys" };

export default function Admin() {
    const [activeTab, setActiveTab] = useState("products");
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [imageFiles, setImageFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editExistingImages, setEditExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [toast, setToast] = useState("");

    // Theme Fonts
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    async function loadProducts() {
        setFetchLoading(true);
        setProducts(await getProducts());
        setFetchLoading(false);
    }
    useEffect(() => { loadProducts(); }, []);

    function showToast(msg) {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    }

    function handleImageChange(e) {
        const files = Array.from(e.target.files).slice(0, 5 - editExistingImages.length);
        setImageFiles(files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));
    }

    function startEdit(product) {
        setEditingId(product.productId);
        setForm({
            productName: product.productName, description: product.description,
            price: product.price, deliveryDetails: product.deliveryDetails, category: product.category
        });
        setEditExistingImages(product.images || []);
        setImageFiles([]); setPreviews([]);
        setActiveTab("products"); // Ensure tab shifts to products on edit
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditingId(null); setForm(emptyForm);
        setImageFiles([]); setPreviews([]); setEditExistingImages([]);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.productName || !form.price) return;
        setLoading(true);
        try {
            if (editingId) {
                await updateProduct(editingId, { ...form, images: editExistingImages }, imageFiles);
                showToast("Product updated successfully");
            } else {
                await addProduct(form, imageFiles);
                showToast("Product added successfully");
            }
            cancelEdit();
            await loadProducts();
        } catch (err) {
            console.error(err); showToast("Something went wrong.");
        } finally { setLoading(false); }
    }

    async function handleDelete(product) {
        if (!window.confirm(`Are you sure you want to delete "${product.productName}"?`)) return;
        await deleteProduct(product.productId, product.images);
        showToast("Product deleted.");
        loadProducts();
    }

    const totalCategories = new Set(products.map(p => p.category)).size;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-20 md:pb-0" style={bodyStyle}>
            
            {/* Custom Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
                .delay-100 { animation-delay: 100ms; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Toast Notification */}
            <div className={`fixed top-6 right-4 z-[100] flex items-center gap-2 bg-[#111111] text-white px-5 py-3 rounded-sm shadow-lg text-sm font-medium transform transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
                <CheckCircle size={16} className="text-green-400" /> {toast}
            </div>

            {/* ─── DESKTOP SIDEBAR (Light Theme) ─── */}
            <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col sticky top-0 h-screen shrink-0">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#111111]" style={headingStyle}>Admin Panel</h2>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <button 
                        onClick={() => setActiveTab("dashboard")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-sm transition-colors text-left ${activeTab === "dashboard" ? "bg-blue-50 text-[#2563EB] font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-[#111111]"}`}
                    >
                        <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveTab("products")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-sm transition-colors text-left ${activeTab === "products" ? "bg-blue-50 text-[#2563EB] font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-[#111111]"}`}
                    >
                        <Package size={18} /> Products
                    </button>
                    <button 
                        onClick={() => setActiveTab("settings")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-sm transition-colors text-left ${activeTab === "settings" ? "bg-blue-50 text-[#2563EB] font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-[#111111]"}`}
                    >
                        <Settings size={18} /> Settings
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-100 space-y-1">
                    <Link to="/" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#111111] rounded-sm transition-colors text-left font-medium">
                        <Store size={18} /> View Shop
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-sm transition-colors text-left font-medium">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* ─── MOBILE BOTTOM BAR (Light Theme) ─── */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around items-center p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={() => setActiveTab("dashboard")}
                    className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${activeTab === "dashboard" ? "text-[#2563EB]" : "text-gray-500 hover:text-[#111111]"}`}
                >
                    <LayoutDashboard size={22} className="mb-1" />
                    <span className="text-[10px] font-medium">Dashboard</span>
                </button>
                <button 
                    onClick={() => setActiveTab("products")}
                    className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${activeTab === "products" ? "text-[#2563EB]" : "text-gray-500 hover:text-[#111111]"}`}
                >
                    <Package size={22} className="mb-1" />
                    <span className="text-[10px] font-medium">Products</span>
                </button>
                <button 
                    onClick={() => setActiveTab("settings")}
                    className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${activeTab === "settings" ? "text-[#2563EB]" : "text-gray-500 hover:text-[#111111]"}`}
                >
                    <Settings size={22} className="mb-1" />
                    <span className="text-[10px] font-medium">Settings</span>
                </button>
                <Link 
                    to="/"
                    className="flex flex-col items-center justify-center w-full py-2 text-gray-500 hover:text-[#111111] transition-colors"
                >
                    <Store size={22} className="mb-1" />
                    <span className="text-[10px] font-medium">Shop</span>
                </Link>
            </nav>

            {/* ─── MAIN CONTENT AREA ─── */}
            <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* ── VIEW: DASHBOARD ── */}
                {activeTab === "dashboard" && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-6" style={headingStyle}>
                            Store Overview
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-center">
                                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">Total Products</h3>
                                <p className="text-4xl font-bold text-[#111111]">{products.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-center">
                                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">Active Categories</h3>
                                <p className="text-4xl font-bold text-[#111111]">{totalCategories}</p>
                            </div>
                            <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-center sm:col-span-2 lg:col-span-1">
                                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">Store Status</h3>
                                <p className="text-xl font-bold text-green-500 flex items-center gap-2 mt-1">
                                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span> Online
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── VIEW: SETTINGS ── */}
                {activeTab === "settings" && (
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-6" style={headingStyle}>
                            Store Settings
                        </h1>
                        <div className="bg-white p-10 rounded-sm border border-gray-200 shadow-sm text-center">
                            <Settings size={40} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-[#111111]">Settings panel coming soon</h3>
                            <p className="text-sm text-gray-500 mt-2">Manage your shop configurations here in the future.</p>
                        </div>
                    </div>
                )}

                {/* ── VIEW: PRODUCTS ── */}
                {activeTab === "products" && (
                    <div className="animate-fade-in-up">
                        <header className="mb-6 flex items-center justify-between">
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111]" style={headingStyle}>
                                Manage Products
                            </h1>
                        </header>

                        {/* Form Section */}
                        <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-5 sm:p-6 mb-10">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                <h2 className="font-semibold text-[#111111] text-lg" style={headingStyle}>
                                    {editingId ? "Edit Product" : "Add New Product"}
                                </h2>
                                {editingId && (
                                    <button onClick={cancelEdit} className="text-gray-400 hover:text-[#FF6B6B] transition-colors p-1.5 bg-gray-50 hover:bg-red-50 rounded-sm">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Product Name *</label>
                                    <input type="text" placeholder="e.g. Minimalist Keyboard" required
                                        value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })}
                                        className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                                    <textarea rows={3} placeholder="Brief product description..."
                                        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none transition-colors" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Price (₹) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                        <input type="number" min="0" step="0.01" placeholder="0.00" required
                                            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                                            className="w-full border border-gray-300 rounded-sm pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category *</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white cursor-pointer transition-colors">
                                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Delivery Details</label>
                                    <input type="text" placeholder="e.g. Ships within 3-5 business days"
                                        value={form.deliveryDetails} onChange={(e) => setForm({ ...form, deliveryDetails: e.target.value })}
                                        className="w-full border border-gray-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Images (Max 5)</label>
                                    
                                    <div className="flex flex-wrap gap-3">
                                        {/* Display Existing Edits */}
                                        {editExistingImages.map((url) => (
                                            <div key={url} className="relative w-20 h-20 group">
                                                <img src={url} className="w-full h-full object-cover rounded-sm border border-gray-200" alt="" />
                                                <button type="button" onClick={() => setEditExistingImages((p) => p.filter((u) => u !== url))}
                                                    className="absolute -top-2 -right-2 bg-[#FF6B6B] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        
                                        {/* Display New Previews */}
                                        {previews.map((src, i) => (
                                            <div key={i} className="relative w-20 h-20">
                                                <img src={src} className="w-full h-full object-cover rounded-sm border-2 border-[#2563EB]/50" alt="" />
                                                <span className="absolute bottom-1 left-1 bg-[#2563EB] text-white text-[9px] px-1 font-bold rounded-sm">NEW</span>
                                            </div>
                                        ))}

                                        {/* Upload Button */}
                                        {(editExistingImages.length + previews.length) < 5 && (
                                            <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 hover:border-[#2563EB] hover:bg-blue-50 rounded-sm cursor-pointer text-gray-400 hover:text-[#2563EB] transition-colors">
                                                <ImagePlus size={20} />
                                                <span className="text-[10px] mt-1 font-medium">Add</span>
                                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="sm:col-span-2 pt-2">
                                    <button type="submit" disabled={loading}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-8 py-3 rounded-sm transition-colors text-sm" style={headingStyle}>
                                        {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
                                            : editingId ? <><Pencil size={16} /> Update Product</>
                                                : <><Plus size={16} /> Add Product</>}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Table Section */}
                        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden delay-100 animate-fade-in-up">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h2 className="font-semibold text-[#111111]" style={headingStyle}>Inventory ({products.length})</h2>
                            </div>
                            
                            {fetchLoading ? (
                                <div className="py-16 flex justify-center items-center text-gray-400">
                                    <Loader2 size={24} className="animate-spin mr-2" /> Loading inventory...
                                </div>
                            ) : products.length === 0 ? (
                                <div className="py-16 text-center text-gray-500">No products found. Add your first product above.</div>
                            ) : (
                                <div className="overflow-x-auto hide-scrollbar">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                            <tr>
                                                <th className="px-5 py-4 font-semibold">Product</th>
                                                <th className="px-5 py-4 font-semibold">Category</th>
                                                <th className="px-5 py-4 font-semibold">Price (₹)</th>
                                                <th className="px-5 py-4 font-semibold text-center">Images</th>
                                                <th className="px-5 py-4 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {products.map((p) => (
                                                <tr key={p.productId} className="hover:bg-gray-50/80 transition-colors">
                                                    <td className="px-5 py-4 font-medium text-[#111111]">
                                                        <div className="flex items-center gap-3">
                                                            <img 
                                                                src={p.images?.[0] || "https://placehold.co/40x40?text=No+Img"} 
                                                                alt="" 
                                                                className="w-10 h-10 rounded-sm object-cover border border-gray-200" 
                                                            />
                                                            <span className="truncate max-w-[140px] sm:max-w-[250px]">{p.productName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-sm border border-gray-200">{p.category}</span>
                                                    </td>
                                                    <td className="px-5 py-4 font-semibold text-[#111111]">
                                                        ₹{Number(p.price).toFixed(2)}
                                                    </td>
                                                    <td className="px-5 py-4 text-center text-gray-500">
                                                        {p.images?.length || 0}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => startEdit(p)} title="Edit"
                                                                className="p-2 text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-sm transition-colors border border-transparent hover:border-blue-100">
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button onClick={() => handleDelete(p)} title="Delete"
                                                                className="p-2 text-gray-400 hover:text-[#FF6B6B] hover:bg-red-50 rounded-sm transition-colors border border-transparent hover:border-red-100">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}