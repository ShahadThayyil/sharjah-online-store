import { Link } from "react-router-dom";
import { Tag, ArrowUpRight } from "lucide-react";

export default function ProductCard({ product }) {
    const { productId, productName, price, category, images, coverImage, description } = product;
    
    // Use coverImage first, fall back to first gallery image, then placeholder
    const thumbnail = coverImage || images?.[0] || "https://placehold.co/400x500?text=No+Image";

    // Theme Fonts
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    // Format description safely
    const displayDesc = Array.isArray(description) ? description.join(" ") : description;

    return (
        <Link 
            to={`/product/${productId}`}
            // ─── Responsive Padding & Radius ───
            // Mobile: p-2, rounded-3xl | Desktop: p-3, rounded-[2rem]
            className="group flex flex-col w-full h-full bg-white rounded-3xl sm:rounded-[2rem] p-2 sm:p-3 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(200,16,46,0.15)] cursor-pointer"
        >
            {/* ─── Inner Image Container ─── */}
            <div className="relative w-full aspect-[4/5] bg-[#F4F4F5] rounded-2xl sm:rounded-[1.5rem] overflow-hidden mb-3 sm:mb-4">
                <img 
                    src={thumbnail} 
                    alt={productName}
                    // Ultra-smooth, slow zoom
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" 
                />
                
                {/* Category Tag - Scales down for mobile */}
                {category && (
                    <span 
                        className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 bg-white/80 backdrop-blur-md text-[#18181B] text-[9px] sm:text-[10px] font-extrabold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-widest transition-colors duration-300 group-hover:bg-white shadow-sm"
                        style={headingStyle}
                    >
                        <Tag size={10} className="text-[#C8102E] sm:w-3 sm:h-3" /> 
                        <span className="truncate max-w-[60px] sm:max-w-none">{category}</span>
                    </span>
                )}

                {/* Dark, sleek "View" pill on hover (Desktop Only) */}
                <div className="absolute inset-x-0 bottom-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out hidden lg:flex justify-center pointer-events-none">
                    <span className="bg-[#18181B]/95 backdrop-blur-sm text-white text-xs font-bold py-3 px-8 rounded-full shadow-xl tracking-wide uppercase" style={headingStyle}>
                        View Product
                    </span>
                </div>
            </div>

            {/* ─── Content Section ─── */}
            <div className="flex flex-col flex-1 px-1 sm:px-2 pb-1 sm:pb-2">
                
                {/* Title and Action Arrow */}
                <div className="flex items-start justify-between gap-2 sm:gap-4 mb-1 sm:mb-2">
                    <h3 
                        className="font-extrabold text-[#18181B] text-sm sm:text-base md:text-xl leading-snug line-clamp-2 group-hover:text-[#C8102E] transition-colors duration-300 tracking-tight"
                        style={headingStyle}
                    >
                        {productName}
                    </h3>
                    
                    {/* Modern diagonal arrow - shrinks on mobile so it doesn't crush the title */}
                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#F4F4F5] text-gray-400 shadow-none group-hover:bg-[#C8102E] group-hover:text-white group-hover:rotate-45 group-hover:shadow-md transition-all duration-300">
                        <ArrowUpRight size={14} strokeWidth={2.5} className="sm:w-4 sm:h-4" />
                    </div>
                </div>
                
                {/* Description */}
                <p 
                    className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3 sm:mb-4"
                    style={bodyStyle}
                >
                    {displayDesc}
                </p>
                
                {/* Price pinned to the bottom */}
                <div className="mt-auto pt-2 border-t border-gray-50">
                    <span 
                        className="text-[#18181B] font-extrabold text-base sm:text-lg md:text-xl tracking-tighter"
                        style={headingStyle}
                    >
                        ₹{Number(price).toFixed(2)}
                    </span>
                </div>
            </div>
        </Link>
    );
}