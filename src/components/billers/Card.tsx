import React from 'react';

export interface CardProps {
    name: string;
    icon: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ name, icon, onClick }) => {
    return (
        <div className="col-6 md:col-3 xl:col-2 p-2" onClick={onClick}>
            <div className="border-1 border-solid border-200 border-round-2xl p-3 flex flex-column align-items-center justify-content-center hover:border-blue-500 hover:surface-hover cursor-pointer transition-all h-full bg-white shadow-none">
                <div className="bg-blue-50 text-blue-500 border-circle w-3rem h-3rem flex align-items-center justify-content-center mb-3">
                    <i className={`pi ${icon} text-xl`}></i>
                </div>
                <span className="text-800 font-semibold text-center text-sm">{name}</span>
            </div>
        </div>
    );
};
