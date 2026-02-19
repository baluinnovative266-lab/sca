import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Moon, Shield, Save, Mail, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getAvatarRecommendations } from '../services/api';

const Settings = () => {
    const { user, updateProfile, changePassword } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_url || '');

    // Password State
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(false);
    const [saving, setSaving] = useState(false);

    // 2FA State
    const [twoFAEnabled, setTwoFAEnabled] = useState(user?.two_fa_enabled || false);
    const [showTwoFAModal, setShowTwoFAModal] = useState(false);
    const [twoFASetupData, setTwoFASetupData] = useState(null);
    const [twoFAVerifyCode, setTwoFAVerifyCode] = useState('');
    const [twoFALoading, setTwoFALoading] = useState(false);

    useEffect(() => {
        setTwoFAEnabled(user?.two_fa_enabled || false);
    }, [user]);

    const handleSetup2FA = async () => {
        setTwoFALoading(true);
        try {
            const response = await axios.post('/api/auth/2fa/setup');
            setTwoFASetupData(response.data);
            setShowTwoFAModal(true);
        } catch (error) {
            alert("Failed to setup 2FA");
        } finally {
            setTwoFALoading(false);
        }
    };

    const handleEnable2FA = async () => {
        setTwoFALoading(true);
        try {
            await axios.post('/api/auth/2fa/enable', { code: twoFAVerifyCode });
            alert("2FA enabled successfully!");
            setShowTwoFAModal(false);
            setTwoFAEnabled(true);
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to enable 2FA");
        } finally {
            setTwoFALoading(false);
        }
    };

    const handleDisable2FA = async () => {
        if (!window.confirm("Are you sure you want to disable 2FA? This will reduce your account security.")) return;
        setTwoFALoading(true);
        try {
            await axios.post('/api/auth/2fa/disable');
            alert("2FA disabled successfully");
            setTwoFAEnabled(false);
        } catch (error) {
            alert("Failed to disable 2FA");
        } finally {
            setTwoFALoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: UserCircle },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
    ];

    useEffect(() => {
        if (activeTab === 'profile') {
            fetchRecommendations();
        }
    }, [activeTab]);

    const fetchRecommendations = async () => {
        setLoadingRecs(true);
        try {
            const data = await getAvatarRecommendations();
            setRecommendations(data);
        } catch (error) {
            console.error("Failed to fetch avatar recommendations", error);
        } finally {
            setLoadingRecs(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        const result = await updateProfile({
            full_name: fullName,
            avatar_url: selectedAvatar
        });
        setSaving(false);
        if (result.success) {
            alert("Profile updated successfully!");
        } else {
            alert(result.error);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            alert("Please fill in all password fields.");
            return;
        }
        if (passwords.new !== passwords.confirm) {
            alert("New passwords do not match.");
            return;
        }
        if (passwords.new.length < 8) {
            alert("New password must be at least 8 characters.");
            return;
        }

        setSaving(true);
        const result = await changePassword(passwords.current, passwords.new);
        setSaving(false);

        if (result.success) {
            alert("Password updated successfully!");
            setPasswords({ current: '', new: '', confirm: '' });
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="pt-28 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Account Settings</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your identity, security, and preferences.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-3 sticky top-28">
                            <nav className="space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
                                                ? 'bg-primary/10 text-primary shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                                }`}
                                        >
                                            <Icon size={18} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-3/4">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 sm:p-12 mb-8"
                        >
                            {activeTab === 'profile' && (
                                <div className="space-y-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h3>
                                        <div className="flex flex-col sm:flex-row items-center gap-8 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                            <div className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl text-white font-black shadow-lg shadow-primary/20 overflow-hidden">
                                                {selectedAvatar ? (
                                                    <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    user?.full_name?.[0].toUpperCase() || 'U'
                                                )}
                                            </div>
                                            <div className="text-center sm:text-left">
                                                <p className="text-sm font-bold text-gray-800">Your Current Identity</p>
                                                <p className="text-xs text-gray-400 mt-1 font-medium italic">
                                                    {user?.predicted_career ? `Based on: ${user.predicted_career}` : 'Predicted career pending...'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Avatar Recommendation Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800">Recommended Avatars for You</h4>
                                                <p className="text-sm text-gray-500 font-medium mt-1">
                                                    {user?.predicted_career
                                                        ? `Based on your predicted career path: ${user.predicted_career}`
                                                        : 'Complete a career analysis to get personalized recommendations!'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={fetchRecommendations}
                                                className="text-xs font-black text-primary hover:underline uppercase tracking-wider"
                                            >
                                                Refresh
                                            </button>
                                        </div>

                                        {loadingRecs ? (
                                            <div className="grid grid-cols-4 gap-4">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-2xl" />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                                {recommendations.map((path, index) => (
                                                    <motion.div
                                                        key={index}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setSelectedAvatar(path)}
                                                        className={`relative aspect-square rounded-2xl cursor-pointer overflow-hidden border-4 transition-all ${selectedAvatar === path
                                                            ? 'border-primary shadow-lg shadow-primary/20'
                                                            : 'border-transparent hover:border-gray-200 bg-gray-50'
                                                            }`}
                                                    >
                                                        <img
                                                            src={path}
                                                            alt={`Avatar recommendation ${index}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://ui-avatars.com/api/?name=Avatar&background=random";
                                                            }}
                                                        />
                                                        {selectedAvatar === path && (
                                                            <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-md">
                                                                <Save size={12} />
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold shadow-inner"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    value={user?.email}
                                                    disabled
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-500 font-bold cursor-not-allowed opacity-75"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-gray-50">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <Save size={20} />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-10">
                                    <h3 className="text-xl font-bold text-gray-800">Password & Security</h3>

                                    <div className="space-y-6 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Current Password</label>
                                            <input
                                                type="password"
                                                value={passwords.current}
                                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">New Password</label>
                                            <input
                                                type="password"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                placeholder="Min 8 characters"
                                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h4 className="font-bold text-orange-800 flex items-center gap-2">
                                                <Shield size={18} /> Two-Factor Authentication
                                            </h4>
                                            <p className="text-sm text-orange-700/80 mt-2 font-medium">Add an extra layer of security to your account by enabling 2FA.</p>

                                            {twoFAEnabled ? (
                                                <div className="mt-4 flex flex-col gap-3">
                                                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                        2FA is currently active
                                                    </div>
                                                    <button
                                                        onClick={handleDisable2FA}
                                                        className="text-sm font-black text-red-600 hover:underline text-left"
                                                    >
                                                        Disable 2FA
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handleSetup2FA}
                                                    disabled={twoFALoading}
                                                    className="mt-4 text-sm font-black text-orange-800 hover:underline"
                                                >
                                                    {twoFALoading ? 'Setting up...' : 'Enable now →'}
                                                </button>
                                            )}
                                        </div>
                                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-[0.03] rotate-12">
                                            <Shield size={120} />
                                        </div>
                                    </div>

                                    {/* 2FA Setup Modal */}
                                    {showTwoFAModal && (
                                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative"
                                            >
                                                <button
                                                    onClick={() => setShowTwoFAModal(false)}
                                                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                                                >
                                                    ✕
                                                </button>

                                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Setup 2-Step Verification</h3>
                                                <p className="text-gray-500 mb-8 font-medium">Scan the QR code or enter the secret manually into your authenticator app.</p>

                                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center gap-6 mb-8">
                                                    {twoFASetupData?.qr_code ? (
                                                        <img
                                                            src={`data:image/png;base64,${twoFASetupData.qr_code}`}
                                                            alt="2FA QR Code"
                                                            className="w-48 h-48 rounded-xl shadow-md"
                                                        />
                                                    ) : (
                                                        <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                                                            QR Code Error
                                                        </div>
                                                    )}

                                                    <div className="w-full">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-1">Manual Setup Secret</p>
                                                        <div className="bg-white border border-gray-200 py-3 px-4 rounded-xl text-center font-mono font-bold text-gray-800 tracking-wider text-sm">
                                                            {twoFASetupData?.secret}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Verification Code</label>
                                                        <input
                                                            type="text"
                                                            maxLength={6}
                                                            placeholder="000000"
                                                            value={twoFAVerifyCode}
                                                            onChange={(e) => setTwoFAVerifyCode(e.target.value.replace(/\D/g, ''))}
                                                            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold shadow-inner text-center text-xl tracking-[0.5em]"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handleEnable2FA}
                                                        disabled={twoFALoading || twoFAVerifyCode.length !== 6}
                                                        className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                                                    >
                                                        {twoFALoading ? 'Verifying...' : 'Finish Enable'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-4 border-t border-gray-50">
                                        <button
                                            onClick={handlePasswordUpdate}
                                            disabled={saving}
                                            className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-red-600 transition-all disabled:opacity-50"
                                        >
                                            {saving ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-8">
                                    <h3 className="text-xl font-bold text-gray-800">Communication Preferences</h3>

                                    <div className="space-y-4">
                                        {[
                                            { title: 'Career Alerts', desc: 'Get notified about new career opportunities matching your profile.' },
                                            { title: 'Goal Reminders', desc: 'Stay on track with your roadmap milestones.' },
                                            { title: 'System Updates', desc: 'Receive news about new features and improvements.' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 rounded-3xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                                                <div>
                                                    <p className="font-bold text-gray-800">{item.title}</p>
                                                    <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                                                </div>
                                                <div className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-sm"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'privacy' && (
                                <div className="space-y-8">
                                    <h3 className="text-xl font-bold text-gray-800">Account Privacy</h3>
                                    <div className="p-8 bg-red-50/50 rounded-3xl border border-red-100">
                                        <h4 className="font-black text-red-600 uppercase tracking-widest text-xs mb-2">Danger Zone</h4>
                                        <p className="text-sm text-gray-600 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
                                        <button className="mt-6 bg-white border-2 border-red-100 text-red-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
