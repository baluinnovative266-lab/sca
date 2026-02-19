import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building, Sparkles, SlidersHorizontal, ChevronRight, Search, Target, X } from 'lucide-react';
import JobCard from '../components/JobCard';

const JobOpportunities = () => {
    const [matches, setMatches] = useState([]);
    const [careerPath, setCareerPath] = useState('');
    const [hiringCompanies, setHiringCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, eligible, growth

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/jobs/match', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMatches(response.data.matches || []);
            const cp = response.data.career_path || '';
            setCareerPath(cp);

            // Fetch companies for this career path
            if (cp) {
                const compRes = await axios.get(`/api/jobs/companies/by-skill?career_path=${encodeURIComponent(cp)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHiringCompanies(compRes.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch jobs/companies", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMatches = matches.filter(job => {
        if (filter === 'eligible') return job.is_eligible;
        if (filter === 'growth') return !job.is_eligible && job.match_percentage >= 50;
        return true;
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-2"
                        >
                            <div className="p-3 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-100">
                                <Target className="text-white" size={24} />
                            </div>
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                                Personalized for you
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
                        >
                            Professional <span className="text-indigo-600">Job Board .</span>
                        </motion.h1>
                        <p className="text-slate-500 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
                            Discover high-impact roles tailored to your progress in <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">{careerPath}</span>. Complete more roadmap phases to unlock exclusive opportunities.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
                        {['all', 'eligible', 'growth'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all capitalize ${filter === f
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Architecting your opportunities...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredMatches.length > 0 ? (
                                filteredMatches.map((job, idx) => (
                                    <JobCard key={idx} job={job} />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200"
                                >
                                    <Sparkles className="mx-auto text-slate-300 mb-4" size={48} />
                                    <h3 className="text-xl font-bold text-slate-800">No opportunities found for this filter</h3>
                                    <p className="text-slate-400 font-medium">Keep learning to unlock more high-match roles.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Recommendations Section */}
                {!loading && hiringCompanies.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-24 p-10 rounded-[3rem] bg-indigo-900 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-800 rounded-full -mr-48 -mt-48 blur-3xl opacity-50"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4 tracking-tight">
                                <Building size={32} className="text-indigo-400" />
                                Companies Hiring for {careerPath}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {hiringCompanies.map((company, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedCompany(company)}
                                        className="h-24 bg-indigo-800/40 backdrop-blur-sm border border-indigo-700/50 rounded-2xl flex items-center justify-center hover:bg-indigo-700/60 transition-all cursor-pointer group"
                                    >
                                        <span className="text-indigo-200 font-black text-sm uppercase tracking-tighter group-hover:text-white transition-all text-center px-2">
                                            {company.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Company Details Modal */}
            <AnimatePresence>
                {selectedCompany && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedCompany(null)}
                                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 p-3 flex items-center justify-center border border-indigo-100">
                                    {selectedCompany.logo ? (
                                        <img src={selectedCompany.logo} alt={selectedCompany.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <Building className="text-indigo-600" size={32} />
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Hiring Partner</p>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedCompany.name}</h3>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest leading-none">About Company</p>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        {selectedCompany.desc || "A top-tier firm constantly looking for skilled professionals to join their innovative teams globally."}
                                    </p>
                                </div>

                                <a
                                    href={selectedCompany.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-center flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    Browse Careers <ChevronRight size={18} />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobOpportunities;
