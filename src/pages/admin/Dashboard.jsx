import { Routes, Route, NavLink, Link, Navigate, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import {
    LayoutDashboard, Package, LogOut, Store
} from "lucide-react";
import Overview from "./Overview";
import Products from "./Products";

const NAV_ITEMS = [
    { to: "overview", icon: LayoutDashboard, label: "Overview" },
    { to: "products", icon: Package, label: "Products" },
];

export default function AdminDashboard() {
    const navigate = useNavigate();

    // Theme Fonts
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    async function handleSignOut() {
        await signOut(auth);
        navigate("/admin/login", { replace: true });
    }

    // ─── EDITORIAL SIDEBAR STYLES ──────────────────────────────────────
    const sidebarLinkClass = ({ isActive }) =>
        `flex items-center gap-4 px-5 py-3.5 rounded-full text-sm font-bold transition-all duration-300 ${
            isActive
                ? "bg-[#18181B] text-white shadow-lg shadow-[#18181B]/10 scale-[1.02]"
                : "text-gray-500 hover:bg-gray-100 hover:text-[#18181B]"
        }`;

    // ─── EDITORIAL MOBILE BOTTOM NAV STYLES ────────────────────────────
    const bottomLinkClass = ({ isActive }) =>
        `flex flex-col items-center justify-center w-full py-3 transition-colors duration-300 ${
            isActive 
                ? "text-[#C8102E]" 
                : "text-gray-400 hover:text-[#18181B]"
        }`;

    return (
        <div className="min-h-screen bg-[#F4F4F5] flex selection:bg-[#C8102E] selection:text-white" style={bodyStyle}>

            {/* ─── DESKTOP SIDEBAR (md+) ─────────────────────────────── */}
            <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                
                {/* Logo Section */}
                <div className="flex items-center gap-3 px-8 py-8 border-b border-gray-50">
                    {/* Replace "/your-logo.jpg" with the actual path to your logo image 
                        (e.g., imported at the top, or placed in your public folder)
                    */}
                    <img 
                        src="/your-logo.jpg" 
                        alt="Sharjah Mobiles Logo" 
                        className="w-10 h-10 object-contain rounded-lg"
                        onError={(e) => { e.target.style.display = 'none'; }} // Hides if image not found yet
                    />
                    <div>
                        <p className="font-extrabold text-[#18181B] leading-tight text-xl tracking-tight" style={headingStyle}>
                            Sharjah Mobiles.
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Admin Control</p>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-5 py-8 space-y-2">
                    <p className="px-4 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-4">Menu</p>
                    {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                        <NavLink key={to} to={to} className={sidebarLinkClass}>
                            <Icon size={18} strokeWidth={2.5} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Divider + Bottom Actions */}
                <div className="px-5 py-6 border-t border-gray-50 space-y-2 bg-gray-50/50">
                    <Link to="/" className="flex items-center gap-4 px-5 py-3.5 w-full rounded-full text-sm font-bold text-gray-600 hover:bg-white hover:shadow-sm hover:text-[#18181B] transition-all">
                        <Store size={18} strokeWidth={2.5} />
                        View Storefront
                    </Link>
                    <button onClick={handleSignOut} className="flex items-center gap-4 px-5 py-3.5 w-full rounded-full text-sm font-bold text-[#C8102E] hover:bg-red-50 transition-all text-left">
                        <LogOut size={18} strokeWidth={2.5} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ─── MAIN CONTENT AREA ─────────────────────────────────── */}
            <div className="flex-1 md:ml-72 flex flex-col min-h-screen pb-20 md:pb-0">

                {/* Mobile top header (Static Branding) */}
                <header className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-gray-100 px-5 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/your-logo.jpg" 
                            alt="Logo" 
                            className="w-8 h-8 object-contain rounded-md"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <span className="font-extrabold text-[#18181B] text-lg tracking-tight" style={headingStyle}>Admin.</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-0 md:p-8">
                    <Routes>
                        <Route index element={<Navigate to="overview" replace />} />
                        <Route path="overview" element={<Overview />} />
                        <Route path="products" element={<Products />} />
                    </Routes>
                </main>
            </div>

            {/* ─── MOBILE BOTTOM NAV ──────────────────────────── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex z-40 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
                
                {/* Standard Nav Items */}
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                    <NavLink key={to} to={to} className={bottomLinkClass}>
                        <Icon size={20} strokeWidth={2.5} className="mb-1" />
                        <span className="text-[10px] font-bold tracking-wide">{label}</span>
                    </NavLink>
                ))}

                {/* View Shop Action */}
                <Link to="/" className="flex flex-col items-center justify-center w-full py-3 text-gray-400 hover:text-[#18181B] transition-colors duration-300">
                    <Store size={20} strokeWidth={2.5} className="mb-1" />
                    <span className="text-[10px] font-bold tracking-wide">Shop</span>
                </Link>

                {/* Logout Action */}
                <button onClick={handleSignOut} className="flex flex-col items-center justify-center w-full py-3 text-[#C8102E]/70 hover:text-[#C8102E] transition-colors duration-300">
                    <LogOut size={20} strokeWidth={2.5} className="mb-1" />
                    <span className="text-[10px] font-bold tracking-wide">Exit</span>
                </button>

            </nav>
        </div>
    );
}