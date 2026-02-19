import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Clock, Send, LifeBuoy, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const HelpDesk = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        issue_type: 'General Inquiry',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const issueTypes = [
        'General Inquiry',
        'Technical Issue',
        'Account Access',
        'Career Roadmap Question',
        'Bug Report',
        'Feedback'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/helpdesk/ticket', formData);
            if (response.data.success) {
                setSuccess(true);
                setFormData({ name: '', email: '', issue_type: 'General Inquiry', description: '' });
            }
        } catch (err) {
            console.error("Help Desk submission error:", err);
            setError("Failed to submit ticket. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-bold mb-6"
                    >
                        <LifeBuoy size={16} /> Support Center
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        CareerSense <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600">Help Desk</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        We’re here to help you navigate your career journey. Report a problem or get in touch with our team.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Contact Cards */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-gray-50 text-primary"><Phone size={20} /></span>
                                Contact Information
                            </h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-gray-50 text-gray-400"><Mail size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Support</p>
                                        <p className="text-lg font-bold text-gray-800">support@careersense.ai</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-gray-50 text-gray-400"><Phone size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Landline</p>
                                        <p className="text-lg font-bold text-gray-800">+91-80-CAREER-AI</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-gray-50 text-gray-400"><Clock size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Support Hours</p>
                                        <p className="text-lg font-bold text-gray-800">Mon–Fri | 9AM–6PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
                            <h3 className="text-xl font-bold mb-4">Need help now?</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Check our Community Chat for instant advice from peers and alumni who've been in your shoes.
                            </p>
                            <button
                                onClick={() => navigate('/community')}
                                className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all"
                            >
                                Go to Community
                            </button>
                        </div>
                    </div>

                    {/* Right: Submission Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200 border border-gray-50 relative">
                            {success ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-12 text-center"
                                >
                                    <div className="flex justify-center mb-6">
                                        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                                            <CheckCircle2 size={40} />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 mb-4">Submission Successful!</h2>
                                    <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-sm mx-auto mb-10">
                                        Your issue has been submitted successfully. Our team will get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all"
                                    >
                                        Submit Another Ticket
                                    </button>
                                </motion.div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                        <span className="p-2 rounded-xl bg-primary/10 text-primary leading-none"><LifeBuoy size={24} /></span>
                                        Report a Problem
                                    </h3>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Your Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="John Doe"
                                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-gray-800"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-gray-800"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Issue Type</label>
                                            <select
                                                value={formData.issue_type}
                                                onChange={(e) => setFormData({ ...formData, issue_type: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-gray-800 appearance-none cursor-pointer"
                                            >
                                                {issueTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Description</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Describe your issue in detail..."
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-gray-800 resize-none"
                                            />
                                        </div>

                                        {error && (
                                            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                                                <AlertCircle size={18} />
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg hover:bg-red-600 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                                            {loading ? 'Submitting...' : 'Send Message'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpDesk;
