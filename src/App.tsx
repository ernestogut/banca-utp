import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { api } from './services/api';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Transfers } from './components/Transfers';
import { AIChatWidget } from './components/AIChatWidget';
import { Accounts } from './components/Accounts';
import { Withdraw } from './components/Withdraw';
import { Deposit } from './components/Deposit';
import { Security } from './components/Security';
import { Support } from './components/Support';
import { Profile } from './components/Profile';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  subText: string;
  category: string;
  status: 'Completado' | 'Pendiente';
  amount: number;
  icon: string;
}

export type ViewType = 
  | 'dashboard'
  | 'accounts'
  | 'transfers'
  | 'history'
  | 'security'
  | 'support'
  | 'profile'
  | 'withdraw'
  | 'deposit';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
  });
  
  // Shared Account Balances (matching Stitch design default values)
  const [savingsBalance, setSavingsBalance] = useState<number>(0);
  const [checkingBalance, setCheckingBalance] = useState<number>(0);
  const [accounts, setAccounts] = useState<any[]>([]);
  
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Shared Transaction History State
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadUserData = async () => {
    try {
      const accountsData = await api.get('/api/accounts');
      setAccounts(accountsData);
      const savings = accountsData.find((a: any) => a.accountType === 'ahorros');
      const checking = accountsData.find((a: any) => a.accountType === 'corriente');
      if (savings) setSavingsBalance(savings.balance);
      if (checking) setCheckingBalance(checking.balance);

      const txs = await api.get('/api/transactions');
      setTransactions(txs);
    } catch (error) {
      console.error('Error cargando los detalles bancarios:', error);
    }
  };

  // Auto-login on startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/profile')
        .then((profile) => {
          setUser(profile);
          setIsAuthenticated(true);
          setCurrentView('dashboard');
          // Fetch balances & history
          api.get('/api/accounts').then((accountsData) => {
            setAccounts(accountsData);
            const savings = accountsData.find((a: any) => a.accountType === 'ahorros');
            const checking = accountsData.find((a: any) => a.accountType === 'corriente');
            if (savings) setSavingsBalance(savings.balance);
            if (checking) setCheckingBalance(checking.balance);
          });
          api.get('/api/transactions').then(setTransactions);
        })
        .catch((err) => {
          console.error('La sesión expiró o es inválida:', err);
          localStorage.removeItem('token');
        });
    }
  }, []);

  // Sync transactions on search queries
  useEffect(() => {
    if (isAuthenticated) {
      api.get(`/api/transactions?query=${encodeURIComponent(globalSearchQuery)}`)
        .then(setTransactions)
        .catch(console.error);
    }
  }, [globalSearchQuery, isAuthenticated]);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    // Cargar saldos e historial
    loadUserData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setGlobalSearchQuery('');
  };

  const handleUpdateProfile = async (name: string, email: string, phone: string) => {
    try {
      const res = await api.put('/api/profile', { name, email, phone });
      setUser(res.user);
      alert('¡Perfil actualizado con éxito!');
    } catch (error: any) {
      alert(error.message || 'Error al actualizar el perfil.');
    }
  };

  // Callback handlers for transactions
  const handleTransferComplete = async (amount: number, description: string, accountType: 'corriente' | 'ahorros') => {
    await api.post('/api/transactions/transfer', {
      accountType,
      amount,
      description,
    });
    await loadUserData();
  };

  const handleWithdrawComplete = async (amount: number, accountType: 'ahorros' | 'corriente') => {
    await api.post('/api/transactions/withdraw', {
      accountType,
      amount,
    });
    await loadUserData();
  };

  const handleDepositComplete = async (amount: number, accountType: 'ahorros' | 'corriente') => {
    await api.post('/api/transactions/deposit', {
      accountType,
      amount,
    });
    await loadUserData();
  };

  const handleCreateAccount = async (accountType: 'corriente' | 'ahorros', initialBalance: number) => {
    const newAccount = await api.post('/api/accounts', {
      accountType,
      initialBalance,
    });
    await loadUserData();
    return newAccount;
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout
      currentView={currentView}
      onNavigate={setCurrentView}
      user={user}
      onLogout={handleLogout}
      globalSearchQuery={globalSearchQuery}
      setGlobalSearchQuery={setGlobalSearchQuery}
    >
      {currentView === 'dashboard' && (
        <Dashboard
          userName={user.name}
          checkingBalance={checkingBalance}
          savingsBalance={savingsBalance}
          onNavigateToTransfers={() => setCurrentView('transfers')}
          onNavigateToWithdraw={() => setCurrentView('withdraw')}
          onNavigateToDeposit={() => setCurrentView('deposit')}
        />
      )}

      {currentView === 'accounts' && (
        <Accounts
          userName={user.name}
          accounts={accounts}
          transactions={transactions}
          onCreateAccount={handleCreateAccount}
        />
      )}
      
      {currentView === 'history' && (
        <History
          user={user}
          onUpdateProfile={handleUpdateProfile}
          searchQuery={globalSearchQuery}
          transactions={transactions}
        />
      )}

      {currentView === 'transfers' && (
        <Transfers
          checkingBalance={checkingBalance}
          savingsBalance={savingsBalance}
          onTransferComplete={handleTransferComplete}
          onNavigateToDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'withdraw' && (
        <Withdraw
          checkingBalance={checkingBalance}
          savingsBalance={savingsBalance}
          onWithdrawComplete={handleWithdrawComplete}
          onCancel={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'deposit' && (
        <Deposit
          checkingBalance={checkingBalance}
          savingsBalance={savingsBalance}
          onDepositComplete={handleDepositComplete}
          onCancel={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'security' && (
        <Security userName={user.name} />
      )}

      {currentView === 'support' && (
        <Support userName={user.name} />
      )}

      {currentView === 'profile' && (
        <Profile
          user={user}
          onUpdateProfile={handleUpdateProfile}
          onCancel={() => setCurrentView('dashboard')}
        />
      )}

      {/* Dynamic Floating Chat Widget */}
      <AIChatWidget userName={user.name} />
    </Layout>
  );
}

export default App;
