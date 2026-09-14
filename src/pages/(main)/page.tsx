import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TransactionList, TransactionItem } from '../../components/dashboard/TransactionList';
import { WalletButton } from '../../components/dashboard/WalletButton';
import { transactionService } from '../../services/transaction.service';
import { userService } from '../../services/user.service';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userName = user?.name || 'User';

    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [mainBalance, setMainBalance] = useState<number>(0);

    useEffect(() => {
        userService
            .getProfile()
            .then((res) => {
                if (res.data && res.data.mainbalance) {
                    setMainBalance(parseFloat(res.data.mainbalance));
                }
            })
            .catch((err) => console.error('Failed to fetch profile', err));

        transactionService
            .getTransactions()
            .then((res) => {
                if (res.data) {
                    setRecentTransactions(res.data.slice(0, 4));
                }
            })
            .catch((err) => console.error('Failed to fetch transactions', err));
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    };

    return (
        <div className="grid" style={{ fontFamily: 'var(--font-family)' }}>
            {/* Top Row Cards */}
            <div className="col-12 lg:col-4">
                <div className="shadow-2 border-round-2xl p-5 flex flex-column justify-content-between h-full relative overflow-hidden" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                    {/* Decorative Background Blob */}
                    <div className="absolute border-circle" style={{ width: '300px', height: '300px', backgroundColor: 'rgba(59, 130, 246, 0.15)', top: '-100px', right: '-100px', filter: 'blur(40px)', zIndex: 0 }}></div>

                    <div className="flex justify-content-between align-items-center mb-5 relative" style={{ zIndex: 1 }}>
                        <div className="flex align-items-center text-blue-200 font-bold text-sm tracking-widest uppercase">
                            <i className="pi pi-wallet mr-2"></i>
                            <span>Main Wallet</span>
                        </div>
                        <span className="text-white text-xs font-bold px-3 py-1 border-round-2xl bg-green-500">ACTIVE</span>
                    </div>
                    <div className="mb-6 relative" style={{ zIndex: 1 }}>
                        <div className="text-500 font-medium mb-1">Total Balance</div>
                        <span className="text-5xl font-bold tracking-tight">₹{Math.floor(mainBalance).toLocaleString('en-IN')}</span>
                        <span className="text-2xl font-medium text-500">.{(mainBalance % 1).toFixed(2).substring(2)}</span>
                    </div>
                    <div className="flex gap-3 relative" style={{ zIndex: 1 }}>
                        <WalletButton label="Add Money" icon="pi pi-plus" bgColor="#ffffff" textColor="#0f172a" />
                        <WalletButton label="Send" icon="pi pi-send" bgColor="#1e293b" textColor="#ffffff" />
                        <WalletButton icon="pi pi-download" bgColor="#1e293b" textColor="#ffffff" isIconOnly />
                    </div>
                </div>
            </div>

            {user?.role === 'retailer' && (
                <div className="col-12 md:col-6 lg:col-4">
                    <div className="surface-card shadow-2 border-round-2xl p-5 flex flex-column justify-content-between h-full relative overflow-hidden border-1 border-200" style={{ background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)' }}>
                        <div className="relative" style={{ zIndex: 1 }}>
                            <div 
                                className="flex align-items-center justify-content-center mb-4 cursor-pointer transition-transform hover:-translate-y-1 mx-auto"
                                onClick={() => navigate('/bbps/categories')}
                                title="Go to Bharat Connect"
                            >
                                <img src="/logo/B_mnemonic.png" alt="Bharat Connect" style={{ width: '55px' }} />
                            </div>
                            <h5 className="text-2xl font-bold text-900 mb-2 mt-0 tracking-tight">Bharat Connect Bill Pay</h5>
                            <p className="text-600 text-base line-height-3 mb-5 font-medium">Pay electricity, mobile, DTH, and all other utilities securely in one place.</p>
                        </div>
                        <div className="relative" style={{ zIndex: 1 }}>
                            <WalletButton label="Explore Categories" icon="pi pi-arrow-right" bgColor="#2563eb" textColor="#ffffff" onClick={() => navigate('/bbps/categories')} />
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Row Lists */}
            <div className="col-12 xl:col-6 mt-4">
                <TransactionList title="Latest Transactions" onActionClick={() => navigate('/bbps/transactions')}>
                    <span className="text-500 font-semibold text-sm mb-4 uppercase tracking-wider block">Recent History</span>
                    {recentTransactions.map((tx) => (
                        <TransactionItem
                            key={tx.id}
                            title={tx.service_name || 'Service Payment'}
                            subtitle={`Txn ID: ${tx.txn_id}`}
                            amount={formatCurrency(parseFloat(tx.total_amount))}
                            icon={tx.status === 'success' ? 'pi pi-check' : 'pi pi-times'}
                            iconBgClass={tx.status === 'success' ? 'bg-green-100' : 'bg-red-100'}
                            iconTextClass={tx.status === 'success' ? 'text-green-600' : 'text-red-600'}
                            isViewable
                            onView={() => navigate(`/bbps/transactions/receipt/${tx.id}`)}
                        />
                    ))}
                    {recentTransactions.length === 0 && <span className="text-500">No recent transactions.</span>}
                </TransactionList>
            </div>

            <div className="col-12 xl:col-6 mt-4">
                <TransactionList title="Upcoming Transactions" actionLabel="View All" onActionClick={() => navigate('/bbps/categories')}>
                    <span className="text-500 font-semibold text-sm mb-4 uppercase tracking-wider block">Today</span>
                    <TransactionItem title="Water Bill" subtitle="Unsuccessfully" amount="- ₹280.00" icon="pi pi-filter" iconBgClass="bg-indigo-100" iconTextClass="text-indigo-600" amountClass="text-red-500" />

                    <span className="text-500 font-semibold text-sm mb-4 mt-5 uppercase tracking-wider block">Tomorrow</span>
                    <TransactionItem title="Income: Commission" subtitle="Successfully" amount="+ ₹1200.00" icon="pi pi-wallet" iconBgClass="bg-pink-100" iconTextClass="text-pink-600" amountClass="text-green-600" />
                    <TransactionItem title="Electric Bill" subtitle="Successfully" amount="- ₹480.00" icon="pi pi-bolt" iconBgClass="bg-blue-100" iconTextClass="text-blue-600" amountClass="text-red-500" />
                </TransactionList>
            </div>
        </div>
    );
};

export default Dashboard;
