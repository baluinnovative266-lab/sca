import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronRight, Briefcase, FileText, TrendingUp, Award, Brain, Navigation, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [locationName, setLocationName] = useState('Global Opportunities');
    const [isLocating, setIsLocating] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            // Standard browser prompt for leaving page
            const message = "Thank you for using CareerSense AI. Visit again to continue your career journey.";
            e.returnValue = message;
            return message;
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
                    const data = await response.json();

                    if (data && data.address) {
                        const city = data.address.city || data.address.town || data.address.village || '';
                        const country = data.address.country || '';
                        setLocationName(city ? `${city}, ${country}` : 'Location Detected');
                    } else {
                        setLocationName('Location Detected');
                    }
                } catch (error) {
                    console.error("Home location fetch error:", error);
                    setLocationName('Location Active');
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error("Home location error:", error);
                setShowLocationModal(true);
                setIsLocating(false);
            }
        );
    };
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero Section */}
            <div className="relative h-[560px] w-full bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
                <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                    {/* Logo + Brand */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30">
                            <Brain className="text-white" size={36} strokeWidth={2} />
                        </div>
                        <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Career<span className="text-pink-400 italic font-light">Sense</span>
                            <span className="block text-sm md:text-base font-semibold text-pink-300/80 uppercase tracking-[0.25em] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>AI-Powered Career Guidance</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-white/85 text-xl md:text-2xl max-w-3xl font-light mb-10"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        Discover the best career path for your skills and interests
                    </motion.p>

                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-gray-800 mb-12">How it works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: <FileText size={32} />, title: "Resume Analysis", desc: "AI-powered extraction of your skills and experience from PDF/DOCX.", color: "bg-blue-50 text-blue-600" },
                        { icon: <Briefcase size={32} />, title: "Career Prediction", desc: "Machine learning model predicts the best fitted roles for you.", color: "bg-green-50 text-green-600" },
                        { icon: <TrendingUp size={32} />, title: "Skill Gap Analysis", desc: "Identify what you're missing for your dream job.", color: "bg-purple-50 text-purple-600" },
                        { icon: <Award size={32} />, title: "Smart Roadmap", desc: "Get a personalized learning path to bridge the gap.", color: "bg-orange-50 text-orange-600" }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-100 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to accelerate your career?</h2>
                    <p className="text-xl text-gray-600 mb-10">Join thousands of students and professionals using CareerSense to find their path.</p>
                    <Link to="/register" className="inline-block bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                        Get Started - It's Free
                    </Link>
                </div>
            </div>

            {/* Geolocation Denial Modal */}
            <AnimatePresence>
                {showLocationModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                                    <MapPin size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Permissions Required</p>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Location Access</h3>
                                </div>
                            </div>

                            <div className="space-y-6 text-sm text-gray-600 font-medium leading-relaxed">
                                <p>To provide personalized job opportunities and local career events, we need to know your city.</p>

                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <p className="text-gray-900 font-bold mb-3 flex items-center gap-2">
                                        <Navigation size={16} className="text-primary" />
                                        How to enable:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <span className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                                            <span>Click the <span className="font-bold">Lock icon</span> in your browser's address bar.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                                            <span>Locate <span className="font-bold">Location</span> and toggle it to <span className="text-emerald-600 font-bold">Allow</span>.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                                            <span>Refresh the page to apply changes.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="w-full mt-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                            >
                                I understand
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
