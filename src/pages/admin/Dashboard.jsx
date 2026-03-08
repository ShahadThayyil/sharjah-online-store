import { Routes, Route, NavLink, Link, Navigate, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import {
    LayoutDashboard, Package, LogOut, ShoppingBag, Store
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

    const sidebarLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm transition-all duration-200 ${
            isActive
                ? "bg-blue-50 text-[#2563EB] font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#111111]"
        }`;

    const bottomLinkClass = ({ isActive }) =>
        `flex flex-col items-center justify-center w-full py-2 transition-colors ${
            isActive ? "text-[#2563EB]" : "text-gray-500 hover:text-[#111111]"
        }`;

    return (
        <div className="min-h-screen bg-gray-50 flex" style={bodyStyle}>

            {/* ─── DESKTOP SIDEBAR (md+) ─────────────────────────────── */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 z-40">
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-sm bg-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <ShoppingBag size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-[#111111] leading-tight text-lg" style={headingStyle}>Vynx Store</p>
                        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Admin Panel</p>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                        <NavLink key={to} to={to} className={sidebarLinkClass}>
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Divider + Bottom Actions */}
                <div className="px-4 py-6 border-t border-gray-100 space-y-1">
                    <Link to="/" className="flex items-center gap-3 px-4 py-2.5 w-full rounded-sm text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#111111] transition-colors">
                        <Store size={18} />
                        View Shop
                    </Link>
                    <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2.5 w-full rounded-sm text-sm font-medium text-[#FF6B6B] hover:bg-red-50 transition-colors text-left">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ─── MAIN CONTENT AREA ─────────────────────────────────── */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">

                {/* Mobile top header (Static Branding) */}
                <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-sm bg-[#2563EB] flex items-center justify-center">
                            <ShoppingBag size={14} className="text-white" />
                        </div>
                        <span className="font-bold text-[#111111] text-base" style={headingStyle}>Admin Panel</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-8">
                    <Routes>
                        <Route index element={<Navigate to="overview" replace />} />
                        <Route path="overview" element={<Overview />} />
                        <Route path="products" element={<Products />} />
                    </Routes>
                </main>
            </div>

            {/* ─── MOBILE BOTTOM NAV ──────────────────────────── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                
                {/* Standard Nav Items */}
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                    <NavLink key={to} to={to} className={bottomLinkClass}>
                        <Icon size={22} className="mb-1" />
                        <span className="text-[10px] font-medium">{label}</span>
                    </NavLink>
                ))}

                {/* View Shop Action */}
                <Link to="/" className="flex flex-col items-center justify-center w-full py-2 text-gray-500 hover:text-[#111111] transition-colors">
                    <Store size={22} className="mb-1" />
                    <span className="text-[10px] font-medium">Shop</span>
                </Link>

                {/* Logout Action */}
                <button onClick={handleSignOut} className="flex flex-col items-center justify-center w-full py-2 text-[#FF6B6B] hover:text-red-700 transition-colors">
                    <LogOut size={22} className="mb-1" />
                    <span className="text-[10px] font-medium">Exit</span>
                </button>

            </nav>
        </div>
    );
}