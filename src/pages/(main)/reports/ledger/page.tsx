import React, { useState, useEffect, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { reportService } from '../../../../services/report.service';

const LedgerPage = () => {
    const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState<any>(null);

    useEffect(() => {
        reportService
            .getLedger()
            .then((res) => {
                if (res.results) setLedgerEntries(res.results);
            })
            .catch((err) => console.error('Failed to fetch ledger', err))
            .finally(() => setLoading(false));
    }, []);

    const dateOptions = [{ name: 'All Time' }, { name: 'Last 7 Days' }, { name: 'Last 30 Days' }];

    const filteredLedgerEntries = useMemo(() => {
        let data = [...ledgerEntries];

        if (selectedDateRange && selectedDateRange.name !== 'All Time') {
            const now = new Date();
            data = data.filter((t) => {
                const tDate = new Date(t.created_at);
                if (selectedDateRange.name === 'Last 7 Days') {
                    return (now.getTime() - tDate.getTime()) / (1000 * 3600 * 24) <= 7;
                } else if (selectedDateRange.name === 'Last 30 Days') {
                    return (now.getTime() - tDate.getTime()) / (1000 * 3600 * 24) <= 30;
                }
                return true;
            });
        }

        if (globalFilterValue) {
            const val = globalFilterValue.toLowerCase();
            data = data.filter((t) => {
                return (t.transaction_id && t.transaction_id.toLowerCase().includes(val)) || (t.transfer_type && t.transfer_type.toLowerCase().includes(val));
            });
        }

        return data;
    }, [ledgerEntries, selectedDateRange, globalFilterValue]);

    const formatCurrency = (value: number) => {
        return value ? value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '₹0.00';
    };

    const formatDate = (value: string) => {
        return new Date(value).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const typeBodyTemplate = (rowData: any) => {
        const isCredit = rowData.type === 'credit';
        return (
            <div className={`px-2 py-1 flex align-items-center justify-content-center ${isCredit ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`} style={{ width: 'max-content', borderRadius: '6px' }}>
                <i className={`pi ${isCredit ? 'pi-arrow-down' : 'pi-arrow-up'} mr-2`} style={{ fontSize: '0.8rem' }}></i>
                <span className="text-sm font-semibold">{isCredit ? 'CREDIT' : 'DEBIT'}</span>
            </div>
        );
    };

    const transferTypeBodyTemplate = (rowData: any) => {
        return <span className="font-semibold text-600 border-1 border-300 px-2 py-1 border-round-md">{rowData.transfer_type}</span>;
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
                            <InputText value={globalFilterValue} onChange={(e) => setGlobalFilterValue(e.target.value)} placeholder="Search Ref ID, Event Type..." className="border-round-lg shadow-none border-300 w-full md:w-20rem py-2 pl-5" />
                        </span>
                    </div>

                    <div className="w-full overflow-hidden">
                        <DataTable
                            value={filteredLedgerEntries}
                            loading={loading}
                            className="flat-datatable"
                            paginator
                            rows={10}
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            emptyMessage="No ledger entries found."
                            scrollable
                            responsiveLayout="scroll"
                        >
                            <Column field="created_at" header="DATE" body={(r) => formatDate(r.created_at)} sortable style={{ minWidth: '12rem' }} />
                            <Column field="transaction_id" header="REF ID" sortable style={{ minWidth: '15rem', fontFamily: 'monospace' }} />
                            <Column field="transfer_type" header="EVENT TYPE" body={transferTypeBodyTemplate} style={{ minWidth: '12rem' }} />
                            <Column field="type" header="TYPE" body={typeBodyTemplate} sortable style={{ minWidth: '8rem' }} />
                            <Column field="amount" header="AMOUNT" body={(r) => formatCurrency(parseFloat(r.amount))} style={{ minWidth: '10rem', fontWeight: 'bold' }} />
                            <Column field="opening_balance" header="OPENING BAL" body={(r) => formatCurrency(parseFloat(r.opening_balance))} style={{ minWidth: '10rem', color: '#64748b' }} />
                            <Column field="closing_balance" header="CLOSING BAL" body={(r) => formatCurrency(parseFloat(r.closing_balance))} style={{ minWidth: '10rem', fontWeight: 'bold' }} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LedgerPage;
