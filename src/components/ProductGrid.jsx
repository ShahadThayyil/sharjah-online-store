import ProductCard from "./ProductCard";
import { PackageOpen } from "lucide-react";

export default function ProductGrid({ products }) {
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    if (!products || products.length === 0) {
        return (
            // ─── Editorial Glassmorphism Empty State ───
            <div className="flex flex-col items-center justify-center py-32 px-4 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-6 text-center transition-all duration-300" style={bodyStyle}>
                
                <div className="w-24 h-24 bg-[#F4F4F5] rounded-full flex items-center justify-center mx-auto mb-6 group transition-transform duration-500 hover:scale-105">
                    <PackageOpen size={40} strokeWidth={1.5} className="text-[#C8102E] opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <p className="text-2xl font-extrabold text-[#18181B] mb-3 tracking-tight" style={headingStyle}>
                    Nothing matches your criteria.
                </p>
                
                <p className="text-base text-gray-500 max-w-md leading-relaxed">
                    We couldn't find any products matching your current filters. Try adjusting your search or clearing your selections to explore more.
                </p>
            </div>
        );
    }

    return (
        /* ─── Editorial Grid Layout ─── */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 xl:gap-x-8 xl:gap-y-12">
            {products.map((product) => (
                <div 
                    key={product.productId} 
                    className="h-full flex product-card-wrapper" 
                    /* 👆 REMOVED the opacity-0 translate-y-8 from here! */
                >
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}