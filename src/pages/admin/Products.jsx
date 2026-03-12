import { useState, useEffect } from "react";
import {
    getProducts, addProduct, deleteProduct, updateProduct,
} from "../../services/productService";
import {
    Plus, Trash2, Pencil, X, ImagePlus,
    CheckCircle, XCircle, Loader2, Search,
    MousePointerClick, Package, FilePenLine, PlusCircle,
    AlertTriangle, Tag, Layers, Truck, Sparkles,
    ListChecks, ChevronDown, Phone, MessageCircle, Star,
} from "lucide-react";

const DEFAULT_CATEGORIES = ["Toys", "Phone Cases", "Accessories", "Stationery", "Other"];

// ── Set your default contact numbers here ─────────────────────────────────────
const DEFAULT_WHATSAPP = "9196330 60181"; 
const DEFAULT_CALL     = "9196330 60181"; 

const EMPTY_FORM = {
    productName: "",
    material: "",
    price: "",
    deliveryDetails: "",
    category: "Toys",
    specs: [],
    whatsappNumber: DEFAULT_WHATSAPP,
    callNumber: DEFAULT_CALL,
};

// ─── Theme Fonts ──────────────────────────────────────────────────────────────
const headingStyle = { fontFamily: "'Poppins', sans-serif" };
const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
    if (!toast.msg) return null;
    return (
        <div className={`fixed top-5 right-5 z-[70] flex items-center gap-2.5 px-6 py-3.5 rounded-full shadow-2xl text-sm text-white font-bold tracking-wide
            ${toast.type === "error" ? "bg-[#C8102E]" : "bg-[#18181B]"}`} style={headingStyle}>
            {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} className="text-[#C8102E]" />}
            {toast.msg}
        </div>
    );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ open, productName, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 transition-all" style={bodyStyle}>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={28} className="text-[#C8102E]" />
                </div>
                <h3 className="font-extrabold text-[#18181B] text-2xl mb-2" style={headingStyle}>Delete Product?</h3>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    <span className="font-bold text-[#18181B]">"{productName}"</span> will be permanently removed from your store.
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3.5 border border-gray-200 rounded-full text-sm text-[#18181B] hover:border-[#18181B] font-bold transition-all">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3.5 bg-[#C8102E] hover:bg-[#a50d26] text-white rounded-full text-sm font-bold shadow-lg shadow-[#C8102E]/20 transition-all">Delete</button>
                </div>
            </div>
        </div>
    );
}

// ─── Success Dialog ───────────────────────────────────────────────────────────
function SuccessDialog({ open, message, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 transition-all" style={bodyStyle}>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="font-extrabold text-[#18181B] text-2xl mb-2" style={headingStyle}>Done!</h3>
                <p className="text-gray-500 text-sm mb-8">{message}</p>
                <button onClick={onClose} className="w-full py-4 bg-[#18181B] hover:bg-[#C8102E] text-white rounded-full text-sm font-bold transition-colors shadow-lg">
                    Continue
                </button>
            </div>
        </div>
    );
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 bg-[#F4F4F5] rounded-full flex items-center justify-center">
                <Icon size={14} className="text-[#C8102E]" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#18181B]" style={headingStyle}>{label}</span>
        </div>
    );
}

// ─── Category Selector with custom add ───────────────────────────────────────
function CategorySelector({ value, onChange, categories, onAddCategory }) {
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customValue, setCustomValue] = useState("");

    function handleAdd() {
        const trimmed = customValue.trim();
        if (!trimmed) return;
        onAddCategory(trimmed);
        onChange(trimmed);
        setCustomValue("");
        setShowCustomInput(false);
    }

    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Category *</label>
            {!showCustomInput ? (
                <div className="flex gap-2">
                    <select
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="flex-1 border-none rounded-full px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#18181B] bg-[#F4F4F5] transition-all text-[#18181B] cursor-pointer"
                    >
                        {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <button
                        type="button"
                        onClick={() => setShowCustomInput(true)}
                        className="flex items-center gap-1.5 px-5 py-3.5 bg-[#18181B] hover:bg-[#C8102E] text-white text-xs font-bold rounded-full transition-colors whitespace-nowrap shadow-md"
                        title="Add custom category"
                    >
                        <Plus size={14} strokeWidth={3} /> New
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        autoFocus
                        placeholder="Enter category name..."
                        value={customValue}
                        onChange={e => setCustomValue(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } if (e.key === "Escape") setShowCustomInput(false); }}
                        className="flex-1 border-none rounded-full px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#C8102E] bg-[#F4F4F5] transition-all text-[#18181B]"
                    />
                    <button type="button" onClick={handleAdd}
                        className="px-5 py-3.5 bg-[#C8102E] hover:bg-[#a50d26] text-white text-xs font-bold rounded-full transition-colors shadow-md">
                        Add
                    </button>
                    <button type="button" onClick={() => { setShowCustomInput(false); setCustomValue(""); }}
                        className="px-4 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs font-bold rounded-full transition-colors">
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Products() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");

    const [categories, setCategories] = useState(() => {
        try {
            const saved = localStorage.getItem("shop_categories");
            return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
        } catch { return DEFAULT_CATEGORIES; }
    });

    const [form, setForm] = useState(EMPTY_FORM);
    const [bulletPoints, setBulletPoints] = useState([""]);
    const [imageFiles, setImageFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editExistingImages, setEditExistingImages] = useState([]);

    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [editExistingCover, setEditExistingCover] = useState(null);

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState({ msg: "", type: "success" });
    const [successDialog, setSuccessDialog] = useState({ open: false, message: "" });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, product: null });

    async function loadProducts() {
        setFetchLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
            setFiltered(data);
        } catch {
            showToastMsg("Failed to load products.", "error");
        } finally {
            setFetchLoading(false);
        }
    }

    useEffect(() => { loadProducts(); }, []);

    useEffect(() => {
        const q = search.trim().toLowerCase();
        setFiltered(q ? products.filter(p =>
            p.productName?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        ) : products);
    }, [search, products]);

    function showToastMsg(msg, type = "success") {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
    }

    function handleAddCategory(newCat) {
        if (categories.includes(newCat)) return;
        const updated = [...categories, newCat];
        setCategories(updated);
        try { localStorage.setItem("shop_categories", JSON.stringify(updated)); } catch {}
        showToastMsg(`Category "${newCat}" added!`);
    }

    function updateBullet(i, v) { const b = [...bulletPoints]; b[i] = v; setBulletPoints(b); }
    function addBullet() { setBulletPoints([...bulletPoints, ""]); }
    function removeBullet(i) { if (bulletPoints.length > 1) setBulletPoints(bulletPoints.filter((_, j) => j !== i)); }

    function addSpec() { setForm({ ...form, specs: [...(form.specs || []), { key: "", value: "" }] }); }
    function updateSpec(i, field, val) {
        const s = [...(form.specs || [])]; s[i] = { ...s[i], [field]: val };
        setForm({ ...form, specs: s });
    }
    function removeSpec(i) { setForm({ ...form, specs: (form.specs || []).filter((_, j) => j !== i) }); }

    function handleImageChange(e) {
        const maxNew = 5 - editExistingImages.length;
        const files = Array.from(e.target.files).slice(0, maxNew);
        setImageFiles(files);
        setPreviews(files.map(f => URL.createObjectURL(f)));
    }

    function handleCoverImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setCoverImageFile(file);
        setCoverPreview(URL.createObjectURL(file));
        setEditExistingCover(null);
    }

    function removeCover() {
        setCoverImageFile(null);
        setCoverPreview(null);
        setEditExistingCover(null);
    }

    function openAdd() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setBulletPoints([""]);
        setEditExistingImages([]);
        setImageFiles([]);
        setPreviews([]);
        setCoverImageFile(null);
        setCoverPreview(null);
        setEditExistingCover(null);
        setShowModal(true);
    }

    function startEdit(product) {
        setEditingId(product.productId);
        setForm({
            productName: product.productName || "",
            material: product.material || "",
            price: product.price || "",
            deliveryDetails: product.deliveryDetails || "",
            category: product.category || categories[0],
            specs: product.specs || [],
            whatsappNumber: product.whatsappNumber || DEFAULT_WHATSAPP,
            callNumber: product.callNumber || DEFAULT_CALL,
        });
        const desc = product.description;
        setBulletPoints(
            Array.isArray(desc) && desc.length > 0 ? desc :
            typeof desc === "string" && desc ? desc.split("\n").filter(Boolean) :
            [""]
        );
        if (product.category && !categories.includes(product.category)) {
            handleAddCategory(product.category);
        }
        setEditExistingImages(product.images || []);
        setImageFiles([]);
        setPreviews([]);
        setEditExistingCover(product.coverImage || null);
        setCoverImageFile(null);
        setCoverPreview(null);
        setShowModal(true);
    }

    function closeModal() {
        if (loading) return;
        setShowModal(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        setBulletPoints([""]);
        setImageFiles([]);
        setPreviews([]);
        setEditExistingImages([]);
        setCoverImageFile(null);
        setCoverPreview(null);
        setEditExistingCover(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.productName || !form.price) return;
        if (loading) return;

        const cleanBullets = bulletPoints.filter(b => b.trim());
        const cleanSpecs = (form.specs || []).filter(s => s.key.trim() && s.value.trim());
        const finalData = {
            ...form,
            description: cleanBullets,
            specs: cleanSpecs,
            coverImage: editExistingCover || null,
        };

        setLoading(true);
        try {
            if (editingId) {
                await updateProduct(editingId, { ...finalData, images: editExistingImages }, imageFiles, coverImageFile);
                closeModal();
                setSuccessDialog({ open: true, message: "Product updated successfully!" });
            } else {
                await addProduct(finalData, imageFiles, coverImageFile);
                closeModal();
                setSuccessDialog({ open: true, message: "Product added to your shop!" });
            }
            await loadProducts();
        } catch (err) {
            console.error(err);
            showToastMsg("Something went wrong. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }

    async function confirmDelete() {
        const product = confirmDialog.product;
        setConfirmDialog({ open: false, product: null });
        try {
            await deleteProduct(product.productId);
            showToastMsg("Product deleted.");
            await loadProducts();
        } catch {
            showToastMsg("Failed to delete product.", "error");
        }
    }

    const displayCover = coverPreview || editExistingCover;

    return (
        <div className="bg-[#F4F4F5] min-h-screen pb-12 text-[#18181B]" style={bodyStyle}>
            <Toast toast={toast} />
            <SuccessDialog open={successDialog.open} message={successDialog.message} onClose={() => setSuccessDialog({ open: false, message: "" })} />
            <ConfirmDialog open={confirmDialog.open} productName={confirmDialog.product?.productName} onConfirm={confirmDelete} onCancel={() => setConfirmDialog({ open: false, product: null })} />

            {/* Custom Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
            `}</style>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pt-6 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight" style={headingStyle}>Inventory.</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and update your store catalog.</p>
                </div>
                <button onClick={openAdd} className="flex items-center justify-center w-full sm:w-auto gap-2 bg-[#18181B] hover:bg-[#C8102E] text-white font-bold px-8 py-3.5 rounded-full transition-all duration-300 text-sm shadow-lg shadow-[#18181B]/10 hover:-translate-y-0.5">
                    <Plus size={18} strokeWidth={2.5} /> Add Product
                </button>
            </div>

            {/* Search and Table Container */}
            <div className="bg-white rounded-3xl md:rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-fade-in-up delay-100">
                
                {/* Search Bar */}
                <div className="p-4 md:p-6 border-b border-gray-50">
                    <div className="relative w-full md:max-w-md">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search by name or category..." value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-[#F4F4F5] border border-transparent rounded-full text-sm font-medium focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition-all text-[#18181B]" />
                    </div>
                </div>

                <div className="px-4 md:px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <h2 className="font-extrabold text-[#18181B] text-sm tracking-wide uppercase" style={headingStyle}>
                        {fetchLoading ? "Loading..." : `${filtered.length} Product${filtered.length !== 1 ? "s" : ""}`}
                    </h2>
                    {/* Category pills */}
                    <div className="hidden md:flex gap-2 flex-wrap">
                        {categories.slice(0, 5).map(cat => (
                            <button key={cat} onClick={() => setSearch(cat === search ? "" : cat)}
                                className={`text-[10px] font-bold px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider ${search === cat ? "bg-[#18181B] text-white shadow-md" : "bg-[#F4F4F5] text-gray-500 hover:bg-[#C8102E] hover:text-white"}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {fetchLoading ? (
                    <div className="divide-y divide-gray-50">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-5 animate-pulse">
                                <div className="w-14 h-14 rounded-2xl bg-gray-100" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                                    <div className="h-2.5 bg-gray-50 rounded-full w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-24 text-center text-gray-400">
                        <Package size={48} strokeWidth={1} className="mx-auto mb-4 text-gray-300" />
                        <p className="font-extrabold text-xl text-[#18181B] mb-1" style={headingStyle}>No products found.</p>
                        <p className="text-sm">{search ? "Try adjusting your search filters." : "Start building your catalog."}</p>
                    </div>
                ) : (
                    <>
                        {/* ─── DESKTOP TABLE VIEW ─── */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold">Product</th>
                                        <th className="px-4 py-4 text-left font-bold">Category</th>
                                        <th className="px-4 py-4 text-left font-bold">Price</th>
                                        <th className="px-4 py-4 text-left font-bold">
                                            <span className="flex items-center gap-1.5"><MousePointerClick size={14} /> Views</span>
                                        </th>
                                        <th className="px-6 py-4 text-right font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map(p => (
                                        <tr key={p.productId} className="hover:bg-[#F4F4F5]/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative flex-shrink-0">
                                                        <img
                                                            src={p.coverImage || (p.images?.length > 0 ? p.images[0] : "https://placehold.co/56x56?text=No+Img")}
                                                            className="w-14 h-14 rounded-2xl object-cover border border-gray-100 bg-white"
                                                            alt={p.productName}
                                                            onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/56x56?text=No+Img"; }}
                                                        />
                                                        {p.coverImage && (
                                                            <span className="absolute -top-1.5 -right-1.5 bg-amber-400 rounded-full p-1 shadow-sm">
                                                                <Star size={10} className="text-white fill-white" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-extrabold text-[#18181B] truncate max-w-[180px] lg:max-w-xs group-hover:text-[#C8102E] transition-colors" style={headingStyle}>{p.productName}</p>
                                                        <p className="text-xs text-gray-400 truncate max-w-[180px] lg:max-w-xs mt-0.5">
                                                            {p.material ? `${p.material}` :
                                                                Array.isArray(p.description) ? p.description[0] :
                                                                p.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="bg-gray-100 text-[#18181B] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">{p.category}</span>
                                            </td>
                                            <td className="px-4 py-4 font-extrabold text-[#18181B]" style={headingStyle}>₹{Number(p.price).toFixed(2)}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2 text-[#18181B] font-bold">
                                                    <div className="bg-gray-100 p-1.5 rounded-full"><MousePointerClick size={12} className="text-gray-500" /></div>
                                                    <span>{p.clicks || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => startEdit(p)} className="p-2.5 rounded-full bg-[#F4F4F5] hover:bg-[#18181B] text-gray-500 hover:text-white transition-all"><Pencil size={16} strokeWidth={2.5} /></button>
                                                    <button onClick={() => setConfirmDialog({ open: true, product: p })} className="p-2.5 rounded-full bg-[#F4F4F5] hover:bg-[#C8102E] text-gray-500 hover:text-white transition-all"><Trash2 size={16} strokeWidth={2.5} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ─── MOBILE CARD VIEW ─── */}
                        <div className="block md:hidden divide-y divide-gray-50">
                            {filtered.map(p => (
                                <div key={p.productId} className="p-5 hover:bg-[#F4F4F5]/50 transition-colors flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        {/* Mobile Image */}
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={p.coverImage || (p.images?.length > 0 ? p.images[0] : "https://placehold.co/80x80?text=No+Img")}
                                                className="w-20 h-20 rounded-[1.2rem] object-cover border border-gray-100 bg-white shadow-sm"
                                                alt={p.productName}
                                                onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80?text=No+Img"; }}
                                            />
                                            {p.coverImage && (
                                                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 rounded-full p-1 shadow-sm">
                                                    <Star size={10} className="text-white fill-white" />
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Mobile Info */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                            <div>
                                                <p className="font-extrabold text-[#18181B] truncate text-base" style={headingStyle}>{p.productName}</p>
                                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                                    {p.material ? `${p.material}` :
                                                        Array.isArray(p.description) ? p.description[0] :
                                                        p.description}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-extrabold text-[#18181B] text-lg" style={headingStyle}>₹{Number(p.price).toFixed(2)}</span>
                                                <span className="bg-gray-100 text-[#18181B] text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">{p.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Mobile Actions Row */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-[#18181B] font-bold text-xs">
                                            <div className="bg-gray-100 p-1.5 rounded-full"><MousePointerClick size={12} className="text-gray-500" /></div>
                                            <span>{p.clicks || 0} Views</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => startEdit(p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F4F5] text-gray-600 hover:bg-[#18181B] hover:text-white transition-colors text-xs font-bold">
                                                <Pencil size={12} strokeWidth={2.5} /> Edit
                                            </button>
                                            <button onClick={() => setConfirmDialog({ open: true, product: p })} className="p-1.5 rounded-full bg-[#F4F4F5] text-gray-500 hover:bg-[#C8102E] hover:text-white transition-colors">
                                                <Trash2 size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ════ MODAL ════ */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4 transition-all">
                    <div className="bg-white w-full sm:rounded-[2.5rem] sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-t-[2.5rem] animate-fade-in-up">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur-xl z-20">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F4F4F5] rounded-full flex items-center justify-center">
                                    {editingId ? <FilePenLine size={18} className="text-[#C8102E] sm:w-5 sm:h-5" /> : <PlusCircle size={18} className="text-[#C8102E] sm:w-5 sm:h-5" />}
                                </div>
                                <div>
                                    <h2 className="font-extrabold text-[#18181B] text-lg sm:text-xl tracking-tight" style={headingStyle}>
                                        {editingId ? "Edit Product." : "Add Product."}
                                    </h2>
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Complete the details below.</p>
                                </div>
                            </div>
                            <button onClick={closeModal} disabled={loading} className="p-2 sm:p-3 rounded-full bg-gray-50 hover:bg-gray-200 text-gray-500 hover:text-[#18181B] transition-colors disabled:opacity-40">
                                <X size={18} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 sm:space-y-10">

                            {/* Section 1: Basic Info */}
                            <div className="space-y-4 sm:space-y-5">
                                <SectionLabel icon={Tag} label="Basic Information" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] sm:text-xs font-bold text-gray-500 mb-1.5 sm:mb-2 uppercase tracking-wide">Product Name *</label>
                                        <input type="text" required placeholder="e.g. Minimalist Desk Mat"
                                            value={form.productName}
                                            onChange={e => setForm({ ...form, productName: e.target.value })}
                                            className="w-full border-none rounded-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#18181B] bg-[#F4F4F5] transition-all text-[#18181B]" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <CategorySelector
                                            value={form.category}
                                            onChange={val => setForm({ ...form, category: val })}
                                            categories={categories}
                                            onAddCategory={handleAddCategory}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-bold text-gray-500 mb-1.5 sm:mb-2 uppercase tracking-wide">Material</label>
                                        <input type="text" placeholder="e.g. Matte Leather"
                                            value={form.material}
                                            onChange={e => setForm({ ...form, material: e.target.value })}
                                            className="w-full border-none rounded-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#18181B] bg-[#F4F4F5] transition-all text-[#18181B]" />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-bold text-gray-500 mb-1.5 sm:mb-2 uppercase tracking-wide">Price *</label>
                                        <div className="relative">
                                            <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₹</span>
                                            <input type="number" min="0" step="0.01" required placeholder="0.00"
                                                value={form.price}
                                                onChange={e => setForm({ ...form, price: e.target.value })}
                                                className="w-full border-none rounded-full pl-8 sm:pl-10 pr-4 sm:pr-5 py-3 sm:py-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#18181B] bg-[#F4F4F5] transition-all text-[#18181B]" />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] sm:text-xs font-bold text-gray-500 mb-1.5 sm:mb-2 uppercase tracking-wide">Delivery Details</label>
                                        <input type="text" placeholder="e.g. Free shipping on orders over ₹500"
                                            value={form.deliveryDetails}
                                            onChange={e => setForm({ ...form, deliveryDetails: e.target.value })}
                                            className="w-full border-none rounded-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#18181B] bg-[#F4F4F5] transition-all text-[#18181B]" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Contact Numbers */}
                            <div>
                                <SectionLabel icon={Phone} label="Contact Methods" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <label className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-gray-500 mb-1.5 sm:mb-2 uppercase tracking-wide">
                                            <MessageCircle size={14} className="text-green-500" /> WhatsApp
                                        </label>
                                        <div className="relative">
                                            <input type="tel" placeholder="e.g. 60123456789"
                                                value={form.whatsappNumber}
                                                onChange={e => setForm({ ...form, whatsappNumber: e.target.value.replace(/\D/g, "") })}
                                                className="w-full border-none rounded-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#18181B] bg-[#F4F4F5] transition-all text-[#18181B]" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-gray-500 mb-1.5 sm:mb-2 uppercase tracking-wide">
                                            <Phone size={14} className="text-[#18181B]" /> Call
                                        </label>
                                        <div className="relative">
                                            <input type="tel" placeholder="e.g. 60123456789"
                                                value={form.callNumber}
                                                onChange={e => setForm({ ...form, callNumber: e.target.value.replace(/\D/g, "") })}
                                                className="w-full border-none rounded-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#18181B] bg-[#F4F4F5] transition-all text-[#18181B]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Description bullets */}
                            <div>
                                <SectionLabel icon={ListChecks} label="Product Details" />
                                <div className="space-y-3">
                                    {bulletPoints.map((point, i) => (
                                        <div key={i} className="flex items-center gap-2 sm:gap-3 group">
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#C8102E] rounded-full flex-shrink-0" />
                                            <input type="text" placeholder={`Feature ${i + 1}`}
                                                value={point} onChange={e => updateBullet(i, e.target.value)}
                                                className="flex-1 border-none rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#18181B] bg-[#F4F4F5] transition-all text-[#18181B]" />
                                            <button type="button" onClick={() => removeBullet(i)}
                                                className="p-2.5 sm:p-3 rounded-full bg-gray-100 text-gray-400 hover:text-white hover:bg-[#C8102E] opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                                                <X size={14} strokeWidth={2.5} className="sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addBullet}
                                        className="flex items-center justify-center gap-2 w-full text-[10px] sm:text-xs text-[#18181B] font-extrabold mt-2 px-4 py-2.5 sm:py-3 rounded-full border-2 border-dashed border-gray-200 hover:border-[#18181B] hover:bg-gray-50 transition-all uppercase tracking-wide">
                                        <Plus size={14} strokeWidth={3} /> Add Detail
                                    </button>
                                </div>
                            </div>

                            {/* Section 4: Specs */}
                            <div>
                                <SectionLabel icon={Sparkles} label="Technical Specs" />
                                <div className="space-y-3">
                                    {(form.specs || []).map((spec, i) => (
                                        <div key={i} className="flex items-center gap-2 sm:gap-3 group">
                                            <input type="text" placeholder="Key (e.g. Color)"
                                                value={spec.key} onChange={e => updateSpec(i, "key", e.target.value)}
                                                className="w-1/3 sm:w-2/5 border-none rounded-full px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#18181B] bg-[#F4F4F5] transition-all text-[#18181B]" />
                                            <span className="text-gray-300 font-bold">:</span>
                                            <input type="text" placeholder="Value (e.g. White)"
                                                value={spec.value} onChange={e => updateSpec(i, "value", e.target.value)}
                                                className="flex-1 border-none rounded-full px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#18181B] bg-[#F4F4F5] transition-all text-[#18181B]" />
                                            <button type="button" onClick={() => removeSpec(i)}
                                                className="p-2.5 sm:p-3 rounded-full bg-gray-100 text-gray-400 hover:text-white hover:bg-[#C8102E] opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                                                <X size={14} strokeWidth={2.5} className="sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addSpec}
                                        className="flex items-center justify-center gap-2 w-full text-[10px] sm:text-xs text-[#18181B] font-extrabold mt-2 px-4 py-2.5 sm:py-3 rounded-full border-2 border-dashed border-gray-200 hover:border-[#18181B] hover:bg-gray-50 transition-all uppercase tracking-wide">
                                        <Plus size={14} strokeWidth={3} /> Add Spec
                                    </button>
                                </div>
                            </div>

                            {/* Section 5: Cover Image */}
                            <div>
                                <SectionLabel icon={Star} label="Cover Image" />
                                {displayCover ? (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                                        <div className="relative w-fit">
                                            <img
                                                src={displayCover}
                                                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl sm:rounded-[1.5rem] border-[3px] border-[#C8102E] shadow-lg"
                                                onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/112x112?text=Err"; }}
                                                alt="Cover"
                                            />
                                            <button type="button" onClick={removeCover}
                                                className="absolute -bottom-2 -right-2 bg-[#18181B] text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        </div>
                                        <label className="flex items-center justify-center w-full sm:w-auto gap-2 cursor-pointer bg-[#F4F4F5] hover:bg-[#18181B] hover:text-white rounded-full px-6 py-3 text-sm text-[#18181B] font-bold transition-all">
                                            <ImagePlus size={16} /> Replace Cover
                                            <input type="file" accept="image/*" className="hidden" onChange={handleCoverImageChange} />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="flex items-center justify-center gap-2 cursor-pointer bg-[#F4F4F5] border-2 border-dashed border-gray-200 hover:border-[#18181B] rounded-3xl sm:rounded-[2rem] w-full py-8 text-sm text-gray-500 hover:text-[#18181B] font-bold transition-all">
                                        <ImagePlus size={20} /> Upload Cover Image
                                        <input type="file" accept="image/*" className="hidden" onChange={handleCoverImageChange} />
                                    </label>
                                )}
                            </div>

                            {/* Section 6: Gallery Images */}
                            <div>
                                <SectionLabel icon={ImagePlus} label="Product Gallery" />
                                <p className="text-[10px] sm:text-xs text-gray-400 font-medium mb-3 sm:mb-4">You can select up to 5 additional images.</p>
                                
                                <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
                                    {editExistingImages.map(url => (
                                        <div key={url} className="relative group">
                                            <img src={url} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl sm:rounded-[1rem] border border-gray-100 shadow-sm" alt="" />
                                            <button type="button" onClick={() => setEditExistingImages(p => p.filter(u => u !== url))}
                                                className="absolute -top-2 -right-2 bg-[#18181B] text-white rounded-full p-1.5 shadow-md opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X size={10} strokeWidth={3} className="sm:w-3 sm:h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {previews.map((src, i) => (
                                        <div key={i} className="relative group">
                                            <img src={src} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl sm:rounded-[1rem] border-2 border-[#18181B]" alt="" />
                                            <span className="absolute -bottom-2 inset-x-1 sm:inset-x-2 bg-[#18181B] text-white text-[8px] sm:text-[9px] font-bold py-0.5 rounded-full text-center tracking-widest">NEW</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                                    <span className="text-[10px] sm:text-xs text-[#18181B] font-extrabold uppercase tracking-wide">{editExistingImages.length + previews.length}/5 Selected</span>
                                    {(editExistingImages.length + imageFiles.length) < 5 && (
                                        <label className="flex items-center justify-center sm:justify-start gap-2 cursor-pointer bg-[#18181B] hover:bg-[#C8102E] text-white rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-md">
                                            <Plus size={14} strokeWidth={3} /> Add Photos
                                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-100">
                                <button type="button" onClick={closeModal} disabled={loading}
                                    className="w-full sm:w-1/3 py-3.5 sm:py-4 bg-white border-2 border-gray-100 rounded-full text-sm text-gray-500 hover:border-[#18181B] hover:text-[#18181B] font-extrabold transition-all disabled:opacity-40">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading}
                                    className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#18181B] hover:bg-[#C8102E] disabled:bg-gray-300 text-white font-bold py-3.5 sm:py-4 rounded-full transition-all text-sm shadow-xl shadow-[#18181B]/10 sm:hover:-translate-y-1">
                                    {loading ? (
                                        <><Loader2 size={18} className="animate-spin" /> {(imageFiles.length > 0 || coverImageFile) ? "Uploading..." : "Saving..."}</>
                                    ) : editingId ? (
                                        <><Pencil size={18} /> Update Product</>
                                    ) : (
                                        <><Plus size={18} strokeWidth={2.5} /> Add to Catalog</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}