import { MOCK_DEMO_RESULTS } from '../utils/constants';

const DemoAutoFill = ({ targetPath }) => {
    const navigate = useNavigate();

    const handleAutoFill = () => {
        // Persist for AnalyzedRoute
        localStorage.setItem('career_stats', JSON.stringify(MOCK_DEMO_RESULTS));
        navigate(targetPath, { state: { resumeResults: MOCK_DEMO_RESULTS } });
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(236,72,153,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAutoFill}
            className="fixed bottom-8 left-8 z-50 bg-white text-pink-600 border-2 border-pink-100 px-6 py-3 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-pink-50 transition-all group"
        >
            <Zap size={20} className="fill-pink-500 group-hover:animate-pulse" />
            Auto-Fill Demo
        </motion.button>
    );
};

export default DemoAutoFill;
