import { Link } from "react-router-dom";
import { MessageCircle, Instagram } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Navbar() {
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const navRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);

    // ─── SCROLL LISTENER FOR DYNAMIC BACKGROUND ──────────────────────────────
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ─── GSAP ENTRANCE ANIMATION ─────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(navRef.current.children,
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
            );
        });
        
        return () => ctx.revert();
    }, []);

    return (
        <header 
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
                isScrolled 
                ? "bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3" 
                : "bg-transparent border-b border-transparent shadow-none py-6"
            }`}
        >
            <div ref={navRef} className="max-w-[1500px] mx-auto px-4 sm:px-6 flex items-center justify-between">
                
                {/* ─── Left Side: Store Logo Image ─── */}
                <Link 
                    to="/" 
                    className="flex items-center group transition-all duration-300" 
                >
                    <div className="relative overflow-hidden rounded-xl  group-hover:-translate-y-0.5 transition-all duration-300">
                        {/* ✏️ Ensure IMG_9123.jpg is in your /public folder */}
                        <img 
                            src="https://res.cloudinary.com/dmtzmgbkj/image/upload/f_webp/v1773162908/Gemini_Generated_Image_cq83thcq83thcq83-removebg-preview_mdgrld.png" 
                            alt="Sharjah Mobiles Logo" 
                            className="h-10 w-auto md:h-18 object-contain"
                            onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Logo"; }}
                        />
                    </div>
                </Link>

                {/* ─── Right Side: Social & CTA ─── */}
                <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                    
                    {/* Sleek Editorial Instagram Pill */}
                    <a 
                        href="https://instagram.com/yourusername" 
                        target="_blank" 
                        rel="noreferrer"
                        className={`flex items-center gap-2 group p-1 pr-1 sm:pr-4 rounded-full transition-all duration-300 ${
                            isScrolled 
                            ? "bg-[#F4F4F5] hover:bg-white border border-transparent hover:border-gray-200" 
                            : "bg-white/50 hover:bg-white border border-transparent"
                        }`}
                    >
                        <div className="bg-white group-hover:bg-[#18181B] text-[#18181B] group-hover:text-white p-2.5 rounded-full transition-colors duration-300 shadow-sm">
                            <Instagram size={14} strokeWidth={2.5} />
                        </div>
                        <span 
                            className="hidden sm:block text-xs font-bold text-gray-500 group-hover:text-[#18181B] tracking-wide uppercase transition-colors duration-300"
                            style={headingStyle}
                        >
                            @sharjahmobiles
                        </span>
                    </a>

                    {/* Support Button */}
                    <a 
                        href="https://wa.me/60123456789" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 px-5 sm:px-6 py-3 bg-[#18181B] hover:bg-[#C8102E] text-white rounded-full text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#C8102E]/20 hover:-translate-y-0.5"
                        style={headingStyle}
                    >
                        <MessageCircle size={18} />
                        <span className="hidden min-[400px]:block">Support</span>
                    </a>
                    
                </div>
            </div>
        </header>
    );
}