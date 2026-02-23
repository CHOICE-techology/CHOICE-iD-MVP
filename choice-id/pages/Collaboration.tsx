
import React from 'react';
import { Globe } from 'lucide-react';

export const Collaboration: React.FC = () => {
    return (
        <div className="text-center py-20 space-y-6 animate-fade-in">
            <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Globe size={48} />
            </div>
            <h1 className="text-3xl font-bold text-dark">Collaboration Hub</h1>
            <p className="text-slate-500 max-w-md mx-auto">
                Find partners for your next Web3 hackathon or DAO proposal. <br/>
                <span className="text-primary font-bold">Coming Soon.</span>
            </p>
        </div>
    );
};
