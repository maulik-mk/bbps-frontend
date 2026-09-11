import React from 'react';

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="surface-card p-4 shadow-2 border-round">{children}</div>
            </div>
        </div>
    );
};

export default SettingsLayout;
