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
const DEFAULT_WHATSAPP = "60123456789"; // change to your real number
const DEFAULT_CALL     = "60123456789"; // change to your real number

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

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
    if (!toast.msg) return null;
    return (
        <div className={`fixed top-5 right-5 z-[70] flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl text-sm text-white font-medium
            ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
            {toast.type === "error" ? <XCircle size={16} /> : <CheckCircle size={16} />}
            {toast.msg}
        </div>
    );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ open, productName, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 text-center">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <AlertTriangle size={26} className="text-red-500" />
                </div>
                <h3 className="font-bold text-slate-800 text-xl mb-2">Delete Product?</h3>
                <p className="text-slate-500 text-sm mb-7 leading-relaxed">
                    <span className="font-semibold text-slate-700">"{productName}"</span> will be permanently removed.
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 font-semibold transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
}

// ─── Success Dialog ───────────────────────────────────────────────────────────
function SuccessDialog({ open, message, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-800 text-xl mb-2">Done!</h3>
                <p className="text-slate-500 text-sm mb-7">{message}</p>
                <button onClick={onClose} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors">
                    Continue
                </button>
            </div>
        </div>
    );
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center">
                <Icon size={13} className="text-violet-600" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
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
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category *</label>
            {!showCustomInput ? (
                <div className="flex gap-2">
                    <select
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-slate-50 focus:bg-white transition-all"
                    >
                        {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <button
                        type="button"
                        onClick={() => setShowCustomInput(true)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-violet-50 hover:bg-violet-100 text-violet-600 text-xs font-bold rounded-xl transition-colors border border-violet-200 whitespace-nowrap"
                        title="Add custom category"
                    >
                        <Plus size={13} /> New
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
                        className="flex-1 border-2 border-violet-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white transition-all"
                    />
                    <button type="button" onClick={handleAdd}
                        className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-colors">
                        Add
                    </button>
                    <button type="button" onClick={() => { setShowCustomInput(false); setCustomValue(""); }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold rounded-xl transition-colors">
                        <X size={14} />
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

    // Dynamic categories (persisted in localStorage)
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

    // ── Cover image state ─────────────────────────────────────────────────────
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [editExistingCover, setEditExistingCover] = useState(null);

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState({ msg: "", type: "success" });
    const [successDialog, setSuccessDialog] = useState({ open: false, message: "" });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, product: null });

    // ── Load ──────────────────────────────────────────────────────────────────
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

    // ── Add custom category ───────────────────────────────────────────────────
    function handleAddCategory(newCat) {
        if (categories.includes(newCat)) return;
        const updated = [...categories, newCat];
        setCategories(updated);
        try { localStorage.setItem("shop_categories", JSON.stringify(updated)); } catch {}
        showToastMsg(`Category "${newCat}" added!`);
    }

    // ── Bullet helpers ────────────────────────────────────────────────────────
    function updateBullet(i, v) { const b = [...bulletPoints]; b[i] = v; setBulletPoints(b); }
    function addBullet() { setBulletPoints([...bulletPoints, ""]); }
    function removeBullet(i) { if (bulletPoints.length > 1) setBulletPoints(bulletPoints.filter((_, j) => j !== i)); }

    // ── Spec helpers ──────────────────────────────────────────────────────────
    function addSpec() { setForm({ ...form, specs: [...(form.specs || []), { key: "", value: "" }] }); }
    function updateSpec(i, field, val) {
        const s = [...(form.specs || [])]; s[i] = { ...s[i], [field]: val };
        setForm({ ...form, specs: s });
    }
    function removeSpec(i) { setForm({ ...form, specs: (form.specs || []).filter((_, j) => j !== i) }); }

    // ── Images ────────────────────────────────────────────────────────────────
    function handleImageChange(e) {
        const maxNew = 5 - editExistingImages.length;
        const files = Array.from(e.target.files).slice(0, maxNew);
        setImageFiles(files);
        setPreviews(files.map(f => URL.createObjectURL(f)));
    }

    // ── Cover image ───────────────────────────────────────────────────────────
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

    // ── Modal ─────────────────────────────────────────────────────────────────
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
        // make sure the product's category is in our list
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

    // ── Submit ────────────────────────────────────────────────────────────────
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
            // keep existing cover URL if no new file selected
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

    // ── Delete ────────────────────────────────────────────────────────────────
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

    // current cover to display (new preview takes priority over saved URL)
    const displayCover = coverPreview || editExistingCover;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div>
            <Toast toast={toast} />
            <SuccessDialog open={successDialog.open} message={successDialog.message} onClose={() => setSuccessDialog({ open: false, message: "" })} />
            <ConfirmDialog open={confirmDialog.open} productName={confirmDialog.product?.productName} onConfirm={confirmDelete} onCancel={() => setConfirmDialog({ open: false, product: null })} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">Products</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage your shop inventory</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm shadow-sm shadow-violet-200">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-5">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search by name or category..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-700 text-sm">
                        {fetchLoading ? "Loading..." : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
                    </h2>
                    {/* Category pills */}
                    <div className="hidden sm:flex gap-1.5 flex-wrap">
                        {categories.slice(0, 5).map(cat => (
                            <button key={cat} onClick={() => setSearch(cat === search ? "" : cat)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${search === cat ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-violet-50 hover:text-violet-600"}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {fetchLoading ? (
                    <div className="divide-y divide-slate-50">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-3 animate-pulse">
                                <div className="w-10 h-10 rounded-lg bg-slate-100" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                                    <div className="h-2.5 bg-slate-50 rounded w-1/4" />
                                </div>
                                <div className="w-20 h-3 bg-slate-100 rounded" />
                                <div className="w-14 h-3 bg-slate-100 rounded" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-slate-400">
                        <Package size={40} strokeWidth={1.2} className="mx-auto mb-3 text-slate-200" />
                        <p className="font-medium">No products found</p>
                        <p className="text-sm mt-1">{search ? "Try a different search term" : "Add your first product above"}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3 text-left">Product</th>
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-left">Price</th>
                                    <th className="px-4 py-3 text-left">
                                        <span className="flex items-center gap-1"><MousePointerClick size={12} /> Clicks</span>
                                    </th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(p => (
                                    <tr key={p.productId} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex-shrink-0">
                                                    <img
                                                        src={p.coverImage || (p.images?.length > 0 ? p.images[0] : "https://placehold.co/44x44?text=No+Img")}
                                                        className="w-11 h-11 rounded-xl object-cover border border-slate-100"
                                                        alt={p.productName}
                                                        onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/44x44?text=No+Img"; }}
                                                    />
                                                    {p.coverImage && (
                                                        <span className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-0.5">
                                                            <Star size={7} className="text-white fill-white" />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 truncate max-w-[160px]">{p.productName}</p>
                                                    <p className="text-xs text-slate-400 truncate max-w-[160px]">
                                                        {p.material ? `Material: ${p.material}` :
                                                            Array.isArray(p.description) ? p.description[0] :
                                                            p.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="bg-violet-50 text-violet-600 text-xs font-semibold px-2.5 py-1 rounded-full">{p.category}</span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-violet-700">RM {Number(p.price).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <MousePointerClick size={13} className="text-slate-300" />
                                                <span className="font-medium">{p.clicks || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors"><Pencil size={15} /></button>
                                                <button onClick={() => setConfirmDialog({ open: true, product: p })} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ════ MODAL ════ */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
                    <div className="bg-white w-full sm:rounded-3xl sm:max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl rounded-t-3xl">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white rounded-t-3xl z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                                    {editingId ? <FilePenLine size={17} className="text-violet-600" /> : <PlusCircle size={17} className="text-violet-600" />}
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-800 text-lg leading-tight">
                                        {editingId ? "Edit Product" : "Add New Product"}
                                    </h2>
                                    <p className="text-xs text-slate-400">Fill in the product details below</p>
                                </div>
                            </div>
                            <button onClick={closeModal} disabled={loading} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-7">

                            {/* Section 1: Basic Info */}
                            <div className="space-y-4">
                                <SectionLabel icon={Tag} label="Basic Information" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* Product Name */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Product Name *</label>
                                        <input type="text" required placeholder="e.g. iPhone 15 Silicone Case"
                                            value={form.productName}
                                            onChange={e => setForm({ ...form, productName: e.target.value })}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-slate-50 focus:bg-white transition-all" />
                                    </div>

                                    {/* Category with custom add */}
                                    <div className="sm:col-span-2">
                                        <CategorySelector
                                            value={form.category}
                                            onChange={val => setForm({ ...form, category: val })}
                                            categories={categories}
                                            onAddCategory={handleAddCategory}
                                        />
                                    </div>

                                    {/* Material */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Product Material</label>
                                        <input type="text" placeholder="e.g. Silicone, Plastic, Cotton"
                                            value={form.material}
                                            onChange={e => setForm({ ...form, material: e.target.value })}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-slate-50 focus:bg-white transition-all" />
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Price (RM) *</label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">RM</span>
                                            <input type="number" min="0" step="0.01" required placeholder="0.00"
                                                value={form.price}
                                                onChange={e => setForm({ ...form, price: e.target.value })}
                                                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-slate-50 focus:bg-white transition-all" />
                                        </div>
                                    </div>

                                    {/* Delivery */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Delivery Details</label>
                                        <input type="text" placeholder="e.g. Ships in 3–5 business days"
                                            value={form.deliveryDetails}
                                            onChange={e => setForm({ ...form, deliveryDetails: e.target.value })}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-slate-50 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Contact Numbers */}
                            <div>
                                <SectionLabel icon={Phone} label="Contact Numbers" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* WhatsApp Number */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                                            <MessageCircle size={12} className="text-green-500" /> WhatsApp Number
                                        </label>
                                        <div className="relative">
                                            <MessageCircle size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-400" />
                                            <input
                                                type="tel"
                                                placeholder="e.g. 60123456789"
                                                value={form.whatsappNumber}
                                                onChange={e => setForm({ ...form, whatsappNumber: e.target.value.replace(/\D/g, "") })}
                                                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-slate-50 focus:bg-white transition-all"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 ml-1">No + or spaces (e.g. 60123456789)</p>
                                    </div>

                                    {/* Call Number */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                                            <Phone size={12} className="text-violet-500" /> Call Number
                                        </label>
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400" />
                                            <input
                                                type="tel"
                                                placeholder="e.g. 60123456789"
                                                value={form.callNumber}
                                                onChange={e => setForm({ ...form, callNumber: e.target.value.replace(/\D/g, "") })}
                                                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-slate-50 focus:bg-white transition-all"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 ml-1">Can be same or different number</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Description bullets */}
                            <div>
                                <SectionLabel icon={ListChecks} label="Product Details (Bullet Points)" />
                                <div className="space-y-2">
                                    {bulletPoints.map((point, i) => (
                                        <div key={i} className="flex items-center gap-2 group">
                                            <div className="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0" />
                                            <input type="text" placeholder={`Point ${i + 1} — e.g. Scratch resistant`}
                                                value={point} onChange={e => updateBullet(i, e.target.value)}
                                                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-slate-50 focus:bg-white transition-all" />
                                            <button type="button" onClick={() => removeBullet(i)}
                                                className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addBullet}
                                        className="flex items-center gap-2 text-xs text-violet-600 hover:text-violet-700 font-semibold mt-1 px-2 py-1 rounded-lg hover:bg-violet-50 transition-colors">
                                        <Plus size={13} /> Add another point
                                    </button>
                                </div>
                            </div>

                            {/* Section 4: Specs */}
                            <div>
                                <SectionLabel icon={Sparkles} label="Features & Specs (Optional)" />
                                <div className="space-y-2">
                                    {(form.specs || []).map((spec, i) => (
                                        <div key={i} className="flex items-center gap-2 group">
                                            <input type="text" placeholder="Key (e.g. Color)"
                                                value={spec.key} onChange={e => updateSpec(i, "key", e.target.value)}
                                                className="w-2/5 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-slate-50 focus:bg-white transition-all" />
                                            <span className="text-slate-300 font-bold flex-shrink-0">:</span>
                                            <input type="text" placeholder="Value (e.g. White)"
                                                value={spec.value} onChange={e => updateSpec(i, "value", e.target.value)}
                                                className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-slate-50 focus:bg-white transition-all" />
                                            <button type="button" onClick={() => removeSpec(i)}
                                                className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {(form.specs || []).length === 0 && (
                                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                                            <p className="text-xs text-slate-400">Examples: Color: White · RAM: 8GB · Weight: 200g</p>
                                        </div>
                                    )}
                                    <button type="button" onClick={addSpec}
                                        className="flex items-center gap-2 text-xs text-violet-600 hover:text-violet-700 font-semibold mt-1 px-2 py-1 rounded-lg hover:bg-violet-50 transition-colors">
                                        <Plus size={13} /> Add spec
                                    </button>
                                </div>
                            </div>

                            {/* ── NEW: Section 5: Cover Image ── */}
                            <div>
                                <SectionLabel icon={Star} label="Cover Image" />
                                <p className="text-xs text-slate-400 mb-3">
                                    Shown as the main card image in the shop listing. If not set, the first gallery image is used.
                                </p>
                                {displayCover ? (
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={displayCover}
                                                className="w-24 h-24 object-cover rounded-2xl border-2 border-amber-300 shadow-sm"
                                                onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96?text=Err"; }}
                                                alt="Cover"
                                            />
                                            <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                <Star size={8} className="fill-white" /> COVER
                                            </span>
                                            <button
                                                type="button"
                                                onClick={removeCover}
                                                className="absolute -bottom-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-amber-50 border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-amber-500 transition-all font-medium">
                                            <ImagePlus size={15} /> Change cover
                                            <input type="file" accept="image/*" className="hidden" onChange={handleCoverImageChange} />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-amber-50 border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-amber-500 transition-all font-medium w-fit">
                                        <ImagePlus size={15} /> Choose cover image
                                        <input type="file" accept="image/*" className="hidden" onChange={handleCoverImageChange} />
                                    </label>
                                )}
                            </div>

                            {/* Section 6: Gallery Images */}
                            <div>
                                <SectionLabel icon={ImagePlus} label="Product Images (Max 5)" />
                                {editExistingImages.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {editExistingImages.map(url => (
                                            <div key={url} className="relative">
                                                <img src={url} className="w-16 h-16 object-cover rounded-xl border-2 border-slate-100"
                                                    onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64?text=Err"; }} alt="" />
                                                <button type="button" onClick={() => setEditExistingImages(p => p.filter(u => u !== url))}
                                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow">
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {previews.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {previews.map((src, i) => (
                                            <div key={i} className="relative">
                                                <img src={src} className="w-16 h-16 object-cover rounded-xl border-2 border-violet-300" alt="" />
                                                <span className="absolute -top-1.5 -left-1.5 bg-violet-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400 font-medium">{editExistingImages.length + previews.length}/5 selected</span>
                                    {(editExistingImages.length + imageFiles.length) < 5 && (
                                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-violet-50 border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-violet-500 transition-all font-medium">
                                            <ImagePlus size={16} /> Choose images
                                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2 border-t border-slate-100">
                                <button type="button" onClick={closeModal} disabled={loading}
                                    className="flex-1 py-3 border-2 border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 font-semibold transition-colors disabled:opacity-40">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-lg shadow-violet-200">
                                    {loading ? (
                                        <><Loader2 size={16} className="animate-spin" />{(imageFiles.length > 0 || coverImageFile) ? "Uploading..." : "Saving..."}</>
                                    ) : editingId ? (
                                        <><Pencil size={15} /> Update Product</>
                                    ) : (
                                        <><Plus size={15} /> Add Product</>
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