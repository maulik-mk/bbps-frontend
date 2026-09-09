import React from 'react';
import { Button } from 'primereact/button';

interface BBPSPageCardProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    hideBack?: boolean;
    accentColor?: string;
    isCanvas?: boolean;
    children: React.ReactNode;
}

const BBPSPageCard: React.FC<BBPSPageCardProps> = ({ title, subtitle, onBack, hideBack = false, accentColor = 'bg-blue-500', isCanvas = false, children }) => {
    return (
        <div className={`bg-white border-solid border-200 shadow-none relative overflow-hidden ${isCanvas ? 'border-none' : 'border-1 border-round-2xl'}`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${accentColor}`}></div>

            <div className="p-3 sm:p-4 md:p-5">
                <div className="flex align-items-center justify-content-between mb-4 border-bottom-1 border-200 pb-3 md:pb-4">
                    <div className="flex align-items-center">
                        {!hideBack && (
                            <Button
                                icon={isCanvas ? 'pi pi-times' : 'pi pi-arrow-left'}
                                className="p-button-rounded p-button-text p-button-secondary mr-2 hover:surface-200 transition-colors"
                                onClick={onBack}
                                aria-label={isCanvas ? 'Close' : 'Go Back'}
                            />
                        )}
                        <div>
                            <h2 className="m-0 text-900 font-bold text-lg sm:text-xl md:text-2xl tracking-tight line-height-2">{title}</h2>
                            {subtitle && <p className="m-0 mt-1 text-500 text-xs sm:text-sm">{subtitle}</p>}
                        </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                        <img src="/logo/Bharat_Connect1.png" alt="Bharat Connect" className="hidden sm:block" style={{ height: '55px' }} />
                        <img src="/logo/Bharat_Connect1.png" alt="Bharat Connect" className="block sm:hidden" style={{ height: '35px' }} />
                    </div>
                </div>

                <div className="mt-4 md:mt-5">{children}</div>
            </div>
        </div>
    );
};

export default BBPSPageCard;
