import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, MessageSquare, LayoutDashboard, LifeBuoy, Home as HomeIcon, TrendingUp } from 'lucide-react';

const Footer = () => {
    const [textIndex, setTextIndex] = useState(0);
    const messages = [
        "Thank you for visiting CareerSense AI ✨",
        "Hope to see you again!",
        "Accelerate your career with AI 🚀"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % messages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const links = [
        { name: 'Home', path: '/', icon: <HomeIcon size={14} /> },
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={14} /> },
        { name: 'Roadmap', path: '/roadmap/overview', icon: <TrendingUp size={14} /> },
        { name: 'Community', path: '/community', icon: <MessageSquare size={14} /> },
        { name: 'Help Desk', path: '/help-desk', icon: <LifeBuoy size={14} /> }
    ];

    return (
        <footer className="relative mt-auto pt-12 pb-8 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gray-900 border-t border-gray-800" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] translate-y-1/2" />

            <div className="relative max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center mb-12">

                    {/* Left: Logo */}
                    <div className="flex justify-center md:justify-start">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-orange-500 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                                <Brain className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight">Career<span className="text-primary italic font-light">Sense</span></h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">AI Platform</p>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Animated Text */}
                    <div className="flex flex-col items-center justify-center min-h-[40px]">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={textIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 text-center"
                            >
                                {messages[textIndex]}
                            </motion.p>
                        </AnimatePresence>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-3 opacity-40 rounded-full" />
                    </div>

                    {/* Right: Quick Links */}
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-4">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="text-gray-600">{link.icon}</span>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        &copy; 2026 CareerSense AI. Built for the future of work.
                    </p>
                    <div className="flex items-center gap-8">
                        <Sparkles size={16} className="text-gray-800" />
                        <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
