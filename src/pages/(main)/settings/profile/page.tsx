import React, { useEffect, useState } from 'react';
import SettingsLayout from '../SettingsLayout';
import api from '../../../../services/api';
import { Skeleton } from 'primereact/skeleton';
import { Avatar } from 'primereact/avatar';

const DetailRow = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex align-items-center py-4 border-bottom-1 surface-border last-of-type:border-none">
        <div className="w-4 text-500 font-medium">{label}</div>
        <div className="w-8 text-900 font-medium">{value}</div>
    </div>
);

const ProfileSettings = () => {
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

    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <SettingsLayout>
            {loading ? (
                <div className="flex flex-column gap-4">
                    <Skeleton height="150px" className="w-full mb-2" />
                    <Skeleton height="300px" className="w-full mb-2" />
                </div>
            ) : (
                <div className="flex flex-column gap-5 max-w-5xl mx-auto w-full">
                    {/* Header Banner */}
                    <div className="surface-card border-round-2xl overflow-hidden shadow-1 border-1 surface-border">
                        <div className="h-8rem bg-indigo-50 flex align-items-end" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, #e0e7ff 0, transparent 50%), radial-gradient(circle at 0% 0%, #e0e7ff 0, transparent 50%)' }}>
                            <div className="px-5 translate-y-50" style={{ transform: 'translateY(50%)' }}>
                                <Avatar label={getInitials(profile?.name)} shape="circle" className="bg-indigo-600 text-white border-4 border-white shadow-2" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }} />
                            </div>
                        </div>
                        <div className="pt-7 pb-5 px-5">
                            <h2 className="text-3xl font-bold text-900 m-0 flex align-items-center gap-2">
                                {profile?.name || 'Unknown User'}
                                <i className="pi pi-verified text-blue-500 text-xl" title="Verified"></i>
                            </h2>
                            <p className="text-500 mt-1 mb-0">{profile?.email || 'No email provided'}</p>
                        </div>
                    </div>

                    {/* Personal Details Card */}
                    <div className="surface-card border-round-2xl shadow-1 border-1 surface-border">
                        <div className="p-4 border-bottom-1 surface-border bg-gray-50 border-round-top-2xl">
                            <h3 className="text-xl font-bold text-900 m-0">Personal details</h3>
                        </div>
                        <div className="px-5">
                            <DetailRow label="Full name" value={profile?.name || 'N/A'} />
                            <DetailRow label="Mobile Number" value={profile?.mobile ? `+91 ${profile.mobile}` : 'N/A'} />
                            <DetailRow label="Access Role" value={profile?.role ? profile.role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'N/A'} />
                        </div>
                    </div>

                    {/* Shop & Address Card */}
                    <div className="surface-card border-round-2xl shadow-1 border-1 surface-border">
                        <div className="p-4 border-bottom-1 surface-border bg-gray-50 border-round-top-2xl">
                            <h3 className="text-xl font-bold text-900 m-0">Shop & Address</h3>
                        </div>
                        <div className="px-5">
                            <DetailRow label="Enterprise Name" value={profile?.shopname || 'N/A'} />
                            <DetailRow label="Street Address" value={profile?.address || 'N/A'} />
                            <DetailRow label="City & State" value={`${profile?.city || 'N/A'}, ${profile?.state || 'N/A'}`} />
                            <DetailRow label="Postal Code" value={profile?.pincode || 'N/A'} />
                        </div>
                    </div>
                </div>
            )}
        </SettingsLayout>
    );
};

export default ProfileSettings;
