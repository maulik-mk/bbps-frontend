import React, { useState, useEffect, useMemo } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../../../services/report.service';
import { BBPSLogo } from '../../../components/BBPSLogo';

const TransactionsPage = ({ type }: { type?: string }) => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [summary, setSummary] = useState({ total_transactions: 0, total_volume: 0 });
    const [activeTab, setActiveTab] = useState('All Transactions');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [categoryOptions, setCategoryOptions] = useState<any[]>([{ name: 'All' }]);
    const [loading, setLoading] = useState(false);
    const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 0 });
    const [totalRecords, setTotalRecords] = useState(0);
    const navigate = useNavigate();
    const dateOptions = [{ name: 'All Time' }, { name: 'Last 7 Days' }, { name: 'Last 30 Days' }];
    const statusOptions = [{ name: 'All' }, { name: 'success' }, { name: 'pending' }, { name: 'failed' }, { name: 'refunded' }];

    useEffect(() => {
        reportService
            .getCategories()
            .then((res) => {
                const dynamicCategories = res.map((cat: any) => ({ name: cat.name }));
                setCategoryOptions([{ name: 'All' }, ...dynamicCategories]);
            })
            .catch((err) => console.error('Failed to load categories', err));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(globalFilterValue), 500);
        return () => clearTimeout(timer);
    }, [globalFilterValue]);

    useEffect(() => {
        setLazyParams({ first: 0, rows: 10, page: 0 });
        fetchTransactions(0);
    }, [activeTab, debouncedSearch, selectedDateRange, selectedStatus, selectedCategory, type]);

    const fetchTransactions = (first: number) => {
        setLoading(true);
        const filters = {
            status: activeTab !== 'All Transactions' ? activeTab : selectedStatus?.name !== 'All' ? selectedStatus?.name : undefined,
            category: selectedCategory?.name !== 'All' ? selectedCategory?.name : undefined,
            dateRange: selectedDateRange?.name === 'Last 7 Days' ? '7' : selectedDateRange?.name === 'Last 30 Days' ? '30' : undefined,
            search: debouncedSearch || undefined
        };

        reportService
            .getTransactions(first, 10, type, filters)
            .then((res) => {
                if (res.results) setTransactions(res.results);
                if (res.summary) setSummary(res.summary);
                if (res.totalRecords !== undefined) setTotalRecords(res.totalRecords);
            })
            .catch((err) => console.error('Failed to fetch transactions', err))
            .finally(() => setLoading(false));
    };

    const onPage = (event: DataTablePageEvent) => {
        setLazyParams({ first: event.first, rows: event.rows, page: event.page || 0 });
        fetchTransactions(event.first);
    };

    const dateTemplate = (rowData: any) => {
        const dateObj = new Date(rowData.created_at);
        const dateStr = dateObj.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const timeStr = dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return (
            <div className="flex flex-column gap-1">
                <span className="font-bold text-800">{dateStr}</span>
                <span className="text-sm text-500 font-medium">{timeStr}</span>
            </div>
        );
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    };

    const statusBodyTemplate = (rowData: any) => {
        const s = rowData.status?.toLowerCase();
        if (s === 'success') {
            return (
                <div className="bg-green-50 text-green-700 px-2 py-1 flex align-items-center justify-content-center" style={{ width: 'max-content', borderRadius: '6px' }}>
                    <i className="pi pi-check-circle mr-2" style={{ fontSize: '0.8rem' }}></i>
                    <span className="text-sm font-semibold">Success</span>
                </div>
            );
        } else if (s === 'pending') {
            return (
                <div className="bg-yellow-50 text-yellow-700 px-2 py-1 flex align-items-center justify-content-center" style={{ width: 'max-content', borderRadius: '6px' }}>
                    <i className="pi pi-clock mr-2" style={{ fontSize: '0.8rem' }}></i>
                    <span className="text-sm font-semibold">Pending</span>
                </div>
            );
        } else {
            return (
                <div className="bg-red-50 text-red-600 px-2 py-1 flex align-items-center justify-content-center" style={{ width: 'max-content', borderRadius: '6px' }}>
                    <i className="pi pi-minus-circle mr-2" style={{ fontSize: '0.8rem' }}></i>
                    <span className="text-sm font-semibold">Failed</span>
                </div>
            );
        }
    };

    const amountBodyTemplate = (rowData: any) => {
        return <span className="font-bold text-700">{formatCurrency(parseFloat(rowData.total_amount))}</span>;
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <button
                className="cursor-pointer bg-white border-1 border-solid border-round-lg px-4 py-2 text-sm font-semibold transition-colors hover:surface-100"
                style={{ color: '#1e293b', borderColor: '#e2e8f0' }}
                onClick={() => navigate(`/bbps/transactions/receipt/${rowData.id}`)}
            >
                Receipt
            </button>
        );
    };

    return (
        <div className="grid">
            <div className="col-12 bg-white min-h-screen">
                <div className="px-3 md:px-5 py-4 w-full" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
                    {/* Header */}
                    {type === 'bbps' ? (
                        <div className="flex justify-content-between align-items-center mb-4 pb-3 border-bottom-1 border-200">
                            <h1 className="m-0 text-900 font-bold text-2xl">Bharat Connect Transactions</h1>
                            <div className="flex align-items-center">
                                <BBPSLogo type="bharat_connect" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-content-between align-items-center mb-4">
                            <h1 className="m-0 text-800 font-semibold text-3xl">Transactions overview</h1>
                        </div>
                    )}
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

                    {/* Lazy DataTable */}
                    <div className="w-full overflow-hidden">
                        <DataTable
                            value={transactions}
                            lazy
                            first={lazyParams.first}
                            rows={10}
                            totalRecords={totalRecords}
                            onPage={onPage}
                            loading={loading}
                            className="flat-datatable"
                            paginator
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} transactions"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            emptyMessage="No transactions found."
                            scrollable
                            responsiveLayout="scroll"
                        >
                            <Column field="created_at" header="DATE & TIME" body={dateTemplate} sortable style={{ minWidth: '12rem' }} />
                            <Column field="first_name" header="USER NAME" sortable style={{ minWidth: '12rem' }} />
                            <Column field="user_mobile" header="USER MOBILE" sortable style={{ minWidth: '12rem' }} />
                            <Column field="category_name" header="CATEGORY" sortable style={{ minWidth: '10rem' }} />
                            <Column field="service_name" header="SERVICE" sortable style={{ minWidth: '12rem' }} />
                            <Column field="txn_id" header="TRANSACTION ID" sortable style={{ minWidth: '12rem' }} />
                            <Column field="total_amount" header="AMOUNT" body={amountBodyTemplate} sortable style={{ minWidth: '10rem' }} />
                            <Column field="status" header="STATUS" body={statusBodyTemplate} sortable style={{ minWidth: '10rem' }} />
                            <Column body={actionBodyTemplate} header="ACTION" align="center" style={{ minWidth: '8rem' }} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;
