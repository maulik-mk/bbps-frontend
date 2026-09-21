import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import BBPSPageCard from '../../../components/BBPSPageCard';
import { BBPSLogo } from '../../../components/BBPSLogo';

const TransactionSearch = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dates, setDates] = useState<any>(null);
    const [mobileNumber, setMobileNumber] = useState('');
    const [txnId, setTxnId] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        setLoading(true);
        setHasSearched(true);
        // Simulate API call
        setTimeout(() => {
            setResults([{ agentId: 'Nexasoft Technologies Retailer', billerName: 'Tata Power', amount: 573, txnDate: '14 Sept 2026 07:47 ', txnReferenceId: 'CC01AE8B7B452F74B574', txnStatus: 'SUCCESS' }]);
            setLoading(false);
        }, 1000);
    };

    const statusBodyTemplate = (rowData: any) => {
        return <span className={`p-tag p-tag-rounded ${rowData.txnStatus === 'SUCCESS' ? 'p-tag-success' : 'p-tag-danger'}`}>{rowData.txnStatus}</span>;
    };

    const amountBodyTemplate = (rowData: any) => {
        return `₹${rowData.amount.toFixed(2)}`;
    };

    return (
        <div className="w-full">
            <div className="px-3 md:px-5 py-4 w-full" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
                <div className="flex justify-content-between align-items-center mb-4 pb-3 border-bottom-1 border-200">
                    <h1 className="m-0 text-900 font-bold text-2xl" style={{ lineHeight: '70px' }}>Transaction Search</h1>
                    <div className="flex align-items-center h-full">
                        <BBPSLogo type="bharat_connect" />
                    </div>
                </div>
            </div>
            <div className="grid px-3 md:px-5">
                <div className="col-12">
                    <BBPSPageCard title="Find past Bharat Connect transactions by Mobile, Reference Number, or Date." onBack={() => navigate(-1)} logoType="none">
                        <div className="grid formgrid p-fluid align-items-end mb-4">
                            <div className="col-12 md:col-6">
                                <label className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">Mobile Number</label>
                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-phone text-400 ml-2" />
                                    <InputText value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="Enter Mobile" className="border-round-xl border-300 py-3 pl-6 w-full" />
                                </span>
                            </div>
                            <div className="col-12 md:col-6">
                                <label className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">Date Range</label>
                                <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput placeholder="Select Date Range" className="border-round-xl" inputClassName="py-3" />
                            </div>
                        </div>

                        <Divider align="center" className="my-4">
                            <span className="p-tag p-tag-rounded p-tag-secondary font-bold px-3">OR</span>
                        </Divider>

                        <div className="grid formgrid p-fluid align-items-end mt-4">
                            <div className="col-12 md:col-12 mb-2">
                                <label className="text-xs font-bold text-500 uppercase tracking-wide block mb-2">B-Connect Txn ID</label>
                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-hashtag text-400 ml-2" />
                                    <InputText value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="Enter B-Connect Txn ID" className="border-round-xl border-300 py-3 pl-6 w-full" />
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-content-end mt-4">
                            <Button
                                label="Search Transactions"
                                icon="pi pi-search"
                                loading={loading}
                                onClick={handleSearch}
                                disabled={(!mobileNumber || !dates) && !txnId}
                                className="border-round-xl font-bold bg-blue-500 border-blue-500 hover:bg-blue-600 transition-colors py-3 px-5"
                            />
                        </div>
                    </BBPSPageCard>

                    {hasSearched && (
                        <div className="mt-4 fadein animation-duration-500">
                            <div className="bg-white border-1 border-solid border-200 border-round-2xl p-4 shadow-none relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                                <h3 className="m-0 text-900 font-bold text-xl mb-4">Search Results</h3>
                                <div className="w-full overflow-hidden">
                                    <DataTable value={results} loading={loading} emptyMessage="No transactions found matching your criteria." stripedRows scrollable responsiveLayout="scroll">
                                        <Column field="agentId" header="Agent ID" style={{ minWidth: '120px' }}></Column>
                                        <Column field="billerName" header="Biller Name" style={{ minWidth: '200px' }}></Column>
                                        <Column field="amount" header="Amount" body={amountBodyTemplate} style={{ minWidth: '100px' }}></Column>
                                        <Column field="txnDate" header="Transaction Date" style={{ minWidth: '160px' }}></Column>
                                        <Column field="txnReferenceId" header="B-Connect Txn ID" style={{ minWidth: '220px' }}></Column>
                                        <Column field="txnStatus" header="Status" body={statusBodyTemplate} style={{ minWidth: '100px' }}></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionSearch;
