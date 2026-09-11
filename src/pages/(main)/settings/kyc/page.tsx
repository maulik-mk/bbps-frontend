import React, { useEffect, useState } from 'react';
import SettingsLayout from '../SettingsLayout';
import api from '../../../../services/api';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';

const DetailRow = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex align-items-center py-4 border-bottom-1 surface-border last-of-type:border-none">
        <div className="w-4 text-500 font-medium">{label}</div>
        <div className="w-8 text-900 font-medium">{value}</div>
    </div>
);

const KycSettings = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/me');
                if (response.data && response.data.data) {
                    setProfile(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const getSeverity = (status: string) => {
        switch (status) {
            case 'verified':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'danger';
            default:
                return 'info';
        }
    };

    return (
        <SettingsLayout>
            <div className="flex flex-column gap-5 max-w-5xl mx-auto w-full">
                {/* Header */}
                <div className="pb-4 border-bottom-1 surface-border flex justify-content-between align-items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-900 m-0">KYC Details</h2>
                        <p className="text-500 mt-2 mb-0">View your identity verification documents.</p>
                    </div>
                    {!loading && profile?.kyc_status && <Tag value={profile.kyc_status.toUpperCase()} severity={getSeverity(profile.kyc_status)} className="px-4 py-2 text-base font-bold border-round-xl shadow-1" />}
                </div>

                {loading ? (
                    <div className="flex flex-column gap-4">
                        <Skeleton height="150px" className="w-full mb-2" />
                    </div>
                ) : (
                    <div className="surface-card border-round-2xl shadow-1 border-1 surface-border">
                        <div className="p-4 border-bottom-1 surface-border bg-gray-50 border-round-top-2xl flex align-items-center gap-3">
                            <i className="pi pi-id-card text-xl text-indigo-500"></i>
                            <h3 className="text-xl font-bold text-900 m-0">Identity Documents</h3>
                        </div>
                        <div className="px-5">
                            <DetailRow label="Aadhar Card" value={profile?.aadharcard || 'Not Provided'} />
                            <DetailRow label="PAN Card" value={profile?.pancard || 'Not Provided'} />
                        </div>
                    </div>
                )}
            </div>
        </SettingsLayout>
    );
};

export default KycSettings;
