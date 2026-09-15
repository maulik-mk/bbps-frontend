import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import BBPSPageCard from '../../../../components/BBPSPageCard';
import { BBPSLogo } from '../../../../components/BBPSLogo';

const TrackComplaint = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [trackingId, setTrackingId] = useState('');
    const [status, setStatus] = useState<any>(null);

    const handleTrack = () => {
        if (!trackingId) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please enter a Tracking ID', life: 3000 });
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setStatus({
                id: trackingId,
                date: new Date().toLocaleDateString(),
                state: 'In Progress',
                message: 'Your complaint has been assigned to a representative and is under investigation.',
                billerStatus: 'Pending Response'
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12 lg:col-7">
                <BBPSPageCard title="Track Complaint Status" subtitle="Enter your Complaint Ticket ID to check the real-time status." onBack={() => navigate(-1)}>
                    <div className="p-fluid">
                        <div className="field mb-6">
                            <label htmlFor="trackingId" className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">
                                Complaint Tracking ID
                            </label>
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-ticket text-400 ml-2" />
                                <InputText
                                    id="trackingId"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    placeholder="Enter your Ticket ID (e.g. TK-12345)"
                                    className="border-round-xl border-300 shadow-none hover:border-blue-400 focus:border-blue-500 transition-colors py-3 pl-6 w-full text-lg"
                                />
                            </span>
                        </div>

                        <div className="mt-6">
                            <Button
                                label="Track Status"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                loading={loading}
                                onClick={handleTrack}
                                disabled={!trackingId}
                                className="border-round-xl w-full py-3 font-bold text-lg shadow-1 bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-colors"
                            />
                        </div>
                    </div>
                </BBPSPageCard>

                {status && (
                    <div className="mt-4 fadein animation-duration-500">
                        <div className="bg-white border-1 border-solid border-200 border-round-2xl p-4 shadow-none relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>

                            <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 border-200 pb-4">
                                <div>
                                    <h3 className="m-0 text-900 font-bold text-xl tracking-tight">Your complaint Status SUCCESS</h3>
                                </div>
                                <div className="ml-2 flex-shrink-0">
                                    <BBPSLogo type="bharat_connect" />
                                </div>
                            </div>

                            <div className="w-full surface-100 p-4 border-round-xl text-left shadow-1">
                                <div className="flex justify-content-between mb-3 border-bottom-1 border-300 pb-2">
                                    <span className="text-600 font-bold text-sm">ComplaintAssigned :</span>
                                    <span className="text-900 font-bold text-sm">CC AVENUE</span>
                                </div>
                                <div className="flex justify-content-between mb-3 border-bottom-1 border-300 pb-2">
                                    <span className="text-600 font-bold text-sm">ComplaintId :</span>
                                    <span className="text-900 font-bold text-sm">{status.id}</span>
                                </div>
                                <div className="flex justify-content-between">
                                    <span className="text-600 font-bold text-sm">ComplaintStatus :</span>
                                    <span className="text-green-600 font-bold text-sm">SUCCESS</span>
                                </div>
                            </div>

                            <div className="flex justify-content-center mt-4">
                                <Button label="Okay" className="bg-blue-600 border-blue-600 font-bold px-4 shadow-1" onClick={() => setStatus(null)} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="col-12 lg:col-5">
                <div className="bg-white border-1 border-solid border-200 border-round-2xl p-5 shadow-none h-full">
                    <h3 className="m-0 text-900 font-bold text-xl mb-4">Ticket Status Guide</h3>
                    <div className="flex flex-column gap-4">
                        <div className="flex align-items-start">
                            <i className="pi pi-clock text-orange-500 text-2xl mr-3 mt-1"></i>
                            <div>
                                <span className="font-bold text-700 block mb-1">In Progress</span>
                                <p className="m-0 text-500 text-sm line-height-3">Your ticket is actively being reviewed by our support agents. Average resolution time is 24-48 hours.</p>
                            </div>
                        </div>
                        <div className="flex align-items-start">
                            <i className="pi pi-building text-blue-500 text-2xl mr-3 mt-1"></i>
                            <div>
                                <span className="font-bold text-700 block mb-1">Pending Biller Response</span>
                                <p className="m-0 text-500 text-sm line-height-3">We have escalated the issue to the respective biller and are awaiting their clarification.</p>
                            </div>
                        </div>
                        <div className="flex align-items-start">
                            <i className="pi pi-check-circle text-green-500 text-2xl mr-3 mt-1"></i>
                            <div>
                                <span className="font-bold text-700 block mb-1">Resolved</span>
                                <p className="m-0 text-500 text-sm line-height-3">The issue has been fixed and your transaction status or refund has been updated successfully.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 p-4 surface-50 border-round-xl">
                        <span className="font-bold text-700 block mb-2">Need immediate assistance?</span>
                        <p className="m-0 text-500 text-sm mb-3">If your transaction is urgent, please call our 24/7 toll-free helpline.</p>
                        <div className="flex align-items-center text-blue-600 font-bold text-lg">
                            <i className="pi pi-phone mr-2"></i>
                            0000-000-0000
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackComplaint;
