import { useState, useEffect, useRef } from "react";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import { SearchX, Search, SlidersHorizontal, ChevronLeft, ChevronRight, Play, TrendingUp, VolumeX } from "lucide-react";
import gsap from "gsap";

const DEFAULT_CATEGORIES = ["Phone Cases", "Accessories","Watches", "Other"];
const PRODUCTS_PER_PAGE = 20;

// MANUALLY ADD YOUR REELS HERE
const TRENDING_REELS = [
    { id: 1, videoUrl: "https://res.cloudinary.com/dmtzmgbkj/video/upload/v1773248933/WhatsApp_Video_2026-03-11_at_10.35.17_PM_sducdq.mp4", title: "iPhone 15 Pro Max Case",  },
    { id: 2, videoUrl: "https://res.cloudinary.com/dmtzmgbkj/video/upload/v1773248942/WhatsApp_Video_2026-03-11_at_10.33.31_PM_1_irc2yc.mp4", title: "Premium Desk Setup", price: "₹2499" },
    { id: 3, videoUrl: "https://res.cloudinary.com/dmtzmgbkj/video/upload/v1773248954/WhatsApp_Video_2026-03-11_at_10.33.31_PM_uogtq5.mp4", title: "Minimalist Watch Straps", price: "₹799" },
];

export default function Home() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState(["All", ...DEFAULT_CATEGORIES]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("featured");
    const [priceInput, setPriceInput] = useState({ min: "", max: "" });
    const [appliedPrice, setAppliedPrice] = useState({ min: "", max: "" });
    const [currentPage, setCurrentPage] = useState(1);

    const heroTextRef = useRef(null);
    const heroImageRef = useRef(null);
    const filterRef = useRef(null);
    const gridRef = useRef(null);
    const reelsRef = useRef(null);

    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    useEffect(() => {
        window.scrollTo(0, 0);
        async function load() {
            try {
                const data = await getProducts();
                setProducts(data);
                setFiltered(data);
                let savedCategories = [];
                try {
                    const saved = localStorage.getItem("shop_categories");
                    if (saved) savedCategories = JSON.parse(saved);
                } catch { }
                const dbCategories = data.map((p) => p.category).filter(Boolean);
                const uniqueCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...savedCategories, ...dbCategories]));
                setCategories(["All", ...uniqueCategories]);
            } catch (err) {
                console.error("Failed to load products:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    useEffect(() => {
        let result = [...products];
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            result = result.filter((p) => p.productName?.toLowerCase().includes(query) || p.category?.toLowerCase().includes(query));
        }
        if (activeCategory !== "All") result = result.filter((p) => p.category === activeCategory);
        if (appliedPrice.min !== "") result = result.filter((p) => Number(p.price) >= Number(appliedPrice.min));
        if (appliedPrice.max !== "") result = result.filter((p) => Number(p.price) <= Number(appliedPrice.max));
        if (sortOrder === "price_asc") result.sort((a, b) => Number(a.price) - Number(b.price));
        else if (sortOrder === "price_desc") result.sort((a, b) => Number(b.price) - Number(a.price));
        setFiltered(result);
        setCurrentPage(1);
    }, [searchQuery, activeCategory, appliedPrice, sortOrder, products]);

    const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
    const currentProducts = filtered.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.fromTo(heroTextRef.current.children, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15 });
            tl.fromTo(heroImageRef.current.children, { x: 100, opacity: 0, rotation: 5 }, { x: 0, opacity: 1, rotation: 0, duration: 1.2, stagger: 0.2 }, "-=0.8");
            tl.fromTo(reelsRef.current.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }, "-=0.6");
            tl.fromTo(filterRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.4");
        });
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!loading && gridRef.current) {
            gsap.fromTo(gridRef.current.querySelectorAll('.product-card-wrapper'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" });
        }
    }, [loading, currentProducts]);

    const handleApplyPrice = (e) => { e.preventDefault(); setAppliedPrice(priceInput); };
    const handleClearFilters = () => {
        setSearchQuery(""); setActiveCategory("All"); setPriceInput({ min: "", max: "" });
        setAppliedPrice({ min: "", max: "" }); setSortOrder("featured");
    };
    const scrollToProducts = () => { gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

    return (
        <div className="min-h-screen bg-[#F4F4F5] text-[#18181B] overflow-x-hidden selection:bg-[#C8102E] selection:text-white pt-24 md:pt-32" style={bodyStyle}>
            <style>{`html { scroll-behavior: smooth; }`}</style>
            
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pb-8 md:pb-16">
                
                {/* ─── EDITORIAL HERO SECTION ─── */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mb-16 md:mb-24">
                    <div ref={heroTextRef} className="w-full lg:w-1/2 flex flex-col items-start z-10 lg:pb-12">
                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold text-[#18181B] leading-[1.05] tracking-tight mb-8" style={headingStyle}>
                            Sharjah <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18181B] to-[#4A4A4A]">Online Store.</span>
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl max-w-md leading-relaxed mb-10">
    Quality watches, electronics gadgets, and trending products for everyday use.
                        </p>
                        <button onClick={scrollToProducts} className="group relative px-8 py-4 bg-[#18181B] text-white rounded-full font-semibold overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#C8102E]/20">
                            <span className="relative z-10 flex items-center gap-2">Shop Collection</span>
                            <div className="absolute inset-0 h-full w-0 bg-[#C8102E] transition-all duration-300 ease-out group-hover:w-full z-0"></div>
                        </button>
                    </div>

                    <div ref={heroImageRef} className="w-full lg:w-1/2 relative h-[350px] md:h-[450px] flex justify-center lg:justify-end">
                        <img src="https://res.cloudinary.com/dmtzmgbkj/image/upload/f_webp/v1773245159/Gemini_Generated_Image_28s78d28s78d28s7_1_w9snos.png" alt="Featured Tech" className="absolute right-0 top-0 w-[85%] md:w-[75%] h-[85%] object-cover rounded-[2rem] shadow-2xl z-10" />
                        <img src="https://res.cloudinary.com/dmtzmgbkj/image/upload/f_webp/v1773244800/photo-1583394838336-acd977736f90_h1m6bm.avif" alt="Lifestyle Accent" className="absolute left-0 bottom-0 w-[55%] md:w-[45%] h-[55%] object-cover rounded-[2rem] shadow-2xl z-20 border-4 border-[#F4F4F5]" />
                    </div>
                </div>

                {/* ─── TRENDING REELS SECTION (REDUCED HEIGHT) ─── */}
                <div className="mb-24">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#C8102E] p-2 rounded-xl text-white shadow-sm">
                                <TrendingUp size={18} />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#18181B]" style={headingStyle}>Trending Now</h2>
                        </div>
                    </div>
                    
                    {/* Changed aspect-ratio to 3/4 for reduced height */}
                    <div ref={reelsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {TRENDING_REELS.map((reel) => (
                            <div key={reel.id} className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-[#18181B] group shadow-lg">
                                
                                
                                <video 
                                    src={reel.videoUrl} 
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                                    autoPlay 
                                    muted
                                    loop 
                                    playsInline
                                />

                                

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none opacity-50" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── MODERN CONTROL PANEL FILTERS ─── */}
                <div ref={filterRef} className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-16">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="w-full md:w-1/2 lg:w-1/3 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C8102E] transition-colors" size={20} />
                            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#C8102E] focus:ring-4 focus:ring-[#C8102E]/10 transition-all duration-300 text-sm font-medium text-[#18181B] shadow-sm" />
                        </div>
                        <div className="w-full md:w-auto flex items-center justify-end">
                            <select id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full md:w-auto bg-transparent border-none py-3 px-4 text-sm font-bold text-[#18181B] cursor-pointer focus:outline-none hover:text-[#C8102E] transition-colors" style={headingStyle}>
                                <option value="featured">Sort by: Featured</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                    {/* ... (Rest of your filters and grid) */}
                    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                        <div className="flex-1 w-full overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
                            <div className="flex items-center gap-2 w-max">
                                {categories.map((cat) => (
                                    <button key={cat} onClick={() => setActiveCategory(cat)} style={headingStyle} className={`px-6 py-2.5 text-sm transition-all duration-300 rounded-full font-semibold border ${activeCategory === cat ? "bg-[#18181B] text-white border-[#18181B] shadow-md" : "bg-white text-gray-500 border-gray-200 hover:border-[#C8102E] hover:text-[#C8102E]"}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
                            <form onSubmit={handleApplyPrice} className="flex items-center gap-2 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm">
                                <div className="flex items-center pl-3 pr-1"><span className="text-gray-400 text-sm font-bold mr-1">₹</span><input type="number" placeholder="Min" min="0" value={priceInput.min} onChange={(e) => setPriceInput({...priceInput, min: e.target.value})} className="w-16 bg-transparent text-sm focus:outline-none font-medium" /></div>
                                <div className="w-px h-4 bg-gray-200"></div>
                                <div className="flex items-center pl-2 pr-1"><span className="text-gray-400 text-sm font-bold mr-1">₹</span><input type="number" placeholder="Max" min="0" value={priceInput.max} onChange={(e) => setPriceInput({...priceInput, max: e.target.value})} className="w-16 bg-transparent text-sm focus:outline-none font-medium" /></div>
                                <button type="submit" className="p-2 bg-[#F4F4F5] text-[#18181B] rounded-full hover:bg-[#C8102E] hover:text-white transition-colors duration-300"><SlidersHorizontal size={16} /></button>
                            </form>
                            {(searchQuery || activeCategory !== "All" || appliedPrice.min || appliedPrice.max || sortOrder !== "featured") && (
                                <button onClick={handleClearFilters} className="p-2.5 text-gray-400 hover:text-[#C8102E] hover:bg-red-50 rounded-full transition-all duration-300 group" title="Clear all filters"><SearchX size={20} className="group-hover:scale-110 transition-transform" /></button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#18181B] tracking-tight" style={headingStyle}>
                            {activeCategory === "All" ? "Latest Drops" : activeCategory}
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Showing {currentProducts.length} of {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
                        </p>
                    </div>
                </div>

                <div ref={gridRef} className="scroll-mt-32">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 xl:gap-x-8 xl:gap-y-12">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="bg-white p-4 rounded-[1.5rem] animate-pulse shadow-sm">
                                    <div className="aspect-[4/5] bg-gray-100 mb-4 rounded-xl" />
                                    <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-3" />
                                    <div className="h-3 bg-gray-100 rounded-full w-full mb-4" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-24 text-center max-w-md mx-auto bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <SearchX size={32} className="text-[#C8102E]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#18181B] mb-2" style={headingStyle}>Nothing to show</h3>
                            <button onClick={handleClearFilters} className="px-6 py-3 bg-[#18181B] text-white rounded-full font-semibold hover:bg-[#C8102E] transition-all duration-300 shadow-md">
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <ProductGrid products={currentProducts} />
                    )}
                </div>

                {!loading && totalPages > 1 && (
                    <div className="mt-20 flex items-center justify-center gap-2">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${currentPage === 1 ? "text-gray-300 cursor-not-allowed bg-transparent" : "text-[#18181B] bg-white hover:bg-[#18181B] hover:text-white shadow-sm hover:shadow-md"}`}><ChevronLeft size={20} /></button>
                        <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-full shadow-sm">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button key={number} onClick={() => handlePageChange(number)} style={headingStyle} className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${currentPage === number ? "bg-[#C8102E] text-white shadow-md" : "text-gray-500 hover:text-[#18181B] hover:bg-gray-100"}`}>{number}</button>
                            ))}
                        </div>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed bg-transparent" : "text-[#18181B] bg-white hover:bg-[#18181B] hover:text-white shadow-sm hover:shadow-md"}`}><ChevronRight size={20} /></button>
                    </div>
                )}
            </div>
        </div>
    );
}