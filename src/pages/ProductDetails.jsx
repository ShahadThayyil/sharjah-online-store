import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, incrementProductClicks } from "../services/productService";
import {
    MessageCircle, Phone, Truck, ChevronLeft, ChevronRight,
    ArrowLeft, Package, ZoomIn, ShieldCheck, Tag
} from "lucide-react";

// ─── Image Lightbox ───────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }) {
    useEffect(() => {
        function handleKey(e) { if (e.key === "Escape") onClose(); }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300" onClick={onClose}>
            <img src={src} alt={alt} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl scale-100" onClick={e => e.stopPropagation()} />
            <button onClick={onClose} className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors backdrop-blur-md">
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
        window.scrollTo(0, 0); // Always start at the top
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
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-12 md:py-24 animate-pulse pt-32">
            <div className="h-4 bg-gray-200 rounded-full w-32 mb-8" />
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="w-full lg:w-6/12 aspect-[4/5] bg-gray-200 rounded-[2rem]" />
                <div className="w-full lg:w-6/12 space-y-6 pt-4">
                    <div className="h-10 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-5 bg-gray-100 rounded-full w-1/4 mb-8" />
                    <div className="h-14 bg-gray-200 rounded-full w-1/3 mb-10" />
                    <div className="h-4 bg-gray-100 rounded-full w-full" />
                    <div className="h-4 bg-gray-100 rounded-full w-5/6" />
                    <div className="h-4 bg-gray-100 rounded-full w-4/6" />
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="text-center py-32 md:py-48 text-gray-400 pt-48" style={bodyStyle}>
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={48} strokeWidth={1} className="text-gray-400" />
            </div>
            <p className="text-2xl font-extrabold text-[#18181B] tracking-tight" style={headingStyle}>Product not found.</p>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">This item might have been removed or is currently unavailable.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#18181B] hover:bg-[#C8102E] text-white rounded-full mt-8 font-bold transition-all shadow-lg hover:-translate-y-0.5">
                <ArrowLeft size={16} /> Back to Collection
            </Link>
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
        <div className="bg-[#F4F4F5] min-h-screen pb-20 pt-24 md:pt-32 text-[#18181B] selection:bg-[#C8102E] selection:text-white" style={bodyStyle}>

            {lightbox && <Lightbox src={lightbox} alt={productName} onClose={() => setLightbox(null)} />}

            <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
                
                {/* ── Breadcrumb / Back ── */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#18181B] transition-colors font-bold uppercase tracking-wider">
                        <ArrowLeft size={16} strokeWidth={2.5} /> Back to Collection
                    </Link>
                </div>

                {/* ── Main Layout Split ── */}
                <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start">

                    {/* ── LEFT: Editorial Image Gallery ── */}
                    <div className="w-full lg:w-6/12 flex flex-col gap-4 lg:sticky lg:top-32">
                        
                        {/* Main Image Frame */}
                        <div className="relative w-full aspect-[4/5] bg-white rounded-[2rem] border border-gray-100 flex items-center justify-center group overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <img
                                src={galleryImgs[activeImg]}
                                alt={productName}
                                onClick={() => setLightbox(galleryImgs[activeImg])}
                                className="w-full h-full object-contain p-6 md:p-12 transition-transform duration-[1.5s] ease-out group-hover:scale-105 cursor-zoom-in"
                            />
                            
                            {/* Floating Zoom Button */}
                            <button
                                onClick={() => setLightbox(galleryImgs[activeImg])}
                                className="absolute top-5 right-5 bg-[#F4F4F5]/80 backdrop-blur-md hover:bg-[#18181B] hover:text-white p-3 rounded-full shadow-sm text-gray-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                                <ZoomIn size={20} />
                            </button>
                            
                            {/* Navigation Chevrons */}
                            {galleryImgs.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveImg(p => (p - 1 + galleryImgs.length) % galleryImgs.length); }}
                                        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-3.5 rounded-full shadow-md text-[#18181B] hover:bg-[#C8102E] hover:text-white lg:opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveImg(p => (p + 1) % galleryImgs.length); }}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-3.5 rounded-full shadow-md text-[#18181B] hover:bg-[#C8102E] hover:text-white lg:opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {galleryImgs.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2">
                                {galleryImgs.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImg(i)}
                                        className={`w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl overflow-hidden border-[3px] transition-all duration-300 ${
                                            activeImg === i ? "border-[#C8102E] shadow-md scale-105" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105 bg-white"
                                        }`}
                                    >
                                        <img src={src} alt="" className="w-full h-full object-cover p-1" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Details & Buy Box ── */}
                    <div className="w-full lg:w-6/12 flex-1 flex flex-col pt-2 lg:pt-0">
                        
                        {/* Title & Category */}
                        <div className="mb-8">
                            <span className="inline-flex items-center gap-1.5 bg-[#18181B] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-sm" style={headingStyle}>
                                <Tag size={12} className="text-[#C8102E]" />
                                {category}
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#18181B] leading-[1.1] tracking-tight" style={headingStyle}>
                                {productName}
                            </h1>
                        </div>

                        {/* Price Block */}
                        <div className="flex items-end gap-3 mb-10 pb-10 border-b border-gray-200/60">
                            <span className="text-[#18181B] font-extrabold text-5xl tracking-tighter" style={headingStyle}>
                                <span className="text-3xl mr-1">₹</span>{Number(price).toFixed(2)}
                            </span>
                            <span className="text-sm font-bold text-gray-400 mb-1.5">Inc. taxes</span>
                        </div>

                        {/* Material Info */}
                        {material && (
                            <div className="mb-10 text-base">
                                <span className="font-extrabold text-[#18181B] uppercase tracking-wide text-xs">Material</span> 
                                <p className="text-gray-600 mt-1 font-medium">{material}</p>
                            </div>
                        )}

                        {/* About this item (Bullets) */}
                        {descArray.length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-sm font-extrabold text-[#18181B] uppercase tracking-wide mb-4" style={headingStyle}>The Details</h3>
                                <ul className="space-y-4">
                                    {descArray.map((point, i) => (
                                        <li key={i} className="flex items-start gap-4 text-base text-gray-600 leading-relaxed font-medium">
                                            <div className="w-2 h-2 rounded-full bg-[#C8102E] mt-2.5 shrink-0 shadow-sm"></div>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Specs Table */}
                        {specsArray.length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-sm font-extrabold text-[#18181B] uppercase tracking-wide mb-4" style={headingStyle}>Specifications</h3>
                                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm text-sm">
                                    {specsArray.map((spec, i) => (
                                        <div key={i} className={`flex px-6 py-4 ${i % 2 === 0 ? "bg-transparent" : "bg-gray-50/50"} border-b border-gray-100 last:border-0`}>
                                            <span className="w-2/5 font-extrabold text-[#18181B]">{spec.key}</span>
                                            <span className="w-3/5 text-gray-500 font-medium">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── FLOATING BUY BOX ── */}
                        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] mt-4">
                            
                            {/* Delivery & Trust Badges */}
                            <div className="text-sm text-gray-600 font-medium mb-8 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#F4F4F5] p-2.5 rounded-full">
                                        <Truck size={18} className="text-[#18181B]" />
                                    </div>
                                    <span>{deliveryDetails ? deliveryDetails : "Standard premium delivery available"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-50 p-2.5 rounded-full">
                                        <ShieldCheck size={18} className="text-green-600" />
                                    </div>
                                    <span className="text-green-700">Secure direct transaction via WhatsApp</span>
                                </div>
                            </div>

                            {/* Call to Action Buttons */}
                            <div className="flex flex-col gap-4">
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-full flex items-center justify-center gap-3 bg-[#18181B] hover:bg-[#C8102E] text-white font-bold py-4 rounded-full transition-all duration-300 text-sm md:text-base shadow-xl shadow-[#18181B]/10 hover:shadow-[#C8102E]/20 hover:-translate-y-1"
                                    style={headingStyle}
                                >
                                    <MessageCircle size={20} className="group-hover:scale-110 transition-transform" /> Order via WhatsApp
                                </a>
                                <a
                                    href={`tel:+${phoneNumber}`}
                                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-[#18181B] border-2 border-gray-200 font-extrabold py-4 rounded-full transition-colors duration-300 text-sm md:text-base"
                                    style={headingStyle}
                                >
                                    <Phone size={18} /> Inquire by Phone
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Inject CSS to hide scrollbar for thumbnails */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}