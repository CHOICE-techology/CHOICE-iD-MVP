
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Award, CheckCircle, Lock, PlayCircle, Star } from 'lucide-react';
import { UserIdentity, VerifiableCredential } from '../types';
import { addCredential } from '../services/storageService';
import { mockUploadToIPFS } from '../services/cryptoService';

interface EducationProps {
    identity: UserIdentity | null;
    onUpdateIdentity: (identity: UserIdentity) => void;
}

const COURSES = [
    { 
        id: 'web3-101', 
        title: 'Web3 & Identity Basics', 
        level: 'Beginner', 
        duration: '15 min', 
        points: 5,
        description: "Learn the fundamentals of Decentralized Identity (DID), Verifiable Credentials, and why privacy matters.",
        color: "bg-emerald-500"
    },
    { 
        id: 'sec-201', 
        title: 'Wallet Security Pro', 
        level: 'Intermediate', 
        duration: '30 min', 
        points: 10,
        description: "Master the art of self-custody. Learn about seed phrases, hardware wallets, and avoiding phishing attacks.",
        color: "bg-blue-500"
    },
    { 
        id: 'collab-301', 
        title: 'DAO Collaboration', 
        level: 'Advanced', 
        duration: '45 min', 
        points: 15,
        description: "How to use your Reputation Score to get hired in DAOs and manage cryptographic agreements.",
        color: "bg-purple-600"
    }
];

export const Education: React.FC<EducationProps> = ({ identity, onUpdateIdentity }) => {
    const [completing, setCompleting] = useState<string | null>(null);

    const hasBadge = (courseTitle: string) => {
        return identity?.credentials.some(vc => 
            vc.type.includes('EducationCredential') && 
            vc.credentialSubject.courseName === courseTitle
        );
    };

    const handleComplete = async (course: typeof COURSES[0]) => {
        if (!identity) return;
        setCompleting(course.id);
        
        try {
            // Simulate course interaction
            await new Promise(resolve => setTimeout(resolve, 1500));

            const badgeVC: VerifiableCredential = {
                id: `urn:uuid:${crypto.randomUUID()}`,
                type: ['VerifiableCredential', 'EducationCredential'],
                issuer: 'did:web:choice.love/education',
                issuanceDate: new Date().toISOString(),
                credentialSubject: {
                    id: identity.did,
                    courseName: course.title,
                    level: course.level as 'Beginner' | 'Intermediate' | 'Advanced',
                    badge: `${course.level} Badge`,
                    points: course.points
                }
            };

            await mockUploadToIPFS(badgeVC);
            const newIdentity = addCredential(identity, badgeVC);
            onUpdateIdentity(newIdentity);
        } catch(e) {
            console.error(e);
        } finally {
            setCompleting(null);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <header>
                <h1 className="text-3xl md:text-4xl font-extrabold text-dark mb-2 tracking-tight">Education Center</h1>
                <p className="text-slate-500 text-base md:text-lg">Earn badges and boost your Trust Score by mastering Web3 skills.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COURSES.map((course) => {
                    const isCompleted = hasBadge(course.title);
                    return (
                        <div key={course.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50 flex flex-col relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-full h-2 ${course.color}`}></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-slate-100 text-slate-500`}>
                                    {course.level}
                                </span>
                                {isCompleted ? (
                                    <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-full">
                                        <CheckCircle size={20} />
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 text-slate-300 p-1.5 rounded-full">
                                        <Lock size={20} />
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-dark mb-2">{course.title}</h3>
                            <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">
                                {course.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
                                <PlayCircle size={14} /> {course.duration}
                                <span className="mx-2">•</span>
                                <Star size={14} className="text-amber-400 fill-amber-400" /> +{course.points} Points
                            </div>

                            <Button 
                                onClick={() => handleComplete(course)}
                                disabled={isCompleted || !identity}
                                isLoading={completing === course.id}
                                variant={isCompleted ? "outline" : "primary"}
                                className="w-full"
                            >
                                {isCompleted ? "Completed" : "Start Lesson"}
                            </Button>
                        </div>
                    );
                })}
            </div>

            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Award size={32} className="text-amber-300" />
                        <h2 className="text-xl md:text-2xl font-bold">Gamified Reputation</h2>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed mb-6">
                        Every badge you earn is a Verifiable Credential stored in your wallet. 
                        Professional DAOs and recruiters use these badges to verify your skills without needing a traditional resume.
                    </p>
                    <div className="flex gap-4">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
                            <span className="block text-2xl font-bold">30%</span>
                            <span className="text-xs uppercase tracking-wider opacity-80">Score Weight</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
                            <span className="block text-2xl font-bold">NFT</span>
                            <span className="text-xs uppercase tracking-wider opacity-80">Badges</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
