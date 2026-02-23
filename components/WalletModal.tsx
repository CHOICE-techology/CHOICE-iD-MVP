
import React from 'react';
import { useConnect } from 'wagmi';
import { X, Wallet, ShieldCheck, Smartphone } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connect, connectors } = useConnect();

  if (!isOpen) return null;

  const getIcon = (name: string) => {
    if (name.toLowerCase().includes('metamask')) return <ShieldCheck className="text-orange-500" />;
    if (name.toLowerCase().includes('walletconnect')) return <Smartphone className="text-blue-500" />;
    return <Wallet className="text-primary" />;
  };

  // Filter for specific connectors requested by user
  const prioritizedConnectors = connectors.filter(c => 
    c.name.toLowerCase().includes('metamask') || 
    c.name.toLowerCase().includes('trust') || 
    c.name.toLowerCase().includes('walletconnect') ||
    c.id === 'injected'
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden animate-scale-in border border-slate-100">
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Connect Wallet</h2>
              <p className="text-sm font-medium text-slate-400">Select your preferred provider</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-3">
            {prioritizedConnectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => {
                  connect({ connector });
                  onClose();
                }}
                className="w-full flex items-center justify-between p-5 rounded-3xl border-2 border-slate-50 hover:border-primary/20 hover:bg-primary/5 transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(connector.name)}
                  </div>
                  <div className="text-left">
                    <div className="font-black text-slate-900 uppercase tracking-wider text-xs">
                      {connector.name === 'Injected' ? 'Browser Wallet (MetaMask)' : connector.name}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {connector.name.toLowerCase().includes('walletconnect') ? 'Mobile & Desktop' : 'Extension'}
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Wallet size={14} />
                </div>
              </button>
            ))}

            {connectors.length === 0 && (
              <div className="text-center py-10 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No wallets detected</p>
                <a 
                  href="https://metamask.io" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-black text-primary mt-2 inline-block hover:underline"
                >
                  Install MetaMask
                </a>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-[0.2em] leading-relaxed">
              By connecting, you agree to the <br />
              <span className="text-slate-900">Terms of Service</span> and <span className="text-slate-900">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
