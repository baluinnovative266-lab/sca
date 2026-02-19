import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, X, Send, Bot, Sparkles, Mic, Volume2,
    VolumeX, Loader2, User, ChevronRight, CornerDownRight,
    Headphones
} from 'lucide-react';
import axios from 'axios';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your CareerSense AI assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [voiceGender, setVoiceGender] = useState('female');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [suggestions] = useState([
        "Suggest a roadmap",
        "Explain this phase",
        "Career advice",
        "Skill gaps"
    ]);


    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = useRef(null);

    useEffect(() => {
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;
            recognition.current.lang = 'en-US';

            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                setIsListening(false);
            };

            recognition.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognition.current) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognition.current.stop();
        } else {
            recognition.current.start();
            setIsListening(true);
        }
    };

    const speakText = (text) => {
        if (!('speechSynthesis' in window) || isMuted) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        // Find professional voice based on selected gender
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => {
            const name = v.name.toLowerCase();
            if (voiceGender === 'female') {
                return name.includes('google us english female') ||
                    name.includes('samantha') ||
                    name.includes('zira') ||
                    name.includes('female');
            } else {
                return name.includes('google us english male') ||
                    name.includes('daniel') ||
                    name.includes('david') ||
                    name.includes('male');
            }
        });

        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0;
        utterance.pitch = voiceGender === 'female' ? 1.0 : 0.9;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (!isMuted) window.speechSynthesis.cancel();
    };

    const toggleVoiceGender = () => {
        setVoiceGender(prev => prev === 'female' ? 'male' : 'female');
        window.speechSynthesis.cancel();
    };


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text = inputText) => {
        const query = text.trim();
        if (!query) return;

        const userMessage = { id: Date.now(), text: query, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        setIsTyping(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/chat', {
                message: query,
                career: localStorage.getItem('predicted_career') || 'Software Engineer'
            }, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            const botResponseText = response.data.reply || "I'm processing that. Can you rephrase?";
            const botResponse = {
                id: Date.now() + 1,
                text: botResponseText,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
            speakText(botResponseText);
        } catch (err) {
            console.error("Chat error:", err);
            const errorMsg = {
                id: Date.now() + 1,
                text: "I'm having trouble connecting to my brain right now. Please try again later!",
                sender: 'bot',
                isError: true
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };


    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-[350px] h-[500px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${voiceGender === 'female' ? 'bg-gradient-to-br from-pink-500 to-rose-600 shadow-pink-500/20' : 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/20'}`}>
                                    <Bot size={22} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white tracking-tight">AI {voiceGender === 'female' ? 'Maya' : 'Max'}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={`w-2 h-2 rounded-full ${isTyping || isSpeaking ? 'bg-pink-400 animate-pulse' : 'bg-green-400'}`}></span>
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                            {isTyping ? 'Thinking...' : isSpeaking ? 'Speaking' : 'Online'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 relative z-10">
                                <button
                                    onClick={toggleVoiceGender}
                                    className="p-2 rounded-xl text-white/40 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5"
                                    title={`Switch to ${voiceGender === 'female' ? 'Male' : 'Female'} voice`}
                                >
                                    <Headphones size={18} />
                                    <span className="text-[10px] font-black uppercase">{voiceGender === 'female' ? 'F' : 'M'}</span>
                                </button>
                                <button
                                    onClick={toggleMute}
                                    className={`p-2 rounded-xl transition-all ${isMuted ? 'text-rose-400 bg-rose-400/10' : 'text-white/40 hover:bg-white/10 hover:text-white'}`}
                                    title={isMuted ? "Unmute" : "Mute"}
                                >
                                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all group"
                                >
                                    <X size={18} className="text-white/30 group-hover:text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Speaking Waveform */}
                        <AnimatePresence>
                            {isSpeaking && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 40, opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-pink-500/10 flex items-center justify-center gap-1 overflow-hidden shrink-0 border-b border-pink-500/20"
                                >
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1 bg-pink-500 rounded-full"
                                            animate={{
                                                height: [10, 25, 12, 30, 15][i % 5],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 0.6,
                                                delay: i * 0.1,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    ))}
                                    <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-3">AI Audio Active</span>
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`
                                            max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed relative
                                            ${msg.sender === 'user'
                                                ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-tr-sm shadow-lg shadow-pink-500/10'
                                                : msg.isError
                                                    ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                                                    : 'bg-white/[0.08] text-white/90 rounded-tl-sm border border-white/5'}
                                        `}
                                    >
                                        <div className="flex items-start gap-2">
                                            {msg.sender === 'bot' && (
                                                <div className="w-5 h-5 rounded-lg bg-pink-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Sparkles size={12} className="text-pink-400" />
                                                </div>
                                            )}
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-4 rounded-2xl rounded-tl-sm flex gap-1.5">
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl">
                            {/* suggestions */}
                            {!isTyping && messages.length < 3 && (
                                <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-1">
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSendMessage(s)}
                                            className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-pink-500/20 hover:text-pink-400 border border-white/5 rounded-full text-[10px] font-bold text-white/40 transition-all uppercase tracking-wider"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="flex items-center gap-2"
                            >
                                <div className="relative flex-1 group">
                                    <input
                                        type="text"
                                        placeholder={isListening ? "Listening carefully..." : "Type your career question..."}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleListening}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all overflow-hidden ${isListening ? 'text-rose-400 bg-rose-400/10' : 'text-white/20 hover:text-white/60 hover:bg-white/5'}`}
                                        title="Voice Input"
                                    >
                                        <div className="relative z-10"><Mic size={18} /></div>
                                        {isListening && (
                                            <motion.div
                                                className="absolute inset-0 bg-rose-500/20"
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            />
                                        )}
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="p-3.5 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-2xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed group shrink-0"
                                >
                                    <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </form>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center text-white relative group transition-all duration-300 ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-br from-pink-500 to-rose-600 ring-4 ring-pink-500/20 animate-pulse'}`}
            >
                {isOpen ? <X size={28} /> : (
                    <div className="relative">
                        <MessageSquare size={28} />
                        <motion.div
                            className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-pink-500"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    </div>
                )}

                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0">
                        <div className="bg-white text-slate-900 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap border border-gray-100 flex items-center gap-2">
                            <Sparkles size={12} className="text-pink-500" />
                            CareerSense AI Assistant
                        </div>
                    </div>
                )}
            </motion.button>

        </div>
    );
};

export default ChatBot;
