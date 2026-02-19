import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, BookOpen, Star, Award } from 'lucide-react';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/register', {
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name
            });
            navigate('/login');
        } catch (err) {
            console.error("Registration error:", err);
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setError(detail.map(e => e.msg).join(', '));
            } else if (typeof detail === 'object' && detail !== null) {
                setError(JSON.stringify(detail));
            } else {
                setError(detail || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    // Animation variants
    const floatingIcon = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, -5, 5, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row max-w-5xl w-full min-h-[650px]">

                {/* Left Side - Register Form */}
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                    <p className="text-gray-500 mb-8">Join CareerSense to unlock your potential.</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="John Doe"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Creating Account...' : (
                                <>Sign Up <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-500">
                        Already have an account?
                        <Link to="/login" className="text-primary font-bold ml-1 hover:underline">Log in</Link>
                    </div>
                </div>

                {/* Right Side - Animation & Branding */}
                <div className="md:w-1/2 bg-gradient-to-bl from-gray-900 to-gray-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    {/* Floating Animated Icons */}
                    <motion.div
                        variants={floatingIcon}
                        animate="animate"
                        className="absolute top-24 left-16 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20"
                    >
                        <Star size={32} className="text-yellow-400" />
                    </motion.div>
                    <motion.div
                        variants={floatingIcon}
                        animate="animate"
                        transition={{ delay: 1.5 }}
                        className="absolute bottom-32 right-12 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20"
                    >
                        <Award size={32} className="text-emerald-400" />
                    </motion.div>

                    <div className="relative z-10 text-right md:text-left">
                        <h1 className="text-4xl font-extrabold mb-4 text-white">Start Your Journey</h1>
                        <p className="text-gray-300 text-lg">Join a community of ambitious individuals finding their true calling with AI-powered insights.</p>
                    </div>

                    <div className="relative z-10 hidden md:block">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen size={20} />
                            <span className="font-bold">CareerSense AI</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
