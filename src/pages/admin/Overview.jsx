import { useState, useEffect } from "react";
import { getProducts } from "../../services/productService";
import {
    Package, MousePointerClick, TrendingUp, Star,
    Clock, Tag,
} from "lucide-react";

export default function Overview() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const totalProducts = products.length;
    const totalClicks = products.reduce((s, p) => s + (p.clicks || 0), 0);
    const avgClicks = totalProducts > 0 ? (totalClicks / totalProducts).toFixed(1) : 0;
    const topClicks = products.reduce((max, p) => Math.max(max, p.clicks || 0), 0);

    const topProducts = [...products]
        .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 6);

    const recentProducts = products.slice(0, 5); // already sorted newest-first

    const statCards = [
        {
            label: "Total Products",
            value: totalProducts,
            icon: Package,
            bg: "bg-violet-50",
            iconColor: "text-violet-600",
            border: "border-violet-100",
        },
        {
            label: "Total Clicks",
            value: totalClicks,
            icon: MousePointerClick,
            bg: "bg-blue-50",
            iconColor: "text-blue-600",
            border: "border-blue-100",
        },
        {
            label: "Avg Clicks / Product",
            value: avgClicks,
            icon: TrendingUp,
            bg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            border: "border-emerald-100",
        },
        {
            label: "Most Clicked",
            value: topClicks,
            icon: Star,
            bg: "bg-amber-50",
            iconColor: "text-amber-600",
            border: "border-amber-100",
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-800">Overview</h1>
                <p className="text-slate-500 text-sm mt-0.5">Dashboard summary and product analytics</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map(({ label, value, icon: Icon, bg, iconColor, border }) => (
                    <div key={label} className={`bg-white rounded-2xl p-4 border ${border} shadow-sm`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
                            <Icon size={20} className={iconColor} />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-800">
                            {loading ? <span className="inline-block w-8 h-5 bg-slate-200 rounded animate-pulse" /> : value}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Clicked Products */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
                        <MousePointerClick size={16} className="text-violet-500" />
                        <h2 className="font-semibold text-slate-700 text-sm">Top Clicked Products</h2>
                    </div>

                    {loading ? (
                        <div className="divide-y divide-slate-50">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
                                    <div className="w-5 h-4 bg-slate-100 rounded" />
                                    <div className="w-10 h-10 rounded-lg bg-slate-100" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 bg-slate-100 rounded w-3/4" />
                                        <div className="h-2.5 bg-slate-50 rounded w-1/2" />
                                    </div>
                                    <div className="w-16 h-5 bg-slate-100 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : topProducts.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-sm">No products yet.</div>
                    ) : (
                        <div className="divide-y divide-slate-50/60">
                            {topProducts.map((p, i) => (
                                <div key={p.productId} className="flex items-center gap-3 px-5 py-3">
                                    <span className={`text-xs font-bold w-5 text-center ${i === 0 ? "text-amber-500" : "text-slate-300"}`}>
                                        #{i + 1}
                                    </span>
                                    <img
                                        src={p.images?.[0] || "https://placehold.co/40x40?text=?"}
                                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                                        alt=""
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 text-sm truncate">{p.productName}</p>
                                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                            <Tag size={10} /> {p.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-violet-50 text-violet-600 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                                        <MousePointerClick size={11} />
                                        {p.clicks || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Products */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" />
                        <h2 className="font-semibold text-slate-700 text-sm">Recently Added</h2>
                    </div>

                    {loading ? (
                        <div className="divide-y divide-slate-50">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 bg-slate-100 rounded w-3/4" />
                                        <div className="h-2.5 bg-slate-50 rounded w-1/3" />
                                    </div>
                                    <div className="w-14 h-4 bg-slate-100 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : recentProducts.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-sm">No products yet.</div>
                    ) : (
                        <div className="divide-y divide-slate-50/60">
                            {recentProducts.map((p) => (
                                <div key={p.productId} className="flex items-center gap-3 px-5 py-3">
                                    <img
                                        src={p.images?.[0] || "https://placehold.co/40x40?text=?"}
                                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                                        alt=""
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 text-sm truncate">{p.productName}</p>
                                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                            <Tag size={10} /> {p.category}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-violet-600 flex-shrink-0">
                                        RM {Number(p.price).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
