import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, incrementProductClicks } from "../services/productService";
import {
    MessageCircle, Phone, Tag, Truck, ChevronLeft, ChevronRight,
    ArrowLeft, Package, ZoomIn, ShieldCheck
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
            <img src={src} alt={alt} className="max-w-full max-h-full object-contain rounded-sm shadow-2xl" onClick={e => e.stopPropagation()} />
            <button onClick={onClose} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-sm transition-colors">
                ✕
            </button>
        </div>
    );
}

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [lightbox, setLightbox] = useState(null);

    // Font inline styles for the theme
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

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
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded-sm w-32 mb-6" />
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-5/12 aspect-[4/5] bg-gray-200 rounded-sm" />
                <div className="w-full lg:w-7/12 space-y-4 pt-2">
                    <div className="h-8 bg-gray-200 rounded-sm w-3/4" />
                    <div className="h-4 bg-gray-100 rounded-sm w-1/4 mb-6" />
                    <div className="h-10 bg-gray-200 rounded-sm w-1/3 mb-6" />
                    <div className="h-4 bg-gray-100 rounded-sm w-full" />
                    <div className="h-4 bg-gray-100 rounded-sm w-5/6" />
                    <div className="h-4 bg-gray-100 rounded-sm w-4/6" />
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="text-center py-24 text-gray-400" style={bodyStyle}>
            <Package size={48} strokeWidth={1} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-semibold text-[#111111]" style={headingStyle}>Product not found.</p>
            <Link to="/" className="text-[#2563EB] mt-4 inline-block hover:underline text-sm font-medium">← Back to shop</Link>
        </div>
    );

    const {
        productName, description, material, price,
        category, deliveryDetails, images, specs,
        whatsappNumber, callNumber, coverImage,
    } = product;

    const galleryImgs = (() => {
        const base = images?.length ? images : [];
        if (coverImage) {
            const rest = base.filter(u => u !== coverImage);
            return [coverImage, ...rest];
        }
        return base.length ? base : ["https://placehold.co/600x600?text=No+Image"];
    })();

    const descArray = Array.isArray(description)
        ? description.filter(Boolean)
        : typeof description === "string" && description
            ? [description]
            : [];

    const specsArray = Array.isArray(specs) ? specs.filter(s => s.key && s.value) : [];

    const waNumber = whatsappNumber || "";
    const phoneNumber = callNumber || "";
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi! I'm interested in buying "${productName}". Could you please provide more details?`)}`;

    return (
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-6 text-[#111111]" style={bodyStyle}>

            {lightbox && <Lightbox src={lightbox} alt={productName} onClose={() => setLightbox(null)} />}

            {/* Breadcrumb / Back */}
            <div className="mb-4">
                <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#2563EB] transition-colors font-medium">
                    <ArrowLeft size={14} /> Back to results
                </Link>
            </div>

            {/* ── Main Layout Split ── */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

                {/* ── LEFT: Image Gallery ── */}
                <div className="w-full lg:w-5/12 flex flex-col lg:flex-row gap-4 sticky top-24">
                    
                    {/* Main Image */}
                    <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] bg-white border border-gray-200 rounded-sm flex items-center justify-center group cursor-zoom-in order-1 lg:order-none">
                        <img
                            src={galleryImgs[activeImg]}
                            alt={productName}
                            onClick={() => setLightbox(galleryImgs[activeImg])}
                            className="w-full h-full object-contain p-2"
                        />
                        <button
                            onClick={() => setLightbox(galleryImgs[activeImg])}
                            className="absolute top-3 right-3 bg-white border border-gray-200 p-2 rounded-sm shadow-sm text-gray-500 hover:text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ZoomIn size={18} />
                        </button>
                        
                        {galleryImgs.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveImg(p => (p - 1 + galleryImgs.length) % galleryImgs.length); }}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 p-2 rounded-sm shadow-sm hover:text-[#2563EB] lg:opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveImg(p => (p + 1) % galleryImgs.length); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 p-2 rounded-sm shadow-sm hover:text-[#2563EB] lg:opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails (Right Side on LG, Bottom on Mobile/Tablet) */}
                    {galleryImgs.length > 1 && (
                        <div className="flex lg:flex-col gap-2 overflow-auto hide-scrollbar shrink-0 order-2 lg:order-none">
                            {galleryImgs.map((src, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImg(i)}
                                    className={`w-16 h-16 lg:w-20 lg:h-20 shrink-0 rounded-sm overflow-hidden border-2 transition-all ${
                                        activeImg === i ? "border-[#2563EB]" : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
                                    }`}
                                >
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── CENTER: Product Details ── */}
                <div className="w-full lg:w-4/12 flex-1 flex flex-col border-b lg:border-b-0 pb-8 lg:pb-0">
                    <span className="text-[#2563EB] font-semibold text-sm tracking-wide mb-1" style={headingStyle}>
                        {category}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#111111] leading-tight mb-2" style={headingStyle}>
                        {productName}
                    </h1>

                    <hr className="my-4 border-gray-200" />

                    {/* Price Tag */}
                    <div className="mb-4">
                        <span className="text-sm text-gray-500 font-medium">Price</span>
                        <div className="flex items-start text-[#111111]">
                            <span className="text-lg font-semibold mt-1 mr-0.5">₹</span>
                            <span className="text-4xl font-bold" style={headingStyle}>{Number(price).toFixed(2)}</span>
                        </div>
                        <span className="text-xs text-gray-500">Inclusive of all taxes</span>
                    </div>

                    {material && (
                        <div className="mb-4 text-sm">
                            <span className="font-semibold text-gray-900">Material:</span> <span className="text-gray-600">{material}</span>
                        </div>
                    )}

                    {/* About this item (Bullets) */}
                    {descArray.length > 0 && (
                        <div className="mt-2 mb-6">
                            <h3 className="text-base font-bold text-[#111111] mb-2" style={headingStyle}>About this item</h3>
                            <ul className="space-y-2 pl-1">
                                {descArray.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></div>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Specs Table integrated into details flow */}
                    {specsArray.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-base font-bold text-[#111111] mb-3" style={headingStyle}>Specifications</h3>
                            <div className="border border-gray-200 rounded-sm overflow-hidden text-sm">
                                {specsArray.map((spec, i) => (
                                    <div key={i} className={`flex px-4 py-2.5 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b border-gray-100 last:border-0`}>
                                        <span className="w-1/3 font-semibold text-[#111111]">{spec.key}</span>
                                        <span className="w-2/3 text-gray-600">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Buy Box (CTAs) ── */}
                <div className="w-full lg:w-3/12 shrink-0">
                    <div className="border border-gray-200 rounded-sm p-5 bg-white shadow-sm sticky top-24">
                        <div className="flex items-center gap-2 text-[#111111] font-bold text-xl mb-4" style={headingStyle}>
                            <span className="text-sm font-semibold">₹</span>{Number(price).toFixed(2)}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-6 space-y-3">
                            {deliveryDetails ? (
                                <div className="flex items-start gap-2">
                                    <Truck size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                    <span>{deliveryDetails}</span>
                                </div>
                            ) : (
                                <div className="flex items-start gap-2">
                                    <Truck size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                    <span>Standard delivery available</span>
                                </div>
                            )}
                            <div className="flex items-start gap-2">
                                <ShieldCheck size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                <span>Secure transaction via WhatsApp</span>
                            </div>
                        </div>

                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Place Order</h4>
                        
                        <div className="flex flex-col gap-3">
                            <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-2.5 rounded-sm transition-colors text-sm"
                                style={headingStyle}
                            >
                                <MessageCircle size={16} /> Order via WhatsApp
                            </a>
                            <a
                                href={`tel:+${phoneNumber}`}
                                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#111111] border border-gray-300 font-medium py-2.5 rounded-sm transition-colors text-sm"
                                style={headingStyle}
                            >
                                <Phone size={16} /> Call for Inquiry
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}