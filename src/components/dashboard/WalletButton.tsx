import React from 'react';

interface WalletButtonProps {
    label?: string;
    icon: string;
    bgColor: string;
    textColor: string;
    onClick?: () => void;
    isIconOnly?: boolean;
}

export const WalletButton: React.FC<WalletButtonProps> = ({ label, icon, bgColor, textColor, onClick, isIconOnly }) => {
    return (
        <button
            className="border-none border-round-2xl flex align-items-center justify-content-center cursor-pointer transition-colors hover:opacity-80"
            style={{
                backgroundColor: bgColor,
                color: textColor,
                padding: isIconOnly ? '0' : '0.8rem 1.5rem',
                width: isIconOnly ? '3rem' : 'auto',
                height: '3rem',
                flexGrow: isIconOnly ? 0 : 1,
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            onClick={onClick}
        >
            <i className={`${icon} ${label ? 'mr-2' : ''} font-bold`}></i>
            {label && <span>{label}</span>}
        </button>
    );
};
