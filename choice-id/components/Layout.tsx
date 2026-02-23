
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  FileBadge, 
  BookOpen, 
  Briefcase, 
  PlusCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { WalletModal } from './WalletModal';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  walletAddress: string | null;
  onDisconnect: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  walletAddress, 
  onDisconnect 
}) => {
  const location = useLocation();
  const { isConnecting, isConnected } = useAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Status notification logic
  React.useEffect(() => {
    if (isConnecting) setStatus('Connecting...');
    else if (isConnected) {
      setStatus('Connected!');
      const timer = setTimeout(() => setStatus('Transaction Analysis Complete'), 2000);
      const hideTimer = setTimeout(() => setStatus(null), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isConnecting, isConnected]);

  const navSections = [
    {
      title: 'PERSONAL',
      items: [
        { name: 'My Identity', href: '/', icon: User },
        { name: 'Credentials', href: '/credentials', icon: FileBadge },
      ]
    },
    {
      title: 'GROWTH',
      items: [
        { name: 'Education', href: '/education', icon: BookOpen },
        { name: 'Jobs & Gigs', href: '/jobs', icon: Briefcase },
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { name: 'Create Wallet', href: '/wallet/create', icon: PlusCircle },
      ]
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-white text-slate-900 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-40 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tighter flex items-center">
            CHOICE<span className="text-primary ml-0.5">iD</span>
          </span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 overflow-y-auto",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col min-h-full p-8">
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-end mb-4">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-xl font-black tracking-tighter flex items-center">
              CHOICE<span className="text-primary ml-0.5">iD</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-10">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-5">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <item.icon size={20} className={isActive(item.href) ? "text-primary" : "text-slate-400"} />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Section: Wallet Status */}
          <div className="mt-auto pt-8 border-t border-slate-100">
            {walletAddress ? (
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CONNECTED</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 truncate mb-5">
                  {walletAddress}
                </div>
                <button 
                  onClick={() => {
                    onDisconnect();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-xs font-black text-brand-pink hover:opacity-70 transition-opacity uppercase tracking-wider"
                >
                  <LogOut size={14} strokeWidth={3} />
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsWalletModalOpen(true)}
                className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-glow-primary hover:opacity-90 transition-all transform active:scale-95 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} />
                Connect CHOICE iD
              </button>
            )}
          </div>
        </div>
      </aside>

      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />

      {/* Main Content - Offset by Sidebar Width on Desktop */}
      <main className="flex-1 lg:ml-64 min-h-screen pt-16 lg:pt-0 flex flex-col">
        {/* Status Notification System */}
        {status && (
          <div className="fixed top-20 lg:top-4 right-4 lg:right-8 z-[60] animate-slide-in-right">
            <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-xl">
              <div className={cn(
                "w-2 h-2 rounded-full",
                status === 'Connecting...' ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
              )} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{status}</span>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-16 flex-1">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="max-w-6xl mx-auto px-6 md:px-12 py-8 border-t border-slate-100 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-y-6 md:gap-6">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3">
              <a 
                href="https://www.choice.love" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
              >
                www.choice.love
              </a>
              <Link 
                to="/about" 
                className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
              >
                About Us
              </Link>
              <a 
                href="https://www.choice.love/choice-id" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
              >
                About Choice iD
              </a>
            </div>
            <div className="text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-[0.2em] text-center md:text-right">
              © 2026 Choice.love
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
