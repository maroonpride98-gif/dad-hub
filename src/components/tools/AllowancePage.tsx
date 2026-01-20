import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

interface Kid {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  weeklyAllowance: number;
  savingsGoal: number;
  savingsGoalName: string;
}

interface Transaction {
  id: string;
  kidId: string;
  type: 'allowance' | 'bonus' | 'spend' | 'save';
  amount: number;
  description: string;
  date: Date;
}

export const AllowancePage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [kids, setKids] = useState<Kid[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [showAddKid, setShowAddKid] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);

  // Form state
  const [newKidName, setNewKidName] = useState('');
  const [newKidEmoji, setNewKidEmoji] = useState('👦');
  const [weeklyAmount, setWeeklyAmount] = useState('5');
  const [transactionType, setTransactionType] = useState<'bonus' | 'spend' | 'save'>('bonus');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');

  const kidEmojis = ['👦', '👧', '🧒', '👶', '🧒🏻', '👦🏽', '👧🏾', '🧒🏿'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.uid) return;

    try {
      // Load kids
      const kidsRef = collection(db, 'allowanceKids');
      const kidsQuery = query(kidsRef, where('userId', '==', user.uid));
      const kidsSnap = await getDocs(kidsQuery);

      const kidsData = kidsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Kid[];

      setKids(kidsData);
      if (kidsData.length > 0 && !selectedKid) {
        setSelectedKid(kidsData[0]);
      }

      // Load recent transactions
      const transRef = collection(db, 'allowanceTransactions');
      const transQuery = query(transRef, where('userId', '==', user.uid));
      const transSnap = await getDocs(transQuery);

      const transData = transSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as Transaction[];

      setTransactions(transData.sort((a, b) => b.date.getTime() - a.date.getTime()));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKid = async () => {
    if (!newKidName.trim()) return;

    haptics.light();

    try {
      const docRef = await addDoc(collection(db, 'allowanceKids'), {
        userId: user.uid,
        name: newKidName.trim(),
        avatar: newKidEmoji,
        balance: 0,
        weeklyAllowance: parseFloat(weeklyAmount) || 5,
        savingsGoal: 50,
        savingsGoalName: 'Something special',
        createdAt: serverTimestamp(),
      });

      const newKid: Kid = {
        id: docRef.id,
        name: newKidName.trim(),
        avatar: newKidEmoji,
        balance: 0,
        weeklyAllowance: parseFloat(weeklyAmount) || 5,
        savingsGoal: 50,
        savingsGoalName: 'Something special',
      };

      setKids((prev) => [...prev, newKid]);
      setSelectedKid(newKid);
      setShowAddKid(false);
      setNewKidName('');
      haptics.success();
    } catch (error) {
      console.error('Error adding kid:', error);
    }
  };

  const handleTransaction = async () => {
    if (!selectedKid || !transactionAmount) return;

    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) return;

    haptics.light();

    try {
      let newBalance = selectedKid.balance;

      if (transactionType === 'bonus') {
        newBalance += amount;
      } else if (transactionType === 'spend' || transactionType === 'save') {
        newBalance -= amount;
      }

      // Update kid balance
      await updateDoc(doc(db, 'allowanceKids', selectedKid.id), {
        balance: newBalance,
      });

      // Add transaction
      await addDoc(collection(db, 'allowanceTransactions'), {
        userId: user.uid,
        kidId: selectedKid.id,
        type: transactionType,
        amount,
        description: transactionDesc || getDefaultDescription(transactionType),
        date: serverTimestamp(),
      });

      // Update local state
      setKids((prev) =>
        prev.map((k) => (k.id === selectedKid.id ? { ...k, balance: newBalance } : k))
      );
      setSelectedKid((prev) => (prev ? { ...prev, balance: newBalance } : prev));

      setShowTransaction(false);
      setTransactionAmount('');
      setTransactionDesc('');
      loadData();
      haptics.success();
    } catch (error) {
      console.error('Error processing transaction:', error);
    }
  };

  const getDefaultDescription = (type: string) => {
    switch (type) {
      case 'bonus':
        return 'Bonus reward';
      case 'spend':
        return 'Purchase';
      case 'save':
        return 'Saved to goal';
      default:
        return '';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'allowance':
        return '💰';
      case 'bonus':
        return '🎁';
      case 'spend':
        return '🛒';
      case 'save':
        return '🏦';
      default:
        return '💵';
    }
  };

  const kidTransactions = selectedKid
    ? transactions.filter((t) => t.kidId === selectedKid.id).slice(0, 10)
    : [];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        paddingBottom: '100px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          💰 Allowance Manager
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Track allowance and teach money management
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {isLoading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
            <p style={{ color: theme.colors.text.muted }}>Loading...</p>
          </div>
        ) : kids.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>👶</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
              Add your first kid
            </h3>
            <p style={{ margin: '0 0 20px 0', color: theme.colors.text.muted }}>
              Start tracking their allowance and savings goals!
            </p>
            <button
              onClick={() => setShowAddKid(true)}
              style={{
                padding: '14px 28px',
                borderRadius: '14px',
                border: 'none',
                background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Add Kid
            </button>
          </div>
        ) : (
          <>
            {/* Kid Selector */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', overflowX: 'auto' }}>
              {kids.map((kid) => (
                <button
                  key={kid.id}
                  onClick={() => setSelectedKid(kid)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '16px',
                    border:
                      selectedKid?.id === kid.id
                        ? `2px solid ${theme.colors.accent.primary}`
                        : `1px solid ${theme.colors.border}`,
                    background:
                      selectedKid?.id === kid.id
                        ? `${theme.colors.accent.primary}20`
                        : theme.colors.card,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{kid.avatar}</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color:
                        selectedKid?.id === kid.id
                          ? theme.colors.accent.primary
                          : theme.colors.text.primary,
                    }}
                  >
                    {kid.name}
                  </span>
                </button>
              ))}
              <button
                onClick={() => setShowAddKid(true)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '16px',
                  border: `1px dashed ${theme.colors.border}`,
                  background: 'transparent',
                  cursor: 'pointer',
                  color: theme.colors.text.muted,
                  whiteSpace: 'nowrap',
                }}
              >
                + Add
              </button>
            </div>

            {/* Selected Kid Details */}
            {selectedKid && (
              <>
                {/* Balance Card */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    borderRadius: '20px',
                    padding: '24px',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    {selectedKid.name}'s Balance
                  </p>
                  <p style={{ margin: '0 0 16px 0', fontSize: '48px', fontWeight: 700, color: '#fff' }}>
                    ${selectedKid.balance.toFixed(2)}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                    Weekly allowance: ${selectedKid.weeklyAllowance.toFixed(2)}
                  </p>
                </div>

                {/* Savings Goal */}
                <div
                  style={{
                    background: theme.colors.card,
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '20px',
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: theme.colors.text.primary }}>
                        🎯 {selectedKid.savingsGoalName}
                      </p>
                      <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
                        Savings Goal
                      </p>
                    </div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#22c55e' }}>
                      ${Math.min(selectedKid.balance, selectedKid.savingsGoal).toFixed(2)} / $
                      {selectedKid.savingsGoal.toFixed(2)}
                    </p>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      background: theme.colors.background.secondary,
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (selectedKid.balance / selectedKid.savingsGoal) * 100)}%`,
                        background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <button
                    onClick={() => {
                      setTransactionType('bonus');
                      setShowTransaction(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#22c55e',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🎁 Add Bonus
                  </button>
                  <button
                    onClick={() => {
                      setTransactionType('spend');
                      setShowTransaction(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#f59e0b',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🛒 Spend
                  </button>
                </div>

                {/* Recent Transactions */}
                <h3
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: theme.colors.text.primary,
                  }}
                >
                  Recent Activity
                </h3>
                {kidTransactions.length === 0 ? (
                  <p style={{ color: theme.colors.text.muted, textAlign: 'center', padding: '20px' }}>
                    No transactions yet
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {kidTransactions.map((trans) => (
                      <div
                        key={trans.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          background: theme.colors.background.secondary,
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>{getTransactionIcon(trans.type)}</span>
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              fontSize: '14px',
                              color: theme.colors.text.primary,
                            }}
                          >
                            {trans.description}
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                            {trans.date.toLocaleDateString()}
                          </p>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 700,
                            color:
                              trans.type === 'bonus' || trans.type === 'allowance'
                                ? '#22c55e'
                                : '#ef4444',
                          }}
                        >
                          {trans.type === 'bonus' || trans.type === 'allowance' ? '+' : '-'}$
                          {trans.amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Add Kid Modal */}
      {showAddKid && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowAddKid(false)}
        >
          <div
            style={{
              background: theme.colors.background.primary,
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 700 }}>Add Kid</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                Name
              </label>
              <input
                type="text"
                value={newKidName}
                onChange={(e) => setNewKidName(e.target.value)}
                placeholder="Kid's name"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                Avatar
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {kidEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewKidEmoji(emoji)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      border:
                        newKidEmoji === emoji
                          ? `2px solid ${theme.colors.accent.primary}`
                          : `1px solid ${theme.colors.border}`,
                      background: newKidEmoji === emoji ? `${theme.colors.accent.primary}20` : 'transparent',
                      fontSize: '24px',
                      cursor: 'pointer',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                Weekly Allowance ($)
              </label>
              <input
                type="number"
                value={weeklyAmount}
                onChange={(e) => setWeeklyAmount(e.target.value)}
                placeholder="5.00"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              />
            </div>

            <button
              onClick={handleAddKid}
              disabled={!newKidName.trim()}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: !newKidName.trim()
                  ? theme.colors.background.secondary
                  : theme.colors.accent.primary,
                color: !newKidName.trim() ? theme.colors.text.muted : '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: !newKidName.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              Add Kid
            </button>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransaction && selectedKid && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowTransaction(false)}
        >
          <div
            style={{
              background: theme.colors.background.primary,
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 700 }}>
              {transactionType === 'bonus' ? '🎁 Add Bonus' : '🛒 Record Spending'}
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                Amount ($)
              </label>
              <input
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                Description (optional)
              </label>
              <input
                type="text"
                value={transactionDesc}
                onChange={(e) => setTransactionDesc(e.target.value)}
                placeholder={transactionType === 'bonus' ? 'e.g., Chore reward' : 'e.g., Toy purchase'}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              />
            </div>

            <button
              onClick={handleTransaction}
              disabled={!transactionAmount}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: !transactionAmount
                  ? theme.colors.background.secondary
                  : transactionType === 'bonus'
                  ? '#22c55e'
                  : '#f59e0b',
                color: !transactionAmount ? theme.colors.text.muted : '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: !transactionAmount ? 'not-allowed' : 'pointer',
              }}
            >
              {transactionType === 'bonus' ? 'Add Bonus' : 'Record Spending'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllowancePage;
