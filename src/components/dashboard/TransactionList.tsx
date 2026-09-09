import React from 'react';

export interface TransactionItemProps {
    title: string;
    subtitle: string;
    amount: string;
    icon: string;
    iconBgClass: string;
    iconTextClass: string;
    amountClass?: string;
    isViewable?: boolean;
    onView?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ title, subtitle, amount, icon, iconBgClass, iconTextClass, amountClass = 'text-900', isViewable, onView }) => {
    return (
        <div className="transaction-list-item py-2">
            <div className={`icon-box ${iconBgClass} ${iconTextClass}`}>
                <i className={icon}></i>
            </div>
            <div className="flex-grow-1">
                <div className="font-bold text-800 mb-1">{title}</div>
                <div className="text-sm text-500">{subtitle}</div>
            </div>
            <div className="flex align-items-center">
                <span className={`font-bold ${amountClass}`}>{amount}</span>
                {isViewable && <i className="pi pi-angle-right ml-3 text-400 cursor-pointer hover:text-700 transition-colors" onClick={onView}></i>}
            </div>
        </div>
    );
};

interface TransactionListProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onActionClick?: () => void;
    children: React.ReactNode;
}

export const TransactionList: React.FC<TransactionListProps> = ({ title, subtitle, actionLabel, onActionClick, children }) => {
    return (
        <div className="surface-card border-round-2xl p-5 shadow-2 h-full">
            <div className="flex justify-content-between align-items-center mb-4">
                <span className="text-2xl font-bold text-900 tracking-tight">{title}</span>
                <div className="flex gap-2 align-items-center">
                    {actionLabel && (
                        <span className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 transition-colors font-semibold" onClick={onActionClick}>
                            {actionLabel}
                        </span>
                    )}
                    <i className="pi pi-search text-500 cursor-pointer ml-3 hover:text-900 transition-colors"></i>
                    <i className="pi pi-sliders-h text-500 cursor-pointer ml-2 hover:text-900 transition-colors"></i>
                </div>
            </div>
            {subtitle && <div className="text-sm text-500 mb-3 font-medium">{subtitle}</div>}

            <div className="flex flex-column gap-2">{children}</div>
        </div>
    );
};
