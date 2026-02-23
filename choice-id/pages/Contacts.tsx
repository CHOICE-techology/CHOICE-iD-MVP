
import React from 'react';
import { Users } from 'lucide-react';

export const Contacts: React.FC = () => {
    return (
        <div className="text-center py-20 space-y-6 animate-fade-in">
            <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Users size={48} />
            </div>
            <h1 className="text-3xl font-bold text-dark">Professional Contacts</h1>
            <p className="text-slate-500 max-w-md mx-auto">
                Manage your address book and verified on-chain relationships.
                <br/>
                <span className="text-primary font-bold">Coming Soon.</span>
            </p>
        </div>
    );
};
