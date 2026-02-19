import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Home, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VisitAgainModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        onClose();
        navigate('/');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -ml-16 -mb-16" />

                        <div className="flex justify-center mb-8">
                            <div className="p-5 rounded-3xl bg-gradient-to-br from-primary/10 to-pink-500/10 text-primary relative">
                                <Sparkles size={48} />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -top-1 -right-1"
                                >
                                    <Sparkles size={16} className="text-pink-400" />
                                </motion.div>
                            </div>
                        </div>

                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-4">
                            Thank you for using <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600">CareerSense AI</span>
                        </h3>

                        <p className="text-gray-500 font-medium leading-relaxed mb-10 px-4">
                            Your journey towards a dream career is in progress. Visit again soon to continue your exploration!
                        </p>

                        <button
                            onClick={handleReturnHome}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 group"
                        >
                            <Home size={20} />
                            Return Home
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-8 flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">See you next time</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default VisitAgainModal;
