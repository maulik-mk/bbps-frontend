import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import BBPSPageCard from '../../../../components/BBPSPageCard';
import { transactionService } from '../../../../services/transaction.service';
import { BBPSLogo } from '../../../../components/BBPSLogo';

interface BillSummaryProps {
    billerIdProp?: string;
    billerNameProp?: string;
    onClose?: () => void;
    isCanvas?: boolean;
    onPaymentSuccess?: (amount: number, billerName: string, consumerNumber: string, bbpsRefNo: string, transactionId?: string) => void;
}

const BillSummary = ({ billerIdProp, billerNameProp, onClose, isCanvas = false, onPaymentSuccess }: BillSummaryProps) => {
    const { billerId: paramBillerId } = useParams<{ billerId: string }>();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [payAmount, setPayAmount] = useState<number | null>(0);
    const [loading, setLoading] = useState(false);
    const [transactionResult, setTransactionResult] = useState<any>(null);

    const billerId = billerIdProp || paramBillerId;

    const dummyBill = {
        consumerNumber: billerId || '0000000001',
        customerName: 'Nexasoft',
        billerName: billerNameProp || 'Torrent Power',
        billAmount: '573.00',
        ccfAmount: '₹15.00',
        totalAmount: '588.00',
        dueDate: '15 Sep 2026',
        billDate: '01 Sep 2026',
        billPeriod: 'August',
        billNumber: '9830219',
        bbpsRefNo: 'CC014366BAAE00066544',
        amountOptions: [
            { label: 'Base Bill Amount', value: '573.00' },
            { label: 'Late Payment Fee', value: '₹0.00' },
            { label: 'Additional Charges', value: '₹0.00' },
            { label: 'Fixed Charges', value: '₹0.00' }
        ]
    };

    const maxPayableAmount = parseFloat(dummyBill.billAmount.replace(/[^0-9.-]+/g, '')) || 0;

    const handlePay = async () => {
        if (!payAmount || payAmount <= 0) return;

        setLoading(true);
        try {
            const res = await transactionService.processPayment({
                category_id: 23,
                amount: Number(payAmount).toFixed(2),
                biller_name: dummyBill.billerName,
                consumer_number: dummyBill.consumerNumber
            });

            const audio = new Audio('/sounds/BharatConnect MOGO 270824.wav');
            audio.play().catch((e) => console.error('Audio play failed:', e));

            const backendTxnId = res.data?.txn_id || dummyBill.bbpsRefNo;
            setTransactionResult({ ...res.data, bbpsRefNo: backendTxnId });

            if (onPaymentSuccess) {
                onPaymentSuccess(payAmount, dummyBill.billerName, dummyBill.consumerNumber, backendTxnId, res.data?.transaction_id);
            } else {
                setShowReceipt(true);
            }
        } catch (error: any) {
            console.error('Payment failed:', error);
            const errorMessage = error.response?.data?.error || 'Payment failed. Please try again.';
            toast.current?.show({ severity: 'error', summary: 'Transaction Failed', detail: errorMessage, life: 5000 });
        } finally {
            setLoading(false);
        }
    };

    const receiptFooter = (
        <div className="flex w-full gap-2 mt-2">
            <Button
                label="View Receipt"
                icon="pi pi-file"
                className="p-button-outlined p-button-secondary flex-1"
                onClick={() => {
                    setShowReceipt(false);
                    const destId = transactionResult?.transaction_id || dummyBill.bbpsRefNo;
                    navigate(`/bbps/transactions/receipt/${destId}`);
                }}
            />
            <Button
                label="Done"
                icon="pi pi-check"
                className="flex-1"
                onClick={() => {
                    setShowReceipt(false);
                    if (onClose) onClose();
                    else navigate('/bbps/categories');
                }}
                autoFocus
            />
        </div>
    );

    const content = (
        <>
            <BBPSPageCard title="Bill Summary" subtitle="Review bill details before authorizing" onBack={() => (onClose ? onClose() : navigate(-1))} isCanvas={isCanvas}>
                <div>
                    {/* Details List */}
                    <div className="surface-50 border-round-2xl p-3 mb-3">
                        <div className="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                            <div className="flex align-items-center text-600">
                                <i className="pi pi-building mr-3 text-lg text-blue-500"></i>
                                <span className="font-medium text-sm">Biller Name</span>
                            </div>
                            <div className="flex align-items-center text-900 font-bold">
                                <span className="mr-3">{dummyBill.billerName}</span>
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 border-round-xl">Electricity</span>
                            </div>
                        </div>

                        <div className="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                            <div className="flex align-items-center text-600">
                                <i className="pi pi-hashtag mr-3 text-lg text-purple-500"></i>
                                <span className="font-medium text-sm">Customer Number</span>
                            </div>
                            <div className="flex align-items-center text-900 font-bold font-mono tracking-wider">
                                <span className="mr-3">{dummyBill.consumerNumber}</span>
                                <i className="pi pi-copy text-400 cursor-pointer hover:text-600 transition-colors"></i>
                            </div>
                        </div>

                        <div className="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                            <div className="flex align-items-center text-600">
                                <i className="pi pi-user mr-3 text-lg text-orange-500"></i>
                                <span className="font-medium text-sm">Customer Name</span>
                            </div>
                            <div className="flex align-items-center text-900 font-bold">
                                <span>{dummyBill.customerName}</span>
                            </div>
                        </div>

                        <div className="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                            <div className="flex align-items-center text-600">
                                <i className="pi pi-calendar mr-3 text-lg text-teal-500"></i>
                                <span className="font-medium text-sm">Bill Date</span>
                            </div>
                            <div className="flex align-items-center text-900 font-bold">
                                <span>{dummyBill.billDate}</span>
                            </div>
                        </div>

                        <div className="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                            <div className="flex align-items-center text-600">
                                <i className="pi pi-calendar-plus mr-3 text-lg text-indigo-500"></i>
                                <span className="font-medium text-sm">Bill Period</span>
                            </div>
                            <div className="flex align-items-center text-900 font-bold">
                                <span>{dummyBill.billPeriod}</span>
                            </div>
                        </div>

                        <div className="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                            <div className="flex align-items-center text-600">
                                <i className="pi pi-file mr-3 text-lg text-pink-500"></i>
                                <span className="font-medium text-sm">Bill Number</span>
                            </div>
                            <div className="flex align-items-center text-900 font-bold">
                                <span>{dummyBill.billNumber}</span>
                            </div>
                        </div>

                        <div className="flex justify-content-between align-items-center py-2">
                            <div className="flex align-items-center text-600">
                                <i className="pi pi-clock text-red-500 mr-3 text-lg"></i>
                                <span className="font-medium text-sm">Due Date</span>
                            </div>
                            <div className="flex align-items-center text-red-500 font-bold">
                                <span className="mr-3">{dummyBill.dueDate}</span>
                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 border-round-xl">PENDING</span>
                            </div>
                        </div>
                    </div>

                    {/* Highlight Billed Amount Box */}
                    <div className="bg-blue-50 p-4 flex flex-column border-1 border-blue-200 border-round-xl mb-3">
                        {/* Header Row */}
                        <div className="flex justify-content-between align-items-center border-bottom-1 border-blue-200 pb-3 mb-3">
                            <div className="font-bold text-blue-900 text-lg">Bill Amount</div>
                            <div className="text-blue-800 font-bold text-xl">{dummyBill.billAmount}</div>
                        </div>

                        {/* Breakdown Rows */}
                        <div className="flex flex-column gap-2 mb-3 px-2">
                            {dummyBill.amountOptions.map((opt, idx) => (
                                <div key={idx} className="flex justify-content-between align-items-center">
                                    <span className="text-blue-800 text-sm">{opt.label}</span>
                                    <span className="text-blue-900 font-semibold text-sm">{opt.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* CCF Row */}
                        <div className="flex justify-content-between align-items-center py-3 border-top-1 border-bottom-1 border-blue-200 mb-3 px-2">
                            <span className="text-blue-900 text-sm font-bold">CCF</span>
                            <span className="text-blue-900 font-bold text-sm">{dummyBill.ccfAmount}</span>
                        </div>

                        {/* Total Row */}
                        <div className="flex justify-content-between align-items-center px-2">
                            <div>
                                <div className="font-bold text-blue-900 text-xl">Total Amount</div>
                                <div className="text-blue-500 text-xs mt-1">Inclusive of all charges</div>
                            </div>
                            <div className="text-blue-900 font-bold text-4xl tracking-tight">{dummyBill.totalAmount}</div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full my-4" style={{ borderTop: '2px dashed #b0bac5ff' }}></div>

                    {/* Payment Input Section */}
                    <div>
                        <label className="text-xs font-bold text-600 uppercase tracking-wide block mb-2">Enter Amount to Pay</label>

                        <div className="relative w-full">
                            <span className="p-input-icon-left w-full">
                                <i className="pi text-500 font-medium text-lg font-normal font-sans" style={{ fontStyle: 'normal' }}>
                                    ₹
                                </i>
                                <InputNumber
                                    id="customAmount"
                                    value={payAmount}
                                    onValueChange={(e) => setPayAmount(e.value ?? null)}
                                    mode="decimal"
                                    className="w-full"
                                    inputClassName="w-full border-round-xl border-300 shadow-none hover:border-blue-400 focus:border-blue-500 transition-colors text-lg font-bold py-2 text-900 pl-5"
                                    style={{ paddingRight: '7rem' }}
                                />
                            </span>
                            <Button
                                label="Full Due"
                                onClick={() => setPayAmount(maxPayableAmount)}
                                className="p-button-text bg-blue-50 text-blue-600 border-round-xl px-3 py-1 text-sm font-bold absolute z-2 transition-colors hover:bg-blue-100 m-0"
                                style={{ right: '0.5rem', top: '50%', transform: 'translateY(-50%)', height: 'calc(100% - 1rem)' }}
                            />
                        </div>

                        {/* Payment Button */}
                        <div className="mt-3">
                            <Button
                                label={`Pay ₹${(payAmount || 0).toLocaleString('en-IN')}`}
                                icon="pi pi-check-circle"
                                className="border-round-xl w-full py-3 font-bold text-lg shadow-1 bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-colors"
                                onClick={handlePay}
                                disabled={!payAmount || payAmount <= 0 || payAmount > maxPayableAmount || loading}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </BBPSPageCard>

            <Dialog showHeader={false} visible={showReceipt} style={{ width: '450px' }} footer={receiptFooter} onHide={() => setShowReceipt(false)} breakpoints={{ '960px': '75vw', '641px': '90vw' }} contentClassName="p-4">
                <div className="relative pt-2">
                    <div className="absolute top-0 right-0">
                        <BBPSLogo type="b_assured" />
                    </div>

                    <div className="flex flex-column align-items-center text-center mt-3 mb-5">
                        <i className="pi pi-file text-800 mb-2" style={{ fontSize: '3.5rem' }}></i>
                        <span className="text-green-500 font-bold text-md mt-2">Transaction success!</span>
                    </div>

                    <div className="w-full text-sm mt-4">
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold w-5">B-Connect Transaction ID</span>
                            <span className="text-900 font-bold w-7 text-right line-height-3" style={{ wordBreak: 'break-word' }}>
                                {transactionResult?.bbpsRefNo || dummyBill.bbpsRefNo}
                            </span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Biller ID</span>
                            <span className="text-900 font-bold text-right">{billerId || 'OTME00005XXZ43'}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Biller Name</span>
                            <span className="text-900 font-bold text-right">{dummyBill.billerName}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Customer Name</span>
                            <span className="text-900 font-bold text-right">{dummyBill.customerName}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Customer Number</span>
                            <span className="text-900 font-bold text-right">{dummyBill.consumerNumber}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Bill Date</span>
                            <span className="text-900 font-bold text-right">{dummyBill.billDate}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Bill Period</span>
                            <span className="text-900 font-bold text-right">{dummyBill.billPeriod}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Bill Number</span>
                            <span className="text-900 font-bold text-right">{dummyBill.billNumber}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Due Date</span>
                            <span className="text-900 font-bold text-right">{dummyBill.dueDate}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Bill Amount</span>
                            <span className="text-900 font-bold text-right">{dummyBill.billAmount}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">CCF</span>
                            <span className="text-900 font-bold text-right">{dummyBill.ccfAmount}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Total Amount</span>
                            <span className="text-900 font-bold text-right">₹{parseFloat((payAmount || 0).toString()).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Transaction Date and Time</span>
                            <span className="text-900 font-bold text-right">{new Date().toLocaleString('en-CA').replace(',', '')}</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Initiating Channel</span>
                            <span className="text-900 font-bold text-right">WEB</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Payment Mode</span>
                            <span className="text-900 font-bold text-right">Main Wallet</span>
                        </div>
                        <div className="flex justify-content-between mb-4">
                            <span className="text-900 font-bold">Transaction Status</span>
                            <span className="text-green-600 font-bold text-right">Success</span>
                        </div>
                        <div className="flex justify-content-between">
                            <span className="text-900 font-bold">Approval Number</span>
                            <span className="text-900 font-bold text-right">{(transactionResult?.bbpsRefNo || dummyBill.bbpsRefNo).replace('CC01', 'UTR1')}</span>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );

    if (isCanvas) {
        return (
            <div className="w-full h-full" style={{ fontFamily: 'var(--font-family)' }}>
                <Toast ref={toast} />
                {content}
            </div>
        );
    }

    return (
        <div className="grid justify-content-center" style={{ fontFamily: 'var(--font-family)' }}>
            <Toast ref={toast} />
            <div className="col-12 lg:col-7 mt-5">{content}</div>
        </div>
    );
};

export default BillSummary;
