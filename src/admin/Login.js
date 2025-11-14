import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("userData", JSON.stringify(res.data.user));
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">

        {/* ★ Animated neon floating blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="neon-circle top-[10%] left-[15%] w-72 h-72 bg-gradient-to-r from-purple-600 to-pink-500"></div>
          <div className="neon-circle top-[60%] right-[5%] w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-400 animation-delay-2000"></div>
          <div className="neon-circle bottom-[10%] left-[40%] w-64 h-64 bg-gradient-to-r from-indigo-500 to-purple-600 animation-delay-4000"></div>

          {/* floating particles */}
          <div className="floating-particle"></div>
          <div className="floating-particle animation-delay-2000"></div>
          <div className="floating-particle animation-delay-4000"></div>
        </div>

        {/* Center Card */}
        <div className="relative w-full max-w-md z-20">
          <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 relative overflow-hidden">

            {/* Glow ring behind card */}
            <div className="absolute inset-0 m-auto w-[350px] h-[350px] rounded-full bg-gradient-to-r from-purple-600 to-blue-500 opacity-20 blur-3xl"></div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-white text-center tracking-wider mb-8 drop-shadow">
                Welcome Back ✦
              </h2>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="text-sm text-gray-300">Email</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-3 pl-12 pr-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 outline-none transition"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm text-gray-300">Password</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-3 pl-12 pr-12 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 outline-none transition"
                      placeholder="••••••••"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-pink-500" />
                    Remember me
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-pink-500/30 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>

              <p className="text-center text-gray-500 text-xs mt-8">
                © {new Date().getFullYear()} Udavin Wijesundara . All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        .neon-circle {
          position: absolute;
          border-radius: 9999px;
          opacity: 0.35;
          filter: blur(90px);
          animation: floatBlob 14s infinite ease-in-out;
        }
        
        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.2); }
          66% { transform: translate(-30px, 40px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .floating-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          opacity: 0.15;
          border-radius: 50%;
          animation: particleFloat 10s infinite linear;
          top: 50%;
          left: 50%;
        }

        @keyframes particleFloat {
          0% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(200px, -150px) scale(0.5); opacity: 0.05; }
          100% { transform: translate(-200px, 200px) scale(1); opacity: 0.15; }
        }

        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.4s ease; }
      `}</style>
    </form>
  );
}
