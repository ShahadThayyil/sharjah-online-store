import { Link } from "react-router-dom";
import { Tag, ArrowRight } from "lucide-react";

export default function ProductCard({ product }) {
    const { productId, productName, price, category, images, description } = product;
    
    // Safely grab the first image or use a clean placeholder
    const thumbnail = images?.[0] || "https://placehold.co/400x500?text=No+Image";

    // Theme Fonts
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    // Format description safely in case it's saved as an array of bullet points
    const displayDesc = Array.isArray(description) ? description[0] : description;

    return (
        <Link 
            to={`/product/${productId}`}
            className="group bg-white rounded-sm overflow-hidden border border-gray-200 hover:border-[#2563EB] transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col"
        >
            {/* Image Section */}
            <div className="relative overflow-hidden aspect-[4/5] bg-gray-50">
                <img 
                    src={thumbnail} 
                    alt={productName}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
                />
                
                {/* Minimal Category Tag */}
                {category && (
                    <span 
                        className="absolute top-3 left-3 flex items-center gap-1.5 bg-white text-[#111111] text-xs font-medium px-2.5 py-1 rounded-sm shadow-sm"
                        style={headingStyle}
                    >
                        <Tag size={12} className="text-[#2563EB]" /> {category}
                    </span>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1 border-t border-gray-100">
                <h3 
                    className="font-semibold text-[#111111] text-base leading-snug line-clamp-1 group-hover:text-[#2563EB] transition-colors"
                    style={headingStyle}
                >
                    {productName}
                </h3>
                
                <p 
                    className="text-gray-500 text-sm mt-1.5 line-clamp-2 flex-1"
                    style={bodyStyle}
                >
                    {displayDesc}
                </p>
                
                {/* Price & Action */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <span 
                        className="text-[#111111] font-bold text-lg tracking-tight"
                        style={headingStyle}
                    >
                        ₹{Number(price).toFixed(2)}
                    </span>
                    <span 
                        className="flex items-center gap-1 text-sm text-[#2563EB] font-medium group-hover:gap-2 transition-all"
                        style={headingStyle}
                    >
                        View <ArrowRight size={14} />
                    </span>
                </div>
            </div>
        </Link>
    );
}