import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoadingScreen() {
    const containerRef = useRef(null);
    const spinnerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        // Lock scroll
        document.body.style.overflow = "hidden";

        const ctx = gsap.context(() => {
            // ─── INFINITE ROTATION ───
            gsap.to(spinnerRef.current, {
                rotation: 360,
                duration: 1,
                repeat: -1,
                ease: "none"
            });

            // ─── TEXT BREATHING ───
            gsap.fromTo(textRef.current, 
                { opacity: 0.3 }, 
                { opacity: 1, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut" }
            );
        });

        return () => {
            document.body.style.overflow = "";
            ctx.revert();
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="fixed inset-0 z-[999] bg-[#F4F4F5] flex flex-col items-center justify-center"
        >
            <div className="relative flex flex-col items-center gap-8">
                
                {/* ─── MINIMALIST SPINNER ─── */}
                <div className="relative w-16 h-16">
                    {/* Background Track */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-gray-200 opacity-30" />
                    
                    {/* Active Spinning Segment */}
                    <div 
                        ref={spinnerRef}
                        className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#C8102E] border-r-[#C8102E]/30"
                    />
                </div>

                {/* ─── SIMPLE TEXT ─── */}
                <div ref={textRef} className="flex flex-col items-center gap-2">
                    <p className="text-[11px] font-black text-[#18181B] uppercase tracking-[0.5em] ml-[0.5em]">
                        Loading
                    </p>
                    {/* Thin progress line accent */}
                    <div className="w-12 h-[1px] bg-[#C8102E]/20 overflow-hidden relative">
                        <div className="absolute inset-0 bg-[#C8102E] animate-loading-line" />
                    </div>
                </div>
            </div>

            {/* Custom Animation for the tiny accent line */}
            <style>{`
                @keyframes loadingLine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-loading-line {
                    animation: loadingLine 1.5s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}