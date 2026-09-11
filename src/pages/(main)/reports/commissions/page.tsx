import React, { useState, useEffect, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { reportService } from '../../../../services/report.service';

const CommissionsPage = () => {
    const [distributions, setDistributions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState<any>(null);

    useEffect(() => {
        reportService
            .getCommissionDistribution()
            .then((res) => {
                if (res.results) setDistributions(res.results);
            })
            .catch((err) => console.error('Failed to fetch commission distributions', err))
            .finally(() => setLoading(false));
    }, []);

    const dateOptions = [{ name: 'All Time' }, { name: 'Last 7 Days' }, { name: 'Last 30 Days' }];

    const filteredDistributions = useMemo(() => {
        let data = [...distributions];

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
                return (t.retailer?.name && t.retailer.name.toLowerCase().includes(val)) || (t.retailer?.mobile && t.retailer.mobile.includes(val)) || (t.service_name && t.service_name.toLowerCase().includes(val));
            });
        }

        return data;
    }, [distributions, selectedDateRange, globalFilterValue]);

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

    const retailerTemplate = (rowData: any) => {
        return (
            <div className="flex flex-column">
                <span className="font-bold text-700">{rowData.retailer?.name || 'Retailer'}</span>
                <span className="text-sm text-500">{rowData.retailer?.mobile || 'N/A'}</span>
            </div>
        );
    };

    const txnDetailsTemplate = (rowData: any) => {
        return (
            <div className="flex flex-column">
                <span className="text-sm text-500">Bill: {formatCurrency(parseFloat(rowData.bill_amount))}</span>
                <span className="text-sm text-orange-600 font-bold">Charge: {formatCurrency(parseFloat(rowData.charge_amount))}</span>
                <span className="text-sm text-700 font-medium">Service: {rowData.service_name || 'N/A'}</span>
            </div>
        );
    };

    const mdTemplate = (rowData: any) => {
        const md = rowData.commissions?.master_distributor;
        if (!md) return <span className="text-400 font-bold">-</span>;
        return (
            <div className="flex flex-column">
                <span className="font-bold text-700">{md.name || 'MD'}</span>
                <span className="text-sm text-500">{md.mobile || 'N/A'}</span>
                <span className="text-sm text-green-600 font-bold mt-1">Commission: {formatCurrency(parseFloat(md.amount))}</span>
            </div>
        );
    };

    const dTemplate = (rowData: any) => {
        const d = rowData.commissions?.distributor;
        if (!d) return <span className="text-400 font-bold">-</span>;
        return (
            <div className="flex flex-column">
                <span className="font-bold text-700">{d.name || 'Distributor'}</span>
                <span className="text-sm text-500">{d.mobile || 'N/A'}</span>
                <span className="text-sm text-green-600 font-bold mt-1">Commission: {formatCurrency(parseFloat(d.amount))}</span>
            </div>
        );
    };

    return (
        <div className="grid">
            <div className="col-12 bg-white min-h-screen">
                <div className="px-3 md:px-5 py-4 w-full" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h1 className="m-0 text-800 font-semibold text-3xl">Commission Distribution</h1>
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
                            <InputText value={globalFilterValue} onChange={(e) => setGlobalFilterValue(e.target.value)} placeholder="Search Retailer or Service..." className="border-round-lg shadow-none border-300 w-full md:w-20rem py-2 pl-5" />
                        </span>
                    </div>

                    <div className="w-full overflow-hidden">
                        <DataTable
                            value={filteredDistributions}
                            loading={loading}
                            className="flat-datatable"
                            paginator
                            rows={10}
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} commissions"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            emptyMessage="No commissions found."
                            scrollable
                            responsiveLayout="scroll"
                        >
                            <Column field="created_at" header="DATE" body={(r) => formatDate(r.created_at)} sortable style={{ minWidth: '12rem' }}></Column>
                            <Column header="RETAILER DETAILS" body={retailerTemplate} style={{ minWidth: '18rem' }}></Column>
                            <Column header="TXN DETAILS" body={txnDetailsTemplate} style={{ minWidth: '18rem' }}></Column>
                            <Column header="DISTRIBUTOR (D)" body={dTemplate} style={{ minWidth: '20rem' }}></Column>
                            <Column header="MASTER DISTRIBUTOR (MD)" body={mdTemplate} style={{ minWidth: '20rem' }}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommissionsPage;
