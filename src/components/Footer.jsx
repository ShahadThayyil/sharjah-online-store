import { ShoppingBag, Mail, MapPin, MessageCircle } from "lucide-react";

// Set your store's WhatsApp number here (include country code, no '+' or spaces)
const OWNER_PHONE = "919876543210";

export default function Footer() {
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    return (
        <footer className="bg-[#111111] text-white pt-16 pb-8 mt-auto">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
                
                {/* ─── Main Footer Content ─── */}
                <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
                    
                    {/* ─── Brand Section ─── */}
                    <div className="flex flex-col gap-4 md:max-w-md">
                        <div className="flex items-center gap-2 font-bold text-xl text-white" style={headingStyle}>
                            <div className="bg-[#2563EB] text-white p-1.5 rounded-lg shadow-sm">
                                <ShoppingBag size={20} />
                            </div>
                            Your Store Name
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed" style={bodyStyle}>
                            Premium quality products with minimal, professional design. Delivered straight to your door with seamless customer support.
                        </p>
                    </div>

                    {/* ─── Contact Section & CTA ─── */}
                    <div className="flex flex-col gap-5 md:min-w-[300px]">
                        <h4 className="text-lg font-semibold text-white tracking-wide" style={headingStyle}>
                            Get in Touch
                        </h4>
                        
                        <ul className="flex flex-col gap-4 text-sm text-gray-400 mb-2" style={bodyStyle}>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-[#2563EB] shrink-0" />
                                <a href="mailto:support@yourstore.com" className="hover:text-white transition-colors">
                                    support@yourstore.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#2563EB] shrink-0 mt-0.5" />
                                <span className="leading-relaxed">
                                    Moonniyur, Kerala<br/>
                                    India
                                </span>
                            </li>
                        </ul>

                        {/* Single Call to Action Button */}
                        <a 
                            href={`https://wa.me/${OWNER_PHONE}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 w-fit bg-[#2563EB] hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            style={headingStyle}
                        >
                            <MessageCircle size={18} />
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>

                {/* ─── Bottom Copyright & Developer Info ─── */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500" style={bodyStyle}>
                    <p>
                        © {new Date().getFullYear()} Your Store Name. All rights reserved.
                    </p>
                    <p className="font-medium">
                        Developed by <span className="text-white font-bold tracking-wide" style={headingStyle}>Vynx Webworks</span>
                    </p>
                </div>
                
            </div>
        </footer>
    );
}