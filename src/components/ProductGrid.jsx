import ProductCard from "./ProductCard";
import { PackageOpen } from "lucide-react";

export default function ProductGrid({ products }) {
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500" style={bodyStyle}>
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100 shadow-sm">
                    <PackageOpen size={36} strokeWidth={1.5} className="text-gray-400" />
                </div>
                <p className="text-xl font-semibold text-[#111111] mb-2" style={headingStyle}>
                    No products found
                </p>
                <p className="text-sm text-gray-400">Try a different category or check back later.</p>
            </div>
        );
    }

    return (
        /* Changed to grid-cols-2 for mobile, with a smaller gap-4 to prevent squishing */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
            {products.map((product, i) => (
                <div 
                    key={product.productId} 
                    className="animate-fade-in-up h-full flex"
                    style={{ animationDelay: `${i * 50}ms` }}
                >
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}