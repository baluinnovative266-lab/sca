import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Calendar, Clock, Target, BookOpen, Video, PlayCircle,
    FileText, Globe, Code, Zap, ChevronRight, MessageSquare, ThumbsUp,
    Send, CheckCircle2, MoreHorizontal, Share2, Award, ExternalLink,
    ChevronLeft, Grid, AlertCircle, X, CornerDownRight, ChevronDown,
    ArrowRight, Loader2, Sparkles, Briefcase, Building
} from 'lucide-react';
import { PLATFORM_LOGOS } from '../utils/constants';
import PhaseGrid from '../components/PhaseGrid';
import Breadcrumbs from '../components/Breadcrumbs';
import SidePanel from '../components/SidePanel';
import axios from 'axios';
import MindMap from '../components/MindMap';

// Unified Pink/Rose Theme
const phaseColors = [
    {
        gradient: 'from-pink-600/10 via-rose-500/5 to-transparent',
        accent: '#ec4899', // Pink-500
        glow: 'bg-pink-500/10',
        tag: 'bg-pink-50 text-pink-600 border-pink-100',
        text: 'text-pink-600',
        border: 'border-pink-100'
    }
];

const TAG_OPTIONS = [
    { value: 'skills', label: '#skills', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { value: 'projects', label: '#projects', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { value: 'career', label: '#career', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { value: 'interview', label: '#interview', color: 'bg-amber-50 text-amber-600 border-amber-100' },
];

const Toast = ({ message, type = 'info', onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-2xl shadow-2xl border border-white/10 min-w-[320px]"
    >
        <div className={`p-2 rounded-xl ${type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-pink-500/20 text-pink-400'}`}>
            {type === 'error' ? <AlertCircle size={18} /> : <Sparkles size={18} />}
        </div>
        <div className="flex-1 text-sm font-bold">{message}</div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X size={16} className="text-white/40" />
        </button>
    </motion.div>
);

// =============================================
// Build dynamic mindmap from phase API data
// =============================================
function buildMindMapFromAPI(phaseName, mindmapNodes, accentColor) {
    const nodes = [];
    const edges = [];

    if (!mindmapNodes || !mindmapNodes.branches) {
        return { nodes: [], edges: [] };
    }

    // Center node
    nodes.push({
        id: 'root',
        position: { x: 400, y: 20 },
        data: { label: phaseName },
        type: 'input',
        style: {
            background: '#ec4899', // Pink-500
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.2)',
        },
    });

    const branches = mindmapNodes.branches;
    const branchSpacing = 280;
    const startX = 400 - ((branches.length - 1) * branchSpacing) / 2;

    branches.forEach((branch, i) => {
        const branchId = `branch-${i}`;
        const x = startX + i * branchSpacing;
        const y = 140;

        // Simplified node style
        const bColor = '#f472b6'; // Pink-400

        nodes.push({
            id: branchId,
            position: { x, y },
            data: { label: branch.name },
            style: {
                background: 'white',
                color: '#1f2937', // Gray-800
                border: `1px solid ${bColor}`,
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: 600,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            },
        });

        edges.push({
            id: `e-root-${branchId}`,
            source: 'root',
            target: branchId,
            animated: true,
            style: { stroke: '#ec4899', strokeWidth: 1.5, opacity: 0.5 },
        });

        // Subnodes
        if (branch.subnodes) {
            const subSpacing = 160;
            const subStartX = x - ((branch.subnodes.length - 1) * subSpacing) / 2;

            branch.subnodes.forEach((sub, j) => {
                const subId = `${branchId}-sub-${j}`;
                nodes.push({
                    id: subId,
                    position: { x: subStartX + j * subSpacing, y: y + 120 },
                    data: { label: sub },
                    style: {
                        background: 'white',
                        color: '#4b5563', // Gray-600
                        border: '1px solid #f3f4f6',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        fontSize: '11px',
                        fontWeight: 600,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                        textAlign: 'center',
                    },
                });
                edges.push({
                    id: `e-${branchId}-${subId}`,
                    source: branchId,
                    target: subId,
                    animated: false,
                    style: { stroke: '#f3f4f6', strokeWidth: 2 },
                });
            });
        }
    });

    return { nodes, edges };
}

const resourceIcons = {
    video: <Video className="text-rose-500" size={18} />,
    course: <PlayCircle className="text-blue-500" size={18} />,
    article: <FileText className="text-emerald-500" size={18} />,
    guide: <BookOpen className="text-purple-500" size={18} />,
    pdf: <FileText className="text-orange-500" size={18} />,
    link: <Globe className="text-gray-500" size={18} />,
    code: <Code className="text-amber-500" size={18} />,
    tool: <Zap className="text-pink-500" size={18} />
};

// PLATFORM_LOGOS moved to src/utils/constants.js

// =============================================
// COMMENT COMPONENT (with threading)
// =============================================
const CommentItem = ({ comment, depth = 0, onReply, onUpvote }) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showReplies, setShowReplies] = useState(true);

    const handleReply = () => {
        if (replyText.trim()) {
            onReply(comment.id, replyText);
            setReplyText('');
            setShowReplyBox(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: depth * 0.05 }}
            className={`${depth > 0 ? 'ml-8 border-l border-gray-100 pl-4' : ''}`}
        >
            <div className={`rounded-xl p-5 border transition-all mb-4 bg-white shadow-sm hover:shadow-md
                ${comment.is_accepted
                    ? 'border-emerald-100 ring-1 ring-emerald-50'
                    : 'border-gray-100'
                }`}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                        {(comment.user_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="text-gray-900 font-bold text-sm tracking-tight">{comment.user_name || 'Anonymous'}</p>
                            {comment.is_accepted && (
                                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 font-bold uppercase tracking-wide">SOLVED</span>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">
                            {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'just now'}
                        </p>
                    </div>
                </div>

                {/* Pros/Cons */}
                {(comment.pros || comment.cons) && (
                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                        {comment.pros && (
                            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                <p className="text-[10px] text-emerald-600 font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Pros
                                </p>
                                <p className="text-xs text-emerald-900/80 leading-relaxed">{comment.pros}</p>
                            </div>
                        )}
                        {comment.cons && (
                            <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                                <p className="text-[10px] text-rose-600 font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Cons
                                </p>
                                <p className="text-xs text-rose-900/80 leading-relaxed">{comment.cons}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                {comment.content && (
                    <div className="pl-3 border-l-2 border-pink-100 mb-4">
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">"{comment.content}"</p>
                    </div>
                )}

                {/* Tags */}
                {comment.tags && (
                    <div className="flex gap-2 mb-3">
                        {comment.tags.split(',').map((tag, i) => {
                            const tagOption = TAG_OPTIONS.find(t => t.value === tag.trim());
                            return (
                                <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${tagOption?.color || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                    #{tag.trim()}
                                </span>
                            );
                        })}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <button
                        onClick={() => onUpvote(comment.id)}
                        className="flex items-center gap-1 hover:text-pink-600 transition-colors"
                    >
                        <ThumbsUp size={14} /> {comment.upvotes || 0}
                    </button>
                    {depth === 0 && (
                        <button
                            onClick={() => setShowReplyBox(!showReplyBox)}
                            className="flex items-center gap-1 hover:text-pink-600 transition-colors"
                        >
                            <CornerDownRight size={14} /> Reply
                        </button>
                    )}
                </div>

                {/* Reply Box */}
                <AnimatePresence>
                    {showReplyBox && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 overflow-hidden">
                            <div className="flex gap-2">
                                <input
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-pink-500 outline-none"
                                    onKeyDown={e => e.key === 'Enter' && handleReply()}
                                />
                                <button onClick={handleReply} className="bg-pink-600 px-3 py-2 rounded-lg text-white text-sm font-bold hover:bg-pink-700 transition-colors">
                                    <Send size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Threaded Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="text-xs text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1 ml-8"
                    >
                        <ChevronDown size={12} className={`transition-transform ${showReplies ? '' : '-rotate-90'}`} />
                        {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                    <AnimatePresence>
                        {showReplies && comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                depth={depth + 1}
                                onReply={onReply}
                                onUpvote={onUpvote}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};


// =============================================
// MAIN COMPONENT
// =============================================
const PhaseDetail = () => {
    const { phaseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('roadmap');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

    // Unified Pink Theme
    const colors = phaseColors[0]; // Always use the pink theme

    // ---- Data from API ----
    const [phaseData, setPhaseData] = useState(null);
    const [career, setCareer] = useState('');
    const [loading, setLoading] = useState(true);

    // ---- ReactFlow Mindmap removed as it is now in MindMap component ----


    // ---- Comments ----
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ content: '', pros: '', cons: '', tags: '' });
    const [submitting, setSubmitting] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);

    // ---- Local Data for Completion Tracking ----
    const [localSteps, setLocalSteps] = useState([]);

    // Initialize local steps when phaseData loads
    useEffect(() => {
        if (phaseData?.steps) {
            // Check localStorage for saved completion status
            const savedCompletion = JSON.parse(localStorage.getItem(`phase_completion_${phaseId}`)) || {};

            const mergedSteps = phaseData.steps.map(step => ({
                ...step,
                is_completed: savedCompletion[step.title] || step.is_completed || false
            }));
            setLocalSteps(mergedSteps);
        }
    }, [phaseData, phaseId]);

    // ---- SidePanel state ----
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [panelData, setPanelData] = useState(null);
    const [panelTitle, setPanelTitle] = useState('');
    const [panelType, setPanelType] = useState('skill');

    const handleStepClick = (step) => {
        // Enriched logic: use backend data attached to the step
        const skillName = step.skill || step.title;

        // Find the most up-to-date state of this step
        const currentStep = localSteps.find(s => s.title === step.title) || step;

        const details = {
            description: step.skill_details?.description || step.outcome || step.custom_description || "Mastering this module is key to your progress in this phase.",
            importance: step.skill_details?.importance || "Core component of the " + displayTitle,
            use_cases: step.skill_details?.use_cases || ["Professional development", "Project implementation"],
            objectives: step.skill_details?.objectives || [step.title, "Practical application"],
            learning_time: step.skill_details?.learning_time || step.duration || "1-2 Weeks",
            resources: step.module_resources || [],
            featured_project: step.featured_project || null,
            // Pass full step object for reference
            title: step.title,
            is_completed: currentStep.is_completed
        };

        setPanelTitle(step.title);
        setPanelData(details);
        setPanelType('skill');
        setIsPanelOpen(true);
    };

    const handleToggleComplete = (stepTitle) => {
        setLocalSteps(prev => {
            const updated = prev.map(s =>
                s.title === stepTitle ? { ...s, is_completed: !s.is_completed } : s
            );

            // Save to localStorage
            const completionMap = updated.reduce((acc, s) => {
                if (s.is_completed) acc[s.title] = true;
                return acc;
            }, {});
            localStorage.setItem(`phase_completion_${phaseId}`, JSON.stringify(completionMap));

            // Update panel data live if open
            if (panelTitle === stepTitle) {
                setPanelData(prevData => ({ ...prevData, is_completed: !prevData.is_completed }));
            }

            return updated;
        });
        showToast("Progress updated!", "success");
    };

    // ---- AI Insights ----
    const [aiInsights, setAiInsights] = useState(null);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [resourceLoading, setResourceLoading] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleResourceClick = async (res) => {
        setResourceLoading(res.title);

        let href = res.url || res.link;
        if (href && !href.startsWith('http')) href = `https://${href}`;

        // Small delay for UX/loading feel
        setTimeout(() => {
            if (!href || href === '#' || href.includes('undefined')) {
                showToast("Resource temporarily unavailable.", "error");
            } else {
                if (res.type === 'pdf') {
                    // Force PDF view in new tab or specific viewer logic could go here
                    window.open(href, '_blank', 'noopener,noreferrer');
                } else {
                    window.open(href, '_blank', 'noopener,noreferrer');
                }
                showToast(`Opening ${res.title}...`, "success");
            }
            setResourceLoading(null);
        }, 800);
    };

    // Fetch roadmap data from API
    useEffect(() => {
        const fetchPhaseData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/get-roadmap', {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });

                const roadmapData = response.data.roadmap || [];
                const userCareer = response.data.career || 'Software Engineer';
                setCareer(userCareer);

                const phaseTitle = phaseId ? phaseId.toLowerCase().replace(/[-_]/g, ' ') : '';

                // Normalize helper: lowercase, replace dashes/emdashes, collapse spaces
                const normalize = (s) => s.toLowerCase().replace(/[-–—_]/g, ' ').replace(/\s+/g, ' ').trim();
                const idNormalized = normalize(phaseTitle);

                // Strategy 1: Exact normalized match
                let matched = roadmapData.find(p => normalize(p.phase) === idNormalized);

                // Strategy 2: Extract phase number from URL (e.g. "phase 1 foundations" → 1)
                if (!matched) {
                    const phaseNumMatch = idNormalized.match(/phase\s*(\d+)/);
                    if (phaseNumMatch) {
                        const targetNum = phaseNumMatch[1];
                        matched = roadmapData.find(p => {
                            const pNum = normalize(p.phase).match(/phase\s*(\d+)/);
                            return pNum && pNum[1] === targetNum;
                        });
                    }
                }

                // Strategy 3: Substring match as final fallback
                if (!matched) {
                    matched = roadmapData.find(p => {
                        const pNorm = normalize(p.phase);
                        return pNorm === idNormalized || idNormalized === pNorm;
                    });
                }

                if (matched) {
                    setPhaseData(matched);
                } else if (roadmapData.length > 0) {
                    // Ultimate fallback: first phase
                    setPhaseData(roadmapData[0]);
                }
            } catch (err) {
                console.error("Failed to load phase data", err);
                // Fallback to cached data
                const cached = localStorage.getItem('current_roadmap');
                if (cached) {
                    const roadmapData = JSON.parse(cached);
                    if (roadmapData[0]) {
                        setPhaseData(roadmapData[0]);
                    }
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPhaseData();
    }, [phaseId]);

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments/${phaseId || 'general'}`);
                setComments(response.data);
            } catch (err) {
                console.error("Failed to fetch comments", err);
            }
        };
        if (activeTab === 'discussion') {
            fetchComments();
            fetchAIInsights();
        }
    }, [activeTab, phaseId]);

    // Fetch AI Insights
    const fetchAIInsights = async (question = '') => {
        setInsightsLoading(true);
        try {
            const response = await axios.post('/api/discussion-insights', {
                career: career || 'Software Engineer',
                phase: phaseData?.phase || 'Phase 1 – Foundations',
                question
            });
            setAiInsights(response.data);
        } catch (err) {
            console.error("Failed to fetch AI insights", err);
            setAiInsights({
                advice: "Keep learning and building! Consistency is key.",
                skill_gaps: ["Core technical skills", "Soft skills"],
                next_actions: ["Set weekly goals", "Build projects"]
            });
        } finally {
            setInsightsLoading(false);
        }
    };

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []
    );

    // Post comment
    const handleCommentSubmit = async () => {
        if (!newComment.content && !newComment.pros && !newComment.cons) return;
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/comments', {
                phase_id: phaseId || 'general',
                content: newComment.content || '(no comment)',
                pros: newComment.pros,
                cons: newComment.cons,
                tags: selectedTags.join(','),
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Refresh comments
            const refresh = await axios.get(`/api/comments/${phaseId || 'general'}`);
            setComments(refresh.data);
            setNewComment({ content: '', pros: '', cons: '', tags: '' });
            setSelectedTags([]);

            // Refresh AI insights if question was posted
            if (newComment.content) {
                fetchAIInsights(newComment.content);
            }
        } catch (err) {
            console.error("Failed to post comment", err);
        } finally {
            setSubmitting(false);
        }
    };

    // Reply to comment
    const handleReply = async (parentId, content) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/comments', {
                phase_id: phaseId || 'general',
                content,
                parent_id: parentId,
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const refresh = await axios.get(`/api/comments/${phaseId || 'general'}`);
            setComments(refresh.data);
        } catch (err) {
            console.error("Failed to post reply", err);
        }
    };

    // Upvote
    const handleUpvote = async (commentId) => {
        try {
            await axios.post(`/api/comments/${commentId}/upvote`);
            const refresh = await axios.get(`/api/comments/${phaseId || 'general'}`);
            setComments(refresh.data);
        } catch (err) {
            console.error("Failed to upvote", err);
        }
    };

    // Tag toggle
    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    // Fallback if no data
    const displayTitle = phaseData?.phase || (phaseId ? phaseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Phase Detail");
    const displayDesc = phaseData?.description || "Review and master the core concepts required for this stage.";
    const objectives = phaseData?.objectives || [];
    const masteryChecklist = phaseData?.mastery_checklist || [];
    const improvementAreas = phaseData?.improvement_areas || [];
    const steps = localSteps.length > 0 ? localSteps : (phaseData?.steps || []);
    const phaseFocus = phaseData?.focus || "Building expertise";

    const completedSteps = steps.filter(s => s.is_completed || s.status === 'completed').length;
    const progress = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-pink-100 selection:text-pink-900 pb-20">

            {/* Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/roadmap/overview')}
                        className="p-2.5 bg-gray-50 hover:bg-white hover:shadow-md rounded-xl transition-all border border-gray-100 group"
                    >
                        <ChevronLeft size={20} className="text-gray-500 group-hover:text-pink-600" />
                    </button>
                    <div className="h-8 w-px bg-gray-100 hidden md:block" />
                    <div>
                        <div className="mb-1">
                            <Breadcrumbs />
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {displayTitle}
                        </h1>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <div className="text-right mr-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</p>
                        <p className="text-xs font-bold text-gray-900 uppercase">{phaseFocus}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100">
                        <Award size={20} />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Overview & Roadmap */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Hero Card */}
                    <div className="relative overflow-hidden glass-card p-8 !bg-white/90">
                        {/* Pink Accent Gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-60" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-pink-50 text-pink-600 border-pink-100">
                                        {phaseFocus}
                                    </span>
                                </div>

                                <h2 className="text-3xl font-black mb-4 leading-tight text-gray-900">
                                    {displayTitle}
                                </h2>

                                <p className="text-sm text-gray-500 mb-6 max-w-xl leading-relaxed">
                                    {displayDesc}
                                </p>
                            </div>

                            {/* Circular Progress */}
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="50%" cy="50%" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                    <circle cx="50%" cy="50%" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                        strokeDasharray={251.2}
                                        strokeDashoffset={251.2 - (251.2 * progress) / 100}
                                        className="text-pink-500 transition-all duration-1000 ease-out"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute text-sm font-bold text-gray-900">{progress}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-8 border-b border-gray-200">
                        {['roadmap', 'mindmap', 'resources', 'career', 'discussion'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${activeTab === tab ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab === 'career' ? 'Career Opportunities' : tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'roadmap' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">

                                {/* Dynamic Workspace Tools */}
                                {phaseData?.tools && phaseData.tools.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                    <Grid size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Workspace Tools</h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Required setup for this phase</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {phaseData.tools.map((tool, i) => (
                                                <motion.a
                                                    key={i}
                                                    href={tool.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ y: -4, scale: 1.02 }}
                                                    className="flex items-center gap-4 bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group relative overflow-hidden"
                                                >
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center p-2 group-hover:bg-indigo-50 transition-colors">
                                                        {tool.logo ? (
                                                            <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain filter group-hover:drop-shadow-sm" />
                                                        ) : (
                                                            <Zap className="text-indigo-500" size={20} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-black text-gray-900 truncate group-hover:text-indigo-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{tool.name}</h4>
                                                        <p className="text-[10px] font-bold text-gray-400 line-clamp-1">{tool.desc || 'Direct download available'}</p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                        <ExternalLink size={14} />
                                                    </div>
                                                </motion.a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Mastery Checklist & AI Companion */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white p-6 rounded-[2rem] border border-pink-100 shadow-sm relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-80 transition-opacity" />
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/20">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <h3 className="font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Mastery Checklist</h3>
                                            </div>
                                            <ul className="space-y-3">
                                                {(masteryChecklist.length > 0 ? masteryChecklist : objectives).slice(0, 3).map((obj, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-xs font-bold text-gray-600">
                                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
                                                        {obj}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group cursor-pointer"
                                        whileHover={{ y: -5 }}
                                        onClick={() => setActiveTab('discussion')}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                    <Sparkles size={20} />
                                                </div>
                                                <h3 className="font-black uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AI Study Companion</h3>
                                            </div>
                                            <p className="text-xs font-bold text-indigo-100 mb-4 leading-relaxed">
                                                "Ready to deep dive? Open the AI Discussion hub for personalized tips and study resources."
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 w-fit px-3 py-1.5 rounded-lg border border-white/20">
                                                Launch Companion <ArrowRight size={12} />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {objectives.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="glass-card p-6 !bg-white/80 border-pink-100 shadow-sm">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Target size={18} className="text-pink-500" />
                                                <h3 className="font-bold text-gray-900">Learning Objectives</h3>
                                            </div>
                                            <ul className="space-y-3">
                                                {objectives.map((obj, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-xs text-gray-600 leading-relaxed">
                                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0 shadow-[0_0_8px_rgba(244,114,182,0.5)]" />
                                                        {obj}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="glass-card p-6 !bg-white/80 border-amber-100 shadow-sm">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Zap size={18} className="text-amber-500" />
                                                <h3 className="font-bold text-gray-900">Strategic Focus</h3>
                                            </div>
                                            <ul className="space-y-3">
                                                {improvementAreas.map((area, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-xs text-gray-600 leading-relaxed">
                                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 shadow-[0_0_8px_rgba(fb,191,36,0.5)]" />
                                                        {area}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Phase Grid */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-lg text-gray-900">Timeline & Modules</h3>
                                    </div>
                                    <PhaseGrid steps={steps} onStepClick={handleStepClick} />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'mindmap' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-[800px]"
                            >
                                <MindMap phaseData={phaseData} career={career} />
                            </motion.div>
                        )}

                        {activeTab === 'resources' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                                {['course', 'video', 'article', 'pdf', 'guide'].map(category => {
                                    const filtered = phaseData?.resources?.filter(res => res.type === category) || [];
                                    if (filtered.length === 0) return null;

                                    return (
                                        <div key={category} className="space-y-6">
                                            <div className="flex items-center gap-3 px-2">
                                                <div className="p-2 rounded-xl bg-pink-50 text-pink-600 border border-pink-100 shadow-sm">
                                                    {resourceIcons[category] || <Globe size={20} />}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-black text-gray-900 uppercase tracking-widest">{category}s</h3>
                                                    <p className="text-[10px] text-gray-400 font-bold">Premium learning content for {displayTitle}</p>
                                                </div>
                                                <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent ml-4" />
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {filtered.map((res, i) => (
                                                    <motion.div
                                                        key={i}
                                                        layout
                                                        className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:border-pink-200 transition-all overflow-hidden"
                                                    >
                                                        {resourceLoading === res.title && (
                                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
                                                                <Loader2 size={24} className="animate-spin text-pink-500" />
                                                            </div>
                                                        )}

                                                        <div className="p-6">
                                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center p-2.5 group-hover:bg-pink-50 transition-colors border border-gray-50 group-hover:border-pink-100">
                                                                    {PLATFORM_LOGOS[res.platform] ? (
                                                                        <img src={PLATFORM_LOGOS[res.platform]} alt={res.platform} className="w-full h-full object-contain" />
                                                                    ) : (
                                                                        resourceIcons[res.type] || <Globe size={20} className="text-gray-400" />
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="px-2.5 py-1 rounded-lg bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-tight border border-gray-100 group-hover:bg-pink-50 group-hover:text-pink-600 group-hover:border-pink-100 transition-colors">
                                                                        {res.difficulty || 'Intermediate'}
                                                                    </span>
                                                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-tight border border-emerald-100">
                                                                        {res.duration || '2h'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="mb-6">
                                                                <h4 className="font-black text-gray-900 text-lg leading-tight mb-2 group-hover:text-pink-600 transition-colors">
                                                                    {res.title}
                                                                </h4>
                                                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                                    {res.description || `Build mastery in ${res.title} with this ${res.type}.`}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{res.platform || 'General'}</span>
                                                                <button
                                                                    onClick={() => handleResourceClick(res)}
                                                                    className="flex items-center gap-2 text-xs font-black text-pink-600 hover:text-pink-700 transition-colors"
                                                                >
                                                                    {res.type === 'video' ? 'Watch Now' : res.type === 'pdf' ? 'View PDF' : 'Start Learning'}
                                                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-full blur-3xl -mr-12 -mt-12 opacity-0 group-hover:opacity-40 transition-opacity" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                                {(!phaseData?.resources || phaseData.resources.length === 0) && (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
                                        <p className="text-gray-400 font-medium">No specialized resources listed for this phase yet.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'career' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                                <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -mr-32 -mt-32" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                                                <Briefcase size={20} />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Career Opportunities</h3>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-6 max-w-2xl leading-relaxed font-medium">
                                            Based on your progress in <span className="text-indigo-600 font-bold">{displayTitle}</span>, we've identified roles at top companies where your skills are in high demand. Complete this phase to improve your match score.
                                        </p>
                                        <Link
                                            to="/job-board"
                                            className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                        >
                                            View Full Job Board <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Quick Match Preview */}
                                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Best Role Match</h4>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Building className="text-slate-400" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900 leading-tight">Software Engineer</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Google</p>
                                            </div>
                                            <div className="ml-auto flex flex-col items-center">
                                                <span className="text-xl font-black text-emerald-500">85%</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Match</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[85%]" />
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Growth Path</h4>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Target className="text-amber-500" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900 leading-tight">Cloud Architect</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Amazon</p>
                                            </div>
                                            <div className="ml-auto flex flex-col items-center">
                                                <span className="text-xl font-black text-amber-500">60%</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Match</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 w-[60%]" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 'discussion' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {/* Discussion Grid - AI & Comments */}
                                <div className="grid lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* New Comment Box */}
                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <h3 className="font-bold text-gray-900 mb-4">Share Insights</h3>
                                            <textarea
                                                value={newComment.content}
                                                onChange={e => setNewComment({ ...newComment, content: e.target.value })}
                                                placeholder="Ask a question or share a tip..."
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-pink-500 outline-none mb-3 resize-none h-24"
                                            />
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <input
                                                    value={newComment.pros}
                                                    onChange={e => setNewComment({ ...newComment, pros: e.target.value })}
                                                    placeholder="Pros (Optional)"
                                                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs"
                                                />
                                                <input
                                                    value={newComment.cons}
                                                    onChange={e => setNewComment({ ...newComment, cons: e.target.value })}
                                                    placeholder="Cons (Optional)"
                                                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-2">
                                                    {TAG_OPTIONS.map(opt => (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => toggleTag(opt.value)}
                                                            className={`px-2 py-1 rounded-full text-[10px] font-bold border transition-all ${selectedTags.includes(opt.value) ? opt.color : 'bg-white border-gray-200 text-gray-400'}`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={handleCommentSubmit}
                                                    disabled={submitting || !newComment.content}
                                                    className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-700 transition-colors disabled:opacity-50"
                                                >
                                                    {submitting ? 'Posting...' : 'Post'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Comments List */}
                                        <div className="space-y-4">
                                            {comments.map(c => (
                                                <CommentItem key={c.id} comment={c} onReply={handleReply} onUpvote={handleUpvote} />
                                            ))}
                                            {comments.length === 0 && (
                                                <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
                                                    <MessageSquare className="mx-auto text-gray-300 mb-2" size={32} />
                                                    <p className="text-gray-400 text-sm">No discussions yet. Start the conversation!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* AI Sidebar */}
                                    <div className="space-y-6">
                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                                            <div className="flex items-center gap-2 mb-4 text-pink-600">
                                                <Sparkles size={18} />
                                                <h3 className="font-bold text-gray-900">AI Mentor</h3>
                                            </div>

                                            {insightsLoading ? (
                                                <div className="animate-pulse space-y-3">
                                                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                                                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Advice</h4>
                                                        <p className="text-sm text-gray-600 leading-relaxed bg-pink-50/50 p-3 rounded-lg border border-pink-50">
                                                            {aiInsights?.advice || "Ask a question to get AI-powered insights tailored to this phase."}
                                                        </p>
                                                    </div>
                                                    {aiInsights?.skill_gaps && (
                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Skill Gaps</h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {aiInsights.skill_gaps.map((skill, i) => (
                                                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200">{skill}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column: Skills & Tools */}
                <div className="space-y-6">
                    {/* Skills Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Award size={18} className="text-pink-500" /> Skills to Master
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {Array.from(new Set((phaseData?.steps || []).map(s => s.skill))).map((skill, i) => (
                                <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-900/80 text-xs font-semibold rounded-lg border border-gray-100 hover:border-pink-200 hover:text-pink-600 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tools Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Grid size={18} className="text-indigo-500" /> Recommended Tools
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {(phaseData?.tools || ['VS Code', 'GitHub', 'Figma', 'Notion']).map((tool, i) => {
                                const toolName = typeof tool === 'object' ? tool.name : tool;
                                const toolDesc = typeof tool === 'object' ? tool.desc : 'Standard for this phase';
                                const toolUrl = typeof tool === 'object' ? tool.url : '#';
                                const toolLogo = typeof tool === 'object' ? tool.logo : null;

                                return (
                                    <a
                                        key={i}
                                        href={toolUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-indigo-100 transition-all group cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center p-2 group-hover:bg-indigo-50 transition-colors">
                                            {toolLogo ? (
                                                <img src={toolLogo} alt={toolName} className="w-full h-full object-contain" />
                                            ) : (
                                                <Zap className="text-indigo-500" size={16} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-black text-gray-700 block truncate group-hover:text-indigo-600 transition-colors">{toolName}</span>
                                            <p className="text-[10px] text-gray-400 font-bold truncate">{toolDesc}</p>
                                        </div>
                                        <div className="text-gray-300 group-hover:text-indigo-500 transition-colors">
                                            <ExternalLink size={14} />
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={panelTitle}
                data={panelData}
                type={panelType}
                onToggleComplete={handleToggleComplete}
            />

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>
        </div >
    );
};

export default PhaseDetail;
