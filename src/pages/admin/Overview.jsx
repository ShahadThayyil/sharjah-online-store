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
        .slice(0, 5);

    const recentProducts = products.slice(0, 5); 

    // ─── CHART DATA ───────────────────────────────────────────────────────────
    const barChartData = topProducts.map(p => ({
        name: p.productName.length > 12 ? p.productName.substring(0, 12) + '...' : p.productName,
        clicks: p.clicks || 0
    }));

    const categoryCounts = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    
    const pieChartData = Object.keys(categoryCounts).map(key => ({
        name: key,
        value: categoryCounts[key]
    }));
    
    // Editorial Theme colors for Pie Chart (Graphite, Crimson, and warm grays)
    const PIE_COLORS = ['#18181B', '#C8102E', '#4A4A4A', '#9CA3AF', '#D1D5DB'];

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
                <div className="bg-white/90 backdrop-blur-md border border-gray-100 p-4 rounded-2xl shadow-xl text-sm" style={bodyStyle}>
                    <p className="font-extrabold text-[#18181B] mb-1">{payload[0].payload.name}</p>
                    <p className="text-[#C8102E] font-bold">{payload[0].value} Clicks</p>
                </div>
            );
        }
        return null;
    };

    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md border border-gray-100 p-4 rounded-2xl shadow-xl text-sm" style={bodyStyle}>
                    <p className="font-extrabold text-[#18181B] mb-1">{payload[0].name}</p>
                    <p className="text-gray-600 font-medium">{payload[0].value} Products</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-[#F4F4F5] text-[#18181B] pb-12" style={bodyStyle}>
            {/* Custom Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
                .delay-300 { animation-delay: 300ms; }
            `}</style>

            {/* Header */}
            <div className="mb-10 animate-fade-in-up pt-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight" style={headingStyle}>Store Analytics.</h1>
                <p className="text-gray-500 text-sm sm:text-base mt-2">Performance metrics and inventory overview.</p>
            </div>

            {/* ─── STAT CARDS ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 animate-fade-in-up delay-100">
                {statCards.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-[#F4F4F5] text-gray-500 group-hover:bg-[#18181B] group-hover:text-white transition-colors duration-300">
                            <Icon size={22} />
                        </div>
                        <p className="text-3xl md:text-4xl font-extrabold text-[#18181B] tracking-tight mb-1" style={headingStyle}>
                            {loading ? <Loader2 size={28} className="animate-spin text-gray-300" /> : value}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider">{label}</p>
                    </div>
                ))}
            </div>

            {/* ─── CHARTS SECTION ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 animate-fade-in-up delay-200">
                
                {/* Bar Chart */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 lg:p-8 lg:col-span-2">
                    <h2 className="font-extrabold text-xl text-[#18181B] mb-8 tracking-tight" style={headingStyle}>Engagement by Product</h2>
                    {loading ? (
                        <div className="h-[300px] flex items-center justify-center text-gray-400"><Loader2 size={30} className="animate-spin" /></div>
                    ) : barChartData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">Not enough data</div>
                    ) : (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9CA3AF', fontWeight: 600}} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis tick={{fontSize: 12, fill: '#9CA3AF', fontWeight: 600}} axisLine={false} tickLine={false} dx={-10} />
                                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#F9FAFB', radius: 8 }} />
                                    <Bar dataKey="clicks" fill="#18181B" radius={[8, 8, 0, 0]} animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 lg:p-8">
                    <h2 className="font-extrabold text-xl text-[#18181B] mb-4 tracking-tight" style={headingStyle}>Inventory Split</h2>
                    {loading ? (
                        <div className="h-[300px] flex items-center justify-center text-gray-400"><Loader2 size={30} className="animate-spin" /></div>
                    ) : pieChartData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">Not enough data</div>
                    ) : (
                        <div className="h-[300px] w-full flex flex-col items-center justify-center">
                            <ResponsiveContainer width="100%" height="75%">
                                <PieChart>
                                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none" animationDuration={1500}>
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Legend */}
                            <div className="flex flex-wrap justify-center gap-4 mt-6">
                                {pieChartData.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
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
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-50 flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-full text-[#C8102E]">
                            <MousePointerClick size={18} />
                        </div>
                        <h2 className="font-extrabold text-[#18181B] text-lg tracking-tight" style={headingStyle}>Top Clicked</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-400"><Loader2 size={24} className="animate-spin mx-auto" /></div>
                    ) : topProducts.length === 0 ? (
                        <div className="py-16 text-center text-gray-400 text-sm font-medium">No engagement data yet.</div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {topProducts.map((p, i) => (
                                <div key={p.productId} className="flex items-center gap-4 px-6 py-5 hover:bg-[#F4F4F5]/50 transition-colors group">
                                    <span className={`text-sm font-extrabold w-5 text-center ${i === 0 ? "text-[#C8102E]" : "text-gray-300"}`}>
                                        {i + 1}
                                    </span>
                                    {/* FIX: Using coverImage first, then fallback */}
                                    <img
                                        src={p.coverImage || p.images?.[0] || "https://placehold.co/80x80?text=No+Image"}
                                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                                        alt={p.productName}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[#18181B] text-sm sm:text-base truncate group-hover:text-[#C8102E] transition-colors">{p.productName}</p>
                                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
                                            <Tag size={12} className="text-gray-400" /> {p.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-[#F4F4F5] text-[#18181B] text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0">
                                        <MousePointerClick size={12} className="text-gray-500" />
                                        {p.clicks || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recently Added List */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-50 flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                            <Clock size={18} />
                        </div>
                        <h2 className="font-extrabold text-[#18181B] text-lg tracking-tight" style={headingStyle}>Recently Added</h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-400"><Loader2 size={24} className="animate-spin mx-auto" /></div>
                    ) : recentProducts.length === 0 ? (
                        <div className="py-16 text-center text-gray-400 text-sm font-medium">No products uploaded yet.</div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentProducts.map((p) => (
                                <div key={p.productId} className="flex items-center gap-4 px-6 py-5 hover:bg-[#F4F4F5]/50 transition-colors group">
                                    {/* FIX: Using coverImage first, then fallback */}
                                    <img
                                        src={p.coverImage || p.images?.[0] || "https://placehold.co/80x80?text=No+Image"}
                                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                                        alt={p.productName}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[#18181B] text-sm sm:text-base truncate group-hover:text-[#C8102E] transition-colors">{p.productName}</p>
                                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-1">
                                            <Tag size={12} className="text-gray-400" /> {p.category}
                                        </span>
                                    </div>
                                    <span className="text-sm sm:text-base font-extrabold text-[#18181B] flex-shrink-0 tracking-tight">
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