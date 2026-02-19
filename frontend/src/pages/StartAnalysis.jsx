import { motion } from 'framer-motion';
import { Target, BookOpen, ArrowRight, Brain, Sparkles, ShieldCheck, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GuidedTour from '../components/GuidedTour';
import { MOCK_DEMO_RESULTS } from '../utils/constants';

const StartAnalysis = () => {
    const navigate = useNavigate();
    const [isTourOpen, setIsTourOpen] = useState(false);

    const handleStartDemo = () => {
        localStorage.setItem('career_stats', JSON.stringify(MOCK_DEMO_RESULTS));
        navigate('/results', { state: { resumeResults: MOCK_DEMO_RESULTS }, replace: true });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50 pt-24 pb-16 px-6 flex items-center justify-center"
        >
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 relative overflow-hidden"
                >
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-pink-500/20">
                            <Brain className="text-white" size={32} />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Career Analysis</span>
                        </h1>

                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                            Analyze your profile with AI to unlock personalized insights and a learning roadmap.
                        </p>

                        <div className="flex items-center justify-center gap-4 mb-10">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsTourOpen(true)}
                                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                            >
                                <Play size={18} className="fill-white" /> Walkthrough Mode
                            </motion.button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            <motion.button
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/career-prediction')}
                                className="group p-6 bg-pink-50 border border-pink-100 rounded-2xl text-left transition-all hover:bg-pink-100 hover:border-pink-200"
                            >
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-pink-600 mb-4 shadow-sm group-hover:bg-pink-600 group-hover:text-white transition-all">
                                    <Target size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">Career Prediction</h3>
                                <p className="text-xs text-gray-400">Personalized scores & interests.</p>
                            </motion.button>

                            <motion.button
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/resume-analysis')}
                                className="group p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-left transition-all hover:bg-emerald-100 hover:border-emerald-200"
                            >
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <BookOpen size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">Resume Upload</h3>
                                <p className="text-xs text-gray-400">Extract skills & industry gaps.</p>
                            </motion.button>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            AI Powered & Privacy First
                        </div>
                    </div>
                </motion.div>

                <p className="mt-8 text-gray-400 text-sm font-medium">
                    No placeholders. No fake scores. Just real data-driven insights.
                </p>
            </div>

            <GuidedTour
                isOpen={isTourOpen}
                onClose={() => setIsTourOpen(false)}
                onStartDemo={handleStartDemo}
            />
        </motion.div>
    );
};


export default StartAnalysis;
