import { useState, useEffect } from "react";
import { getProducts } from "../../services/productService";
import {
    Package, MousePointerClick, TrendingUp, Star,
    Clock, Tag, Loader2
} from "lucide-react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from "recharts";

export default function Overview() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Theme Fonts
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    useEffect(() => {
        getProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    // ─── DATA CALCULATIONS ────────────────────────────────────────────────────
    const totalProducts = products.length;
    const totalClicks = products.reduce((s, p) => s + (p.clicks || 0), 0);
    const avgClicks = totalProducts > 0 ? (totalClicks / totalProducts).toFixed(1) : 0;
    const topClicks = products.reduce((max, p) => Math.max(max, p.clicks || 0), 0);

    const topProducts = [...products]
        .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 5); // Top 5 for charts and lists

    const recentProducts = products.slice(0, 5); // Assuming already sorted newest-first

    // ─── CHART DATA ───────────────────────────────────────────────────────────
    const barChartData = topProducts.map(p => ({
        name: p.productName.length > 12 ? p.productName.substring(0, 12) + '...' : p.productName,
        clicks: p.clicks || 0
    }));

    // Group by category for Pie Chart
    const categoryCounts = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    
    const pieChartData = Object.keys(categoryCounts).map(key => ({
        name: key,
        value: categoryCounts[key]
    }));
    
    // Monochrome/Blue theme colors for Pie Chart
    const PIE_COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

    // ─── STAT CARDS CONFIG ────────────────────────────────────────────────────
    const statCards = [
        { label: "Total Products", value: totalProducts, icon: Package },
        { label: "Total Clicks", value: totalClicks, icon: MousePointerClick },
        { label: "Avg Clicks / Item", value: avgClicks, icon: TrendingUp },
        { label: "Most Clicked", value: topClicks, icon: Star },
    ];

    // ─── CUSTOM TOOLTIPS FOR CHARTS ───────────────────────────────────────────
    const CustomBarTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 p-3 rounded-sm shadow-lg text-sm" style={bodyStyle}>
                    <p className="font-semibold text-[#111111] mb-1">{payload[0].payload.name}</p>
                    <p className="text-[#2563EB] font-medium">{payload[0].value} Clicks</p>
                </div>
            );
        }
        return null;
    };

    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 p-3 rounded-sm shadow-lg text-sm" style={bodyStyle}>
                    <p className="font-semibold text-[#111111] mb-1">{payload[0].name}</p>
                    <p className="text-gray-600">{payload[0].value} Products</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={bodyStyle}>
            {/* Custom Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
                .delay-300 { animation-delay: 300ms; }
            `}</style>

            {/* Header */}
            <div className="mb-8 animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#111111]" style={headingStyle}>Dashboard Overview</h1>
                <p className="text-gray-500 text-sm mt-1">Analytics and performance metrics for your store.</p>
            </div>

            {/* ─── STAT CARDS ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 animate-fade-in-up delay-100">
                {statCards.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white rounded-sm p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="w-10 h-10 rounded-sm flex items-center justify-center mb-4 bg-blue-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                            <Icon size={20} />
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-[#111111]" style={headingStyle}>
                            {loading ? <Loader2 size={24} className="animate-spin text-gray-300" /> : value}
                        </p>
                        <p className="text-xs text-gray-500 mt-1.5 font-medium uppercase tracking-wide">{label}</p>
                    </div>
                ))}
            </div>

            {/* ─── CHARTS SECTION ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-fade-in-up delay-200">
                
                {/* Bar Chart */}
                <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 lg:col-span-2">
                    <h2 className="font-semibold text-[#111111] mb-6" style={headingStyle}>Top Performing Products</h2>
                    {loading ? (
                        <div className="h-[300px] flex items-center justify-center text-gray-400"><Loader2 size={30} className="animate-spin" /></div>
                    ) : barChartData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">Not enough data</div>
                    ) : (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                                    <YAxis tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#F3F4F6' }} />
                                    <Bar dataKey="clicks" fill="#2563EB" radius={[2, 2, 0, 0]} animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6">
                    <h2 className="font-semibold text-[#111111] mb-2" style={headingStyle}>Category Distribution</h2>
                    {loading ? (
                        <div className="h-[300px] flex items-center justify-center text-gray-400"><Loader2 size={30} className="animate-spin" /></div>
                    ) : pieChartData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">Not enough data</div>
                    ) : (
                        <div className="h-[300px] w-full flex flex-col items-center justify-center">
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none" animationDuration={1500}>
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Legend */}
                            <div className="flex flex-wrap justify-center gap-3 mt-2">
                                {pieChartData.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                                        {entry.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── LISTS SECTION ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-300">

                {/* Top Clicked Products List */}
                <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                        <MousePointerClick size={16} className="text-[#2563EB]" />
                        <h2 className="font-semibold text-[#111111] text-sm" style={headingStyle}>Top Clicked Products</h2>
                    </div>

                    {loading ? (
                        <div className="p-6 text-center text-gray-400"><Loader2 size={20} className="animate-spin mx-auto" /></div>
                    ) : topProducts.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">No products yet.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {topProducts.map((p, i) => (
                                <div key={p.productId} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <span className={`text-sm font-bold w-4 text-center ${i === 0 ? "text-[#2563EB]" : "text-gray-300"}`}>
                                        {i + 1}
                                    </span>
                                    <img
                                        src={p.images?.[0] || "https://placehold.co/40x40?text=?"}
                                        className="w-12 h-12 rounded-sm object-cover flex-shrink-0 border border-gray-200"
                                        alt=""
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[#111111] text-sm truncate">{p.productName}</p>
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                            <Tag size={10} /> {p.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-blue-50 text-[#2563EB] text-xs font-semibold px-3 py-1 rounded-sm flex-shrink-0">
                                        <MousePointerClick size={12} />
                                        {p.clicks || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recently Added List */}
                <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                        <Clock size={16} className="text-gray-500" />
                        <h2 className="font-semibold text-[#111111] text-sm" style={headingStyle}>Recently Added</h2>
                    </div>

                    {loading ? (
                        <div className="p-6 text-center text-gray-400"><Loader2 size={20} className="animate-spin mx-auto" /></div>
                    ) : recentProducts.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">No products yet.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {recentProducts.map((p) => (
                                <div key={p.productId} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <img
                                        src={p.images?.[0] || "https://placehold.co/40x40?text=?"}
                                        className="w-12 h-12 rounded-sm object-cover flex-shrink-0 border border-gray-200"
                                        alt=""
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[#111111] text-sm truncate">{p.productName}</p>
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                            <Tag size={10} /> {p.category}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#111111] flex-shrink-0">
                                        ₹{Number(p.price).toFixed(2)}
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