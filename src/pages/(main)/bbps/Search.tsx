import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import BBPSPageCard from '../../../components/BBPSPageCard';

const TransactionSearch = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dates, setDates] = useState<any>(null);
    const [searchType, setSearchType] = useState('mobile');
    const [searchValue, setSearchValue] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const searchOptions = [
        { label: 'Mobile Number', value: 'mobile' },
        { label: 'BBPS Ref Number', value: 'ref_no' },
        { label: 'Biller Name', value: 'biller' }
    ];

    const handleSearch = () => {
        setLoading(true);
        setHasSearched(true);
        // Simulate API call
        setTimeout(() => {
            setResults([
                { id: 'BBPS1001', date: '2023-10-25 14:30', amount: 500, status: 'SUCCESS', biller: 'Jio Postpaid' },
                { id: 'BBPS1002', date: '2023-10-26 09:15', amount: 1200, status: 'FAILED', biller: 'Airtel Broadband' }
            ]);
            setLoading(false);
        }, 1000);
    };

    const statusBodyTemplate = (rowData: any) => {
        return <span className={`p-tag p-tag-rounded ${rowData.status === 'SUCCESS' ? 'p-tag-success' : 'p-tag-danger'}`}>{rowData.status}</span>;
    };

    const amountBodyTemplate = (rowData: any) => {
        return `₹${rowData.amount.toFixed(2)}`;
    };

    return (
        <div className="grid">
            <div className="col-12">
                <BBPSPageCard title="Transaction Search" subtitle="Find past BBPS transactions by Mobile, Reference Number, or Date." onBack={() => navigate(-1)}>
                    <div className="grid formgrid p-fluid">
                        <div className="col-12 md:col-3">
                            <label className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">Date Range</label>
                            <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput placeholder="Select Date Range" className="border-round-xl" />
                        </div>
                        <div className="col-12 md:col-3">
                            <label className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">Search By</label>
                            <Dropdown value={searchType} options={searchOptions} onChange={(e) => setSearchType(e.value)} placeholder="Select criteria" className="border-round-xl" />
                        </div>
                        <div className="col-12 md:col-4">
                            <label className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">Search Value</label>
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-search text-400 ml-2" />
                                <InputText value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder={`Enter ${searchType}`} className="border-round-xl border-300 py-3 pl-6 w-full" />
                            </span>
                        </div>
                        <div className="col-12 md:col-2 flex align-items-end">
                            <Button
                                label="Search"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                loading={loading}
                                onClick={handleSearch}
                                disabled={!searchValue && !dates}
                                className="w-full border-round-xl font-bold bg-blue-500 border-blue-500 hover:bg-blue-600 transition-colors py-3"
                            />
                        </div>
                    </div>
                </BBPSPageCard>

                {hasSearched && (
                    <div className="mt-4 fadein animation-duration-500">
                        <div className="bg-white border-1 border-solid border-200 border-round-2xl p-4 shadow-none relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                            <h3 className="m-0 text-900 font-bold text-xl mb-4">Search Results</h3>
                            <div className="w-full overflow-hidden">
                                <DataTable value={results} loading={loading} emptyMessage="No transactions found matching your criteria." stripedRows scrollable responsiveLayout="scroll">
                                    <Column field="id" header="BBPS Ref No" style={{ minWidth: '150px' }}></Column>
                                    <Column field="date" header="Date & Time" style={{ minWidth: '150px' }}></Column>
                                    <Column field="biller" header="Biller" style={{ minWidth: '200px' }}></Column>
                                    <Column field="amount" header="Amount" body={amountBodyTemplate} style={{ minWidth: '100px' }}></Column>
                                    <Column field="status" header="Status" body={statusBodyTemplate} style={{ minWidth: '100px' }}></Column>
                                </DataTable>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionSearch;
