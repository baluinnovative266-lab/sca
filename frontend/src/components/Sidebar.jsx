import { NavLink } from 'react-router-dom';
import { Home, Brain, FileText, BarChart2, Map, TrendingUp, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ mobile }) => {
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/career-prediction', label: 'Career Prediction', icon: Brain },
        { path: '/resume-analysis', label: 'Resume Analysis', icon: FileText },
        { path: '/results', label: 'My Results', icon: BarChart2 },
        { path: '/roadmap/overview', label: 'My Roadmap', icon: Map },
        { path: '/job-board', label: 'Job Board', icon: Briefcase },
    ];


    const baseClasses = "h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col";
    // If mobile is true, use 'flex' (it will be inside a fixed container from Layout). 
    // If false (default desktop sidebar), use 'hidden md:flex fixed...'.
    const visibilityClasses = mobile ? "flex w-full" : "hidden md:flex fixed left-0 top-0 z-20";

    return (
        <div className={`${baseClasses} ${visibilityClasses}`}>
            <div className="p-8 border-b border-indigo-500/10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.4)] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        CAREERSENSE AI
                    </h1>
                    <p className="text-[10px] text-indigo-300/30 font-mono tracking-[0.3em] mt-1 font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>V 2.0 PROTOCOL</p>
                </motion.div>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="transition-transform"
                                >
                                    <item.icon size={20} />
                                </motion.div>
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="glass-card p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Completion Status</p>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full w-3/4"></div>
                    </div>
                    <p className="text-right text-xs text-indigo-400 mt-1 font-mono">75%</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
