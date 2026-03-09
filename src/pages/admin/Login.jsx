import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowLeft, Mail, KeyRound, AlertCircle } from "lucide-react"; // Added AlertCircle

export default function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [checking, setChecking] = useState(true);

    // Theme Fonts
    const headingStyle = { fontFamily: "'Poppins', sans-serif" };
    const bodyStyle = { fontFamily: "'Open Sans', sans-serif" };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/admin/dashboard", { replace: true });
            } else {
                setChecking(false);
            }
        });

        return () => unsub();
    }, [navigate]);

    // Clear error when user starts typing
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError(""); // Instantly clear error state for better UX
    };

    if (checking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F4F4F5]" style={bodyStyle}>
                <Loader2 size={40} className="animate-spin text-[#18181B]" />
                <p className="text-sm font-bold tracking-widest uppercase text-gray-400">Verifying access...</p>
            </div>
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        
        // ─── 1. FRONTEND VALIDATION (Pre-flight checks) ───
        if (!form.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        // Basic Regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
            setError("Please enter a valid email address format.");
            return;
        }

        if (!form.password) {
            setError("Please enter your password.");
            return;
        }

        // ─── 2. FIREBASE AUTHENTICATION ───
        setLoading(true);

        try {
            await signInWithEmailAndPassword(
                auth,
                form.email.trim(),
                form.password
            );
            navigate("/admin/dashboard", { replace: true });
        } catch (err) {
            console.error("Auth Error:", err.code);
            
            // ─── 3. FIREBASE ERROR MAPPING ───
            switch (err.code) {
                case 'auth/invalid-credential':
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    setError("Invalid email or password. Please try again.");
                    break;
                case 'auth/too-many-requests':
                    setError("Too many failed attempts. Please try again later.");
                    break;
                case 'auth/invalid-email':
                    setError("The email address is improperly formatted.");
                    break;
                case 'auth/network-request-failed':
                    setError("Network error. Please check your internet connection.");
                    break;
                default:
                    setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#F4F4F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#C8102E] selection:text-white" style={bodyStyle}>
            
            {/* Custom Entrance Animation */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>

            <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
                
                {/* Branding Area */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <img 
                        src="/your-logo.jpg" 
                        alt="Logo" 
                        className="w-16 h-16 object-contain rounded-2xl mb-4 shadow-sm"
                        onError={(e) => { 
                            e.target.style.display = 'none'; 
                            e.target.nextSibling.style.display = 'flex'; // Show fallback shield
                        }} 
                    />
                    {/* Fallback Shield Icon if image fails/isn't set */}
                    <div className="hidden bg-[#18181B] p-4 rounded-[1rem] shadow-lg mb-4">
                        <ShieldCheck size={32} className="text-white" />
                    </div>

                    <h2 className="text-center text-3xl font-extrabold text-[#18181B] tracking-tight" style={headingStyle}>
                        Admin Portal.
                    </h2>
                    <p className="mt-2 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Authorized Personnel Only
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white py-10 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] sm:px-10 border border-gray-100">
                    
                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 transition-all">
                            <AlertCircle size={18} className="text-[#C8102E] shrink-0 mt-0.5" />
                            <p className="text-sm text-[#C8102E] font-medium leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        {/* Email Input */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className={`h-5 w-5 ${error ? "text-[#C8102E]" : "text-gray-400"}`} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`block w-full pl-12 pr-4 py-3.5 bg-[#F4F4F5] border rounded-full sm:text-sm font-medium text-[#18181B] transition-all outline-none ${
                                        error ? "border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20" : "border-transparent focus:ring-2 focus:ring-[#18181B]"
                                    }`}
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <KeyRound className={`h-5 w-5 ${error ? "text-[#C8102E]" : "text-gray-400"}`} />
                                </div>
                                <input
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`block w-full pl-12 pr-12 py-3.5 bg-[#F4F4F5] border rounded-full sm:text-sm font-medium text-[#18181B] transition-all outline-none ${
                                        error ? "border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20" : "border-transparent focus:ring-2 focus:ring-[#18181B]"
                                    }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#18181B] transition-colors"
                                >
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-full shadow-lg shadow-[#18181B]/10 text-sm font-bold text-white bg-[#18181B] hover:bg-[#C8102E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18181B] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Back to Storefront */}
                <div className="mt-8 flex justify-center">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#18181B] transition-colors uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} />
                        Return to Storefront
                    </a>
                </div>
            </div>
        </div>
    );
}