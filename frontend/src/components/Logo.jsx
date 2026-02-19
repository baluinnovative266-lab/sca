import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const Logo = ({ className = "", size = "default" }) => {
    const sizes = {
        small: { icon: 34, pad: 'p-1.5', text: 'text-lg', sub: 'text-[0.55rem]' },
        default: { icon: 38, pad: 'p-2', text: 'text-xl', sub: 'text-[0.6rem]' },
        large: { icon: 52, pad: 'p-3', text: 'text-3xl', sub: 'text-xs' },
    };
    const s = sizes[size] || sizes.default;

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <motion.div
                whileHover={{ scale: 1.08, rotate: 5 }}
                transition={{ duration: 0.3, type: 'spring' }}
                className={`${s.pad} rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/25`}
            >
                <Brain className="text-white" size={s.icon * 0.55} strokeWidth={2} />
            </motion.div>
            <div className="flex flex-col leading-none">
                <span className={`${s.text} font-extrabold tracking-tight text-gray-900`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Career<span className="text-pink-600">Sense</span>
                </span>
                <span className={`${s.sub} font-semibold text-pink-400/80 uppercase tracking-[0.2em]`} style={{ fontFamily: "'Inter', sans-serif" }}>
                    AI-Powered Guidance
                </span>
            </div>
        </div>
    );
};

export default Logo;
