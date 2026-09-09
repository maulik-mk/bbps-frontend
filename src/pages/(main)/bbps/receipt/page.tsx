import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const ReceiptPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/dummy/transactions.json')
            .then((res) => res.json())
            .then((data: any[]) => {
                const found = data.find((t) => t.id === id || t.transactionId === id || t.bbpsRefNo === id);
                setTransaction(found || { notFound: true });
            })
            .catch((err) => {
                console.error('Failed to fetch transactions', err);
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

    const isSuccess = transaction.status === 'SUCCESS';
    const isPending = transaction.status === 'PENDING';

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
        <div className="grid justify-content-center pt-5 pb-8" style={{ fontFamily: 'var(--font-family)', minHeight: '80vh' }}>
            <div className="col-12 md:col-10 lg:col-7 xl:col-5">
                <div className="bg-white relative overflow-hidden shadow-1 border-none" style={{ borderRadius: '1.5rem' }}>
                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${isSuccess ? 'bg-green-500' : isPending ? 'bg-orange-500' : 'bg-red-500'}`}></div>

                    {/* Header */}
                    <div className="flex flex-column sm:flex-row align-items-center justify-content-between p-5 border-bottom-1 border-200 bg-white">
                        <div className="flex align-items-center mb-3 sm:mb-0">
                            <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-text p-button-secondary mr-3 hover:surface-200 transition-colors bg-white shadow-1" onClick={() => navigate(-1)} aria-label="Go Back" />
                            <h2 className="m-0 text-900 font-bold text-2xl tracking-tight text-blue-900">Payment Receipt</h2>
                        </div>
                        <img src="/logo/B_Assured.png" alt="B Assured" style={{ height: '100px' }} className="mb-4" />
                    </div>

                    <div className="p-5 flex flex-column align-items-center">
                        <i className={`${statusIcon} mb-3 shadow-2 border-circle bg-white`} style={{ fontSize: '4.5rem' }}></i>

                        <div className="text-center mb-5">
                            <div className="text-500 font-bold text-base mb-2 uppercase tracking-widest">Amount Paid</div>
                            <h1 className="m-0 text-900 font-bold text-6xl mb-3 text-blue-900">₹{transaction.amount?.toLocaleString('en-IN')}</h1>
                            <Tag value={transaction.status} className={`text-sm px-3 py-2 font-bold border-round-2xl shadow-1 ${statusColor}`} />
                        </div>

                        {/* Details Card */}
                        <div className="w-full mb-5">
                            <div className="flex justify-content-between align-items-center py-3 border-bottom-1 border-50">
                                <span className="text-600 font-semibold text-base flex align-items-center">
                                    <i className="pi pi-building mr-3 text-500 text-lg"></i>Provider
                                </span>
                                <span className="text-900 font-bold text-base text-right">{transaction.provider || transaction.billerName}</span>
                            </div>

                            <div className="flex justify-content-between align-items-center py-3 border-bottom-1 border-50">
                                <span className="text-600 font-semibold text-base flex align-items-center">
                                    <i className="pi pi-user mr-3 text-500 text-lg"></i>Customer
                                </span>
                                <span className="text-900 font-bold text-base text-right">{transaction.userName || transaction.customerName}</span>
                            </div>

                            <div className="flex justify-content-between align-items-center py-3 border-bottom-1 border-50">
                                <span className="text-600 font-semibold text-base flex align-items-center">
                                    <i className="pi pi-hashtag mr-3 text-500 text-lg"></i>Ref / ID
                                </span>
                                <span className="text-900 font-bold text-base font-mono tracking-wider">{transaction.billerNumber || transaction.consumerNumber}</span>
                            </div>

                            <div className="flex justify-content-between align-items-center py-3 border-bottom-1 border-50">
                                <span className="text-600 font-semibold text-base flex align-items-center">
                                    <i className="pi pi-file mr-3 text-500 text-lg"></i>Transaction ID
                                </span>
                                <span className="text-900 font-bold text-base font-mono">{transaction.id}</span>
                            </div>

                            {(transaction.utr || transaction.bbpsRefNo) && (
                                <div className="flex justify-content-between align-items-center py-3 border-bottom-1 border-50">
                                    <span className="text-600 font-semibold text-base flex align-items-center">
                                        <i className="pi pi-sitemap mr-3 text-500 text-lg"></i>UTR / BBPS Ref
                                    </span>
                                    <span className="text-900 font-bold text-base font-mono bg-blue-100 text-blue-800 px-2 py-1 border-round">{transaction.utr || transaction.bbpsRefNo}</span>
                                </div>
                            )}

                            <div className="flex justify-content-between align-items-center py-3">
                                <span className="text-600 font-semibold text-base flex align-items-center">
                                    <i className="pi pi-calendar mr-3 text-500 text-lg"></i>Date & Time
                                </span>
                                <span className="text-900 font-bold text-base text-right">{transaction.date ? new Date(transaction.date).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="text-center text-500 text-sm font-medium mb-5">Thank you for using Bharat Connect services.</div>

                        {/* Actions */}
                        <div className="flex gap-4 w-full">
                            <Button label="Download PDF" icon="pi pi-download" className="p-button-outlined p-button-secondary border-round-xl flex-1 font-bold py-3 text-lg bg-white" />
                            <Button
                                label="Print Receipt"
                                icon="pi pi-print"
                                className="border-round-xl flex-1 font-bold py-3 text-lg bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700 shadow-2 transition-colors"
                                onClick={() => window.print()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPage;
