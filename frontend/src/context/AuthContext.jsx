import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Configure axios defaults
    useEffect(() => {
        const fetchProfile = async (tk) => {
            setLoading(true);
            try {
                const response = await axios.get('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${tk}` },
                    timeout: 5000 // 5 second timeout
                });
                setUser(response.data);
                // Auto-sync age to localStorage for returning users
                if (response.data.age) {
                    localStorage.setItem('user_age', String(response.data.age));
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                // If it's a 401, clear everything
                if (err.response?.status === 401) {
                    delete axios.defaults.headers.common['Authorization'];
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            fetchProfile(token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login',
                new URLSearchParams({ username: email, password: password }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
            );

            if (response.data.two_fa_required) {
                return { success: true, two_fa_required: true, email: response.data.email };
            }

            const accessToken = response.data.access_token;
            setToken(accessToken);
            setUser({ email });
            navigate('/age-check');
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, error: error.response?.data?.detail || "Login failed" };
        }
    };

    const verify2FA = async (email, code) => {
        try {
            const response = await axios.post('/api/auth/login/verify-2fa', { email, code });
            const accessToken = response.data.access_token;
            setToken(accessToken);
            setUser({ email });
            navigate('/age-check');
            return { success: true };
        } catch (error) {
            console.error("2FA verification failed", error);
            return { success: false, error: error.response?.data?.detail || "Invalid 2FA code" };
        }
    };

    const register = async (fullName, email, password) => {
        try {
            const response = await axios.post('/api/auth/register', {
                full_name: fullName,
                email,
                password
            });
            const accessToken = response.data.access_token;
            setToken(accessToken);
            setUser({ email, fullName });
            navigate('/age-check');
            return { success: true };
        } catch (error) {
            console.error("Registration failed", error);
            return { success: false, error: error.response?.data?.detail || "Registration failed" };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('user_age');
        navigate('/');
    };

    const updateProfile = async (data) => {
        try {
            await axios.post('/api/auth/update-profile', data);
            // Refresh user data
            const response = await axios.get('/api/auth/me');
            setUser(response.data);
            return { success: true };
        } catch (error) {
            console.error("Update profile failed", error);
            return { success: false, error: error.response?.data?.detail || "Update failed" };
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            await axios.post('/api/auth/change-password', {
                old_password: oldPassword,
                new_password: newPassword
            });
            return { success: true };
        } catch (error) {
            console.error("Change password failed", error);
            return { success: false, error: error.response?.data?.detail || "Change password failed" };
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, changePassword, verify2FA, loading }}>
            {!loading ? children : (
                <div className="flex h-screen items-center justify-center bg-slate-900 text-white flex-col gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg font-medium animate-pulse">Loading CareerSense...</p>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
