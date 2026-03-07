import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import { Sparkles, ChevronDown } from "lucide-react";

const ALL_CATEGORIES = ["All", "Toys", "Phone Cases", "Accessories", "Stationery", "Other"];

export default function Home() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getProducts();
                setProducts(data);
                setFiltered(data);
            } catch (err) {
                console.error("Failed to load products:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    useEffect(() => {
        setFiltered(
            activeCategory === "All"
                ? products
                : products.filter((p) => p.category === activeCategory)
        );
    }, [activeCategory, products]);

    return (
        <>
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-300 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
                    <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                        <Sparkles size={14} /> New arrivals every week
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                        Shop Smart,<br />Shop Easy 🛍️
                    </h1>
                    <p className="text-lg text-violet-100 max-w-xl mx-auto mb-8">
                        Browse our collection and order via WhatsApp — fast, easy, and personal.
                    </p>
                    <a href="#products"
                        className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-8 py-3 rounded-full hover:bg-violet-50 transition-colors shadow-lg">
                        Browse Products <ChevronDown size={18} />
                    </a>
                </div>
            </section>

            {/* Products */}
            <section id="products" className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Our Products</h2>
                        <p className="text-slate-500 text-sm">
                            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {ALL_CATEGORIES.map((cat) => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${activeCategory === cat
                                    ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-violet-400 hover:text-violet-600"
                                }`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Loading skeleton */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                <div className="aspect-[4/3] bg-slate-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                                    <div className="h-3 bg-slate-100 rounded w-full" />
                                    <div className="h-5 bg-slate-200 rounded w-1/3 mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ProductGrid products={filtered} />
                )}
            </section>
        </>
    );
}
