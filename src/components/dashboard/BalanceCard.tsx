import React from 'react';
import { classNames } from 'primereact/utils';

interface BalanceCardProps {
    title: string;
    subtitle: string;
    amount: string;
    currency: string;
    gradientClass: 'bg-gradient-blue' | 'bg-gradient-rose' | 'bg-gradient-emerald';
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ title, subtitle, amount, currency, gradientClass }) => {
    return (
        <div className={classNames('dashboard-main-card h-full flex flex-column justify-content-between', gradientClass)}>
            <div className="flex justify-content-between align-items-center mb-4">
                <span className="font-semibold text-title">{title}</span>
                <span className="text-sm font-medium border-bottom-1 border-400 pb-1 cursor-pointer hover:text-900 transition-colors">{subtitle}</span>
            </div>

            <div className="mt-6 flex align-items-baseline">
                <span className="text-4xl font-bold text-amount mr-2">{amount}</span>
                <span className="text-sm font-bold text-title">{currency}</span>
                <i className="pi pi-angle-down ml-2 text-title cursor-pointer"></i>
            </div>
        </div>
    );
};
