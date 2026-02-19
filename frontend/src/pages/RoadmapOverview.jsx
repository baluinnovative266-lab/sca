import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Star, Clock, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';

const RoadmapOverview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhase, setSelectedPhase] = useState(null);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                // 1. Try to get from location state
                const stateData = location.state?.roadmap;
                if (stateData) {
                    setRoadmap(stateData);
                    return;
                }

                // 2. Try to get from API (persistence)
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch('/api/get-roadmap', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data.roadmap && data.roadmap.length > 0) {
                            setRoadmap(data.roadmap);
                            return;
                        }
                    }
                }

                // 3. Fallback to localStorage
                const cached = localStorage.getItem('current_roadmap');
                if (cached) {
                    setRoadmap(JSON.parse(cached));
                }
            } catch (err) {
                console.error("Failed to load roadmap:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [location.state]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-100/50 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-50/50 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-16 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-pink-600 mb-3">
                        <span className="text-xs font-bold tracking-widest uppercase bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                            Career Path
                        </span>
                        <ChevronRight size={14} className="text-gray-300" />
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                            {user?.predicted_career || "Your Journey"}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 tracking-tight">
                        Your Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-600">Roadmap</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                        A structured timeline designed to take you from foundational knowledge to industry mastery. Select a phase to begin.
                    </p>
                </header>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
                >
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10 translate-y-4"></div>

                    {roadmap.map((phase, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{
                                    y: -15,
                                    scale: 1.05,
                                    boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.25)"
                                }}
                                onClick={() => setSelectedPhase(phase)}
                                className={`
                                    relative glass-card p-6 !bg-white/90 cursor-pointer hover:!bg-white transition-all duration-300 group flex flex-col h-full z-0 hover:z-10
                                    ${selectedPhase?.phase === phase.phase ? 'ring-2 ring-pink-500 ring-offset-2' : ''}
                                `}
                            >
                                {/* Step Number Indicator */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center font-black text-xl text-pink-600 border border-pink-100 shadow-sm group-hover:scale-110 transition-transform">
                                        {index + 1}
                                    </div>
                                    <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                        Phase {index + 1}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mb-4 flex-grow">
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 leading-tight group-hover:text-pink-600 transition-colors">
                                        {phase.phase}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                                        {phase.description || "Master the core skills required for this level."}
                                    </p>
                                </div>

                                {/* Metrics */}
                                <div className="pt-4 border-t border-gray-50 mt-auto">
                                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-3">
                                        <span className="flex items-center gap-1.5">
                                            <BookOpen size={14} className="text-pink-400" />
                                            {(phase.steps || []).length} Modules
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Star size={14} className="text-yellow-400" />
                                            Focus
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-pink-500 h-full rounded-full w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                                    </div>

                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        <div className="text-center text-xs font-bold text-pink-600 uppercase tracking-wider flex items-center justify-center gap-1">
                                            View Details <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Slide-over Panel */}
            <AnimatePresence>
                {selectedPhase && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPhase(null)}
                            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-50 shadow-2xl overflow-y-auto"
                        >
                            {/* Panel Header */}
                            <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 p-6 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-bold text-pink-600 uppercase tracking-widest">Phase Detail</span>
                                    <p className="text-sm font-bold text-pink-600">{(selectedPhase.steps || []).length} Modules Included</p>
                                    <h2 className="text-2xl font-black text-gray-900 leading-none mt-1">{selectedPhase.phase}</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedPhase(null)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
                                >
                                    <ArrowRight size={24} />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="text-gray-600 leading-relaxed mb-8 text-base">
                                    {selectedPhase.description}
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-lg text-gray-900">Modules Breakdown</h3>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{(selectedPhase.steps || []).length} Steps</span>
                                    </div>

                                    {(selectedPhase.steps || []).map((step, idx) => (
                                        <div key={idx} className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-100 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-base text-gray-800 group-hover:text-pink-600 transition-colors">{step.title}</h4>
                                                {step.status === 'completed' && <CheckCircle size={18} className="text-emerald-500" />}
                                                {step.status === 'fast-track' && <Star size={18} className="text-amber-500" />}
                                            </div>

                                            <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">{step.outcome}</p>

                                            <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                                                    <Clock size={12} className="text-gray-400" />
                                                    {step.duration}
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                                                    <BookOpen size={12} className="text-gray-400" />
                                                    {step.skill}
                                                </div>
                                            </div>

                                            {step.custom_description && (
                                                <div className={`mt-3 p-3 rounded-lg text-xs font-medium border ${step.status === 'critical' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-pink-50 text-pink-700 border-pink-100'
                                                    }`}>
                                                    {step.status === 'critical' ? '⚠️ Critical Focus: ' : '💡 Insight: '}
                                                    {step.custom_description}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/roadmap/phase/${selectedPhase.phase.replace(/\s/g, '-').toLowerCase()}`)}
                                    className="w-full mt-8 bg-gradient-to-r from-pink-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-pink-600/20 hover:shadow-pink-600/40 transition-all flex items-center justify-center gap-2"
                                >
                                    Begin Phase <ArrowRight size={20} />
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoadmapOverview;
