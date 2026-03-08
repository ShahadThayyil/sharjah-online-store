import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import { SearchX, Search } from "lucide-react";

const DEFAULT_CATEGORIES = ["Toys", "Phone Cases", "Accessories", "Stationery", "Other"];

export default function Home() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters & Sorting State
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState(["All", ...DEFAULT_CATEGORIES]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("featured");
    
    // Price Filter State
    const [priceInput, setPriceInput] = useState({ min: "", max: "" });
    const [appliedPrice, setAppliedPrice] = useState({ min: "", max: "" });

    // Font inline styles for the theme
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    useEffect(() => {
        async function load() {
            try {
                const data = await getProducts();
                setProducts(data);
                setFiltered(data);

                // 1. Grab custom categories
                let savedCategories = [];
                try {
                    const saved = localStorage.getItem("shop_categories");
                    if (saved) savedCategories = JSON.parse(saved);
                } catch { }

                // 2. Extract categories from DB
                const dbCategories = data.map((p) => p.category).filter(Boolean);

                // 3. Merge & remove duplicates
                const uniqueCategories = Array.from(new Set([
                    ...DEFAULT_CATEGORIES,
                    ...savedCategories,
                    ...dbCategories
                ]));

                setCategories(["All", ...uniqueCategories]);
            } catch (err) {
                console.error("Failed to load products:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // ─── FILTER & SORT LOGIC ──────────────────────────────────────────────────
    useEffect(() => {
        let result = [...products];

        // 1. Search Filter
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (p) => p.productName?.toLowerCase().includes(query) || 
                       p.category?.toLowerCase().includes(query)
            );
        }

        // 2. Category Filter
        if (activeCategory !== "All") {
            result = result.filter((p) => p.category === activeCategory);
        }

        // 3. Price Filter
        if (appliedPrice.min !== "") {
            result = result.filter((p) => Number(p.price) >= Number(appliedPrice.min));
        }
        if (appliedPrice.max !== "") {
            result = result.filter((p) => Number(p.price) <= Number(appliedPrice.max));
        }

        // 4. Sorting
        if (sortOrder === "price_asc") {
            result.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortOrder === "price_desc") {
            result.sort((a, b) => Number(b.price) - Number(a.price));
        }

        setFiltered(result);
    }, [searchQuery, activeCategory, appliedPrice, sortOrder, products]);

    const handleApplyPrice = (e) => {
        e.preventDefault();
        setAppliedPrice(priceInput);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setActiveCategory("All");
        setPriceInput({ min: "", max: "" });
        setAppliedPrice({ min: "", max: "" });
        setSortOrder("featured");
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#111111] overflow-x-hidden" style={bodyStyle}>
            
            {/* Custom Animations injected directly into the component */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0;
                }
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
            `}</style>
            
            {/* ─── FULL WIDTH HERO BANNER ───────────────────────────────────── */}
            <div className="w-full relative bg-[#2563EB] flex flex-col md:flex-row items-stretch min-h-[400px] md:min-h-[500px] shadow-lg animate-fade-in-up">
                
                {/* Left Text Content */}
                <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 z-10 flex flex-col justify-center bg-[#2563EB]">
                    <span className="text-blue-200 font-semibold text-xs md:text-sm tracking-widest uppercase mb-4" style={headingStyle}>
                        Premium Collection
                    </span>
                    <h1 
                        className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
                        style={headingStyle}
                    >
                        Sharjah Mobiles <br/> Store.
                    </h1>
                    <p className="text-blue-100 text-sm md:text-lg max-w-lg leading-relaxed">
                        Discover top-tier products with minimal, professional design. Everything you need, sorted simply and cleanly.
                    </p>
                </div>

                {/* Right Image Content */}
                <div className="w-full md:w-1/2 relative h-[300px] md:h-auto overflow-hidden bg-gray-100 group">
                    {/* Main Cover Image with smooth zoom on hover */}
                    <img 
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1500" 
                        alt="Store Featured Banner" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                    />
                    {/* Gradient overlay to seamlessly blend the left and right sides */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-[#2563EB] opacity-90 md:opacity-100 w-full md:w-1/3"></div>
                    
                    {/* Floating accent image with hover lift and rounded borders */}
                    <div className="absolute bottom-8 right-8 w-36 h-48 bg-white p-2.5 shadow-2xl hidden lg:block rounded-2xl transform rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 ease-out z-20">
                        <img 
                            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300" 
                            alt="Featured Detail"
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                </div>

            </div>

            {/* ─── MAIN CONTENT ──────────────────────────────────────────────── */}
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-12 animate-fade-in-up delay-100">
                
                {/* ─── CENTERED FILTERS (Rounded & Smooth) ───────────────────── */}
                <div className="flex flex-col items-center justify-center space-y-8 mb-12 border-b border-gray-100 pb-10">
                    
                    {/* Search Bar */}
                    <div className="w-full max-w-2xl relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-3.5 border border-gray-200 rounded-full focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 bg-white transition-all duration-300 shadow-sm text-sm font-medium"
                        />
                    </div>

                    {/* Category Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={headingStyle}
                                className={`px-6 py-2.5 text-sm transition-all duration-300 border rounded-full ${
                                    activeCategory === cat 
                                    ? "bg-[#2563EB] text-white border-[#2563EB] font-medium shadow-md transform scale-105" 
                                    : "bg-white text-[#111111] border-gray-200 hover:border-[#2563EB] hover:text-[#2563EB] hover:shadow-sm"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Price & Sort Row */}
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 text-sm w-full bg-gray-50/50 p-4 rounded-3xl">
                        
                        {/* Price Filter */}
                        <form onSubmit={handleApplyPrice} className="flex items-center gap-3">
                            <span className="font-semibold text-gray-500" style={headingStyle}>Price:</span>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    min="0"
                                    value={priceInput.min}
                                    onChange={(e) => setPriceInput({...priceInput, min: e.target.value})}
                                    className="w-24 pl-8 pr-3 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 bg-white transition-all duration-300"
                                />
                            </div>
                            <span className="text-gray-400 font-medium">-</span>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    min="0"
                                    value={priceInput.max}
                                    onChange={(e) => setPriceInput({...priceInput, max: e.target.value})}
                                    className="w-24 pl-8 pr-3 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 bg-white transition-all duration-300"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="px-5 py-2 bg-white border border-gray-200 rounded-2xl hover:text-[#2563EB] hover:border-[#2563EB] hover:shadow-sm transition-all duration-300 font-semibold"
                            >
                                Go
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-8 bg-gray-200"></div>

                        {/* Sorting */}
                        <div className="flex items-center gap-3">
                            <label htmlFor="sort" className="font-semibold text-gray-500" style={headingStyle}>Sort:</label>
                            <select 
                                id="sort"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="border border-gray-200 rounded-2xl py-2 px-4 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 bg-white cursor-pointer transition-all duration-300"
                            >
                                <option value="featured">Featured</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>

                        {/* Clear All Button */}
                        {(searchQuery || activeCategory !== "All" || appliedPrice.min || appliedPrice.max || sortOrder !== "featured") && (
                            <button 
                                onClick={handleClearFilters}
                                className="text-[#FF6B6B] hover:text-red-700 font-semibold px-4 py-2 rounded-2xl hover:bg-red-50 transition-all duration-300"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* ─── SECTION HEADING ─────────────────────────────────────────── */}
                <div className="mb-10 text-center animate-fade-in-up delay-200">
                    <h2 className="text-3xl font-bold text-[#111111]" style={headingStyle}>
                        Explore Our Collection
                    </h2>
                    <div className="w-16 h-1 bg-[#2563EB] mx-auto mt-4 rounded-full"></div>
                </div>

                {/* ─── PRODUCT GRID ────────────────────────────────────────────── */}
                <div className="animate-fade-in-up delay-200">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="border border-gray-100 p-4 rounded-3xl animate-pulse bg-white shadow-sm">
                                    <div className="aspect-[4/5] bg-gray-100 mb-5 rounded-2xl" />
                                    <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-3" />
                                    <div className="h-3 bg-gray-50 rounded-full w-full mb-4" />
                                    <div className="h-6 bg-gray-100 rounded-full w-1/3" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-24 text-center max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <SearchX size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#111111] mb-3" style={headingStyle}>No products found</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">We couldn't find anything matching your current filters. Try tweaking your search.</p>
                            <button 
                                onClick={handleClearFilters}
                                className="px-8 py-3 bg-[#2563EB] text-white rounded-full font-semibold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        <ProductGrid products={filtered} />
                    )}
                </div>
            </div>
        </div>
    );
}