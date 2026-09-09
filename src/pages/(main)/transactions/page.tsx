import React, { useState, useEffect, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';

const TransactionsPage = () => {
    const [allTransactions, setAllTransactions] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('All Transactions');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/dummy/transactions.json')
            .then((res) => res.json())
            .then((data) => setAllTransactions(data))
            .catch((err) => console.error('Failed to fetch transactions', err));
    }, []);

    const dateOptions = [{ name: 'All Time' }, { name: 'Last 7 Days' }, { name: 'Last 30 Days' }];
    const statusOptions = [{ name: 'All' }, { name: 'SUCCESS' }, { name: 'PENDING' }, { name: 'FAILED' }, { name: 'REFUNDED' }];

    const categoryOptions = useMemo(() => {
        const cats = new Set(allTransactions.map((t) => t.category));
        return [
            { name: 'All' },
            ...Array.from(cats)
                .filter(Boolean)
                .map((c) => ({ name: c as string }))
        ];
    }, [allTransactions]);

    const transactions = useMemo(() => {
        let data = [...allTransactions];

        // Tab Filter
        if (activeTab === 'Succeeded') data = data.filter((t) => t.status === 'SUCCESS');
        if (activeTab === 'Refunded') data = data.filter((t) => t.status === 'REFUNDED');

        // Dropdown Filters
        if (selectedStatus && selectedStatus.name !== 'All') {
            data = data.filter((t) => t.status === selectedStatus.name);
        }
        if (selectedCategory && selectedCategory.name !== 'All') {
            data = data.filter((t) => t.category === selectedCategory.name);
        }
        if (selectedDateRange && selectedDateRange.name !== 'All Time') {
            const now = new Date();
            data = data.filter((t) => {
                const tDate = new Date(t.date);
                if (selectedDateRange.name === 'Last 7 Days') {
                    return (now.getTime() - tDate.getTime()) / (1000 * 3600 * 24) <= 7;
                } else if (selectedDateRange.name === 'Last 30 Days') {
                    return (now.getTime() - tDate.getTime()) / (1000 * 3600 * 24) <= 30;
                }
                return true;
            });
        }

        // Global Search
        if (globalFilterValue) {
            const val = globalFilterValue.toLowerCase();
            data = data.filter((t) => {
                return (
                    (t.billerName && t.billerName.toLowerCase().includes(val)) ||
                    (t.userName && t.userName.toLowerCase().includes(val)) ||
                    (t.amount && t.amount.toString().includes(val)) ||
                    (t.transactionId && t.transactionId.toLowerCase().includes(val))
                );
            });
        }

        return data;
    }, [allTransactions, activeTab, selectedStatus, selectedCategory, selectedDateRange, globalFilterValue]);

    const formatDate = (value: string) => {
        return new Date(value).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    };

    const statusBodyTemplate = (rowData: any) => {
        const s = rowData.status?.toUpperCase();
        if (s === 'SUCCESS' || s === 'RECEIVE' || s === 'DEPOSIT') {
            return (
                <div className="bg-green-50 text-green-700 px-2 py-1 flex align-items-center justify-content-center" style={{ width: 'max-content', borderRadius: '6px' }}>
                    <i className="pi pi-check-circle mr-2" style={{ fontSize: '0.8rem' }}></i>
                    <span className="text-sm font-semibold">{rowData.status}</span>
                </div>
            );
        } else if (s === 'PENDING') {
            return (
                <div className="bg-yellow-50 text-yellow-700 px-2 py-1 flex align-items-center justify-content-center" style={{ width: 'max-content', borderRadius: '6px' }}>
                    <i className="pi pi-clock mr-2" style={{ fontSize: '0.8rem' }}></i>
                    <span className="text-sm font-semibold">{rowData.status}</span>
                </div>
            );
        } else {
            return (
                <div className="bg-red-50 text-red-600 px-2 py-1 flex align-items-center justify-content-center" style={{ width: 'max-content', borderRadius: '6px' }}>
                    <i className="pi pi-minus-circle mr-2" style={{ fontSize: '0.8rem' }}></i>
                    <span className="text-sm font-semibold">{rowData.status || 'Failed'}</span>
                </div>
            );
        }
    };

    const amountBodyTemplate = (rowData: any) => {
        return <span className="font-bold text-700">{formatCurrency(rowData.amount)}</span>;
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <button
                className="cursor-pointer bg-white border-1 border-solid border-round-lg px-4 py-2 text-sm font-semibold transition-colors hover:surface-100"
                style={{ color: '#1e293b', borderColor: '#e2e8f0' }}
                onClick={() => navigate(`/bbps/transactions/receipt/${rowData.id}`)}
            >
                Details
            </button>
        );
    };

    return (
        <div className="grid">
            <div className="col-12 bg-white min-h-screen">
                <div className="px-3 md:px-5 py-4 w-full" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
                    {/* Header */}
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h1 className="m-0 text-800 font-semibold text-3xl">Transactions overview</h1>
                        <Button label="Export" icon="pi pi-cloud-download" className="p-button-outlined p-button-secondary border-round-lg text-700 bg-white border-300 font-medium py-2 px-3 shadow-none hover:surface-100" />
                    </div>

                    {/* Tabs */}
                    <div className="flex border-bottom-1 border-200 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                        {['All Transactions', 'Succeeded', 'Refunded'].map((tab) => (
                            <div key={tab} className={`px-4 py-3 font-medium cursor-pointer transition-colors ${activeTab === tab ? 'text-blue-600 border-bottom-2 border-blue-600' : 'text-500 hover:text-700'}`} onClick={() => setActiveTab(tab)}>
                                {tab}
                            </div>
                        ))}
                    </div>

                    {/* Filter Toolbar */}
                    <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-4 gap-3 w-full">
                        <div className="flex gap-2 md:gap-3 flex-wrap w-full md:w-auto">
                            <span className="p-input-icon-left w-full sm:w-auto">
                                <i className="pi pi-clock text-500" style={{ zIndex: 1 }} />
                                <Dropdown
                                    value={selectedDateRange}
                                    onChange={(e) => setSelectedDateRange(e.value)}
                                    placeholder="Date range"
                                    options={dateOptions}
                                    optionLabel="name"
                                    className="border-round-lg shadow-none border-300 w-full sm:w-12rem"
                                    style={{ paddingLeft: '1.5rem' }}
                                />
                            </span>
                            <span className="p-input-icon-left w-full sm:w-auto">
                                <i className="pi pi-flag text-500" style={{ zIndex: 1 }} />
                                <Dropdown
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.value)}
                                    placeholder="Status"
                                    options={statusOptions}
                                    optionLabel="name"
                                    className="border-round-lg shadow-none border-300 w-full sm:w-10rem"
                                    style={{ paddingLeft: '1.5rem' }}
                                />
                            </span>
                            <span className="p-input-icon-left w-full sm:w-auto">
                                <i className="pi pi-briefcase text-500" style={{ zIndex: 1 }} />
                                <Dropdown
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.value)}
                                    placeholder="Category"
                                    options={categoryOptions}
                                    optionLabel="name"
                                    className="border-round-lg shadow-none border-300 w-full sm:w-12rem"
                                    style={{ paddingLeft: '1.5rem' }}
                                />
                            </span>
                        </div>
                        <span className="p-input-icon-left w-full md:w-auto mt-2 md:mt-0">
                            <i className="pi pi-search text-500" />
                            <InputText value={globalFilterValue} onChange={(e) => setGlobalFilterValue(e.target.value)} placeholder="Search amount, name, ID..." className="border-round-lg shadow-none border-300 w-full md:w-20rem py-2 pl-5" />
                        </span>
                    </div>

                    {/* Flat DataTable */}
                    <div className="w-full overflow-hidden">
                        <DataTable
                            value={transactions}
                            className="flat-datatable"
                            paginator
                            rows={10}
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} transactions"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            emptyMessage="No transactions found."
                            scrollable
                            responsiveLayout="scroll"
                        >
                            <Column field="date" header="DATE & TIME" body={(rowData) => formatDate(rowData.date)} sortable style={{ minWidth: '12rem' }} />
                            <Column field="userName" header="USER NAME" sortable style={{ minWidth: '12rem' }} />
                            <Column field="userMobile" header="USER MOBILE NUMBER" sortable style={{ minWidth: '12rem' }} />
                            <Column field="billerNumber" header="BILLER NUMBER" sortable style={{ minWidth: '10rem' }} />
                            <Column field="billerMobile" header="BILLER MOBILES" sortable style={{ minWidth: '10rem' }} />
                            <Column field="provider" header="PROVIDER" sortable style={{ minWidth: '12rem' }} />
                            <Column field="transactionId" header="TRANSACTION ID" sortable style={{ minWidth: '12rem' }} />
                            <Column field="utr" header="UTR" sortable style={{ minWidth: '10rem' }} />
                            <Column field="amount" header="AMOUNT" body={amountBodyTemplate} sortable style={{ minWidth: '10rem' }} />
                            <Column field="charges" header="CHARGES" body={(rowData) => formatCurrency(rowData.charges)} sortable style={{ minWidth: '10rem' }} />
                            <Column field="openingBalance" header="OPENING" body={(rowData) => formatCurrency(rowData.openingBalance)} sortable style={{ minWidth: '10rem' }} />
                            <Column field="closingBalance" header="CLOSING" body={(rowData) => formatCurrency(rowData.closingBalance)} sortable style={{ minWidth: '10rem' }} />
                            <Column field="status" header="STATUS" body={statusBodyTemplate} sortable style={{ minWidth: '10rem' }} />
                            <Column body={actionBodyTemplate} header="ACTION" style={{ minWidth: '8rem' }} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;
