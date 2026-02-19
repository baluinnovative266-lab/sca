import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles, Target, Zap, BarChart3, Brain } from 'lucide-react';
import { predictCareer } from '../services/api';
import AnalysisLoader from '../components/AnalysisLoader';

const InputField = ({ label, name, type = "number", value, onChange, max, icon: Icon }) => (
    <div className="space-y-2 group">
        <label
            className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1 group-focus-within:text-pink-500 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {label}
        </label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                max={max}
                className={`w-full bg-white border-2 border-gray-200 rounded-2xl ${Icon ? 'px-12' : 'px-6'} py-4 text-gray-800 font-semibold outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm hover:border-gray-300 placeholder:text-gray-400 custom-number-input`}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}
                placeholder={`Enter ${label.toLowerCase()} score...`}
                required
            />
        </div>
    </div>
);

const CareerPrediction = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        math_score: '',
        programming_score: '',
        communication_score: '',
        problem_solving_score: '',
        interest_coding: '',
        interest_design: '',
        interest_management: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiData = Object.fromEntries(
                Object.entries(formData).map(([k, v]) => [k, parseInt(v) || 0])
            );
            const result = await predictCareer(apiData);
            // Persist to localStorage for gated route
            localStorage.setItem('career_stats', JSON.stringify(result));

            // Artificial delay for UX
            setTimeout(() => {
                navigate('/results', { state: { predictionResults: result, inputData: apiData }, replace: true });
                setLoading(false);
            }, 1800);
        } catch (error) {
            console.error("Prediction failed", error);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <AnalysisLoader isOpen={loading} message="Analyzing Your Career Potential..." />

            {/* Custom styles for number input spinners */}
            <style>{`
                .custom-number-input::-webkit-inner-spin-button,
                .custom-number-input::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .custom-number-input {
                    -moz-appearance: textfield;
                    appearance: textfield;
                }
            `}</style>
            {/* ... rest of the file ... */}

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 text-center relative"
            >
                {/* Pink Brain Logo with Pulse */}
                <div className="relative inline-flex p-5 rounded-3xl bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 border border-pink-200 mb-8 shadow-lg shadow-pink-200/40">
                    <div className="absolute inset-0 rounded-3xl bg-pink-400/20 animate-pulse blur-xl"></div>
                    <Brain className="text-pink-600 relative z-10" size={52} strokeWidth={1.8} />
                </div>

                <h1
                    className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    <span className="block text-gray-900 mb-2">Unlock Your</span>
                    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
                        Future Career
                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-pink-200 opacity-60" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.7201 5.2046 81.318 2.53467 122.992 2.5085C161.466 2.48435 186.275 6.46782 196.999 6.99997" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                    </span>
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    AI-powered analysis of your academic profile and interests to predict your perfect career match with <span className="text-pink-600 font-bold">94% accuracy</span>.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden"
            >
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-50 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[120px] -ml-40 -mb-40 pointer-events-none" />

                <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
                            <h2
                                className="text-sm font-bold text-gray-600 uppercase tracking-[0.2em]"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                Academic Performance
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputField label="Mathematics" name="math_score" value={formData.math_score} onChange={handleChange} max={100} icon={Target} />
                            <InputField label="Programming" name="programming_score" value={formData.programming_score} onChange={handleChange} max={100} icon={Zap} />
                            <InputField label="Communication" name="communication_score" value={formData.communication_score} onChange={handleChange} max={100} icon={Sparkles} />
                            <InputField label="Problem Solving" name="problem_solving_score" value={formData.problem_solving_score} onChange={handleChange} max={100} icon={BarChart3} />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            <h2
                                className="text-sm font-bold text-gray-600 uppercase tracking-[0.2em]"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                Interest Areas <span className="text-gray-400 font-normal normal-case tracking-normal">(Scale 1–10)</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <InputField label="Coding" name="interest_coding" value={formData.interest_coding} onChange={handleChange} max={10} />
                            <InputField label="Design" name="interest_design" value={formData.interest_design} onChange={handleChange} max={10} />
                            <InputField label="Management" name="interest_management" value={formData.interest_management} onChange={handleChange} max={10} />
                        </div>
                    </div>

                    <div className="pt-8 flex justify-center md:justify-end">
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(236,72,153,0.3)' }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-wider shadow-xl transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" /> Analyzing...
                                </>
                            ) : (
                                <>
                                    Analyze Career <ArrowRight size={20} />
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CareerPrediction;
