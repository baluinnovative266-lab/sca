import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, RefreshCw } from 'lucide-react';

const careerSeeds = {
    'Software Engineer': ['Felix', 'Aneka', 'Max', 'Luna', 'Leo', 'Ivy', 'Sam', 'Mira'],
    'Data Scientist': ['Aneka', 'Zack', 'Luna', 'Dev', 'Ivy', 'Leo', 'Mira', 'Max'],
    'Web Developer': ['Bob', 'Rose', 'Jake', 'Lily', 'Ryan', 'Pearl', 'Cole', 'Iris'],
    'UI/UX Designer': ['Caitlyn', 'Drew', 'Lily', 'Alex', 'Rose', 'Eli', 'Jade', 'Kai'],
    'Product Manager': ['Willow', 'Samuel', 'Sophie', 'Arthur', 'Grace', 'Victor', 'Emma', 'Julian'],
};

const defaultSeeds = ['Charlie', 'Bailey', 'Max', 'Bella', 'Cooper', 'Lucy', 'Duke', 'Daisy'];

const AvatarSelector = ({ currentCareer = 'Software Engineer' }) => {
    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const [avatarSet, setAvatarSet] = useState(0);

    const seeds = careerSeeds[currentCareer] || defaultSeeds;
    const currentAvatars = seeds.slice(avatarSet * 4, avatarSet * 4 + 4);

    const handleRefresh = () => {
        setAvatarSet(prev => (prev + 1) % Math.ceil(seeds.length / 4));
    };

    return (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-white">Recommended Avatars</h3>
                <motion.button
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleRefresh}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                >
                    <RefreshCw size={16} />
                </motion.button>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {currentAvatars.map((seed, index) => {
                    const url = `https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9`;
                    return (
                        <motion.div
                            key={`${avatarSet}-${seed}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedAvatar(index)}
                            className={`relative rounded-full cursor-pointer p-1 transition-all ${selectedAvatar === index ? 'bg-primary ring-2 ring-primary/50' : 'bg-transparent hover:bg-white/10'}`}
                        >
                            <img
                                src={url}
                                alt={`Avatar ${seed}`}
                                className="w-full h-full rounded-full bg-slate-700"
                            />
                            {selectedAvatar === index && (
                                <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-slate-900">
                                    <Check size={10} strokeWidth={4} />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
            <p className="text-xs text-white/40 mt-4 text-center">Based on your role: <span className="text-primary font-bold">{currentCareer}</span></p>
        </div>
    );
};

export default AvatarSelector;
