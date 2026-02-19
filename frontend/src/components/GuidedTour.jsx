import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, Target, Zap, MousePointer2 } from 'lucide-react';

const steps = [
    {
        title: "Welcome to CareerSense AI",
        content: "I'll guide you through our professional career intelligence platform. Ready to see how AI transforms career planning?",
        icon: <Sparkles className="text-pink-500" />
    },
    {
        title: "Career Prediction",
        content: "Our AI analyzes academic scores and interests to predict the best-fit career paths with high precision.",
        icon: <Target className="text-emerald-500" />
    },
    {
        title: "Resume Intelligence",
        content: "Upload any resume to instantly extract skills, identify gaps, and see a real-time match score.",
        icon: <Zap className="text-amber-500" />
    },
    {
        title: "Interactive Roadmaps",
        content: "Explore personalized learning paths with animated mind maps and curated external resources.",
        icon: <MousePointer2 className="text-indigo-500" />
    }
];

const GuidedTour = ({ isOpen, onClose, onStartDemo }) => {
    const [currentStep, setCurrentStep] = useState(0);

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            if (onStartDemo) onStartDemo();
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative z-10 overflow-hidden border border-white/20"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Background Accents */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <button onClick={onClose} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <X size={24} />
                    </button>

                    <div className="relative z-10 text-center">
                        <motion.div
                            key={currentStep}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="inline-flex p-5 rounded-[2rem] bg-gray-50 mb-8 shadow-inner border border-gray-100"
                        >
                            {React.cloneElement(steps[currentStep].icon, { size: 40 })}
                        </motion.div>

                        <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {steps[currentStep].title}
                        </h3>

                        <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
                            {steps[currentStep].content}
                        </p>

                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                className={`flex items-center gap-2 font-bold px-6 py-3 rounded-2xl transition-all ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                <ChevronLeft size={20} /> Back
                            </button>

                            {/* Indicators */}
                            <div className="flex gap-2">
                                {steps.map((_, i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-pink-500' : 'w-2 bg-gray-200'}`} />
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all hover:-translate-y-1"
                            >
                                {currentStep === steps.length - 1 ? 'Start Demo' : 'Next Step'} <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GuidedTour;
