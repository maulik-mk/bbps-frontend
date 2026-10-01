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
import { BBPSLogo } from '../../../../components/BBPSLogo';

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
        { label: 'Transaction Successful, Amount Debited but services not received', value: 'success_debited_no_service' },
        { label: 'Transaction Successful, Amount Debited but Service Disconnected or Service Stopped', value: 'success_debited_disconnected' },
        { label: 'Transaction Successful, Amount Debited but Late Payment Surcharge Charges add in next bill', value: 'success_debited_surcharge' },
        { label: 'Erroneously paid in wrong account', value: 'wrong_account' },
        { label: 'Duplicate Payment', value: 'duplicate_payment' },
        { label: 'Erroneously paid the wrong amount', value: 'wrong_amount' },
        { label: 'Payment information not received from Biller or Delay in receiving payment information from the Biller.', value: 'info_not_received_delay' },
        { label: 'Bill Paid but Amount not adjusted or still showing due amount.', value: 'paid_not_adjusted' }
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
            const newTicketId = 'CC' + Math.floor(10000000000 + Math.random() * 90000000000);
            setTicketId(newTicketId);
            setShowSuccess(true);
            setLoading(false);
        }, 1000);
    };

    const handleCloseDialog = () => {
        setShowSuccess(false);
        setFormData({ dates: null, mobileNumber: '', transactionRef: '', complaintType: null, description: '' });
    };

    const dialogFooter = (
        <div className="flex w-full mt-2">
            <Button label="Done" icon="pi pi-check" className="w-full border-round-xl py-3 font-bold text-lg shadow-1" onClick={handleCloseDialog} autoFocus />
        </div>
    );

    return (
        <div className="w-full">
            <div className="px-3 md:px-5 py-4 w-full" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
                <div className="flex justify-content-between align-items-center mb-4 pb-3 border-bottom-1 border-200">
                    <h1 className="m-0 text-900 font-bold text-2xl" style={{ lineHeight: '70px' }}>Register Complaint</h1>
                    <div className="flex align-items-center h-full">
                        <BBPSLogo type="bharat_connect" />
                    </div>
                </div>
            </div>
            <div className="grid px-3 md:px-5">
                <Toast ref={toast} />
                <div className="col-12 lg:col-8">
                    <BBPSPageCard title="Register Complaint." onBack={() => navigate(-1)} logoType="none">
                        <form onSubmit={handleSubmit} className="p-fluid">
                            <div className="grid formgrid">
                                <div className="col-12 md:col-6 field mb-5">
                                    <label htmlFor="dates" className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">
                                        Date *
                                    </label>
                                    <span className="p-input-icon-left w-full">
                                        <i className="pi pi-calendar text-400 ml-2" style={{ zIndex: 1 }} />
                                        <Calendar
                                            id="dates"
                                            value={formData.dates}
                                            onChange={(e: any) => setFormData({ ...formData, dates: e.value })}
                                            readOnlyInput
                                            placeholder="Select Date"
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
                                    B-Connect Txn ID *
                                </label>
                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-hashtag text-400 ml-2" />
                                    <InputText
                                        id="transactionRef"
                                        value={formData.transactionRef}
                                        onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                                        placeholder="Enter B-Connect Txn ID"
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
                                        scrollHeight="350px"
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

                <div className="col-12 lg:col-4">
                    <div className="bg-white border-1 border-solid border-200 border-round-2xl p-5 shadow-none h-full">
                        <h3 className="m-0 text-900 font-bold text-xl mb-4">What happens next?</h3>
                        <div className="flex flex-column gap-4">
                            <div className="flex align-items-start">
                                <div className="flex align-items-center justify-content-center bg-blue-100 text-blue-600 border-circle mr-3" style={{ width: '2.5rem', height: '2.5rem', minWidth: '2.5rem' }}>
                                    <span className="font-bold">1</span>
                                </div>
                                <div>
                                    <span className="font-bold text-700 block mb-1">Ticket Creation</span>
                                    <p className="m-0 text-500 text-sm line-height-3">A unique Tracking ID is generated instantly for your complaint.</p>
                                </div>
                            </div>
                            <div className="flex align-items-start">
                                <div className="flex align-items-center justify-content-center bg-blue-100 text-blue-600 border-circle mr-3" style={{ width: '2.5rem', height: '2.5rem', minWidth: '2.5rem' }}>
                                    <span className="font-bold">2</span>
                                </div>
                                <div>
                                    <span className="font-bold text-700 block mb-1">Agent Assignment</span>
                                    <p className="m-0 text-500 text-sm line-height-3">Our dedicated Bharat Connect resolution team begins investigating the transaction.</p>
                                </div>
                            </div>
                            <div className="flex align-items-start">
                                <div className="flex align-items-center justify-content-center bg-blue-100 text-blue-600 border-circle mr-3" style={{ width: '2.5rem', height: '2.5rem', minWidth: '2.5rem' }}>
                                    <span className="font-bold">3</span>
                                </div>
                                <div>
                                    <span className="font-bold text-700 block mb-1">Biller Escalation</span>
                                    <p className="m-0 text-500 text-sm line-height-3">If required, we coordinate directly with your biller to resolve the failure.</p>
                                </div>
                            </div>
                            <div className="flex align-items-start">
                                <div className="flex align-items-center justify-content-center bg-green-100 text-green-600 border-circle mr-3" style={{ width: '2.5rem', height: '2.5rem', minWidth: '2.5rem' }}>
                                    <i className="pi pi-check font-bold"></i>
                                </div>
                                <div>
                                    <span className="font-bold text-700 block mb-1">Resolution</span>
                                    <p className="m-0 text-500 text-sm line-height-3">You will be notified via SMS/Email once the issue is completely resolved.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Successful Dialog */}
                <Dialog 
                    showHeader={false} 
                    visible={showSuccess} 
                    style={{ width: '450px' }} 
                    footer={dialogFooter} 
                    onHide={handleCloseDialog} 
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                    contentClassName="p-4"
                    maskStyle={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(8px)'
                    }}
                >
                    <div className="relative pt-2">
                        <div className="relative mb-5">
                            <div className="flex flex-column align-items-center text-center">
                                <i className="pi pi-check-circle text-800 mb-2" style={{ fontSize: '3.5rem' }}></i>
                                <span className="text-green-500 font-bold text-md mt-2">Successfully Registered</span>
                            </div>
                        </div>

                        <div className="w-full surface-100 p-3 border-round-xl text-left shadow-1">
                            <div className="flex justify-content-between mb-3">
                                <span className="text-500 font-medium text-sm">Customer Name</span>
                                <span className="text-900 font-bold text-sm text-right">Nexasoft Technologies</span>
                            </div>
                            <div className="flex justify-content-between mb-3">
                                <span className="text-500 font-medium text-sm">B-Connect Txn ID</span>
                                <span className="text-900 font-bold text-sm text-right">{formData.transactionRef}</span>
                            </div>
                            <div className="flex justify-content-between mb-3">
                                <span className="text-500 font-medium text-sm w-4">Complaint Type</span>
                                <span className="text-900 font-bold text-sm text-right w-8 line-height-3">{complaintTypes.find((t) => t.value === formData.complaintType)?.label || formData.complaintType}</span>
                            </div>
                            <div className="flex justify-content-between">
                                <span className="text-500 font-medium text-sm">Complaint Id</span>
                                <span className="text-900 font-bold text-sm text-right">{ticketId}</span>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default ComplaintRegistration;
