import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, PlayCircle, Sparkles, Clock, ArrowRight, Star } from 'lucide-react';

const PhaseGrid = ({ steps, onStepClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, idx) => {
                const isCompleted = step.is_completed || step.status === 'completed';
                const isCritical = step.status === 'critical';
                const isFastTrack = step.status === 'fast-track';

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(236, 72, 153, 0.1), 0 10px 10px -5px rgba(236, 72, 153, 0.04)" }}
                        onClick={() => onStepClick && onStepClick(step)}
                        className={`
                            relative p-6 rounded-xl bg-white border flex flex-col justify-between h-full min-h-[260px] cursor-pointer transition-all duration-300 shadow-sm group
                            ${isCompleted
                                ? 'border-l-4 border-l-emerald-500 border-y-gray-100 border-r-gray-100'
                                : isCritical
                                    ? 'border-l-4 border-l-rose-500 border-y-gray-100 border-r-gray-100'
                                    : isFastTrack
                                        ? 'border-l-4 border-l-amber-500 border-y-gray-100 border-r-gray-100'
                                        : 'border-l-4 border-l-pink-500 border-y-gray-100 border-r-gray-100'
                            }
                        `}
                    >
                        {/* Content */}
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isCompleted ? 'bg-emerald-50 text-emerald-600' :
                                    isCritical ? 'bg-rose-50 text-rose-600' :
                                        isFastTrack ? 'bg-amber-50 text-amber-600' :
                                            'bg-pink-50 text-pink-600'
                                    }`}>
                                    {isCompleted ? <CheckCircle size={20} /> : <PlayCircle size={20} />}
                                </div>
                                {isCritical && (
                                    <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles size={10} /> Critical
                                    </span>
                                )}
                                {isFastTrack && (
                                    <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                        <Star size={10} /> Fast Track
                                    </span>
                                )}
                            </div>

                            <h4 className="font-bold text-lg mb-2 leading-tight text-gray-900 group-hover:text-pink-600 transition-colors">
                                {step.title}
                            </h4>

                            <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed">
                                {step.custom_description || step.outcome}
                            </p>

                            {/* Skill Tags / Chips could go here if available in step data */}
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1.5 rounded-md">
                                <Clock size={12} />
                                {step.duration}
                            </div>

                            <motion.button
                                whileHover={{ x: 3 }}
                                whileTap={{ scale: 0.98 }}
                                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${isCompleted ? 'text-emerald-600' : 'text-gray-400 group-hover:text-pink-600'
                                    }`}
                            >
                                {isCompleted ? 'Review' : 'Start Module'} <ArrowRight size={12} />
                            </motion.button>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default PhaseGrid;
