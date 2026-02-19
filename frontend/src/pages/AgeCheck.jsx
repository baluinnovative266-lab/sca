import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, AlertTriangle, Info, ShieldCheck, Loader2, UserCheck } from 'lucide-react';
import axios from 'axios';

const AgeCheck = () => {
    const navigate = useNavigate();
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const validateAge = () => {
        const ageNum = parseInt(age, 10);
        if (!age || isNaN(ageNum)) return 'Please enter your age.';
        if (ageNum <= 0) return 'Age must be a positive number.';
        if (ageNum > 120) return 'Please enter a valid age.';
        return null;
    };

    const saveAgeAndProceed = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/auth/set-age', { age: parseInt(age, 10) }, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            localStorage.setItem('user_age', age);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error('Failed to save age:', err);
            // Fallback: save locally and proceed anyway
            localStorage.setItem('user_age', age);
            navigate('/dashboard', { replace: true });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateAge();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError('');

        const ageNum = parseInt(age, 10);
        if (ageNum < 16) {
            setShowWarning(true);
        } else {
            await saveAgeAndProceed();
        }
    };

    const handleContinueAnyway = async () => {
        setShowWarning(false);
        await saveAgeAndProceed();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        >
            <div className="max-w-md w-full">
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative overflow-hidden"
                >
                    {/* Background accents */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />

                    <div className="relative z-10">
                        {/* Icon */}
                        <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/20">
                            <UserCheck className="text-white" size={28} />
                        </div>

                        {/* Title */}
                        <h1
                            className="text-2xl md:text-3xl font-black text-gray-900 text-center mb-2 tracking-tight"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            Tell Us Your Age
                        </h1>
                        <p className="text-gray-500 text-center mb-8 text-sm font-medium">
                            This helps us personalize your experience.
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    Your Age
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={age}
                                    onChange={(e) => { setAge(e.target.value); setError(''); }}
                                    autoComplete="off"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all text-center"
                                    autoFocus
                                />
                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="text-rose-500 text-xs font-bold mt-2 text-center"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading || !age}
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        Continue <ArrowRight size={20} />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Info Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl"
                        >
                            <div className="flex gap-3">
                                <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-indigo-700/80 leading-relaxed font-medium">
                                    CareerSense AI is built primarily for IT &amp; Computer Science students — helping you explore career paths, identify skill gaps, and follow personalized learning roadmaps tailored to the tech industry.
                                </p>
                            </div>
                        </motion.div>

                        {/* Footer */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <ShieldCheck size={12} className="text-emerald-500" />
                            Your data stays private
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Under-16 Warning Modal */}
            <AnimatePresence>
                {showWarning && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowWarning(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative z-10 text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-amber-100">
                                <AlertTriangle size={28} className="text-amber-500" />
                            </div>

                            <h3
                                className="text-xl font-black text-gray-900 mb-3"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                Notice
                            </h3>

                            <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
                                This application is primarily designed for students aged 16 and above.
                                You may continue, but some features may not be fully relevant for you yet.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleContinueAnyway}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>Continue Anyway <ArrowRight size={18} /></>
                                )}
                            </motion.button>

                            <button
                                onClick={() => setShowWarning(false)}
                                className="mt-4 text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
                            >
                                Go Back
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AgeCheck;
