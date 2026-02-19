import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Briefcase, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

const JobCard = ({ job }) => {
    const {
        role,
        company_name,
        company_logo,
        level,
        required_skills,
        match_percentage,
        missing_skills,
        is_eligible,
        apply_url
    } = job;

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden p-6 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/60 p-2 border border-white/60 flex items-center justify-center overflow-hidden shadow-inner">
                        {company_logo ? (
                            <img src={company_logo} alt={company_name} className="w-full h-full object-contain" />
                        ) : (
                            <Briefcase className="w-8 h-8 text-indigo-500" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{role}</h3>
                        <p className="text-sm font-semibold text-gray-500">{company_name}</p>
                        {job.description && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{job.description}</p>
                        )}
                    </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/60 border border-white/60 text-xs font-bold text-indigo-600 shadow-sm">
                    {level}
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-600">Skill Match</span>
                    <span className={is_eligible ? "text-green-600" : "text-amber-500"}>{match_percentage}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200/50 rounded-full overflow-hidden border border-white/20">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${match_percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${is_eligible ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                    />
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div>
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                        {required_skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-white/50 text-[10px] font-bold text-gray-600 border border-white/60">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {!is_eligible && missing_skills.length > 0 && (
                    <div className="p-3 rounded-lg bg-red-50/50 border border-red-100/50">
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <AlertCircle size={10} /> Missing Skills
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {missing_skills.map((skill, idx) => (
                                <span key={idx} className="text-[10px] font-bold text-red-600">
                                    • {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/20">
                <div className="flex items-center gap-1 text-gray-400">
                    <MapPin size={12} />
                    <span className="text-[10px] font-bold">Remote</span>
                </div>
                <motion.a
                    whileHover={is_eligible ? { scale: 1.05 } : { x: [0, -2, 2, -2, 2, 0] }}
                    whileTap={{ scale: 0.95 }}
                    href={is_eligible ? apply_url : '#'}
                    target={is_eligible ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm shadow-xl transition-all ${is_eligible
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        }`}
                    onClick={(e) => !is_eligible && e.preventDefault()}
                >
                    {is_eligible ? 'Apply Now' : 'Skills Needed'}
                    <ChevronRight size={16} />
                </motion.a>
            </div>
        </motion.div>
    );
};

export default JobCard;
