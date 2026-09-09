import React from 'react';

interface MiniChartProps {
    title: string;
    value: string;
    subValue: string;
    trend: 'up' | 'down' | 'neutral';
    label: string;
}

export const MiniChart: React.FC<MiniChartProps> = ({ title, value, subValue, trend, label }) => {
    return (
        <div className="flex flex-column pt-4 pb-2 pr-3">
            <span className="text-600 font-medium text-sm mb-2">{title}</span>
            <div className="flex align-items-center mb-1">
                <span className="text-2xl font-bold text-900 mr-2">{value}</span>
                <span className={`text-xs px-2 py-1 border-round font-bold ${trend === 'up' ? 'bg-green-100 text-green-700' : trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {subValue} {trend === 'up' ? '↗' : trend === 'down' ? '↘' : ''}
                </span>
            </div>
            <span className="text-400 text-xs">{label}</span>
        </div>
    );
};
