import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, incrementProductClicks } from "../services/productService";
import {
    MessageCircle, Phone, Tag, Truck, ChevronLeft, ChevronRight,
    ArrowLeft, Package, Layers, Sparkles, CheckCircle2, Info,
    ZoomIn,
} from "lucide-react";

// ─── Image Lightbox ───────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }) {
    useEffect(() => {
        function handleKey(e) { if (e.key === "Escape") onClose(); }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
            <img src={src} alt={alt} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
            <button onClick={onClose} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors">
                ✕
            </button>
        </div>
    );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ icon: Icon, title, children, accent = "violet" }) {
    const colors = {
        violet: "bg-violet-50 border-violet-100 text-violet-600",
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
        blue: "bg-blue-50 border-blue-100 text-blue-600",
        amber: "bg-amber-50 border-amber-100 text-amber-600",
    };
    return (
        <div className={`rounded-2xl border p-5 ${colors[accent]}`}>
            <div className="flex items-center gap-2 mb-4">
                <Icon size={16} className="flex-shrink-0" />
                <h3 className="font-bold text-sm uppercase tracking-wider">{title}</h3>
            </div>
            <div className="text-slate-700">{children}</div>
        </div>
    );
}

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        incrementProductClicks(id);
        async function load() {
            try { setProduct(await getProductById(id)); }
            catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        load();
    }, [id]);

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (loading) return (
        <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
            <div className="h-5 bg-slate-200 rounded w-24 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="aspect-square bg-slate-200 rounded-3xl" />
                <div className="space-y-4">
                    <div className="h-5 bg-slate-100 rounded w-20" />
                    <div className="h-9 bg-slate-200 rounded w-3/4" />
                    <div className="h-8 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 rounded" />
                    <div className="h-4 bg-slate-100 rounded w-4/5" />
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="text-center py-24 text-slate-400">
            <Package size={48} strokeWidth={1} className="mx-auto mb-4 text-slate-200" />
            <p className="text-xl font-semibold text-slate-600">Product not found.</p>
            <Link to="/" className="text-violet-600 mt-4 inline-block hover:underline text-sm">← Back to shop</Link>
        </div>
    );

    const {
        productName, description, material, price,
        category, deliveryDetails, images, specs,
        whatsappNumber, callNumber, coverImage,
    } = product;

    // Gallery: if coverImage exists add it as first, then rest of images (deduped)
    const galleryImgs = (() => {
        const base = images?.length ? images : [];
        if (coverImage) {
            const rest = base.filter(u => u !== coverImage);
            return [coverImage, ...rest];
        }
        return base.length ? base : ["https://placehold.co/600x500?text=No+Image"];
    })();

    // description can be array (bullet points) or plain string
    const descArray = Array.isArray(description)
        ? description.filter(Boolean)
        : typeof description === "string" && description
            ? [description]
            : [];

    const specsArray = Array.isArray(specs) ? specs.filter(s => s.key && s.value) : [];

    // Per-product contact numbers
    const waNumber   = whatsappNumber || "";
    const phoneNumber = callNumber    || "";

    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi! I'm interested in buying "${productName}". Could you please provide more details?`)}`;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">

            {/* Lightbox */}
            {lightbox && <Lightbox src={lightbox} alt={productName} onClose={() => setLightbox(null)} />}

            {/* Back link */}
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 mb-8 transition-colors font-medium group">
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to shop
            </Link>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

                {/* ── LEFT: Image Gallery ── */}
                <div>
                    {/* Main image */}
                    <div className="relative rounded-3xl overflow-hidden bg-slate-100 aspect-square shadow-lg group">
                        <img
                            src={galleryImgs[activeImg]}
                            alt={productName}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        />
                        {/* Zoom button */}
                        <button
                            onClick={() => setLightbox(galleryImgs[activeImg])}
                            className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-xl shadow-md text-slate-600 hover:text-violet-600 transition-all opacity-0 group-hover:opacity-100"
                            title="View full size"
                        >
                            <ZoomIn size={16} />
                        </button>

                        {/* Prev / Next arrows */}
                        {galleryImgs.length > 1 && (
                            <>
                                <button
                                    onClick={() => setActiveImg(p => (p - 1 + galleryImgs.length) % galleryImgs.length)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-xl shadow-md transition-all"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={() => setActiveImg(p => (p + 1) % galleryImgs.length)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-xl shadow-md transition-all"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </>
                        )}

                        {/* Image counter badge */}
                        {galleryImgs.length > 1 && (
                            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                                {activeImg + 1} / {galleryImgs.length}
                            </span>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {galleryImgs.length > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                            {galleryImgs.map((src, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImg(i)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-violet-500 shadow-md shadow-violet-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                                >
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Core Info ── */}
                <div className="flex flex-col">
                    {/* Category badge */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full w-fit mb-4">
                        <Tag size={11} /> {category}
                    </span>

                    {/* Product name */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight mb-3">
                        {productName}
                    </h1>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-4xl font-black text-violet-600">RM {Number(price).toFixed(2)}</span>
                    </div>

                    {/* Material pill */}
                    {material && (
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 text-sm text-slate-600 font-medium">
                                <Layers size={14} className="text-slate-400" />
                                <span>Material: <strong className="text-slate-800">{material}</strong></span>
                            </div>
                        </div>
                    )}

                    {/* Description bullets */}
                    {descArray.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Product Details</h3>
                            <ul className="space-y-2">
                                {descArray.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                                        <CheckCircle2 size={15} className="text-violet-400 mt-0.5 flex-shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Delivery */}
                    {deliveryDetails && (
                        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 text-sm text-slate-600">
                            <Truck size={17} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="font-bold text-emerald-700 block mb-0.5">Delivery Info</span>
                                {deliveryDetails}
                            </div>
                        </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-green-100 text-sm"
                        >
                            <MessageCircle size={19} /> WhatsApp Now
                        </a>
                        <a
                            href={`tel:+${phoneNumber}`}
                            className="flex-1 flex items-center justify-center gap-2.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-violet-100 text-sm"
                        >
                            <Phone size={19} /> Call Now
                        </a>
                    </div>
                </div>
            </div>

            {/* ── SPECS TABLE (full width below) ── */}
            {specsArray.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-50 bg-slate-50/80">
                        <Sparkles size={16} className="text-violet-500" />
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Features & Specifications</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {specsArray.map((spec, i) => (
                            <div key={i} className={`flex items-center px-6 py-3.5 text-sm ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                                <span className="w-2/5 font-semibold text-slate-500 capitalize">{spec.key}</span>
                                <span className="flex-1 text-slate-800 font-medium">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Bottom CTA strip ── */}
            <div className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-violet-200">
                <div className="text-white text-center sm:text-left">
                    <p className="font-bold text-lg">Interested in this product?</p>
                    <p className="text-violet-200 text-sm mt-0.5">Contact us now to place your order</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <a href={waLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-md">
                        <MessageCircle size={16} /> WhatsApp
                    </a>
                    <a href={`tel:+${phoneNumber}`}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                        <Phone size={16} /> Call
                    </a>
                </div>
            </div>
        </div>
    );
}