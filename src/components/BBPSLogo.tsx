import React from 'react';
import { classNames } from 'primereact/utils';

type LogoType = 'bharat_connect' | 'b_assured' | 'mnemonic';

interface BBPSLogoProps {
    type: LogoType;
    className?: string;
    style?: React.CSSProperties;
}

export const BBPSLogo: React.FC<BBPSLogoProps> = ({ type, className, style }) => {
    let src = '';
    let alt = '';

    switch (type) {
        case 'bharat_connect':
            src = '/logo/Bharat_Connect1.png';
            alt = 'Bharat Connect';
            break;
        case 'b_assured':
            src = '/logo/B_Assured.png';
            alt = 'B Assured';
            break;
        case 'mnemonic':
            src = '/logo/B_mnemonic.png';
            alt = 'B Mnemonic';
            break;
    }

    return (
        <div className={classNames('flex align-items-center justify-content-end', className)} style={style}>
            <img
                src={src}
                alt={alt}
                style={{
                    height: '70px',
                    objectFit: 'contain'
                }}
            />
        </div>
    );
};
