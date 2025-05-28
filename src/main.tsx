import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SolanaProvider } from './context/SolanaProvider.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { TransactionProvider } from './context/TransactionContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SolanaProvider>
      <AuthProvider>
        <TransactionProvider>
          <App />
        </TransactionProvider>
      </AuthProvider>
    </SolanaProvider>
  </StrictMode>
);