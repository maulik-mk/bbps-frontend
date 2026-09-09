import React from 'react';
import { classNames } from 'primereact/utils';

interface StatusCardProps {
    title: string;
    value: string;
    description: string;
    icon: string;
    gradientClass: 'bg-gradient-blue' | 'bg-gradient-rose' | 'bg-gradient-emerald';
    actionIcon?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({ title, value, description, icon, gradientClass, actionIcon = 'pi pi-question-circle' }) => {
    return (
        <div className={classNames('dashboard-main-card h-full flex flex-column justify-content-between', gradientClass)}>
            <div className="flex justify-content-between align-items-center mb-4">
                <span className="font-semibold text-title">{title}</span>
                <i className={classNames(actionIcon, 'text-title cursor-pointer opacity-70 hover:opacity-100 transition-opacity')}></i>
            </div>

            <div className="flex align-items-center mt-4">
                <div className="w-3rem h-3rem border-circle flex align-items-center justify-content-center bg-white shadow-1 mr-3">
                    <i className={classNames(icon, 'text-xl', gradientClass.replace('bg-', 'text-'))}></i>
                </div>
                <div>
                    <div className="text-2xl font-bold text-amount mb-1">{value}</div>
                    <div className="text-sm text-title font-medium opacity-80">{description}</div>
                </div>
            </div>
        </div>
    );
};
