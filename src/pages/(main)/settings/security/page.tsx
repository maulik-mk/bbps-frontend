import React from 'react';
import SettingsLayout from '../SettingsLayout';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

const SecuritySettings = () => {
    return (
        <SettingsLayout>
            <div className="flex flex-column gap-5 max-w-5xl mx-auto w-full">
                <div className="pb-4 border-bottom-1 surface-border">
                    <h2 className="text-3xl font-bold text-900 m-0">Security & Login</h2>
                    <p className="text-500 mt-2 mb-0">Manage your account security and update your password.</p>
                </div>

                <div className="surface-card border-round-2xl shadow-1 border-1 surface-border">
                    <div className="p-4 border-bottom-1 surface-border bg-gray-50 border-round-top-2xl flex align-items-center gap-3">
                        <i className="pi pi-key text-xl text-indigo-500"></i>
                        <h3 className="text-xl font-bold text-900 m-0">Change Password</h3>
                    </div>
                    <div className="p-5">
                        <div className="grid formgrid p-fluid max-w-3xl">
                            <div className="field mb-4 col-12">
                                <label htmlFor="currentPassword" className="font-medium text-900 mb-2 block">
                                    Current Password
                                </label>
                                <Password id="currentPassword" placeholder="Enter your current password" feedback={false} toggleMask inputClassName="p-3" />
                            </div>
                            <div className="field mb-4 col-12 md:col-6">
                                <label htmlFor="newPassword" className="font-medium text-900 mb-2 block">
                                    New Password
                                </label>
                                <Password id="newPassword" placeholder="Create a new password" toggleMask inputClassName="p-3" />
                            </div>
                            <div className="field mb-5 col-12 md:col-6">
                                <label htmlFor="confirmPassword" className="font-medium text-900 mb-2 block">
                                    Confirm Password
                                </label>
                                <Password id="confirmPassword" placeholder="Confirm your new password" feedback={false} toggleMask inputClassName="p-3" />
                            </div>
                            <div className="col-12 border-top-1 surface-border pt-4">
                                <Button label="Update Password" icon="pi pi-check" className="w-auto px-5 py-3 font-bold border-round-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="surface-card border-round-2xl shadow-1 border-1 surface-border">
                    <div className="p-4 border-bottom-1 surface-border bg-gray-50 border-round-top-2xl flex align-items-center gap-3">
                        <i className="pi pi-desktop text-xl text-indigo-500"></i>
                        <h3 className="text-xl font-bold text-900 m-0">Where You're Logged In</h3>
                    </div>
                    <div className="px-5">
                        <div className="flex align-items-center py-4 border-bottom-1 surface-border">
                            <i className="pi pi-desktop text-3xl text-500 mr-4"></i>
                            <div>
                                <div className="text-900 font-bold mb-1">Mac · Mumbai, India</div>
                                <div className="text-500 text-sm">
                                    Chrome · <span className="text-green-500 font-medium">Active now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
};

export default SecuritySettings;
