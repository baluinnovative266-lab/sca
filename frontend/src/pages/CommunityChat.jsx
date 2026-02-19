import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Hash, Search, TrendingUp, Sparkles, Pin,
    Smile, Paperclip, ArrowLeft, Users, MessageSquare,
    ThumbsUp, Heart, Flame, MessageCircle, Info, ChevronRight,
    Loader2, X
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CHANNELS = [
    { id: 'general', name: 'General', desc: 'Main student hub' },
    { id: 'ml', name: 'Machine Learning', desc: 'Models & Data Science' },
    { id: 'web-dev', name: 'Web Dev', desc: 'Full-stack & Design' },
    { id: 'resume-help', name: 'Resume Help', desc: 'Feedback & Tips' },
    { id: 'roadmaps', name: 'Roadmaps', desc: 'Career path discussion' },
];

const TRENDING_TOPICS = [
    { topic: '#CareerExpo2026', count: 124 },
    { topic: '#FAANGInterviews', count: 89 },
    { topic: '#MLRefinery', count: 56 },
    { topic: '#React19', count: 42 },
];

const CommunityChat = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeChannel, setActiveChannel] = useState('general');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const chatEndRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showKarmaInfo, setShowKarmaInfo] = useState(false);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Real-time polling
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/community/messages/${activeChannel}`);
                setMessages(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [activeChannel]);

    useEffect(() => {
        if (isAtBottom) scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/community/send', {
                message: newMessage,
                channel: activeChannel
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNewMessage('');
            // Trigger an immediate scroll for better UX
            setIsAtBottom(true);
        } catch (err) {
            console.error("Failed to send message", err);
        } finally {
            setSending(false);
        }
    };

    const handleReact = async (messageId, emojiType) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/community/react', {
                message_id: messageId,
                type: emojiType
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to react", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFE] flex flex-col font-sans selection:bg-pink-100 selection:text-pink-900">
            {/* Gradient Top Header */}
            <div className="bg-gradient-to-r from-violet-600 via-pink-600 to-rose-500 pt-12 pb-24 px-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex items-center justify-between mb-8 text-white/80 text-xs font-bold uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2">
                            <Link to="/dashboard" className="hover:text-white flex items-center gap-1 transition-colors">
                                Dashboard
                            </Link>
                            <ChevronRight size={10} />
                            <span className="text-white">Community Chat</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5"><Users size={14} /> 1.2k Online</span>
                            <span className="flex items-center gap-1.5"><Sparkles size={14} /> AI Moderated</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-2">
                            CareerSense Community
                        </h1>
                        <p className="text-white/80 text-lg font-medium">
                            Ask doubts. Share ideas. Grow together.
                        </p>
                    </div>
                </div>

                {/* Aesthetic shapes */}
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-violet-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto w-full flex-1 -mt-16 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6 px-4 md:px-8 pb-8">

                {/* LEFT SIDEBAR: Channels */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl flex flex-col gap-6 sticky top-8 h-[calc(100vh-200px)] lg:h-auto">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search channels..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-3">Channels</p>
                        {CHANNELS.map(ch => (
                            <button
                                key={ch.id}
                                onClick={() => setActiveChannel(ch.id)}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300
                                    ${activeChannel === ch.id
                                        ? 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 border border-pink-100 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-50 border border-transparent'}
                                `}
                            >
                                <div className={`p-1.5 rounded-lg ${activeChannel === ch.id ? 'bg-pink-100' : 'bg-gray-100'}`}>
                                    <Hash size={16} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold tracking-tight">{ch.name}</p>
                                    <p className="text-[10px] opacity-60 font-medium">#{ch.id}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">My Profile</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center font-bold text-white shadow-lg">
                                {user?.full_name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{user?.full_name}</p>
                                <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Active Now
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER: Chat Window */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl flex flex-col overflow-hidden h-[700px]">
                    {/* Chat Header */}
                    <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl border border-pink-100">
                                <Hash size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                                    {CHANNELS.find(c => c.id === activeChannel)?.name}
                                </h2>
                                <p className="text-xs text-gray-400 font-medium tracking-tight">
                                    {CHANNELS.find(c => c.id === activeChannel)?.desc}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"><Pin size={18} /></button>
                            <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"><Info size={18} /></button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-pink-100 scrollbar-track-transparent">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-pink-500" size={32} />
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Conversation...</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-pink-50 rounded-3xl flex items-center justify-center text-pink-500 mx-auto mb-4 border border-pink-100 shadow-sm">
                                        <MessageCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Welcome to #{activeChannel}!</h3>
                                    <p className="text-xs text-gray-400 font-medium max-w-[240px] mx-auto mt-2">
                                        This is the beginning of the chat. Be respectful and helpful.
                                    </p>
                                </div>

                                {messages.map((msg, i) => {
                                    const isMe = msg.user_id === user?.id;
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                {msg.avatar_url ? (
                                                    <img src={msg.avatar_url} className="w-9 h-9 rounded-2xl border-2 border-white shadow-md shadow-gray-200" alt={msg.username} />
                                                ) : (
                                                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-md ${isMe ? 'bg-pink-600' : 'bg-violet-600'} shadow-gray-200`}>
                                                        {msg.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`max-w-[70%] flex flex-col gap-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className="flex items-center gap-2 px-1">
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{msg.username}</span>
                                                    <span className="text-[10px] text-gray-300 font-bold">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className={`
                                                    p-4 rounded-[24px] shadow-sm text-sm font-medium leading-relaxed transition-all group relative
                                                    ${isMe
                                                        ? 'bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-tr-none'
                                                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none hover:border-violet-200'}
                                                `}>
                                                    {msg.message}

                                                    {/* Reactions Bar (appears on hover) */}
                                                    <div className={`
                                                        absolute -bottom-3 ${isMe ? 'right-0' : 'left-0'} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10
                                                    `}>
                                                        <button onClick={() => handleReact(msg.id, 'thumbs_up')} className="p-1.5 bg-white border border-gray-100 rounded-full shadow-sm hover:scale-110 transition-transform"><ThumbsUp size={10} className="text-pink-500" /></button>
                                                        <button onClick={() => handleReact(msg.id, 'heart')} className="p-1.5 bg-white border border-gray-100 rounded-full shadow-sm hover:scale-110 transition-transform"><Heart size={10} className="text-rose-500" /></button>
                                                        <button onClick={() => handleReact(msg.id, 'fire')} className="p-1.5 bg-white border border-gray-100 rounded-full shadow-sm hover:scale-110 transition-transform"><Flame size={10} className="text-orange-500" /></button>
                                                    </div>
                                                </div>

                                                {/* Reaction Pills */}
                                                <div className="flex flex-wrap gap-1 mt-1 px-1">
                                                    {Object.entries(msg.reactions).map(([type, count]) => count > 0 && (
                                                        <div key={type} className="flex items-center gap-1 bg-white border border-gray-100 rounded-full px-2 py-0.5 shadow-xs text-[10px] font-bold text-gray-500">
                                                            {type === 'thumbs_up' ? '👍' : type === 'heart' ? '❤️' : '🔥'} {count}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={chatEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-6 bg-white/50 border-t border-gray-100">
                        <form onSubmit={handleSend} className="relative bg-gray-50 border border-gray-100 rounded-2xl p-2.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-pink-500/10 focus-within:bg-white transition-all shadow-inner">
                            <button type="button" className="p-2.5 text-gray-400 hover:text-pink-600 transition-colors"><Smile size={20} /></button>
                            <input
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder={`Write a message to #${activeChannel}...`}
                                className="flex-1 bg-transparent py-2 px-2 text-sm font-semibold outline-none text-gray-900 placeholder:text-gray-300"
                            />
                            <div className="flex items-center gap-1">
                                <button type="button" className="p-2.5 text-gray-400 hover:text-pink-600 transition-colors hidden md:block"><Paperclip size={20} /></button>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-2.5 rounded-xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 disabled:opacity-50 transition-all"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT PANEL: Stats & Trending */}
                <div className="flex flex-col gap-6 sticky top-8 h-[calc(100vh-200px)] lg:h-auto">
                    {/* Channel Stats */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Community Hub</p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><Sparkles size={16} /></div>
                                    <span className="text-xs font-bold text-gray-700">AI Daily Tip</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                Looking to switch from ML to Web Dev? Check out the new "Web Frameworks" channel for a curated learning path.
                            </p>
                        </div>
                    </div>

                    {/* Trending */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl space-y-5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trending Topics</p>
                        <div className="space-y-3">
                            {TRENDING_TOPICS.map((topic, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 group-hover:text-pink-600 transition-colors truncate">{topic.topic}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">{topic.count} conversations today</p>
                                    </div>
                                    <TrendingUp size={14} className="text-gray-300 group-hover:text-pink-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-gray-100">
                            View All Topics
                        </button>
                    </div>

                    {/* Pinned Helpful Info */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform"><MessageSquare size={80} /></div>
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-4">Pro Tip</p>
                        <h4 className="text-lg font-black tracking-tight leading-tight mb-2">Be an Expert</h4>
                        <p className="text-xs text-white/80 font-medium leading-relaxed mb-6">
                            Marking messages as helpful increases your Community Karma score and unlocks premium badges.
                        </p>
                        <button
                            onClick={() => setShowKarmaInfo(true)}
                            className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Karma Info Modal */}
            <AnimatePresence>
                {showKarmaInfo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

                            <button
                                onClick={() => setShowKarmaInfo(false)}
                                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
                                    <Sparkles size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Community Reward System</p>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Community Karma</h3>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm text-gray-600 font-medium leading-relaxed">
                                <p>Karma points are earned by participating in discussions and helping fellow students. Here's how to earn them:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                        <span>Receive a "Helpful" reaction on your messages (+5 points)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                        <span>Answer a question in Roadmap channels (+10 points)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                        <span>Reach daily activity milestones (+2 points)</span>
                                    </li>
                                </ul>
                                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 mt-4">
                                    <p className="text-indigo-900 font-bold mb-1">Badge Rewards</p>
                                    <p className="text-xs">Higher scores unlock Silver, Gold, and Platinum badges on your profile!</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowKarmaInfo(false)}
                                className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                Got it!
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommunityChat;
