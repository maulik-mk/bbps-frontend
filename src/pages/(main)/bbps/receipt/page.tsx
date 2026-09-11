import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { transactionService } from '../../../../services/transaction.service';

const ReceiptPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        transactionService
            .getReceipt(id)
            .then((res) => {
                if (res.data) setTransaction(res.data);
                else setTransaction({ notFound: true });
            })
            .catch((err) => {
                console.error('Failed to fetch transaction receipt', err);
                setTransaction({ notFound: true });
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <i className="pi pi-spin pi-spinner text-blue-500" style={{ fontSize: '2rem' }}></i>
            </div>
        );
    }

    if (!transaction || transaction.notFound) {
        return (
            <div className="flex flex-column justify-content-center align-items-center mt-8" style={{ fontFamily: 'var(--font-family)' }}>
                <i className="pi pi-exclamation-circle text-red-500 mb-3" style={{ fontSize: '4rem' }}></i>
                <h2 className="text-900 font-bold text-2xl m-0 mb-2">Receipt Not Found</h2>
                <p className="text-500 m-0 mb-4">We couldn't locate the transaction details for ID: {id}</p>
                <Button label="Back to Transactions" icon="pi pi-arrow-left" className="border-round-xl" onClick={() => navigate('/bbps/transactions')} />
            </div>
        );
    }

    const isSuccess = transaction.status === 'success';
    const isPending = transaction.status === 'pending';

    let statusIcon = 'pi pi-times-circle text-red-500';
    let statusColor = 'bg-red-100 text-red-700';
    if (isSuccess) {
        statusIcon = 'pi pi-check-circle text-green-500';
        statusColor = 'bg-green-100 text-green-700';
    } else if (isPending) {
        statusIcon = 'pi pi-clock text-orange-500';
        statusColor = 'bg-orange-100 text-orange-700';
    }

    return (
        <div className="grid">
            <div className="col-12 xl:col-8 xl:col-offset-2">
                <div className="surface-card p-5 shadow-2 border-round-2xl">
                    {/* Header */}
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center mb-5 gap-3 border-bottom-1 border-200 pb-4">
                        <div>
                            <Button icon="pi pi-arrow-left" label="Back to Transactions" className="p-button-text p-button-secondary p-0 mb-3 hover:text-blue-500 transition-colors" onClick={() => navigate(-1)} />
                            <div className="text-900 text-3xl font-bold">Transaction Details</div>
                            <div className="text-600 font-medium mt-1">View the full details of this BBPS transaction.</div>
                        </div>
                        <img src="/logo/B_Assured.png" alt="B Assured" style={{ height: '100px' }} className="mb-4" />
                    </div>

                    {/* Status Highlights */}
                    <div
                        className={`p-4 border-round-xl mb-5 flex flex-column sm:flex-row align-items-start sm:align-items-center justify-content-between border-1 ${
                            isSuccess ? 'surface-ground border-green-200' : isPending ? 'surface-ground border-orange-200' : 'surface-ground border-red-200'
                        }`}
                    >
                        <div className="flex align-items-center mb-3 sm:mb-0">
                            <i className={`${statusIcon} text-5xl mr-4`}></i>
                            <div>
                                <div className="text-900 font-bold text-3xl mb-1">₹{parseFloat(transaction.total_amount).toLocaleString('en-IN')}</div>
                                <div className="text-600 font-medium text-sm uppercase tracking-wider">Total Amount {isSuccess ? 'Paid' : 'Attempted'}</div>
                            </div>
                        </div>
                        <Tag value={transaction.status} severity={isSuccess ? 'success' : isPending ? 'warning' : 'danger'} className="text-sm px-4 py-2 font-bold border-round-2xl shadow-1 uppercase tracking-wide" />
                    </div>

                    {/* Details Grid */}
                    <div className="grid mb-5">
                        <div className="col-12 sm:col-6 p-3">
                            <div className="flex align-items-center text-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                <i className="pi pi-building mr-2"></i>Provider
                            </div>
                            <div className="text-900 font-bold text-xl">{transaction.biller_name || 'N/A'}</div>
                        </div>
                        <div className="col-12 sm:col-6 p-3">
                            <div className="flex align-items-center text-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                <i className="pi pi-user mr-2"></i>Customer / Mobile
                            </div>
                            <div className="text-900 font-bold text-xl">{transaction.mobile}</div>
                        </div>
                        <div className="col-12 sm:col-6 p-3">
                            <div className="flex align-items-center text-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                <i className="pi pi-hashtag mr-2"></i>Reference / ID
                            </div>
                            <div className="text-900 font-bold font-mono text-lg">{transaction.consumer_number || 'N/A'}</div>
                        </div>
                        <div className="col-12 sm:col-6 p-3">
                            <div className="flex align-items-center text-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                <i className="pi pi-file mr-2"></i>Transaction ID
                            </div>
                            <div className="text-900 font-bold font-mono text-lg">{transaction.txn_id}</div>
                        </div>
                        {transaction.utr && (
                            <div className="col-12 sm:col-6 p-3">
                                <div className="flex align-items-center text-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                    <i className="pi pi-sitemap mr-2"></i>BBPS Reference Number / UTR
                                </div>
                                <div className="text-blue-700 bg-blue-50 font-bold font-mono inline-block px-2 py-1 border-round text-lg">{transaction.utr}</div>
                            </div>
                        )}
                        <div className="col-12 sm:col-6 p-3">
                            <div className="flex align-items-center text-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                <i className="pi pi-calendar mr-2"></i>Date & Time
                            </div>
                            <div className="text-900 font-bold text-lg">{new Date(transaction.created_at).toLocaleString('en-IN')}</div>
                        </div>

                        <div className="col-12 p-0 mt-3 border-top-1 border-200"></div>

                        <div className="col-12 sm:col-6 p-3">
                            <div className="flex align-items-center text-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                <i className="pi pi-wallet mr-2"></i>Opening Balance
                            </div>
                            <div className="text-900 font-bold text-lg">₹{parseFloat(transaction.balance_before || 0).toLocaleString('en-IN')}</div>
                        </div>

                        <div className="col-12 sm:col-6 p-3">
                            <div className="flex align-items-center text-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                <i className="pi pi-wallet mr-2"></i>Closing Balance
                            </div>
                            <div className="text-900 font-bold text-lg">₹{parseFloat(transaction.balance_after || 0).toLocaleString('en-IN')}</div>
                        </div>
                        <div className="col-12 sm:col-6 p-3">
                            <div className="flex align-items-center text-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                <i className="pi pi-bolt mr-2"></i>Bill Amount
                            </div>
                            <div className="text-900 font-bold text-lg">₹{parseFloat(transaction.bill_amount || 0).toLocaleString('en-IN')}</div>
                        </div>
                        <div className="col-12 sm:col-6 p-3">
                            <div className="flex align-items-center text-500 font-bold text-xs mb-2 uppercase tracking-widest">
                                <i className="pi pi-dollar mr-2"></i>Charges Applied
                            </div>
                            <div className="text-900 font-bold text-lg text-red-500">₹{parseFloat(transaction.charge_amount || 0).toLocaleString('en-IN')}</div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="border-top-1 border-200 pt-5 flex flex-column sm:flex-row justify-content-end gap-3">
                        <Button label="Download PDF" icon="pi pi-download" className="p-button-outlined p-button-secondary border-round-xl font-bold px-4" />
                        <Button label="Print Details" icon="pi pi-print" className="border-round-xl font-bold bg-blue-600 border-blue-600 hover:bg-blue-700 px-4 shadow-2" onClick={() => window.print()} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPage;
