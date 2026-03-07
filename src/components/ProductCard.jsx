import { Link } from "react-router-dom";
import { Tag, ArrowRight } from "lucide-react";

export default function ProductCard({ product }) {
    const { productId, productName, price, category, images, description } = product;
    const thumbnail = images?.[0] || "https://placehold.co/400x300?text=No+Image";

    return (
        <Link to={`/product/${productId}`}
            className="fade-up group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 hover:-translate-y-1 flex flex-col">

            <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
                <img src={thumbnail} alt={productName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 text-violet-600 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                    <Tag size={11} /> {category}
                </span>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-slate-800 text-base leading-snug line-clamp-1">{productName}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2 flex-1">{description}</p>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-violet-600 font-bold text-lg">RM {Number(price).toFixed(2)}</span>
                    <span className="flex items-center gap-1 text-xs text-violet-500 font-medium group-hover:gap-2 transition-all">
                        View <ArrowRight size={13} />
                    </span>
                </div>
            </div>
        </Link>
    );
}
