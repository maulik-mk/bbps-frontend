import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import BillSummary from '../bills/page';
import BBPSPageCard from '../../../../components/BBPSPageCard';

const CategorySelection = () => {
    const { service } = useParams<{ service: string }>();
    const navigate = useNavigate();
    const [selectedOperator, setSelectedOperator] = useState<any>(null);
    const [consumerNumber, setConsumerNumber] = useState('');
    const [operators, setOperators] = useState<any[]>([]);
    const [showBillCanvas, setShowBillCanvas] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<{ amount: number; billerName: string; consumerNumber: string; bbpsRefNo: string } | null>(null);

    const decodedService = service ? decodeURIComponent(service) : 'Service';

    useEffect(() => {
        // Simulating the future REST API call: GET /api/operators?category=...
        // For now, it fetches the static dummy file matching the exact category name
        fetch(`/dummy/operators/${decodedService.toLowerCase()}.json`)
            .then((res) => {
                if (!res.ok) throw new Error('Category not found');
                return res.json();
            })
            .then((data: any[]) => {
                setOperators(data);
            })
            .catch((err) => {
                console.error('Failed to load dummy operators', err);
                setOperators([]);
            });
    }, [decodedService]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOperator && consumerNumber) {
            setShowBillCanvas(true);
        }
    };

    const handlePaymentSuccess = (amount: number, billerName: string, consumerNumber: string, bbpsRefNo: string) => {
        setShowBillCanvas(false);
        setReceiptData({ amount, billerName, consumerNumber, bbpsRefNo });
        setShowReceipt(true);
    };

    const receiptFooter = (
        <div className="flex w-full gap-2 mt-2">
            <Button
                label="View Receipt"
                icon="pi pi-file"
                className="p-button-outlined p-button-secondary flex-1"
                onClick={() => {
                    setShowReceipt(false);
                    navigate(`/bbps/transactions/receipt/${receiptData?.bbpsRefNo || 'NEW'}`);
                }}
            />
            <Button
                label="Done"
                icon="pi pi-check"
                className="flex-1"
                onClick={() => {
                    setShowReceipt(false);
                }}
                autoFocus
            />
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12 lg:col-7 mt-5">
                <BBPSPageCard title={`Pay ${decodedService}`} subtitle="Fetch your bill instantly." onBack={() => navigate(-1)}>
                    <div className="p-fluid">
                        <div className="field mb-5">
                            <label htmlFor="operator" className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">
                                Service Provider
                            </label>
                            <div className="relative w-full">
                                <i className="pi pi-building text-400 absolute z-1" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <Dropdown
                                    id="operator"
                                    value={selectedOperator}
                                    onChange={(e) => setSelectedOperator(e.value)}
                                    options={operators}
                                    optionLabel="name"
                                    placeholder="Choose your provider"
                                    className="border-round-xl border-300 shadow-none hover:border-blue-400 transition-colors w-full dropdown-with-icon"
                                />
                            </div>
                        </div>

                        <div className="field mb-6">
                            <label htmlFor="consumerNumber" className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">
                                Consumer Number
                            </label>
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-id-card text-400 ml-2" />
                                <InputText
                                    id="consumerNumber"
                                    value={consumerNumber}
                                    onChange={(e) => setConsumerNumber(e.target.value)}
                                    placeholder="Enter your registered number"
                                    className="border-round-xl border-300 shadow-none hover:border-blue-400 focus:border-blue-500 transition-colors py-3 pl-6 w-full text-lg"
                                />
                            </span>
                        </div>

                        <div className="mt-6">
                            <Button
                                label="Fetch Bill"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                onClick={handleSubmit}
                                disabled={!selectedOperator || !consumerNumber}
                                className="border-round-xl w-full py-3 font-bold text-lg shadow-1 bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-colors"
                            />
                        </div>
                    </div>
                </BBPSPageCard>
            </div>

            {/* Right Side: Informational Widgets */}
            <div className="col-12 lg:col-5 mt-5">
                {/* Recent Settlements Widget */}
                <div className="bg-white border-1 border-solid border-200 p-5 shadow-none mb-4" style={{ borderRadius: '24px' }}>
                    <div className="flex justify-content-between align-items-center border-bottom-1 border-200 pb-3 mb-3">
                        <div>
                            <h3 className="m-0 text-900 font-bold text-lg">Recent Bill Settlements</h3>
                            <p className="m-0 text-500 text-sm mt-1">Quick 1-click repeat payment receipts</p>
                        </div>
                        <Button label="View All" className="p-button-text p-button-sm font-bold px-2 py-1" />
                    </div>

                    <div className="flex align-items-center justify-content-between py-3 border-bottom-1 border-100">
                        <div className="flex align-items-center">
                            <div className="bg-orange-50 text-orange-500 font-bold border-circle w-3rem h-3rem flex align-items-center justify-content-center mr-3">TP</div>
                            <div>
                                <div className="flex align-items-center">
                                    <span className="font-bold text-800 mr-2">Torrent Power</span>
                                    <Tag value="PAID" className="text-xs px-2 py-1 bg-green-100 text-green-700 font-bold border-round-xl" />
                                </div>
                                <span className="text-400 text-sm">Home • 12 Aug 2024</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-900">₹1,840.00</div>
                            <a href="#" className="text-blue-500 text-xs font-semibold no-underline">
                                Download NOC
                            </a>
                        </div>
                    </div>

                    <div className="flex align-items-center justify-content-between py-3 border-bottom-1 border-100">
                        <div className="flex align-items-center">
                            <div className="bg-blue-50 text-blue-500 font-bold border-circle w-3rem h-3rem flex align-items-center justify-content-center mr-3">TAT</div>
                            <div>
                                <div className="flex align-items-center">
                                    <span className="font-bold text-800 mr-2">Tata Power</span>
                                    <Tag value="PAID" className="text-xs px-2 py-1 bg-green-100 text-green-700 font-bold border-round-xl" />
                                </div>
                                <span className="text-400 text-sm">Office • 08 Jul 2024</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-900">₹4,210.00</div>
                            <a href="#" className="text-blue-500 text-xs font-semibold no-underline">
                                Download NOC
                            </a>
                        </div>
                    </div>

                    <div className="flex align-items-center justify-content-between pt-3">
                        <div className="flex align-items-center">
                            <div className="bg-yellow-50 text-yellow-600 font-bold border-circle w-3rem h-3rem flex align-items-center justify-content-center mr-3">ADA</div>
                            <div>
                                <div className="flex align-items-center">
                                    <span className="font-bold text-800 mr-2">Adani Electricity</span>
                                    <Tag value="PAID" className="text-xs px-2 py-1 bg-green-100 text-green-700 font-bold border-round-xl" />
                                </div>
                                <span className="text-400 text-sm">Warehouse • 15 Jun 2024</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-900">₹8,920.00</div>
                            <a href="#" className="text-blue-500 text-xs font-semibold no-underline">
                                Download NOC
                            </a>
                        </div>
                    </div>
                </div>

                {/* Promotional Banner Widget */}
                <div className="p-5 mb-4 relative overflow-hidden shadow-2" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}>
                    <div className="flex justify-content-between align-items-start mb-4">
                        <span className="bg-white-alpha-20 text-white text-xs font-bold px-3 py-1 border-round-2xl">POWERSAVER EXCLUSIVE</span>
                        <span className="text-white-alpha-90 text-sm font-medium">Code: POWER75</span>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2 line-height-3">Flat ₹75 Cashback on Torrent & Tata Power Bills</h3>
                    <p className="text-white-alpha-80 text-sm line-height-3 mb-4">Apply discount directly during UPI payment checkout. Valid on bills above ₹1,000.</p>

                    <div className="flex justify-content-between align-items-center border-top-1 border-white-alpha-20 pt-3">
                        <span className="text-white-alpha-80 text-sm font-medium">Expires in 3 days</span>
                        <Button label="Apply Offer" className="bg-white text-indigo-600 border-none border-round-xl font-bold px-4 py-2 hover:bg-gray-50 transition-colors" />
                    </div>
                </div>

                {/* Support Widget */}
                <div className="bg-white border-1 border-solid border-200 p-4 shadow-none flex align-items-center justify-content-between" style={{ borderRadius: '24px' }}>
                    <div className="flex align-items-center">
                        <div className="bg-blue-50 border-circle w-3rem h-3rem flex align-items-center justify-content-center mr-3">
                            <i className="pi pi-life-ring text-blue-500 text-xl"></i>
                        </div>
                        <div>
                            <div className="font-bold text-800 text-sm">Need Bill Dispute Support?</div>
                            <div className="text-500 text-xs mt-1">Toll-free 24x7 resolution desk for electricity complaints.</div>
                        </div>
                    </div>
                    <Button label="Call Desk" className="p-button-text bg-blue-50 text-blue-600 border-round-xl font-bold px-3 py-2 text-sm ml-2" />
                </div>
            </div>

            {/* Bill Canvas */}
            <Dialog
                visible={showBillCanvas}
                onHide={() => setShowBillCanvas(false)}
                className="w-11 md:w-8 lg:w-6 xl:w-5 p-0"
                showHeader={false}
                contentClassName="p-0 border-round-2xl overflow-hidden"
                maskStyle={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(8px)'
                }}
            >
                {showBillCanvas && <BillSummary billerIdProp={consumerNumber} onClose={() => setShowBillCanvas(false)} isCanvas={true} onPaymentSuccess={handlePaymentSuccess} />}
            </Dialog>

            {/* Payment Successful Dialog */}
            <Dialog header="Payment Successful" visible={showReceipt} style={{ width: '400px' }} footer={receiptFooter} onHide={() => setShowReceipt(false)} breakpoints={{ '960px': '75vw', '641px': '90vw' }}>
                {receiptData && (
                    <div className="flex flex-column align-items-center text-center">
                        <i className="pi pi-check-circle text-green-500 mb-3" style={{ fontSize: '4rem' }}></i>
                        <h2 className="m-0 text-gray-900 mb-1">₹{receiptData.amount?.toLocaleString('en-IN') ?? 0}</h2>
                        <p className="text-500 mb-3">Paid to {receiptData.billerName}</p>
                        <img src="/logo/B_Assured.png" alt="B Assured" style={{ height: '100px' }} className="mb-4" />

                        <div className="w-full surface-100 p-3 border-round-md mb-4 text-left">
                            <div className="flex justify-content-between mb-2">
                                <span className="text-500 font-medium text-sm">Consumer Number</span>
                                <span className="text-900 font-bold text-sm">{receiptData.consumerNumber}</span>
                            </div>
                            <div className="flex justify-content-between mb-2">
                                <span className="text-500 font-medium text-sm">BBPS Ref No.</span>
                                <span className="text-900 font-bold text-sm">{receiptData.bbpsRefNo}</span>
                            </div>
                            <div className="flex justify-content-between">
                                <span className="text-500 font-medium text-sm">Date</span>
                                <span className="text-900 font-bold text-sm">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default CategorySelection;
