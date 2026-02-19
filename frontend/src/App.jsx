import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CareerPrediction from './pages/CareerPrediction';
import ResumeAnalysis from './pages/ResumeAnalysis';
import ResultsPage from './pages/ResultsPage';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import PhaseDetail from './pages/PhaseDetail';
import FullRoadmap from './pages/FullRoadmap';
import CommunityChat from './pages/CommunityChat';
import RoadmapOverview from './pages/RoadmapOverview';
import HelpDesk from './pages/HelpDesk';
import Footer from './components/Footer';

import StartAnalysis from './pages/StartAnalysis';
import AgeCheck from './pages/AgeCheck';
import JobOpportunities from './pages/JobOpportunities';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AnalyzedRoute = ({ children }) => {
    const stats = localStorage.getItem('career_stats');
    if (!stats) {
        return <Navigate to="/start-analysis" replace />;
    }
    return children;
};

const AgeVerifiedRoute = ({ children }) => {
    const age = localStorage.getItem('user_age');
    if (!age) {
        return <Navigate to="/age-check" replace />;
    }
    return children;
};

function AppContent() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public */}
                <Route path="/" element={
                    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
                        <Navbar />
                        <Home />
                        <Footer />
                    </div>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Age Check (before dashboard, after login) */}
                <Route path="/age-check" element={
                    <ProtectedRoute>
                        <AgeCheck />
                    </ProtectedRoute>
                } />

                {/* Start Analysis (Hub for unanalyzed users) */}
                <Route path="/start-analysis" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <Layout>
                                <StartAnalysis />
                            </Layout>
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Dashboard (hub / results summary) */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Results Page — after prediction/resume analysis */}
                <Route path="/results" element={
                    <ProtectedRoute>
                        <AnalyzedRoute>
                            <Layout>
                                <ResultsPage />
                            </Layout>
                        </AnalyzedRoute>
                    </ProtectedRoute>
                } />

                {/* Career Prediction (Not gated) */}
                <Route path="/career-prediction" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <Layout>
                                <CareerPrediction />
                            </Layout>
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Resume Analysis (Not gated) */}
                <Route path="/resume-analysis" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <Layout>
                                <ResumeAnalysis />
                            </Layout>
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Roadmap Overview */}
                <Route path="/roadmap/overview" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <AnalyzedRoute>
                                <Layout>
                                    <RoadmapOverview />
                                </Layout>
                            </AnalyzedRoute>
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Phase Detail */}
                <Route path="/roadmap/phase/:phaseId" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <AnalyzedRoute>
                                <Layout>
                                    <PhaseDetail />
                                </Layout>
                            </AnalyzedRoute>
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Full Roadmap */}
                <Route path="/roadmap/full" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <AnalyzedRoute>
                                <Layout>
                                    <FullRoadmap />
                                </Layout>
                            </AnalyzedRoute>
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Legacy phase route */}
                <Route path="/roadmap/:phaseId" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <AnalyzedRoute>
                                <Layout>
                                    <PhaseDetail />
                                </Layout>
                            </AnalyzedRoute>
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Community Chat */}
                <Route path="/community" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <CommunityChat />
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Settings */}
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <Layout>
                                <Settings />
                            </Layout>
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Job Opportunities */}
                <Route path="/job-board" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <AnalyzedRoute>
                                <Layout>
                                    <JobOpportunities />
                                </Layout>
                            </AnalyzedRoute>
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Help Desk */}
                <Route path="/help-desk" element={
                    <ProtectedRoute>
                        <AgeVerifiedRoute>
                            <Layout>
                                <HelpDesk />
                            </Layout>
                        </AgeVerifiedRoute>
                    </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Home />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
