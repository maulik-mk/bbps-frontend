import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <span className="font-medium ml-2">
                © All rights reserved by <span className="text-blue-500">Nexasoft Technologies Pvt Ltd.</span>
            </span>
        </div>
    );
};

export default AppFooter;
