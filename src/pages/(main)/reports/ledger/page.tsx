import React, { useState, useEffect } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { reportService } from '../../../../services/report.service';

const LedgerPage = () => {
    const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 0 });
    const [totalRecords, setTotalRecords] = useState(0);

    const dateOptions = [{ name: 'All Time' }, { name: 'Last 7 Days' }, { name: 'Last 30 Days' }];

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(globalFilterValue), 500);
        return () => clearTimeout(timer);
    }, [globalFilterValue]);

    useEffect(() => {
        setLazyParams({ first: 0, rows: 10, page: 0 });
        fetchLedger(0);
    }, [debouncedSearch, selectedDateRange]);

    const fetchLedger = (first: number) => {
        setLoading(true);
        const filters = {
            dateRange: selectedDateRange?.name === 'Last 7 Days' ? '7' : selectedDateRange?.name === 'Last 30 Days' ? '30' : undefined,
            search: debouncedSearch || undefined
        };

        reportService
            .getLedger(first, 10, filters)
            .then((res) => {
                if (res.results) {
                    setLedgerEntries(res.results);
                }
                if (res.totalRecords !== undefined) {
                    setTotalRecords(res.totalRecords);
                }
            })
            .catch((err) => console.error('Failed to fetch ledger', err))
            .finally(() => setLoading(false));
    };

    const onPage = (event: DataTablePageEvent) => {
        setLazyParams({ first: event.first, rows: event.rows, page: event.page || 0 });
        fetchLedger(event.first);
    };

    const formatCurrency = (value: number) => {
        return value ? value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '₹0.00';
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

    const amountDetailsTemplate = (rowData: any) => {
        const baseAmount = parseFloat(rowData.transfer_type === 'BBPS_BILL_PAYMENT' ? rowData.bill_amount || rowData.amount : rowData.amount);
        const charges = parseFloat(rowData.transfer_type === 'BBPS_BILL_PAYMENT' ? rowData.charge_amount || 0 : 0);

        return (
            <div className="flex flex-column">
                <span className="font-bold text-700">{formatCurrency(baseAmount)}</span>
                {charges > 0 && <span className="text-orange-500 font-semibold mt-1">+ {formatCurrency(charges)} charge</span>}
            </div>
        );
    };

    const typeBodyTemplate = (rowData: any) => {
        const isCredit = rowData.type === 'credit';
        const formattedAmount = formatCurrency(parseFloat(rowData.amount));
        return (
            <div className={`px-2 py-1 flex align-items-center justify-content-center ${isCredit ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`} style={{ width: 'max-content', borderRadius: '6px' }}>
                <span className="text-sm font-bold">
                    {isCredit ? '+' : '-'}
                    {formattedAmount}
                </span>
            </div>
        );
    };

    const getEventDescription = (rowData: any) => {
        switch (rowData.transfer_type) {
            case 'D_COMMISSION':
            case 'MD_COMMISSION':
                return `Commission for ${rowData.txn_id || 'Transaction'}`;
            case 'BBPS_BILL_PAYMENT':
                return `Bill Payment for ${rowData.txn_id || 'Transaction'}`;
            case 'COMPANY_REVENUE':
                return `Revenue for ${rowData.txn_id || 'Transaction'}`;
            default:
                return rowData.transfer_type;
        }
    };

    const descriptionTemplate = (rowData: any) => {
        return (
            <div className="flex flex-column py-1 justify-content-center" style={{ minHeight: '80px' }}>
                <div className="flex align-items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-900 text-base" style={{ letterSpacing: '-0.3px' }}>
                        {rowData.user_name || 'System Account'}
                    </span>
                    <span className="text-xs text-600 bg-gray-100 px-2 py-1 border-round flex align-items-center font-medium">
                        <i className="pi pi-phone mr-1" style={{ fontSize: '0.7rem', color: '#9ca3af' }}></i>
                        {rowData.user_mobile || 'N/A'}
                    </span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 border-round">Bharat Connect</span>
                </div>

                {rowData.txn_id && (
                    <div className="flex align-items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-600" style={{ fontFamily: 'monospace', letterSpacing: '-0.2px' }}>
                            {rowData.txn_id}
                        </span>
                        <i className="pi pi-copy text-400 cursor-pointer transition-colors hover:text-600" style={{ fontSize: '0.85rem' }} title="Copy Transaction ID" onClick={() => navigator.clipboard.writeText(rowData.txn_id)}></i>
                    </div>
                )}

                <div className="text-sm text-700 font-medium mt-1" style={{ lineHeight: '1.4', maxWidth: '350px' }}>
                    {getEventDescription(rowData)} {rowData.service_name && <span className="font-bold"></span>}
                </div>
            </div>
        );
    };

    return (
        <div className="grid">
            <div className="col-12 bg-white min-h-screen">
                <div className="px-3 md:px-5 py-4 w-full" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h1 className="m-0 text-800 font-semibold text-3xl">Wallet Ledger</h1>
                        <Button label="Export" icon="pi pi-cloud-download" className="p-button-outlined p-button-secondary border-round-lg text-700 bg-white border-300 font-medium py-2 px-3 shadow-none hover:surface-100" />
                    </div>

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
                        </div>
                        <span className="p-input-icon-left w-full md:w-auto mt-2 md:mt-0">
                            <i className="pi pi-search text-500" />
                            <InputText value={globalFilterValue} onChange={(e) => setGlobalFilterValue(e.target.value)} placeholder="Search Txn ID, Service..." className="border-round-lg shadow-none border-300 w-full md:w-20rem py-2 pl-5" />
                        </span>
                    </div>

                    <div className="w-full overflow-hidden">
                        <DataTable
                            value={ledgerEntries}
                            lazy
                            first={lazyParams.first}
                            rows={10}
                            totalRecords={totalRecords}
                            onPage={onPage}
                            loading={loading}
                            className="flat-datatable"
                            paginator
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            emptyMessage="No ledger entries found."
                            scrollable
                            responsiveLayout="scroll"
                        >
                            <Column field="created_at" header="DATE & TIME" body={dateTemplate} sortable style={{ minWidth: '12rem' }} />
                            <Column header="DESCRIPTION" body={descriptionTemplate} style={{ minWidth: '22rem' }} />
                            <Column header="AMOUNT" body={amountDetailsTemplate} style={{ minWidth: '12rem' }} />
                            <Column field="opening_balance" header="OPENING BAL" body={(r) => formatCurrency(parseFloat(r.opening_balance))} style={{ minWidth: '10rem', color: '#64748b' }} />
                            <Column field="type" header="CR/DR" body={typeBodyTemplate} sortable style={{ minWidth: '10rem' }} />
                            <Column field="closing_balance" header="CLOSING BAL" body={(r) => formatCurrency(parseFloat(r.closing_balance))} style={{ minWidth: '10rem', fontWeight: 'bold' }} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LedgerPage;
