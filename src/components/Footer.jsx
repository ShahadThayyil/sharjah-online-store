import { ShoppingBag, Mail, MapPin, MessageCircle, ArrowUpRight } from "lucide-react";

// Set your store's WhatsApp number here (include country code, no '+' or spaces)
const OWNER_PHONE = "919633060181";

export default function Footer() {
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    return (
        // Added massive top rounded corners to mimic an app-sheet or bento card
        <footer className="bg-[#18181B] text-white pt-20 pb-8 mt-auto rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-2xl relative overflow-hidden">
            
            {/* Subtle background glow effect using your Crimson Red */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8102E] opacity-10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 relative z-10">
                
                {/* ─── Main Footer Content ─── */}
                <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
                    
                    {/* ─── Brand Section (Editorial Left) ─── */}
                    <div className="flex flex-col gap-6 lg:max-w-lg">
                        
                        <div
  className="flex items-center gap-3 font-extrabold text-2xl md:text-3xl tracking-tight text-white group"
  style={headingStyle}
>
  <div className=" shadow-md  transition-colors duration-300">
    <img
      src="https://res.cloudinary.com/dmtzmgbkj/image/upload/f_webp/v1773242316/Gemini_Generated_Image_z1zngsz1zngsz1zn_h80z4b.png"   // your logo path
      alt="Sharjah Logo"
      className="w-12 h-12 object-contain rounded-full"
    />
  </div>

  Sharjah Online Store.
</div>
                        
                        <h3 className="text-3xl md:text-4xl font-bold text-white/90 leading-tight mt-4" style={headingStyle}>
    Discover the latest <br /> watches & gadgets.
</h3>

<p className="text-base text-gray-400 leading-relaxed mt-2" style={bodyStyle}>
    Shop stylish watches, electronics gadgets, and trending products at the best prices. 
    Quality products, simple shopping, and fast delivery.
</p>
                    </div>

                    {/* ─── Contact Section & CTA (Editorial Right) ─── */}
                    <div className="flex flex-col gap-8 lg:min-w-[350px]">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest" style={headingStyle}>
                            Get in Touch
                        </h4>
                        
                        <ul className="flex flex-col gap-6 text-base text-gray-300" style={bodyStyle}>
                            <li>
                                <a href="mailto:onlinestoresharjah@gmail.com" className="group flex items-center gap-4 w-fit">
                                    <div className="bg-white/5 p-3 rounded-full group-hover:bg-[#C8102E] group-hover:text-white transition-colors duration-300">
                                        <Mail size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="group-hover:text-white transition-colors">onlinestoresharjah@gmail.com</span>
                                </a>
                            </li>
                            
                            <li className="flex items-start gap-4">
                                <div className="bg-white/5 p-3 rounded-full mt-1">
                                    <MapPin size={20} className="text-gray-400" />
                                </div>
                                <span className="leading-relaxed mt-1 text-gray-400">
                                    Valanchery, Kerala<br/>
                                    <span className="text-white font-medium">India</span>
                                </span>
                            </li>
                        </ul>

                        {/* Massive, Premium Call to Action Button */}
                        <a 
                            href={`https://wa.me/${OWNER_PHONE}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between px-8 py-4 mt-4 w-full sm:w-fit bg-white hover:bg-[#C8102E] text-[#18181B] hover:text-white rounded-full text-sm font-extrabold uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#C8102E]/20 hover:-translate-y-1"
                            style={headingStyle}
                        >
                            <span className="flex items-center gap-3">
                                <MessageCircle size={20} />
                                Chat on WhatsApp
                            </span>
                            <ArrowUpRight size={18} className="ml-6 opacity-50 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300" />
                        </a>
                    </div>
                </div>

                {/* ─── Bottom Copyright & Developer Info ─── */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500" style={bodyStyle}>
                    <p>
                        © {new Date().getFullYear()} Sharjah Online Store. All rights reserved.
                    </p>
                    
                    {/* Sleek developer credit */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                        <span className="text-xs">Developed by</span>
                        <a href="https://wa.me/919847512024" className="font-bold text-white hover:text-[#C8102E] transition-colors tracking-wide" style={headingStyle}>
                            Vynx Webworks
                        </a>
                    </div>
                </div>
                
            </div>
        </footer>
    );
}