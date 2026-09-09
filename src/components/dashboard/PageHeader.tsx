import React from 'react';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    actionIcon?: string;
    actionColor?: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'help' | 'secondary';
    onActionClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actionLabel, actionIcon = 'pi pi-plus', actionColor = 'primary', onActionClick }) => {
    return (
        <div className="flex flex-column md:flex-row md:align-items-center justify-content-between mb-4 border-bottom-1 border-300 pb-3">
            <div>
                <h2 className="m-0 text-900 font-bold text-2xl">{title}</h2>
                {subtitle && <p className="m-0 mt-1 text-500">{subtitle}</p>}
            </div>
            {actionLabel && (
                <div className="mt-3 md:mt-0">
                    <Button label={actionLabel} icon={actionIcon} onClick={onActionClick} className="border-round-xl px-4 py-2 font-bold shadow-1" />
                </div>
            )}
        </div>
    );
};
