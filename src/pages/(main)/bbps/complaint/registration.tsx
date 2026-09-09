import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import BBPSPageCard from '../../../../components/BBPSPageCard';

const ComplaintRegistration = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const [formData, setFormData] = useState<any>({
        dates: null,
        mobileNumber: '',
        transactionRef: '',
        complaintType: null,
        description: ''
    });

    const complaintTypes = [
        { label: 'Transaction Successful, account not updated', value: 'success_not_updated' },
        { label: 'Transaction Successful, Amount Debited but services not received', value: 'success_debited_no_service' },
        { label: 'Transaction Successful, Amount Debited but Service Disconnected or Service Stopped', value: 'success_debited_disconnected' },
        { label: 'Transaction Successful, Amount Debited but Late Payment Surcharge Charges add in next bill', value: 'success_debited_surcharge' },
        { label: 'Erroneously paid in wrong account', value: 'wrong_account' },
        { label: 'Duplicate Payment', value: 'duplicate_payment' },
        { label: 'Erroneously paid the wrong amount', value: 'wrong_amount' },
        { label: 'Payment information not received from Biller or Delay in receiving payment information from the Biller', value: 'info_not_received_delay' },
        { label: 'Bill Paid but Amount not adjusted or still showing due amount', value: 'paid_not_adjusted' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.dates || !formData.mobileNumber || !formData.transactionRef || !formData.complaintType || !formData.description) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const newTicketId = 'TK-' + Math.floor(Math.random() * 10000);
            setTicketId(newTicketId);
            setShowSuccess(true);
            setFormData({ dates: null, mobileNumber: '', transactionRef: '', complaintType: null, description: '' });
            setLoading(false);
        }, 1000);
    };

    const dialogFooter = (
        <div className="flex w-full mt-2">
            <Button label="Done" icon="pi pi-check" className="w-full border-round-xl py-3 font-bold text-lg shadow-1" onClick={() => setShowSuccess(false)} autoFocus />
        </div>
    );

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12 md:col-8 md:offset-2">
                <BBPSPageCard title="Register Complaint" subtitle="Submit a complaint for a specific BBPS transaction." onBack={() => navigate(-1)}>
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <div className="grid formgrid">
                            <div className="col-12 md:col-6 field mb-5">
                                <label htmlFor="dates" className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">
                                    Date Range *
                                </label>
                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-calendar text-400 ml-2" style={{ zIndex: 1 }} />
                                    <Calendar
                                        id="dates"
                                        value={formData.dates}
                                        onChange={(e: any) => setFormData({ ...formData, dates: e.value })}
                                        selectionMode="range"
                                        readOnlyInput
                                        placeholder="Select Date Range"
                                        className="w-full"
                                        inputClassName="border-round-xl border-300 shadow-none hover:border-blue-400 focus:border-blue-500 transition-colors py-3 pl-6 w-full text-lg"
                                    />
                                </span>
                            </div>

                            <div className="col-12 md:col-6 field mb-5">
                                <label htmlFor="mobileNumber" className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">
                                    Mobile Number *
                                </label>
                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-mobile text-400 ml-2" />
                                    <InputText
                                        id="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                        placeholder="Enter Mobile Number"
                                        className="border-round-xl border-300 shadow-none hover:border-blue-400 focus:border-blue-500 transition-colors py-3 pl-6 w-full text-lg"
                                    />
                                </span>
                            </div>
                        </div>

                        <div className="field mb-5">
                            <label htmlFor="transactionRef" className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">
                                B-Connect Transaction Ref ID *
                            </label>
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-hashtag text-400 ml-2" />
                                <InputText
                                    id="transactionRef"
                                    value={formData.transactionRef}
                                    onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                                    placeholder="Enter BBPS Ref No."
                                    className="border-round-xl border-300 shadow-none hover:border-blue-400 focus:border-blue-500 transition-colors py-3 pl-6 w-full text-lg"
                                />
                            </span>
                        </div>

                        <div className="field mb-5">
                            <label htmlFor="complaintType" className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">
                                Complaint Type
                            </label>
                            <div className="relative w-full">
                                <i className="pi pi-exclamation-circle text-400 absolute z-1" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <Dropdown
                                    id="complaintType"
                                    value={formData.complaintType}
                                    onChange={(e) => setFormData({ ...formData, complaintType: e.value })}
                                    options={complaintTypes}
                                    placeholder="Select Complaint Reason"
                                    className="border-round-xl border-300 shadow-none hover:border-blue-400 transition-colors w-full dropdown-with-icon pl-2"
                                />
                            </div>
                        </div>

                        <div className="field mb-6">
                            <label htmlFor="description" className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">
                                Description
                            </label>
                            <InputTextarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                placeholder="Describe your issue in detail..."
                                className="border-round-xl border-300 shadow-none hover:border-blue-400 focus:border-blue-500 transition-colors p-3 w-full text-lg"
                            />
                        </div>

                        <div className="mt-6">
                            <Button
                                label="Submit Complaint"
                                type="submit"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                loading={loading}
                                disabled={!formData.dates || !formData.mobileNumber || !formData.transactionRef || !formData.complaintType || !formData.description}
                                className="border-round-xl w-full py-3 font-bold text-lg shadow-1 bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-colors"
                            />
                        </div>
                    </form>
                </BBPSPageCard>
            </div>

            {/* Registration Successful Dialog */}
            <Dialog header="Complaint Registered" visible={showSuccess} style={{ width: '400px' }} footer={dialogFooter} onHide={() => setShowSuccess(false)} breakpoints={{ '960px': '75vw', '641px': '90vw' }}>
                <div className="flex flex-column align-items-center text-center pt-3">
                    <i className="pi pi-check-circle text-green-500 mb-3" style={{ fontSize: '4rem' }}></i>
                    <h2 className="m-0 text-gray-900 mb-2">Successfully Registered</h2>
                    <p className="text-500 mb-4 line-height-3">Your complaint has been submitted to BBPS and is under review.</p>

                    <div className="w-full surface-100 p-3 border-round-xl text-center shadow-1">
                        <span className="text-500 font-medium text-sm block mb-1">Ticket ID</span>
                        <span className="text-900 font-bold text-2xl tracking-wide">{ticketId}</span>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ComplaintRegistration;
