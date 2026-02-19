import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const faqData = [
    {
        q: "What makes CareerSense AI better than standard career tests?",
        a: "CareerSense AI uses real-time market data and natural language processing to analyze your unique skills profile, not just generic interests. We provide verified competency badges and dynamic roadmaps that adapt as you learn."
    },
    {
        q: "How accurate are the career predictions?",
        a: "Our model achieves 85% accuracy by cross-referencing your academic history, technical skills, and soft skills against over 500 successful career profiles in our database."
    },
    {
        q: "Can I customize the learning roadmap?",
        a: "Yes! The roadmap is dynamic. You can add specific modules, skip phases you've already mastered, and adjust the pace based on your schedule."
    },
    {
        q: "Is my resume data kept private?",
        a: "Absolutely. We process your resume locally for initial analysis and only store anonymized skill metrics. Your personal data is encrypted and never shared with third parties."
    }
];

const FAQSection = () => {
    const [activeIndices, setActiveIndices] = useState([]);

    const toggleFAQ = (index) => {
        setActiveIndices(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="py-12">
            <div className="text-center mb-10">
                <h3 className="text-2xl font-black text-gray-900 mb-2 font-display">Frequently Asked Questions</h3>
                <p className="text-gray-500">Common questions about your career journey</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
                {faqData.map((faq, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-2xl border transition-all duration-300 ${activeIndices.includes(index) ? 'border-primary/50 shadow-lg shadow-primary/5' : 'border-gray-100 shadow-sm'}`}
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <span className={`font-bold text-lg ${activeIndices.includes(index) ? 'text-primary' : 'text-gray-800'}`}>
                                {faq.q}
                            </span>
                            <span className={`p-2 rounded-full transition-colors ${activeIndices.includes(index) ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400'}`}>
                                {activeIndices.includes(index) ? <Minus size={20} /> : <Plus size={20} />}
                            </span>
                        </button>

                        <AnimatePresence>
                            {activeIndices.includes(index) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                                        <div className="mt-4">
                                            {faq.a}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQSection;
