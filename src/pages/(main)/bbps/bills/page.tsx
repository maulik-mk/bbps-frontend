import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import BBPSPageCard from '../../../../components/BBPSPageCard';
import { transactionService } from '../../../../services/transaction.service';

interface BillSummaryProps {
    billerIdProp?: string;
    onClose?: () => void;
    isCanvas?: boolean;
    onPaymentSuccess?: (amount: number, billerName: string, consumerNumber: string, bbpsRefNo: string) => void;
}

const BillSummary = ({ billerIdProp, onClose, isCanvas = false, onPaymentSuccess }: BillSummaryProps) => {
    const { billerId: paramBillerId } = useParams<{ billerId: string }>();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [payAmount, setPayAmount] = useState<number | null>(1250);
    const [paymentMode, setPaymentMode] = useState<string>('wallet');
    const [loading, setLoading] = useState(false);
    const [transactionResult, setTransactionResult] = useState<any>(null);

    const paymentModes = [
        { label: 'Main Wallet', value: 'wallet' },
        { label: 'UPI / QR', value: 'upi' },
        { label: 'Credit / Debit Card', value: 'card' },
        { label: 'Net Banking', value: 'net_banking' },
        { label: 'Cash', value: 'cash' }
    ];

    const billerId = billerIdProp || paramBillerId;

    const dummyBill = {
        consumerNumber: billerId || '0000000001',
        customerName: 'Maulik Kadeval',
        billerName: 'Selected Operator',
        billAmount: '₹173.00',
        dueDate: '15 Sep 2026',
        billDate: '01 Sep 2026',
        bbpsRefNo: 'TRX987654357'
    };

    const maxPayableAmount = parseFloat(dummyBill.billAmount.replace(/[^0-9.-]+/g, '')) || 0;

    const handlePay = async () => {
        if (!payAmount || payAmount <= 0) return;

        setLoading(true);
        try {
            const res = await transactionService.processPayment({
                category_id: 3,
                amount: Number(payAmount).toFixed(2),
                biller_name: dummyBill.billerName,
                consumer_number: dummyBill.consumerNumber
            });

            const audio = new Audio('/sounds/BharatConnect MOGO 270824.wav');
            audio.play().catch((e) => console.error('Audio play failed:', e));

            const backendTxnId = res.data?.txn_id || dummyBill.bbpsRefNo;
            setTransactionResult({ ...res.data, bbpsRefNo: backendTxnId });

            if (onPaymentSuccess) {
                onPaymentSuccess(payAmount, dummyBill.billerName, dummyBill.consumerNumber, backendTxnId);
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
                    navigate(`/bbps/transactions/receipt/${dummyBill.bbpsRefNo}`);
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
                    <div className="surface-50 border-round-2xl p-4 mb-4">
                        <div className="flex justify-content-between align-items-center py-3 border-bottom-1 border-200">
                            <div className="flex align-items-center text-600">
                                <i className="pi pi-building mr-3 text-lg text-blue-500"></i>
                                <span className="font-medium text-sm">Biller</span>
                            </div>
                            <div className="flex align-items-center text-900 font-bold">
                                <span className="mr-3">{dummyBill.billerName}</span>
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 border-round-xl">Electricity</span>
                            </div>
                        </div>

                        <div className="flex justify-content-between align-items-center py-3 border-bottom-1 border-200">
                            <div className="flex align-items-center text-600">
                                <i className="pi pi-hashtag mr-3 text-lg text-purple-500"></i>
                                <span className="font-medium text-sm">Consumer Number</span>
                            </div>
                            <div className="flex align-items-center text-900 font-bold font-mono tracking-wider">
                                <span className="mr-3">{dummyBill.consumerNumber}</span>
                                <i className="pi pi-copy text-400 cursor-pointer hover:text-600 transition-colors"></i>
                            </div>
                        </div>

                        <div className="flex justify-content-between align-items-center py-3 border-bottom-1 border-200">
                            <div className="flex align-items-center text-600">
                                <i className="pi pi-user mr-3 text-lg text-orange-500"></i>
                                <span className="font-medium text-sm">Customer Name</span>
                            </div>
                            <div className="flex align-items-center text-900 font-bold">
                                <span>{dummyBill.customerName}</span>
                            </div>
                        </div>

                        <div className="flex justify-content-between align-items-center py-3 border-bottom-1 border-200">
                            <div className="flex align-items-center text-600">
                                <i className="pi pi-calendar mr-3 text-lg text-teal-500"></i>
                                <span className="font-medium text-sm">Bill Date</span>
                            </div>
                            <div className="flex align-items-center text-900 font-bold">
                                <span>{dummyBill.billDate}</span>
                            </div>
                        </div>

                        <div className="flex justify-content-between align-items-center py-3">
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
                    <div className="bg-blue-50 p-4 flex justify-content-between align-items-center border-1 border-blue-100 border-round-xl">
                        <div>
                            <div className="font-bold text-blue-900 text-lg">Billed Amount</div>
                            <div className="text-blue-600 text-sm mt-1 font-medium">Gross payable inclusive of taxes</div>
                        </div>
                        <div className="text-blue-700 font-bold text-3xl tracking-tight">{dummyBill.billAmount}</div>
                    </div>

                    {/* Divider */}
                    <div className="w-full border-bottom-1 border-200 my-5 border-dashed"></div>

                    {/* Payment Input Section */}
                    <div>
                        <label className="text-xs font-bold text-600 uppercase tracking-wide block mb-3">Enter Amount to Pay</label>

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
                                    inputClassName="w-full border-round-xl border-300 shadow-none hover:border-blue-400 focus:border-blue-500 transition-colors text-lg font-bold py-3 text-900 pl-5"
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

                        <div className="mt-4 flex align-items-center text-sm ml-1">
                            <span className="text-blue-600 font-bold mr-3 cursor-pointer hover:text-blue-800 transition-colors" onClick={() => setPayAmount(maxPayableAmount)}>
                                Pay Full: {dummyBill.billAmount}
                            </span>
                            <span className="text-300 mr-3">•</span>
                            <span className="text-500 font-medium cursor-pointer hover:text-700 transition-colors" onClick={() => setPayAmount(100)}>
                                Custom Amount
                            </span>
                        </div>
                        <div className="mt-5">
                            <label className="text-xs font-bold text-600 uppercase tracking-wide block mb-3">Payment Mode</label>
                            <div className="relative w-full">
                                <i className="pi pi-wallet text-400 absolute z-1" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <Dropdown value={paymentMode} options={paymentModes} onChange={(e) => setPaymentMode(e.value)} className="w-full border-round-xl border-300 py-1 pl-4 hover:border-blue-400 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Payment Button */}
                    <div className="mt-5 pt-2">
                        <Button
                            label={payAmount ? `Pay ₹${payAmount.toLocaleString('en-IN')}` : 'Pay'}
                            icon="pi pi-check-circle"
                            className="border-round-xl w-full py-3 font-bold text-lg shadow-1 bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-colors"
                            onClick={handlePay}
                            disabled={!payAmount || payAmount <= 0 || payAmount > maxPayableAmount || loading}
                            loading={loading}
                        />
                    </div>
                </div>
            </BBPSPageCard>

            <Dialog header="Payment Successful" visible={showReceipt} style={{ width: '400px' }} footer={receiptFooter} onHide={() => setShowReceipt(false)} breakpoints={{ '960px': '75vw', '641px': '90vw' }}>
                <div className="flex flex-column align-items-center text-center">
                    <i className="pi pi-check-circle text-green-500 mb-3" style={{ fontSize: '4rem' }}></i>
                    <h2 className="m-0 text-gray-900 mb-1">₹{payAmount?.toLocaleString('en-IN') ?? 0}</h2>
                    <p className="text-500 mb-3">Paid to {dummyBill.billerName}</p>
                    <img src="/logo/B_Assured.png" alt="B Assured" style={{ height: '100px' }} className="mb-4" />

                    <div className="w-full surface-100 p-3 border-round-md mb-4 text-left">
                        <div className="flex justify-content-between mb-2">
                            <span className="text-500 font-medium text-sm">Consumer Number</span>
                            <span className="text-900 font-bold text-sm">{dummyBill.consumerNumber}</span>
                        </div>
                        <div className="flex justify-content-between mb-2">
                            <span className="text-500 font-medium text-sm">BBPS Ref No.</span>
                            <span className="text-900 font-bold text-sm">{transactionResult?.bbpsRefNo || dummyBill.bbpsRefNo}</span>
                        </div>
                        <div className="flex justify-content-between">
                            <span className="text-500 font-medium text-sm">Date</span>
                            <span className="text-900 font-bold text-sm">{new Date().toLocaleDateString()}</span>
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
