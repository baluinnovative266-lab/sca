import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Menu, X, Settings, LayoutDashboard, ChevronDown, Users } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import VisitAgainModal from './VisitAgainModal';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout, token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setIsProfileOpen(false);
        setIsOpen(false);
        setShowLogoutModal(true);
        // Wait a bit before actual logout to show modal
        setTimeout(() => {
            logout();
            localStorage.removeItem('career_stats');
            localStorage.removeItem('current_roadmap');
            localStorage.removeItem('predicted_career');
        }, 3000);
    };

    const getInitials = () => {
        if (!user) return '??';
        if (user.full_name) {
            return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        }
        return user.email.substring(0, 2).toUpperCase();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Logo size="small" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">Home</Link>
                        {token && user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium transition-colors">Dashboard</Link>
                                <Link to="/career-prediction" className="text-gray-600 hover:text-primary font-medium transition-colors">Career Guidance</Link>
                                <Link to="/resume-analysis" className="text-gray-600 hover:text-primary font-medium transition-colors">Resume Analysis</Link>

                                {/* User Dropdown */}
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full border border-gray-100 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm overflow-hidden">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                getInitials()
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 max-w-[120px] truncate">{user.full_name || user.email}</span>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </motion.button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden py-3"
                                            >
                                                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 mb-2">
                                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-primary font-black overflow-hidden border border-gray-100">
                                                        {user.avatar_url ? (
                                                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                        ) : (
                                                            getInitials()
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Account Center</p>
                                                        <p className="text-sm font-bold text-gray-800 mt-1 dark:text-gray-200 truncate">{user.full_name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                </div>

                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary transition-all font-medium"
                                                >
                                                    <LayoutDashboard size={18} />
                                                    <span>My Dashboard</span>
                                                </Link>

                                                <Link
                                                    to="/settings"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary transition-all font-medium"
                                                >
                                                    <Settings size={18} />
                                                    <span>Settings</span>
                                                </Link>

                                                <div className="border-t border-gray-50 mt-2 pt-2">
                                                    <button
                                                        onClick={() => navigate('/login?switch=true')}
                                                        className="w-full flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary transition-all font-medium"
                                                    >
                                                        <Users size={18} />
                                                        <span>Switch Account</span>
                                                    </button>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-all font-bold"
                                                    >
                                                        <LogOut size={18} />
                                                        <span>Logout</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Log in</Link>
                                <Link to="/register" className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3">
                        {token && user && (
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm overflow-hidden">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    getInitials()
                                )}
                            </div>
                        )}
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-white border-b border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-lg"
                >
                    <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary font-medium p-2">Home</Link>
                    {token && user ? (
                        <>
                            <div className="p-2 border-b border-gray-50">
                                <p className="text-sm font-bold text-gray-800">{user.full_name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary font-medium p-2">Dashboard</Link>
                            <Link to="/career-prediction" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary font-medium p-2">Career Guidance</Link>
                            <Link to="/resume-analysis" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary font-medium p-2">Resume Analysis</Link>
                            <Link to="/settings" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary font-medium p-2">Account Settings</Link>
                            <button onClick={handleLogout} className="text-left text-red-600 font-bold p-2 flex items-center gap-2">
                                <LogOut size={20} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-primary font-medium p-2">Log in</Link>
                            <Link to="/register" onClick={() => setIsOpen(false)} className="bg-primary text-white px-5 py-3 rounded-lg font-medium text-center shadow-lg shadow-red-500/30">Sign up</Link>
                        </>
                    )}
                </motion.div>
            )}
            <VisitAgainModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
        </nav>
    );
};

export default Navbar;
