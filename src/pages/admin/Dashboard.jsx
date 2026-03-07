import { useState } from "react";
import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import {
    LayoutDashboard, Package, LogOut, ShoppingBag, X, Menu,
} from "lucide-react";
import Overview from "./Overview";
import Products from "./Products";

const NAV_ITEMS = [
    { to: "overview", icon: LayoutDashboard, label: "Overview" },
    { to: "products", icon: Package, label: "Products" },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    async function handleSignOut() {
        await signOut(auth);
        navigate("/admin/login", { replace: true });
    }

    const sidebarLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
            ? "bg-violet-600 text-white shadow-sm shadow-violet-900/40"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`;

    const bottomLinkClass = ({ isActive }) =>
        `flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${isActive ? "text-violet-500" : "text-slate-500"
        }`;

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* ─── SIDEBAR (desktop md+) ─────────────────────────────── */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 min-h-screen fixed left-0 top-0 z-40">
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-white leading-none">MyShop</p>
                        <p className="text-xs text-slate-500 mt-0.5">Admin Panel</p>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                        <NavLink key={to} to={to} className={sidebarLinkClass}>
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Divider + Sign out */}
                <div className="px-3 py-4 border-t border-slate-800 space-y-1">
                    <a href="/"
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all">
                        <ShoppingBag size={18} />
                        View Shop
                    </a>
                    <button onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ─── MAIN CONTENT AREA ─────────────────────────────────── */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

                {/* Mobile top header */}
                <header className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                            <ShoppingBag size={14} className="text-white" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">MyShop Admin</span>
                    </div>
                    <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                        <Menu size={20} />
                    </button>
                </header>

                {/* Mobile slide-out menu */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 flex md:hidden">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                        <div className="relative w-72 bg-slate-900 h-full flex flex-col shadow-2xl">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                                        <ShoppingBag size={14} className="text-white" />
                                    </div>
                                    <span className="font-bold text-white">MyShop Admin</span>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            <nav className="flex-1 px-3 py-4 space-y-1">
                                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                                    <NavLink key={to} to={to} className={sidebarLinkClass} onClick={() => setMobileMenuOpen(false)}>
                                        <Icon size={18} />
                                        {label}
                                    </NavLink>
                                ))}
                            </nav>
                            <div className="px-3 py-4 border-t border-slate-800 space-y-1">
                                <a href="/" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all">
                                    <ShoppingBag size={18} /> View Shop
                                </a>
                                <button onClick={handleSignOut}
                                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all">
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
                    <Routes>
                        <Route index element={<Navigate to="overview" replace />} />
                        <Route path="overview" element={<Overview />} />
                        <Route path="products" element={<Products />} />
                    </Routes>
                </main>
            </div>

            {/* ─── BOTTOM NAV (mobile only) ──────────────────────────── */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 flex md:hidden z-40 safe-bottom">
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                    <NavLink key={to} to={to} className={bottomLinkClass}>
                        <Icon size={21} />
                        <span>{label}</span>
                    </NavLink>
                ))}
                <button onClick={handleSignOut} className="flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium text-slate-500">
                    <LogOut size={21} />
                    <span>Sign Out</span>
                </button>
            </nav>
        </div>
    );
}
