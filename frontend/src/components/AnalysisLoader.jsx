import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, ShieldCheck, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const AnalysisLoader = ({ isOpen, message = "Analyzing your profile..." }) => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statuses = [
        "Scanning academic performance...",
        "Evaluating core competencies...",
        "Identifying skill gaps...",
        "Matching with 500+ career paths...",
        "Generating personalized roadmap...",
        "Finalizing intelligent insights..."
    ];

    useEffect(() => {
        if (!isOpen) {
            setProgress(0);
            setStatusIndex(0);
            return;
        }

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 15;
                return next > 95 ? 95 : next;
            });
        }, 800);

        const statusInterval = setInterval(() => {
            setStatusIndex(prev => (prev + 1) % statuses.length);
        }, 2000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(statusInterval);
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-white/80 backdrop-blur-xl"
                >
                    <div className="max-w-md w-full px-8 text-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-pink-500/30 relative"
                        >
                            <Brain className="text-white" size={48} />
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-[2rem] bg-white opacity-20"
                            />
                        </motion.div>

                        <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {message}
                        </h2>

                        <p className="text-pink-600 font-bold text-sm mb-10 h-6 flex items-center justify-center gap-2">
                            <Sparkles size={14} className="animate-pulse" />
                            {statuses[statusIndex]}
                        </p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Engine Status</span>
                                <span className="text-xs font-black text-gray-900">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-100 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 rounded-full relative shadow-lg shadow-pink-500/20"
                                >
                                    <div className="absolute top-0 right-0 h-full w-8 bg-white/20 blur-sm -skew-x-12" />
                                </motion.div>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-3 gap-4">
                            {[
                                { icon: <Search size={16} />, label: "Parsing" },
                                { icon: <Zap size={16} />, label: "Processing" },
                                { icon: <ShieldCheck size={16} />, label: "Verifying" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${progress > (i + 1) * 30 ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-300'} transition-all duration-500`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${progress > (i + 1) * 30 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AnalysisLoader;
