import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Info, Lightbulb, Clock, CheckCircle2, ChevronRight, Github, ExternalLink, Code, Award } from 'lucide-react';
import { PLATFORM_LOGOS } from '../utils/constants';

const SidePanel = ({ isOpen, onClose, title, subtitle, data, type }) => {
    const career = localStorage.getItem('predicted_career') || 'Software Engineer';

    const getFallbackLink = () => {
        const fallbacks = {
            "Software Engineer": "https://github.com/trending/software-engineering",
            "Web Developer": "https://github.com/topics/starter-template",
            "Data Scientist": "https://github.com/topics/data-science",
            "UI/UX Designer": "https://github.com/topics/design-system",
            "Product Manager": "https://github.com/topics/product-management"
        };
        return fallbacks[career] || "https://github.com/explore";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-br from-pink-50/50 to-white">
                            <div>
                                <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-1">{type || 'Details'}</p>
                                <h2 className="text-2xl font-black text-gray-900 leading-tight">{title}</h2>
                                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                            </div>
                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 rounded-xl bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <X size={20} />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {type === 'Skill Gap' ? (
                                <>
                                    <section>
                                        <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                                            <Info size={18} className="text-pink-600" />
                                            What is it?
                                        </div>
                                        <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            {data?.description || "A critical competence identified by our AI that is currently missing in your professional profile."}
                                        </p>
                                    </section>

                                    <section className="grid grid-cols-2 gap-4">
                                        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                                            <Target size={18} className="text-rose-600 mb-2" />
                                            <p className="text-xs text-rose-500 font-bold uppercase mb-1">Impact</p>
                                            <p className="text-sm font-bold text-gray-900">{data?.importance || "High Impact"}</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                            <Clock size={18} className="text-blue-600 mb-2" />
                                            <p className="text-xs text-blue-500 font-bold uppercase mb-1">Effort</p>
                                            <p className="text-sm font-bold text-gray-900">{data?.learning_time || "Variable"}</p>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                                            <Lightbulb size={18} className="text-amber-500" />
                                            Industry Use Cases
                                        </div>
                                        <div className="space-y-3">
                                            {(data?.use_cases || ["Enterprise Apps", "SaaS Systems"]).map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                            Learning Objectives
                                        </div>
                                        <div className="space-y-3">
                                            {(data?.objectives || ["Master Fundamentals", "Build Capstone Project"]).map((item, i) => (
                                                <div key={i} className="flex gap-3 text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                                    <ChevronRight size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </>
                            ) : (
                                <>
                                    <section>
                                        <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                                            <Info size={18} className="text-pink-600" />
                                            {type === 'Build Project' ? 'Project Overview' : 'Module Overview'}
                                        </div>
                                        <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                                            "{data?.overview || data?.description || (type === 'Build Project' ? "Build a professional project applying what you've learned." : "Mastering this competence is key for your career growth.")}"
                                        </p>
                                    </section>

                                    <section className="grid grid-cols-2 gap-4">
                                        <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 shadow-sm">
                                            <Target size={18} className="text-pink-600 mb-2" />
                                            <p className="text-[10px] text-pink-500 font-black uppercase tracking-tighter mb-1">
                                                {type === 'Build Project' ? 'Stack' : 'Impact'}
                                            </p>
                                            <p className="text-sm font-bold text-gray-900 leading-tight">
                                                {data?.tech_stack || data?.importance || "Industry Standard"}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm">
                                            <Clock size={18} className="text-blue-600 mb-2" />
                                            <p className="text-[10px] text-blue-500 font-black uppercase tracking-tighter mb-1">
                                                {type === 'Build Project' ? 'Difficulty' : 'Duration'}
                                            </p>
                                            <p className="text-sm font-bold text-gray-900 leading-tight">
                                                {data?.difficulty || data?.learning_time || "1-2 Weeks"}
                                            </p>
                                        </div>
                                    </section>

                                    {/* Project Direct Link (if it's a project) */}
                                    {type === 'Build Project' && (data?.github_link || data?.featured_project?.github_link) && (
                                        <section>
                                            <a
                                                href={data?.github_link || data?.featured_project?.github_link || getFallbackLink()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white p-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg group"
                                            >
                                                <Github size={20} />
                                                Starter Template
                                                <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        </section>
                                    )}

                                    {/* Objectives Section for Projects/Modules */}
                                    <section>
                                        <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                            {type === 'Build Project' ? 'Project Objectives' : 'Key Objectives'}
                                        </div>
                                        <div className="space-y-3">
                                            {(data?.objectives || (type === 'Build Project' ? ["Practical Implementation", "Portfolio Piece", "Scale Ready"] : ["Skill Mastery", "Industry Application", "Standard Practices"])).map((item, i) => (
                                                <div key={i} className="flex gap-3 text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                                    <ChevronRight size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Module Specific Resources */}
                                    {(data?.resources || data?.module_resources) && (data.resources || data.module_resources).length > 0 && (
                                        <section>
                                            <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                                                <Award size={18} className="text-purple-500" />
                                                {type === 'Build Project' ? 'Learning Resources' : 'Suggested Resources'}
                                            </div>
                                            <div className="space-y-3">
                                                {(data.resources || data.module_resources).map((res, i) => (
                                                    <a
                                                        key={i}
                                                        href={res.url || res.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center p-1.5 group-hover:bg-indigo-50 transition-colors border border-transparent group-hover:border-indigo-50">
                                                            {PLATFORM_LOGOS[res.platform] ? (
                                                                <img src={PLATFORM_LOGOS[res.platform]} alt={res.platform} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <ExternalLink size={14} className="text-indigo-500" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{res.title}</p>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-[9px] text-gray-400 uppercase font-black tracking-tight">{res.platform || res.type}</p>
                                                                {res.duration && <span className="text-[9px] text-gray-300">•</span>}
                                                                {res.duration && <p className="text-[9px] text-emerald-500 font-bold">{res.duration}</p>}
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                                                    </a>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* Featured Project Section (Only for Modules, hidden if we are already viewing a Project) */}
                                    {type !== 'Build Project' && (
                                        <section className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-pink-500/20 transition-all" />

                                            <div className="flex items-center gap-2 text-pink-400 font-bold mb-4">
                                                <Code size={18} />
                                                <span className="text-[10px] uppercase font-black tracking-widest">Hands-on Practice</span>
                                            </div>

                                            <h3 className="text-lg font-black mb-2">
                                                {data?.featured_project?.title || data?.title || "Career Lab Project"}
                                            </h3>
                                            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                                                {data?.featured_project?.overview || data?.overview || "Build a professional project applying what you've learned in this module."}
                                            </p>

                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Stack</p>
                                                    <p className="text-[11px] font-bold text-gray-200">{data?.featured_project?.tech_stack || data?.tech_stack || "Node + React"}</p>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Difficulty</p>
                                                    <p className="text-[11px] font-bold text-gray-200">{data?.featured_project?.difficulty || data?.difficulty || "Moderate"}</p>
                                                </div>
                                            </div>

                                            <a
                                                href={data?.featured_project?.github_link || data?.github_link || getFallbackLink()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-3 bg-pink-600 text-white p-4 rounded-2xl font-black hover:bg-pink-500 transition-all shadow-lg group"
                                            >
                                                <Github size={20} />
                                                Starter Template
                                                <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        </section>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-3">
                            {type === 'skill' && onToggleComplete && (
                                <button
                                    onClick={() => onToggleComplete(data.title)}
                                    className={`w-full py-4 font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 ${data.is_completed
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200'
                                        : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-pink-500 hover:text-pink-500'
                                        }`}
                                >
                                    {data.is_completed ? (
                                        <>
                                            <CheckCircle2 size={20} /> Module Completed
                                        </>
                                    ) : (
                                        <>
                                            <Target size={20} /> Mark as Complete
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-sm"
                            >
                                Close Details
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SidePanel;
