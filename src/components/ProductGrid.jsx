import ProductCard from "./ProductCard";
import { PackageOpen } from "lucide-react";

export default function ProductGrid({ products }) {
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <PackageOpen size={48} strokeWidth={1.2} className="mb-4" />
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm">Try a different category or check back later.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
                <div key={product.productId} style={{ animationDelay: `${i * 60}ms` }}>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}
