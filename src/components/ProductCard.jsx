import { Link } from "react-router-dom";
import { Tag, ArrowRight } from "lucide-react";

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
            // Modern Hover
            className="group flex flex-col w-full h-full bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]"
        >
            {/* Image Box */}
            <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden flex items-center justify-center">
                <img 
                    src={thumbnail} 
                    alt={productName}
                    // Smooth, modern slow-zoom on hover
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                />
                
                {/* Category Tag - hidden on extra small screens to save space, visible otherwise */}
                {category && (
                    <span 
                        className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 bg-white/90 backdrop-blur-md text-[#111111] text-[9px] sm:text-[10px] font-bold px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-md shadow-sm uppercase tracking-wider"
                        style={headingStyle}
                    >
                        <Tag size={10} className="text-[#2563EB] hidden sm:block" /> 
                        <span className="truncate max-w-[60px] sm:max-w-none">{category}</span>
                    </span>
                )}

                {/* Desktop Hover Overlay: "Quick View" badge */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out hidden lg:flex justify-center pointer-events-none">
                    <span className="bg-white/95 backdrop-blur-sm text-[#111111] text-xs font-bold py-2 px-6 rounded-full shadow-lg" style={headingStyle}>
                        Quick View
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 p-2.5 sm:p-4 md:p-5">
                <h3 
                    className="font-bold text-[#111111] text-xs sm:text-base md:text-lg leading-snug line-clamp-1 mb-1 sm:mb-1.5 group-hover:text-[#2563EB] transition-colors duration-300"
                    style={headingStyle}
                >
                    {productName}
                </h3>
                
                {/* Description - Clamped to strictly 4 lines with ellipsis */}
                <p 
                    className="text-gray-500 text-[10px] sm:text-sm line-clamp-4 mb-3 sm:mb-4 leading-relaxed"
                    style={bodyStyle}
                >
                    {displayDesc}
                </p>
                
                {/* Price & Modern Action Arrow */}
                <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4 border-t border-gray-100">
                    <span 
                        className="text-[#111111] font-bold text-sm sm:text-lg md:text-xl tracking-tight"
                        style={headingStyle}
                    >
                        ₹{Number(price).toFixed(2)}
                    </span>
                    
                    {/* Modern circular arrow */}
                    <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                        <ArrowRight size={12} className="sm:w-4 sm:h-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}