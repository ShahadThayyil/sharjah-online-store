import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
    const [user, setUser] = useState(undefined); // undefined = still checking

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return unsub;
    }, []);

    // Still checking auth state
    if (user === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 size={32} className="animate-spin text-violet-400" />
            </div>
        );
    }

    // Not logged in → redirect to login
    if (!user) return <Navigate to="/admin/login" replace />;

    // Authenticated
    return children;
}
