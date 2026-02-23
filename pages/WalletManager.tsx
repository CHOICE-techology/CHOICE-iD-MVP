
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Copy, Check, Download, Lock, Eye, EyeOff, Coins, ArrowRight, ChevronRight, BookOpen, Globe } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const COIN_DATA = [
  { name: "Ethereum", symbol: "ETH", color: "text-indigo-500", bg: "bg-indigo-50", risk: "Low", description: "The leading smart contract platform. Used for DeFi, NFTs, and DAOs. Highly secure but can have high fees." },
  { name: "Bitcoin", symbol: "BTC", color: "text-orange-500", bg: "bg-orange-50", risk: "Low", description: "The first cryptocurrency. Digital gold and a store of value. Most secure network." },
  { name: "Solana", symbol: "SOL", color: "text-purple-500", bg: "bg-purple-50", risk: "Medium", description: "High-performance blockchain known for speed and low transaction fees. Growing ecosystem." },
  { name: "Arbitrum", symbol: "ARB", color: "text-blue-500", bg: "bg-blue-50", risk: "Medium", description: "Layer 2 scaling solution for Ethereum. Fast and cheap transactions, inherits ETH security." },
  { name: "Polygon", symbol: "MATIC", color: "text-violet-500", bg: "bg-violet-50", risk: "Medium", description: "A scalable infrastructure framework for building Ethereum-compatible blockchains." },
  { name: "Avalanche", symbol: "AVAX", color: "text-red-500", bg: "bg-red-50", risk: "Medium", description: "An open, programmable smart contracts platform for decentralized applications." },
  { name: "Base", symbol: "BASE", color: "text-blue-600", bg: "bg-blue-100", risk: "Low", description: "Secure, low-cost, developer-friendly Ethereum L2 incubated by Coinbase." }
];

export const WalletManager: React.FC<{ mode: 'create' | 'download' }> = ({ mode }) => {
  const [seedPhrase, setSeedPhrase] = useState<string[] | null>(null);
  const [showSeed, setShowSeed] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Creation Flow State
  const [step, setStep] = useState(1);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Data Persistence: Check if we were sent here with a pre-selected coin
  useEffect(() => {
    if (location.state && location.state.preSelectedCoin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedChain(location.state.preSelectedCoin);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(2); // Skip to provider selection
    }
  }, [location.state]);

  const generateWallet = () => {
    // Mock seed phrase generation
    const mockMnemonic = "witch collapse practice feed shame open despair creek road again ice least".split(" ");
    setSeedPhrase(mockMnemonic);
    setStep(3);
  };

  const copyToClipboard = () => {
    if (seedPhrase) {
      navigator.clipboard.writeText(seedPhrase.join(" "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadKeyStore = (currency: string) => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify({ currency, address: "0xMock...", privateKey: "encrypted" })], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${currency.toLowerCase()}_keystore_utc.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const navigateToCreate = (coinName: string) => {
    navigate('/wallet/create', { state: { preSelectedCoin: coinName } });
  };

  if (mode === 'create') {
    return (
      <div className="space-y-8 animate-fade-in">
        <header>
          <h1 className="text-4xl font-extrabold text-dark mb-2 tracking-tight">Create New Wallet</h1>
          <p className="text-slate-500 text-lg">Follow the steps to generate a secure wallet for your chosen chain.</p>
        </header>

        {/* Progress Stepper */}
        <div className="flex items-center gap-4 text-sm font-bold text-slate-400 mb-8">
          <span className={`${step >= 1 ? 'text-primary' : ''}`}>1. Select Chain</span>
          <ChevronRight size={16} />
          <span className={`${step >= 2 ? 'text-primary' : ''}`}>2. Select Provider</span>
          <ChevronRight size={16} />
          <span className={`${step >= 3 ? 'text-primary' : ''}`}>3. Secure</span>
        </div>

        {/* STEP 1: SELECT CHAIN */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {COIN_DATA.map(coin => (
                <button 
                  key={coin.name}
                  onClick={() => { setSelectedChain(coin.name); setStep(2); }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${coin.bg} p-2 rounded-lg ${coin.color}`}>
                        <Coins size={24} />
                    </div>
                    <ArrowRight size={20} className="text-slate-300 group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-lg text-dark">{coin.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${coin.risk === 'Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                       {coin.risk} Risk
                     </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{coin.description}</p>
                </button>
             ))}
          </div>
        )}

        {/* STEP 2: SELECT PROVIDER */}
        {step === 2 && (
           <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                 <div className="bg-white p-2 rounded-lg shadow-sm">
                   <Coins size={20} className="text-primary" />
                 </div>
                 <div>
                   <span className="text-xs font-bold text-slate-400 uppercase">Selected Chain</span>
                   <p className="font-bold text-dark">{selectedChain}</p>
                 </div>
                 <Button variant="ghost" onClick={() => setStep(1)} className="ml-auto text-xs">Change</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Generate Local */}
                 <div 
                    onClick={generateWallet}
                    className="bg-white border-2 border-slate-200 hover:border-primary p-6 rounded-2xl cursor-pointer transition-all group relative overflow-hidden"
                 >
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary">
                        <Lock size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Generate Seed Phrase</h3>
                    <p className="text-slate-500 text-sm mb-4">Create a self-custodial wallet locally in your browser. You control the keys.</p>
                    <span className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                        Create Now <ArrowRight size={16} />
                    </span>
                 </div>

                 {/* Connect External */}
                 <div 
                    onClick={() => { setSelectedProvider('External'); alert("Redirecting to external provider connection..."); }}
                    className="bg-white border-2 border-slate-200 hover:border-secondary p-6 rounded-2xl cursor-pointer transition-all group"
                 >
                    <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-secondary">
                        <Globe size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Connect Provider</h3>
                    <p className="text-slate-500 text-sm mb-4">Link an existing wallet like MetaMask, Coinbase Wallet, or Phantom.</p>
                    <span className="text-secondary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                        Connect <ArrowRight size={16} />
                    </span>
                 </div>
              </div>
           </div>
        )}

        {/* STEP 3: SEED PHRASE */}
        {step === 3 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 animate-fade-in">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-bold text-dark">Your Secret Recovery Phrase</h3>
                    <p className="text-sm text-slate-500">For {selectedChain} Network</p>
                 </div>
                 <button 
                   onClick={() => setShowSeed(!showSeed)}
                   className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium"
                 >
                   {showSeed ? <><EyeOff size={16}/> Hide</> : <><Eye size={16}/> Show</>}
                 </button>
              </div>

              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6 rounded-2xl border ${showSeed ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
                 {seedPhrase?.map((word, idx) => (
                   <div key={idx} className="flex items-center gap-3">
                      <span className="text-slate-400 select-none text-xs">{idx + 1}</span>
                      <span className={`font-mono font-bold ${showSeed ? 'text-dark' : 'blur-md text-white select-none'}`}>
                        {word}
                      </span>
                   </div>
                 ))}
              </div>

              <div className="flex gap-4">
                 <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                   {copied ? <><Check size={18} className="mr-2"/> Copied</> : <><Copy size={18} className="mr-2"/> Copy to Clipboard</>}
                 </Button>
                 <Button className="flex-1" onClick={() => { setSeedPhrase(null); setStep(1); }}>
                   I Saved It
                 </Button>
              </div>
              
              <p className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-lg border border-red-100">
                Warning: Never share this phrase with anyone. Store it securely offline.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DOWNLOAD MODE
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-extrabold text-dark mb-2 tracking-tight">Multi-Currency & Education</h1>
        <p className="text-slate-500 text-lg">Manage multiple assets and learn about their utility.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {COIN_DATA.map(coin => (
           <div key={coin.symbol} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all group flex flex-col relative overflow-hidden">
             {/* Risk Badge */}
             <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl ${coin.risk === 'Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
               {coin.risk} Risk
             </div>

             <div className="flex justify-between items-start mb-4">
                <div className={`${coin.bg} p-3 rounded-xl ${coin.color}`}>
                  <Coins size={24} />
                </div>
                <div className="flex gap-2 mr-12">
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                    {coin.symbol}
                    </span>
                </div>
             </div>
             
             <h3 className="text-lg font-bold text-dark mb-1">{coin.name} Wallet</h3>
             <div className="flex items-start gap-2 mb-4 bg-slate-50 p-3 rounded-lg min-h-[80px]">
                <BookOpen size={16} className="text-slate-400 mt-1 shrink-0" />
                <p className="text-sm text-slate-500 leading-snug">{coin.description}</p>
             </div>

             <div className="mt-auto grid grid-cols-2 gap-3">
                <Button variant="secondary" className="w-full text-xs" onClick={() => downloadKeyStore(coin.name)}>
                    <Download size={14} className="mr-2" />
                    Keystore
                </Button>
                <Button variant="primary" className="w-full text-xs" onClick={() => navigateToCreate(coin.name)}>
                    <Plus size={14} className="mr-2" />
                    Create
                </Button>
             </div>
           </div>
         ))}
      </div>
      
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-8">
        <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
          <BookOpen size={18} />
          Education Center
        </h4>
        <p className="text-sm text-blue-600">
          Understanding the blockchain you are using is crucial for security. Low risk chains like Bitcoin and Ethereum are proven. 
          Newer L2s or high-speed chains may have different security assumptions. Always verify the network before sending funds.
        </p>
      </div>
    </div>
  );
};

// Helper icon component
const Plus = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
