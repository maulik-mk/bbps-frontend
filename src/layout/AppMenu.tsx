import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { Link, useLocation } from 'react-router-dom';
import { AppMenuItem } from '@/types';

import { useAuth } from '../context/AuthContext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { user } = useAuth();
    const role = (user?.role || '').toLowerCase();

    const isAdmin = role === 'admin';
    const isMD = role === 'master_distributor' || role === 'master distributor';
    const isDistributor = role === 'distributor';
    const isRetailer = role === 'retailer';

    const location = useLocation();
    let model: AppMenuItem[] = [];

    if (location.pathname.startsWith('/settings')) {
        model = [
            {
                label: 'User Settings',
                items: [
                    { label: 'Personal Info', icon: 'pi pi-fw pi-user', to: '/settings/profile' },
                    { label: 'Security', icon: 'pi pi-fw pi-lock', to: '/settings/security' },
                    { label: 'KYC Details', icon: 'pi pi-fw pi-id-card', to: '/settings/kyc' },
                    { label: 'Banking Details', icon: 'pi pi-fw pi-wallet', to: '/settings/banking' },
                    { label: 'Back to Dashboard', icon: 'pi pi-fw pi-arrow-left', to: '/' }
                ]
            }
        ];
    } else {
        model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/' }]
            },
            ...(isAdmin
                ? [
                      {
                          label: 'Master',
                          items: [{ label: 'Schemes', icon: 'pi pi-fw pi-tags', to: '/master/schemes' }]
                      }
                  ]
                : []),
            ...(isAdmin || isMD || isDistributor
                ? [
                      {
                          label: 'User Management',
                          items: [
                              ...(isAdmin ? [{ label: 'Master Distributor', icon: 'pi pi-fw pi-box', to: '/users/master-distributor' }] : []),
                              ...(isAdmin || isMD ? [{ label: 'Distributor', icon: 'pi pi-fw pi-users', to: '/users/distributor' }] : []),
                              { label: 'Retailer', icon: 'pi pi-fw pi-user', to: '/users/retailer' }
                          ]
                      }
                  ]
                : []),
            ...(isAdmin || isRetailer
                ? [
                      {
                          label: 'Transaction Report',
                          items: [
                              { label: 'All Transactions', icon: 'pi pi-fw pi-wallet', to: '/transactions' },
                              { label: 'BBPS Transactions', icon: 'pi pi-fw pi-wallet', to: '/bbps/transactions' },
                              ...(isAdmin ? [{ label: 'Commission Ledger', icon: 'pi pi-fw pi-sitemap', to: '/reports/commissions' }] : [])
                          ]
                      }
                  ]
                : []),
            {
                label: 'Account Statement',
                items: [{ label: 'Wallet Ledger', icon: 'pi pi-fw pi-book', to: '/reports/ledger' }]
            },
            ...(isRetailer
                ? [
                      {
                          label: 'BBPS Services',
                          items: [
                              { label: 'Complaint Registration', icon: 'pi pi-fw pi-file-edit', to: '/bbps/complaint/registration' },
                              { label: 'Check Complaint Status', icon: 'pi pi-fw pi-info-circle', to: '/bbps/complaint/track' },
                              { label: 'Transaction Search', icon: 'pi pi-fw pi-search', to: '/bbps/transactions/search' }
                          ]
                      }
                  ]
                : []),
            {
                label: 'Account',
                items: [{ label: 'User Settings', icon: 'pi pi-fw pi-cog', to: '/settings/profile' }]
            }
        ];
    }

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator" key={`sep-${i}`}></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
