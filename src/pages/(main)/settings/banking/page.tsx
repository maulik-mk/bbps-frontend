import React, { useEffect, useState } from 'react';
import SettingsLayout from '../SettingsLayout';
import api from '../../../../services/api';
import { Skeleton } from 'primereact/skeleton';

const DetailRow = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex align-items-center py-4 border-bottom-1 surface-border last-of-type:border-none">
        <div className="w-4 text-500 font-medium">{label}</div>
        <div className="w-8 text-900 font-medium">{value}</div>
    </div>
);

const BankSettings = () => {
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

    return (
        <SettingsLayout>
            <div className="flex flex-column gap-5 max-w-5xl mx-auto w-full">
                {/* Header */}
                <div className="pb-4 border-bottom-1 surface-border">
                    <h2 className="text-3xl font-bold text-900 m-0">Banking Details</h2>
                    <p className="text-500 mt-2 mb-0">View your registered bank account information for payouts.</p>
                </div>

                {loading ? (
                    <div className="flex flex-column gap-4">
                        <Skeleton height="200px" className="w-full mb-2" />
                    </div>
                ) : (
                    <div className="surface-card border-round-2xl shadow-1 border-1 surface-border">
                        <div className="p-4 border-bottom-1 surface-border bg-gray-50 border-round-top-2xl flex align-items-center gap-3">
                            <i className="pi pi-building-columns text-xl text-indigo-500"></i>
                            <h3 className="text-xl font-bold text-900 m-0">Primary Account</h3>
                        </div>
                        <div className="px-5">
                            <DetailRow label="Bank Name" value={profile?.bankname || 'Not Provided'} />
                            <DetailRow label="Account Number" value={profile?.accountnumber || 'Not Provided'} />
                            <DetailRow label="IFSC Code" value={profile?.ifsccode || 'Not Provided'} />
                        </div>
                    </div>
                )}
            </div>
        </SettingsLayout>
    );
};

export default BankSettings;
