
import React, { useState } from 'react';
import { UserIdentity } from '../types';
import { 
  Copy, 
  History, 
  Zap, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { ReputationMeter } from '../components/ReputationMeter';
import { CredentialCard } from '../components/CredentialCard';
import { calculateReputation } from '../services/reputationEngine';
import { generateProof } from '../services/zkService';
import { Button } from '../components/Button';
import { ZKProof } from '../types';

interface HomeProps {
  identity: UserIdentity | null;
}

export const Home: React.FC<HomeProps> = ({ identity }) => {
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [lastProof, setLastProof] = useState<ZKProof | null>(null);

  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
          Connect Your <span className="text-primary">Identity</span>
        </h1>
        <p className="text-gray max-w-md mb-8">
          Join the privacy-first reputation network. Connect your wallet to access your secure vault and verifiable credentials.
        </p>
      </div>
    );
  }

  const reputation = calculateReputation(identity.credentials);

  const handleGenerateProof = async () => {
    setIsGeneratingProof(true);
    try {
      const proof = await generateProof(reputation.score, 50);
      setLastProof(proof);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingProof(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header / Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Self-Sovereign Identity</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tighter">
                  Your Digital <span className="text-primary">Passport</span>
                </h1>
                <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => navigator.clipboard.writeText(identity.did)}>
                  <code className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-xs font-mono text-gray">
                    {identity.did.slice(0, 30)}...
                  </code>
                  <Copy className="w-4 h-4 text-gray group-hover:text-primary transition-colors" />
                </div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray mb-2">Sybil Risk</div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border ${
                  reputation.sybilRisk === 'low' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                  reputation.sybilRisk === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                  'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {reputation.sybilRisk === 'low' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  <span className="uppercase">{reputation.sybilRisk}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reputation Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              Reputation Engine
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-sm font-medium text-gray">Base Score</span>
                  <span className="font-mono font-bold">+{reputation.breakdown.baseScore}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-sm font-medium text-gray">Credential Weight</span>
                  <span className="font-mono font-bold text-emerald-500">+{reputation.breakdown.weightedScore}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-sm font-medium text-gray">Time Decay</span>
                  <span className="font-mono font-bold text-red-500">{reputation.breakdown.timeDecayAdjustment}</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-slate-100 dark:border-slate-800 pl-0 md:pl-8">
                <ReputationMeter score={reputation.score} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Anchoring & ZK */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="px-2 py-1 bg-primary/20 rounded text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/30">
                  ZK Proof Ready
                </div>
                <Zap className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-bold">Privacy-Preserving Verification</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Generate a Zero-Knowledge Proof to verify your reputation without revealing your credentials.
              </p>
              <Button 
                fullWidth 
                onClick={handleGenerateProof}
                disabled={isGeneratingProof}
                className="bg-primary text-slate-950 font-bold hover:bg-white transition-all"
              >
                {isGeneratingProof ? 'Computing Proof...' : 'Generate ZK Proof'}
              </Button>
              {lastProof && (
                <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>Proof Hash</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="text-[10px] font-mono truncate text-primary">{lastProof.proof}</div>
                </div>
              )}
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray mb-4 flex items-center">
              <History className="w-4 h-4 mr-2" />
              Anchor History
            </h3>
            <div className="space-y-4">
              {identity.lastAnchorHash ? (
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-1.5 bg-emerald-500/10 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Reputation Anchored</div>
                    <div className="text-[10px] text-gray font-mono truncate w-32">{identity.lastAnchorHash}</div>
                    <div className="text-[10px] text-gray mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(identity.lastAnchorTimestamp!).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-xs text-gray italic">No on-chain anchors found.</div>
                  <button className="mt-3 text-xs font-bold text-primary flex items-center mx-auto hover:underline">
                    Anchor Now <ArrowUpRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-black tracking-tighter">
            Verifiable <span className="text-primary">Credentials</span>
          </h2>
          <Link to="/credentials" className="text-sm font-bold text-primary hover:underline">
            View All
          </Link>
        </div>
        
        {identity.credentials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {identity.credentials.slice(0, 3).map((vc) => (
              <CredentialCard key={vc.id} credential={vc} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl py-12 text-center">
            <p className="text-gray mb-4">You haven't added any credentials yet.</p>
            <Link to="/credentials">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Add Your First Credential
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
