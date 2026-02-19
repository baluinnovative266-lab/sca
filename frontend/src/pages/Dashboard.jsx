import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, BookOpen, BarChart3, Award, ArrowRight, Brain, Sparkles, TrendingUp, Play, Lock, MessageSquare, MapPin, Navigation, Briefcase, X, LifeBuoy } from 'lucide-react';
import FAQSection from '../components/FAQSection';
import DemoAutoFill from '../components/DemoAutoFill';
import GuidedTour from '../components/GuidedTour';

// ─── Page transition variants ─────────────────────────────────────────────────
const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: 'easeIn' } },
};

import { MOCK_DEMO_RESULTS } from '../utils/constants';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [locationStatus, setLocationStatus] = useState('prompt'); // prompt, loading, active, denied
    const [coords, setCoords] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [showLocationModal, setShowLocationModal] = useState(false);

    const fetchLocationName = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`);
            const data = await response.json();
            if (data && data.display_name) {
                // Try to get a shorter name (City, Country)
                const addr = data.address;
                const city = addr.city || addr.town || addr.village || addr.suburb || '';
                const country = addr.country || '';
                setLocationName(city && country ? `${city}, ${country}` : data.display_name);
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            setLocationName("Location found (Name unavailable)");
        }
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus('denied');
            return;
        }

        setLocationStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationStatus('active');
                const newCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setCoords(newCoords);
                fetchLocationName(newCoords.lat, newCoords.lng);
            },
            (error) => {
                console.error("Location error:", error);
                setLocationStatus('denied');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    const handleStartDemo = () => {
        localStorage.setItem('career_stats', JSON.stringify(MOCK_DEMO_RESULTS));
        navigate('/results', { state: { resumeResults: MOCK_DEMO_RESULTS }, replace: true });
    };

    // If prediction/resume data arrives here, redirect to /results
    useEffect(() => {
        const data = location.state?.resumeResults || location.state?.predictionResults;
        if (data) {
            navigate('/results', { state: location.state, replace: true });
        } else {
            const cached = localStorage.getItem('career_stats');
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    // Ensure it's a valid analysis with expected data
                    if (parsed && (parsed.predicted_career || parsed.career_match_score)) {
                        setStats(parsed);
                    } else {
                        localStorage.removeItem('career_stats');
                        setStats(null);
                    }
                } catch (e) {
                    localStorage.removeItem('career_stats');
                    setStats(null);
                }
            }
        }
    }, [location.state, navigate]);


    // Feature cards for the hub
    const features = [
        {
            icon: <Target size={28} />,
            title: 'Career Predictor',
            desc: 'Input your academic scores & interests to get your best-fit career.',
            color: 'text-pink-600',
            bg: 'bg-pink-50',
            border: 'border-pink-100',
            hover: 'hover:bg-pink-600',
            link: '/career-prediction',
            cta: 'Predict My Career',
        },
        {
            icon: <BookOpen size={28} />,
            title: 'Resume Analyzer',
            desc: 'Upload your CV to extract skills and identify gaps automatically.',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            hover: 'hover:bg-emerald-600',
            link: '/resume-analysis',
            cta: 'Analyze Resume',
        },
        {
            icon: <BarChart3 size={28} />,
            title: 'My Results',
            desc: 'View your career match score, skill gaps, and AI-powered insights.',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            hover: 'hover:bg-indigo-600',
            link: '/results',
            cta: 'View Results',
        },
        {
            icon: <Award size={28} />,
            title: 'My Roadmap',
            desc: 'Follow your personalized learning path to reach your career goal.',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            hover: 'hover:bg-amber-600',
            link: '/roadmap/overview',
            cta: 'View Roadmap',
        },
        {
            icon: <Briefcase size={28} />,
            title: 'Job Opportunities',
            desc: 'Connect your skills to real hiring companies and open roles.',
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            border: 'border-rose-100',
            hover: 'hover:bg-rose-600',
            link: '/job-board',
            cta: 'Find Jobs',
        },
    ];

    const steps = [
        { num: '01', label: 'Predict Career', sub: 'Enter your scores', icon: <Brain size={20} />, link: '/career-prediction' },
        { num: '02', label: 'View Results', sub: 'See your match score', icon: <Sparkles size={20} />, link: '/results' },
        { num: '03', label: 'Follow Roadmap', sub: 'Learn phase by phase', icon: <TrendingUp size={20} />, link: '/roadmap/overview' },
    ];

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-gray-50 pt-24 pb-16 px-6"
        >
            <div className="max-w-7xl mx-auto">

                {/* ── Hero ── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 border border-pink-100 px-4 py-2 rounded-full text-sm font-bold mb-6">
                        <Brain size={16} /> AI-Powered Career Guidance
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {stats ? <>Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">CareerSense</span></> : "Start Your Career Analysis"}
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
                        {stats
                            ? "Your AI-powered career intelligence platform. Explore your personalized insights below."
                            : "Complete career prediction or upload resume to unlock personalized insights."
                        }
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsTourOpen(true)}
                            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                        >
                            <Play size={18} className="fill-white" /> Walkthrough Mode
                        </motion.button>

                        {/* GPS Badge */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowLocationModal(true)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold border transition-all ${locationStatus === 'active'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                                : locationStatus === 'denied'
                                    ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                                    : 'bg-gray-50 text-gray-500 border-gray-100'
                                }`}
                        >
                            {locationStatus === 'active' ? (
                                <>
                                    <Navigation size={18} className="fill-current" />
                                    <span>{locationName || 'GPS Active'}</span>
                                </>
                            ) : locationStatus === 'denied' ? (
                                <>
                                    <MapPin size={18} />
                                    <span>Location Denied</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    <span>Locating...</span>
                                </>
                            )}
                        </motion.button>

                        {stats && (
                            <div className="flex flex-wrap gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/community')}
                                    className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all flex items-center gap-2"
                                >
                                    <MessageSquare size={18} />
                                    Community Chat
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/help-desk')}
                                    className="bg-white text-gray-700 px-8 py-3 rounded-xl font-bold border border-gray-200 shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
                                >
                                    <LifeBuoy size={18} className="text-primary" />
                                    Help Desk
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        localStorage.removeItem('career_stats');
                                        localStorage.removeItem('current_roadmap');
                                        setStats(null);
                                    }}
                                    className="bg-white text-gray-400 hover:text-red-500 px-6 py-3 rounded-xl font-bold border border-gray-100 hover:border-red-100 transition-all"
                                >
                                    Reset Analysis
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ── Recent Analysis (Conditional) ── */}
                {stats && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl mb-14 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                            <div className="flex-1">
                                <p className="text-xs font-black text-pink-500 uppercase tracking-widest mb-2">Resume Insight</p>
                                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                                    Current Career Fit: <span className="text-pink-600">{stats.predicted_career}</span>
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {stats.extracted_skills?.slice(0, 4).map((skill, i) => (
                                        <div key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600">
                                            {typeof skill === 'object' ? skill.name : skill}
                                        </div>
                                    ))}
                                    <div className="px-4 py-2 bg-pink-50 border border-pink-100 rounded-xl text-xs font-bold text-pink-600">
                                        +{(stats.extracted_skills?.length || 0) - 4} More
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-8 bg-pink-600 rounded-[2rem] text-white min-w-[200px] shadow-lg shadow-pink-500/20">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Match Score</p>
                                <div className="text-5xl font-black">{Math.round(stats.career_match_score || 0)}%</div>
                                <button
                                    onClick={() => navigate('/results')}
                                    className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/20 hover:bg-white text-white hover:text-pink-600 px-4 py-2 rounded-lg transition-all"
                                >
                                    Deep Dive <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── User Journey Steps ── */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-14">
                    {steps.map((step, i) => {
                        const isLocked = !stats && i > 0;
                        const content = (
                            <motion.div
                                whileHover={!isLocked ? { y: -4, boxShadow: '0 12px 30px -8px rgba(236,72,153,0.2)' } : {}}
                                whileTap={!isLocked ? { scale: 0.97 } : {}}
                                className={`flex items-center gap-4 bg-white border rounded-2xl px-6 py-4 shadow-sm transition-all
                                    ${isLocked ? 'opacity-50 grayscale cursor-not-allowed border-gray-100' : 'border-gray-200 cursor-pointer group'}
                                `}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                                    ${isLocked ? 'bg-gray-50 text-gray-300' : 'bg-pink-50 text-pink-600 group-hover:bg-pink-500 group-hover:text-white'}
                                `}>
                                    {isLocked ? <Lock size={18} /> : step.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {step.num}</p>
                                    <p className={`font-bold text-sm ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>{step.label}</p>
                                    <p className="text-xs text-gray-400">{isLocked ? 'Locked until analyzed' : step.sub}</p>
                                </div>
                            </motion.div>
                        );

                        return (
                            <div key={i} className="flex items-center gap-4">
                                {isLocked ? content : <Link to={step.link}>{content}</Link>}
                                {i < steps.length - 1 && (
                                    <ArrowRight size={20} className="text-gray-300 shrink-0 hidden md:block" />
                                )}
                            </div>
                        );
                    })}
                </div>


                {/* ── Feature Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {features.map((f, i) => {
                        // Only show Results and Roadmap if stats are available
                        if (!stats && (f.title === 'My Results' || f.title === 'My Roadmap')) return null;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                                whileTap={{ scale: 0.97 }}
                                className={`group bg-white border ${f.border} rounded-2xl p-8 shadow-sm cursor-pointer transition-all duration-300`}
                                onClick={() => navigate(f.link)}
                            >
                                <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">{f.desc}</p>
                                <div className={`inline-flex items-center gap-2 text-sm font-bold ${f.color} group-hover:gap-3 transition-all`}>
                                    {f.cta} <ArrowRight size={16} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── Quick Start CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-8 text-white text-center shadow-xl shadow-pink-500/20"
                >
                    <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Ready to discover your career path?
                    </h3>
                    <p className="text-white/80 mb-6">Takes less than 2 minutes. Get your personalized AI career analysis.</p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Link
                            to="/career-prediction"
                            className="inline-flex items-center gap-3 bg-white text-pink-600 px-8 py-4 rounded-2xl font-black text-base shadow-lg hover:shadow-xl transition-all"
                        >
                            Start Career Analysis <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </motion.div>

                <div className="mt-20">
                    <FAQSection />
                </div>
            </div>

            <GuidedTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} onStartDemo={handleStartDemo} />

            {/* Location Details Modal */}
            <AnimatePresence>
                {showLocationModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-4 rounded-2xl ${locationStatus === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    <MapPin size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Geolocation Intelligence</p>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                        {locationStatus === 'active' ? 'Position Locked' : 'Location Required'}
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {locationStatus === 'active' ? (
                                    <>
                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Detected Address</p>
                                            <p className="text-lg font-bold text-gray-800 leading-tight">
                                                {locationName || 'Resolving address...'}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Latitude</p>
                                                <p className="text-sm font-black text-gray-800">{coords?.lat.toFixed(6)}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Longitude</p>
                                                <p className="text-sm font-black text-gray-800">{coords?.lng.toFixed(6)}</p>
                                            </div>
                                        </div>

                                        <a
                                            href={`https://www.google.com/maps?q=${coords?.lat},${coords?.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
                                        >
                                            <Navigation size={18} className="fill-white" />
                                            View on Google Maps
                                        </a>
                                    </>
                                ) : (
                                    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                                        <p className="text-sm font-medium text-red-800 leading-relaxed mb-4">
                                            {locationStatus === 'denied'
                                                ? "Location access is blocked. To see local opportunities, please click the lock icon in your browser's address bar and set Location to 'Allow'."
                                                : "We're currently determining your precise coordinates..."}
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => window.location.reload()}
                                                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                                            >
                                                Reload & Try Again
                                            </button>
                                            <button
                                                onClick={() => window.open('https://support.google.com/chrome/answer/142065', '_blank')}
                                                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-all"
                                            >
                                                How to enable location?
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="w-full mt-6 py-4 bg-white border border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                            >
                                Close Details
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;
