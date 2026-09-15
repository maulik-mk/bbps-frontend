import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { transactionService } from '../../../../services/transaction.service';
import { BBPSLogo } from '../../../../components/BBPSLogo';

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
        <div className="grid justify-content-center" style={{ fontFamily: 'var(--font-family)' }}>
            <div className="col-12 lg:col-10 xl:col-8 mt-5">
                {/* Header */}
                <div className="flex justify-content-between align-items-center mb-4">
                    <h1 className="text-3xl font-bold text-blue-900 m-0 tracking-wide uppercase">Bill Pay Receipt</h1>
                    <div style={{ transform: 'scale(1.4)', transformOrigin: 'right center' }}>
                        <BBPSLogo type="b_assured" />
                    </div>
                </div>

                {/* Receipt Card */}
                <div className="surface-card border-1 border-300 border-round-xl shadow-none overflow-hidden mb-5">
                    <div className="p-4 border-bottom-1 border-300 bg-gray-50 flex align-items-center">
                        <span className="font-bold text-gray-900 text-lg">Transaction {transaction.status === 'success' ? 'Successful !' : transaction.status === 'pending' ? 'Pending' : 'Failed'}</span>
                    </div>

                    <div className="flex flex-column w-full">
                        {/* Row 1 */}
                        <div className="flex flex-column md:flex-row w-full border-bottom-1 border-200">
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-none md:border-right-1 border-200">
                                <span className="text-600 font-semibold text-sm">Biller Name</span>
                                <span className="text-900 font-bold text-sm text-right">{transaction.biller_name || 'N/A'}</span>
                            </div>
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-top-1 border-200 md:border-none">
                                <span className="text-600 font-semibold text-sm">Bill Amount</span>
                                <span className="text-900 font-bold text-sm text-right">{parseFloat(transaction.bill_amount || 0).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-column md:flex-row w-full border-bottom-1 border-200">
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-none md:border-right-1 border-200">
                                <span className="text-600 font-semibold text-sm">Biller ID</span>
                                <span className="text-900 font-bold text-sm text-right">{transaction.biller_id || '0TME00005XXZ43'}</span>
                            </div>
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-top-1 border-200 md:border-none">
                                <span className="text-600 font-semibold text-sm">Customer Convenience Fees</span>
                                <span className="text-900 font-bold text-sm text-right">{parseFloat(transaction.charge_amount || 0).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="flex flex-column md:flex-row w-full border-bottom-1 border-200">
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-none md:border-right-1 border-200">
                                <span className="text-600 font-semibold text-sm">Bharat Connect Transaction ID</span>
                                <span className="text-900 font-bold text-sm text-right line-height-3 max-w-15rem" style={{ wordBreak: 'break-word' }}>
                                    {transaction.txn_id}
                                </span>
                            </div>
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-top-1 border-200 md:border-none">
                                <span className="text-600 font-semibold text-sm">Total Amount</span>
                                <span className="text-900 font-bold text-sm text-right">{parseFloat(transaction.total_amount || 0).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Row 4 */}
                        <div className="flex flex-column md:flex-row w-full border-bottom-1 border-200">
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-none md:border-right-1 border-200">
                                <span className="text-600 font-semibold text-sm">Customer Name</span>
                                <span className="text-900 font-bold text-sm text-right">{transaction.customer_name || 'Nexasoft'}</span>
                            </div>
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-top-1 border-200 md:border-none">
                                <span className="text-600 font-semibold text-sm">Transaction Date and Time</span>
                                <span className="text-900 font-bold text-sm text-right">{new Date(transaction.created_at).toLocaleString('en-CA').replace(',', '')}</span>
                            </div>
                        </div>

                        {/* Row 5 */}
                        <div className="flex flex-column md:flex-row w-full border-bottom-1 border-200">
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-none md:border-right-1 border-200">
                                <span className="text-600 font-semibold text-sm">Customer Number</span>
                                <span className="text-900 font-bold text-sm text-right">{transaction.mobile || transaction.consumer_number}</span>
                            </div>
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-top-1 border-200 md:border-none">
                                <span className="text-600 font-semibold text-sm">Payment Mode</span>
                                <span className="text-900 font-bold text-sm text-right">Main Wallet</span>
                            </div>
                        </div>

                        {/* Row 6 */}
                        <div className="flex flex-column md:flex-row w-full border-bottom-1 border-200">
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-none md:border-right-1 border-200">
                                <span className="text-600 font-semibold text-sm">Bill Date</span>
                                <span className="text-900 font-bold text-sm text-right">{transaction.bill_date || '01 Sep 2026'}</span>
                            </div>
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-top-1 border-200 md:border-none">
                                <span className="text-600 font-semibold text-sm">Transaction Status</span>
                                <span className="text-900 font-bold text-sm text-right capitalize">{transaction.status}</span>
                            </div>
                        </div>

                        {/* Row 7 */}
                        <div className="flex flex-column md:flex-row w-full border-bottom-1 border-200">
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-none md:border-right-1 border-200">
                                <span className="text-600 font-semibold text-sm">Bill Period</span>
                                <span className="text-900 font-bold text-sm text-right">{transaction.bill_period || 'August'}</span>
                            </div>
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-top-1 border-200 md:border-none">
                                <span className="text-600 font-semibold text-sm">Approval Number</span>
                                <span className="text-900 font-bold text-sm text-right">UTR1AE8B7B452F74B574</span>
                            </div>
                        </div>

                        {/* Row 8 */}
                        <div className="flex flex-column md:flex-row w-full border-bottom-1 border-200">
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-none md:border-right-1 border-200">
                                <span className="text-600 font-semibold text-sm">Bill Number</span>
                                <span className="text-900 font-bold text-sm text-right">{transaction.bill_number || '9830219'}</span>
                            </div>
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-top-1 border-200 md:border-none">
                                <span className="text-600 font-semibold text-sm">Initiating Channel</span>
                                <span className="text-900 font-bold text-sm text-right">WEB</span>
                            </div>
                        </div>

                        {/* Row 9 */}
                        <div className="flex flex-column md:flex-row w-full">
                            <div className="w-full md:w-6 flex justify-content-between p-4 border-none md:border-right-1 border-200">
                                <span className="text-600 font-semibold text-sm">Due Date</span>
                                <span className="text-900 font-bold text-sm text-right">{transaction.due_date || '15 Sep 2026'}</span>
                            </div>
                            <div className="w-full md:w-6 p-4 border-top-1 border-200 md:border-none"></div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-content-center mb-6">
                    <Button label="Download Receipt" className="border-round-lg font-bold bg-blue-700 border-blue-700 hover:bg-blue-800 px-6 py-2 shadow-2" onClick={() => window.print()} />
                </div>
            </div>
        </div>
    );
};

export default ReceiptPage;
