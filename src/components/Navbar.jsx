import { Link } from "react-router-dom";
import { ShoppingBag, MessageCircle } from "lucide-react";

export default function Navbar() {
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };

    return (
        <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-gray-100 shadow-sm">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                
                {/* ─── Left Side: Store Logo ─── */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-[#111111] hover:opacity-80 transition-opacity" style={headingStyle}>
                    <div className="bg-[#2563EB] text-white p-1.5 rounded-lg shadow-sm">
                        <ShoppingBag size={20} />
                    </div>
                    sharjah Mobiles
                </Link>

                {/* ─── Right Side: CTA Button ─── */}
                <div className="flex items-center gap-3 shrink-0">
                    
                    {/* Support / WhatsApp Button */}
                    <a 
                        href="https://wa.me/60123456789" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        style={headingStyle}
                    >
                        <MessageCircle size={16} className="text-white" />
                        <span>Support</span>
                    </a>
                    
                </div>

            </div>
        </header>
    );
}