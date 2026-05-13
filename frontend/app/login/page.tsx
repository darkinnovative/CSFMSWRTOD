"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AlertCircle, Loader } from "lucide-react";
import { getErrorMessage } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      // Store token and user info in localStorage
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 md:px-6 relative overflow-hidden pcb-pattern">
      {/* Animated background elements */}
      <div className="absolute top-20 right-20 w-52 md:w-72 h-52 md:h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute -bottom-8 left-20 w-52 md:w-72 h-52 md:h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 right-40 w-40 md:w-52 h-40 md:h-52 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{animationDelay: '1s'}}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-cyan-500/30 rounded-xl shadow-2xl p-6 md:p-8 hover:border-cyan-500/60 transition-all duration-300 backdrop-blur-sm animate-slideInUp pcb-pattern relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8 animate-slideInDown relative z-10">
            <div className="inline-block mb-4 p-2 md:p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg animate-circuit-glow">
              <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Dark Innovative</h1>
            <p className="text-sm md:text-base text-slate-400 animate-fadeInUp">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg flex items-start gap-3 animate-shake">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyan-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:border-cyan-500/50"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-400 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-slate-700 border-cyan-500/30 rounded transition-all duration-300 cursor-pointer hover:scale-110 accent-cyan-500"
                />
                Remember me
              </label>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2 transform hover:scale-105 hover:-translate-y-0.5"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">Demo credentials</span>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-2 text-center text-sm relative z-10">
            <p className="text-slate-400">Try these demo credentials:</p>
            <div className="bg-slate-700/50 p-3 rounded-lg text-slate-300 text-xs space-y-1 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 cursor-pointer group camera-grid">
              <p><strong>Email:</strong> <span className="font-mono text-cyan-300 group-hover:text-cyan-200 transition-colors">admin@eyes.com</span></p>
              <p><strong>Password:</strong> <span className="font-mono text-cyan-300 group-hover:text-cyan-200 transition-colors">password</span></p>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-slate-400 relative z-10">
            Don't have an account?{" "}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 font-semibold hover:translate-x-1 inline-block">
              Sign up
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center relative z-10">
          <Link href="/" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 text-sm hover:translate-x-1 inline-flex items-center gap-1">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
