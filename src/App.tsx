import { useState, useEffect } from 'react';
import Login from './components/Login';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface BudgetCategory {
  name: string;
  limit: number;
  spent: number;
  color: string;
}

// Demo data for public version (no real personal data)
const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 1, description: 'Monthly Salary', amount: 5000, category: 'Income', date: '2026-03-01', type: 'income' },
  { id: 2, description: 'Grocery Store', amount: 150, category: 'Food', date: '2026-03-05', type: 'expense' },
  { id: 3, description: 'Gas Station', amount: 45, category: 'Transportation', date: '2026-03-07', type: 'expense' },
  { id: 4, description: 'Electric Bill', amount: 120, category: 'Utilities', date: '2026-03-10', type: 'expense' },
  { id: 5, description: 'Freelance Project', amount: 800, category: 'Income', date: '2026-03-15', type: 'income' },
];

const DEMO_BUDGETS: BudgetCategory[] = [
  { name: 'Food', limit: 500, spent: 150, color: '#FF9500' },
  { name: 'Transportation', limit: 200, spent: 45, color: '#007AFF' },
  { name: 'Utilities', limit: 300, spent: 120, color: '#FF3B30' },
  { name: 'Entertainment', limit: 150, spent: 0, color: '#AF52DE' },
];

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(DEMO_BUDGETS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      loadRealData();
    }
  }, []);

  const loadRealData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://batesai.org/api/budget/data', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || DEMO_TRANSACTIONS);
        setBudgets(data.budgets || DEMO_BUDGETS);
      }
    } catch (error) {
      console.log('Using demo data - backend unavailable');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setTransactions(DEMO_TRANSACTIONS);
    setBudgets(DEMO_BUDGETS);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => { setIsAuthenticated(true); loadRealData(); }} />;
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #007AFF, #5856D6)',
        padding: '60px 20px 40px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Budget Tracker</h1>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Bates LLC</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '20px' }}>
        {activeTab === 'dashboard' && (
          <Dashboard balance={balance} income={totalIncome} expenses={totalExpenses} budgets={budgets} />
        )}
        {activeTab === 'transactions' && (
          <TransactionsList transactions={transactions} />
        )}
        {activeTab === 'budgets' && (
          <BudgetsList budgets={budgets} />
        )}
      </main>

      {/* Tab Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid #C6C6C8',
        display: 'flex',
        justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000
      }}>
        <TabButton
          icon="📊"
          label="Dashboard"
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        />
        <TabButton
          icon="💳"
          label="Transactions"
          active={activeTab === 'transactions'}
          onClick={() => setActiveTab('transactions')}
        />
        <TabButton
          icon="📅"
          label="Budgets"
          active={activeTab === 'budgets'}
          onClick={() => setActiveTab('budgets')}
        />
      </nav>
    </div>
  );
}

function Dashboard({ balance, income, expenses, budgets }: {
  balance: number;
  income: number;
  expenses: number;
  budgets: BudgetCategory[];
}) {
  return (
    <div>
      {/* Balance Card */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        <p style={{ fontSize: '14px', color: '#8E8E93', marginBottom: '8px' }}>Current Balance</p>
        <h2 style={{ fontSize: '42px', fontWeight: '700', color: '#1C1C1E' }}>
          ${balance.toLocaleString()}
        </h2>
        <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#8E8E93' }}>Income</p>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#34C759' }}>+${income.toLocaleString()}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#8E8E93' }}>Expenses</p>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#FF3B30' }}>-${expenses.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Budget Summary */}
      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Budget Summary</h3>
      {budgets.map(budget => (
        <div key={budget.name} style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>{budget.name}</span>
            <span style={{ fontSize: '14px', color: '#8E8E93' }}>
              ${budget.spent} / ${budget.limit}
            </span>
          </div>
          <div style={{
            background: '#E5E5EA',
            borderRadius: '6px',
            height: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: budget.color,
              width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%`,
              height: '100%',
              borderRadius: '6px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionsList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Recent Transactions</h3>
      {transactions.map(transaction => (
        <div key={transaction.id} style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)'
        }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>{transaction.description}</p>
            <p style={{ fontSize: '13px', color: '#8E8E93' }}>{transaction.category} • {transaction.date}</p>
          </div>
          <span style={{
            fontSize: '17px',
            fontWeight: '600',
            color: transaction.type === 'income' ? '#34C759' : '#1C1C1E'
          }}>
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
          </span>
        </div>
      ))}
    </div>
  );
}

function BudgetsList({ budgets }: { budgets: BudgetCategory[] }) {
  return (
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Monthly Budgets</h3>
      {budgets.map(budget => (
        <div key={budget.name} style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '12px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <p style={{ fontSize: '17px', fontWeight: '600', marginBottom: '4px' }}>{budget.name}</p>
              <p style={{ fontSize: '14px', color: '#8E8E93' }}>Monthly Limit</p>
            </div>
            <span style={{ fontSize: '24px', fontWeight: '700', color: budget.color }}>
              ${budget.limit}
            </span>
          </div>
          <div style={{
            background: '#E5E5EA',
            borderRadius: '8px',
            height: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: `linear-gradient(90deg, ${budget.color}, ${budget.color}dd)`,
              width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%`,
              height: '100%',
              borderRadius: '8px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p style={{ fontSize: '13px', color: '#8E8E93', marginTop: '8px' }}>
            ${budget.spent} spent ({Math.round((budget.spent / budget.limit) * 100)}%)
          </p>
        </div>
      ))}
    </div>
  );
}

function TabButton({ icon, label, active, onClick }: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        opacity: active ? 1 : 0.5
      }}
    >
      <span style={{ fontSize: '24px' }}>{icon}</span>
      <span style={{ fontSize: '11px', fontWeight: active ? '600' : '400' }}>{label}</span>
    </button>
  );
}

export default App;
