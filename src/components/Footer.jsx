import { ShoppingBag, Phone, MessageCircle } from "lucide-react";
import { OWNER_PHONE } from "../App";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 mt-16">
            <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center gap-2 text-white font-bold text-lg mb-2">
                        <ShoppingBag size={20} /> MyShop
                    </div>
                    <p className="text-sm text-slate-400">
                        Quality products delivered to your door. Order via WhatsApp or call!
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/" className="hover:text-violet-400 transition-colors">Home</a></li>
                        <li><a href="/admin" className="hover:text-violet-400 transition-colors">Admin Panel</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-3">Contact Us</h4>
                    <div className="flex flex-col gap-2 text-sm">
                        <a href={`https://wa.me/${OWNER_PHONE}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-green-400 transition-colors">
                            <MessageCircle size={16} /> WhatsApp Us
                        </a>
                        <a href={`tel:${OWNER_PHONE}`}
                            className="flex items-center gap-2 hover:text-violet-400 transition-colors">
                            <Phone size={16} /> Call Us
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-800 text-center text-xs text-slate-500 py-4">
                © {new Date().getFullYear()} MyShop. All rights reserved.
            </div>
        </footer>
    );
}
