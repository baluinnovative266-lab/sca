import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import ChatBot from './ChatBot';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import Footer from './Footer';

const Layout = ({ children }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="pt-20 px-4 md:px-8 max-w-7xl mx-auto"
            >
                {children}
            </motion.main>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="fixed bottom-24 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/80 transition-all"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <ChatBot />
            <Footer />
        </div>
    );
};

export default Layout;
