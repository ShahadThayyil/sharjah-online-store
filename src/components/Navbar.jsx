import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-violet-600">
                    <ShoppingBag size={24} />
                    MyShop
                </Link>
                <nav className="flex items-center gap-4">
                    <Link to="/" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors">
                        Home
                    </Link>
                </nav>
            </div>
        </header>
    );
}
