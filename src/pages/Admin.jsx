import { useState, useEffect } from "react";
import { getProducts, addProduct, deleteProduct, updateProduct } from "../services/productService";
import { Plus, Trash2, Pencil, X, ImagePlus, CheckCircle, Loader2 } from "lucide-react";

const CATEGORIES = ["Toys", "Phone Cases", "Accessories", "Stationery", "Other"];
const emptyForm = { productName: "", description: "", price: "", deliveryDetails: "", category: "Toys" };

export default function Admin() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [imageFiles, setImageFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editExistingImages, setEditExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [toast, setToast] = useState("");

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
                showToast("Product updated!");
            } else {
                await addProduct(form, imageFiles);
                showToast("Product added!");
            }
            cancelEdit();
            await loadProducts();
        } catch (err) {
            console.error(err); showToast("Something went wrong.");
        } finally { setLoading(false); }
    }

    async function handleDelete(product) {
        if (!confirm(`Delete "${product.productName}"?`)) return;
        await deleteProduct(product.productId, product.images);
        showToast("Product deleted.");
        loadProducts();
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-slate-800 mb-8">🛠 Admin Panel</h1>

            {/* Toast */}
            {toast && (
                <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg text-sm">
                    <CheckCircle size={16} /> {toast}
                </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-10">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-slate-700 text-lg">
                        {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
                    </h2>
                    {editingId && (
                        <button onClick={cancelEdit} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Product Name *</label>
                        <input type="text" placeholder="e.g. iPhone 15 Case" required
                            value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                        <textarea rows={3} placeholder="Describe the product..."
                            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none" />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Price (RM) *</label>
                        <input type="number" min="0" step="0.01" placeholder="0.00" required
                            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Category *</label>
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white">
                            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Delivery Details</label>
                        <input type="text" placeholder="e.g. Ships within 3-5 business days"
                            value={form.deliveryDetails} onChange={(e) => setForm({ ...form, deliveryDetails: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-2">Images (max 5)</label>
                        {editExistingImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {editExistingImages.map((url) => (
                                    <div key={url} className="relative w-16 h-16">
                                        <img src={url} className="w-full h-full object-cover rounded-lg" alt="" />
                                        <button type="button" onClick={() => setEditExistingImages((p) => p.filter((u) => u !== url))}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {previews.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {previews.map((src, i) => (
                                    <img key={i} src={src} className="w-16 h-16 object-cover rounded-lg" alt="" />
                                ))}
                            </div>
                        )}
                        <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-xl px-4 py-3 text-sm text-slate-400 hover:text-violet-500 transition-colors w-fit">
                            <ImagePlus size={18} /> Choose images
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>

                    <div className="sm:col-span-2">
                        <button type="submit" disabled={loading}
                            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
                                : editingId ? <><Pencil size={16} /> Update Product</>
                                    : <><Plus size={16} /> Add Product</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-semibold text-slate-700">All Products ({products.length})</h2>
                </div>
                {fetchLoading ? (
                    <div className="py-16 text-center text-slate-400">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">No products yet. Add one above!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3 text-left">Product</th>
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-left">Price</th>
                                    <th className="px-4 py-3 text-left">Images</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {products.map((p) => (
                                    <tr key={p.productId} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-800 max-w-[160px] truncate">{p.productName}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-violet-50 text-violet-600 text-xs font-semibold px-2 py-0.5 rounded-full">{p.category}</span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-violet-700">RM {Number(p.price).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-slate-400">{p.images?.length || 0}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => startEdit(p)}
                                                    className="p-1.5 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(p)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
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
    );
}
