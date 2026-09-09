import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { Link } from 'react-router-dom';
import { AppMenuItem } from '@/types';

import { useAuth } from '../context/AuthContext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { user } = useAuth();
    const userRole = user?.role || '';

    const managementItems = [];

    if (userRole === 'Admin' || userRole === 'admin') {
        managementItems.push(
            { label: 'Master Distributor', icon: 'pi pi-fw pi-box', to: '/users/master-distributor' },
            { label: 'Distributor', icon: 'pi pi-fw pi-users', to: '/users/distributor' },
            { label: 'Retailer', icon: 'pi pi-fw pi-user', to: '/users/retailer' }
        );
    } else if (userRole === 'Master Distributor' || userRole === 'master_distributor') {
        managementItems.push({ label: 'Distributor', icon: 'pi pi-fw pi-users', to: '/users/distributor' }, { label: 'Retailer', icon: 'pi pi-fw pi-user', to: '/users/retailer' });
    } else if (userRole === 'Distributor' || userRole === 'distributor') {
        managementItems.push({ label: 'Retailer', icon: 'pi pi-fw pi-user', to: '/users/retailer' });
    }

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/' },
                { label: 'Transactions', icon: 'pi pi-fw pi-wallet', to: '/bbps/transactions' }
            ]
        }
    ];

    if (managementItems.length > 0) {
        model.push({
            label: 'User Management',
            items: managementItems
        });
    }

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
