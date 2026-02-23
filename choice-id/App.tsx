
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiProvider, useAccount, useDisconnect } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './services/wagmiConfig';

import { Layout } from './components/Layout';
import { Identity } from './pages/Identity';
import { Credentials } from './pages/Credentials';
import { Verify } from './pages/Verify';
import { About } from './pages/About';
import { Education } from './pages/Education';
import { Jobs } from './pages/Jobs';
import { WalletManager } from './pages/WalletManager';
import { UserIdentity } from './types';
import { loadIdentity, saveIdentity } from './services/storageService';
import { generateDID, calculateReputationScore } from './services/cryptoService';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [userIdentity, setUserIdentity] = useState<UserIdentity | null>(null);

  // Handle identity initialization when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      let identity = loadIdentity();
      
      if (!identity || identity.address !== address) {
        identity = {
          address: address,
          did: generateDID(address),
          credentials: [],
          reputationScore: calculateReputationScore([]),
        };
        saveIdentity(identity);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserIdentity(identity);
    } else if (!isConnected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserIdentity(null);
    }
  }, [isConnected, address]);

  const updateIdentity = (newIdentity: UserIdentity) => {
    const score = calculateReputationScore(newIdentity.credentials);
    const updated = { ...newIdentity, reputationScore: score };
    setUserIdentity(updated);
    saveIdentity(updated);
  };

  return (
    <Layout 
      walletAddress={address || null} 
      onDisconnect={() => disconnect()}
    >
      <Routes>
        <Route path="/" element={<Identity identity={userIdentity} onUpdateIdentity={updateIdentity} />} />
        <Route path="/credentials" element={<Credentials identity={userIdentity} onUpdateIdentity={updateIdentity} isAuthenticated={!!userIdentity} onLogin={() => {}} />} />
        <Route path="/education" element={<Education identity={userIdentity} onUpdateIdentity={updateIdentity} />} />
        <Route path="/jobs" element={<Jobs identity={userIdentity} />} />
        <Route path="/about" element={<About />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/wallet/create" element={<WalletManager mode="create" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
