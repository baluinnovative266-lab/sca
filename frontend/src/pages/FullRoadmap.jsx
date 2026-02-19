import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Flag,
    Award,
    Briefcase,
    Rocket,
    ChevronRight,
    Circle,
    CheckCircle,
    Calendar,
    Target,
    Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';

const FullRoadmap = () => {
    const location = useLocation();
    const { user } = useAuth();
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = location.state?.roadmap || JSON.parse(localStorage.getItem('current_roadmap') || '[]');
        setRoadmap(data);
        setLoading(false);
    }, [location.state]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6">

                <div className="mb-12">
                    <Breadcrumbs />
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mt-6"
                    >
                        <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 border border-pink-100 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                            <Target size={14} /> Journey Path
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Odyssey</span>
                        </h1>
                        <p className="text-gray-500 text-lg mt-4 max-w-3xl leading-relaxed">
                            Your comprehensive journey from first principles to industry mastery. This path is dynamically personalized for your
                            <span className="text-pink-600 font-bold mx-1 border-b-2 border-pink-200">
                                {user?.predicted_career || "Target Career"}
                            </span> role.
                        </p>
                    </motion.div>
                </div>

                {/* Vertical Timeline */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative ml-4 md:ml-12"
                >
                    {/* Main Timeline Pipe */}
                    <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-200 via-rose-200 to-gray-200 rounded-full opacity-50 z-0"></div>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="absolute left-6 top-0 w-1 bg-gradient-to-b from-pink-500 via-rose-500 to-gray-400 rounded-full z-1 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                    />

                    {roadmap.map((phase, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="relative mb-20 pl-20 group"
                        >
                            {/* Phase Marker */}
                            <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-white border-4 border-pink-500 flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(236,72,153,0.3)] z-10 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                                <span className="text-sm font-black text-pink-600 group-hover:text-white">{idx + 1}</span>
                            </div>

                            {/* Content Card */}
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 group-hover:border-pink-100 transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-pink-50 rounded-full blur-[80px] -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 group-hover:text-pink-600 transition-colors uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                            {phase.phase}
                                        </h2>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                                                Approx. 3-4 Months
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                                Verified Track
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/roadmap/phase-${idx + 1}`}
                                        state={{ roadmap }}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl text-sm font-black transition-all shadow-lg hover:shadow-gray-200 group-hover:scale-105 active:scale-95"
                                    >
                                        Explore Phase
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <p className="text-gray-500 text-sm leading-relaxed mb-8 relative z-10 font-medium">
                                    {phase.description}
                                </p>

                                {/* Steps Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                    {phase.steps?.slice(0, 4).map((step, sIdx) => (
                                        <div key={sIdx} className="flex items-center gap-3 p-4 bg-gray-50 group-hover:bg-white rounded-2xl border border-gray-100 group-hover:border-pink-100 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-white text-pink-500 flex items-center justify-center shadow-sm group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-800 uppercase tracking-tighter leading-none mb-1">{step.title}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{step.duration}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Milestone Badge for Phase 3/4 */}
                                {(idx === 2 || idx === 3) && (
                                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                                                <Award className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Impact Event</p>
                                                <p className="text-sm font-black text-gray-900 uppercase italic">
                                                    {idx === 2 ? "Project Milestone: Full Portfolio Release" : "Career Milestone: Job Readiness Certification"}
                                                </p>
                                            </div>
                                        </div>
                                        <Flag className="w-6 h-6 text-gray-200 group-hover:text-pink-300 transition-colors" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {/* Final Goal */}
                    <motion.div
                        variants={itemVariants}
                        className="relative pl-20 pb-20"
                    >
                        <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(16,185,129,0.5)] z-10 animate-bounce">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <div className="bg-gradient-to-br from-white to-emerald-50/30 p-10 rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -mr-32 -mt-32" />
                            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                Goal Reached: <span className="text-emerald-600">Industry Mastery</span>
                            </h2>
                            <p className="text-gray-500 text-base mt-4 max-w-2xl font-medium relative z-10">
                                You are now equipped with the technical proficiency, mental resilience, and visual portfolio requested by top-tier tech organizations. Your career odyssey is just beginning.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default FullRoadmap;
