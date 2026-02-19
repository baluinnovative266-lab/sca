import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, BookOpen, Briefcase, GraduationCap, Shield } from 'lucide-react';
import axios from 'axios';

import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [twoFACode, setTwoFACode] = useState('');
    const [showTwoFA, setShowTwoFA] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verify2FA } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (showTwoFA) {
            const result = await verify2FA(formData.email, twoFACode);
            if (!result.success) {
                setError(result.error);
                setLoading(false);
            }
            return;
        }

        const result = await login(formData.email, formData.password);

        if (result.two_fa_required) {
            setShowTwoFA(true);
            setLoading(false);
            return;
        }

        if (!result.success) {
            const detail = result.error;
            if (Array.isArray(detail)) {
                setError(detail.map(e => e.msg).join(', '));
            } else if (typeof detail === 'object' && detail !== null) {
                setError(JSON.stringify(detail));
            } else {
                setError(detail || 'Login failed');
            }
        }
        setLoading(false);
    };

    // Animation variants for the floating icons
    const floatingIcon = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-5xl w-full min-h-[600px]">

                {/* Left Side - Animation & Branding */}
                <div className="md:w-1/2 bg-gradient-to-br from-primary to-orange-500 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    {/* Floating Animated Icons */}
                    <motion.div
                        variants={floatingIcon}
                        animate="animate"
                        className="absolute top-20 right-20 bg-white/20 backdrop-blur-md p-4 rounded-2xl"
                    >
                        <Briefcase size={32} className="text-white" />
                    </motion.div>
                    <motion.div
                        variants={floatingIcon}
                        animate="animate"
                        transition={{ delay: 2 }}
                        className="absolute bottom-40 left-10 bg-white/20 backdrop-blur-md p-4 rounded-2xl"
                    >
                        <GraduationCap size={32} className="text-white" />
                    </motion.div>

                    <div className="relative z-10">
                        <h1 className="text-4xl font-extrabold mb-4">Welcome Back!</h1>
                        <p className="text-white/80 text-lg">Your career journey continues here. Log in to access your personalized roadmap.</p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen size={20} />
                            <span className="font-bold">CareerSense AI</span>
                        </div>
                        <p className="text-xs text-white/60">© 2026 CareerSense. All rights reserved.</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
                    <p className="text-gray-500 mb-8">Enter your credentials to access your account.</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">


                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!showTwoFA ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                placeholder="name@example.com"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                            <input
                                                type="password"
                                                name="password"
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                placeholder="••••••••"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">2-Step Verification Code</label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="twoFACode"
                                            required
                                            maxLength={6}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center text-2xl font-bold tracking-widest"
                                            placeholder="000000"
                                            value={twoFACode}
                                            onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 text-center">Enter the 6-digit code from your authenticator app.</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">Remember me</label>
                                </div>
                                {!showTwoFA && (
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-primary hover:text-red-700">Forgot password?</a>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Verifying...' : (
                                    <>
                                        {showTwoFA ? 'Verify Code' : 'Login'} <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            {showTwoFA && (
                                <button
                                    type="button"
                                    onClick={() => setShowTwoFA(false)}
                                    className="w-full text-gray-500 text-sm font-medium hover:underline"
                                >
                                    Back to Login
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="mt-8 text-center text-gray-500">
                        Don't have an account?
                        <Link to="/register" className="text-primary font-bold ml-1 hover:underline">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
