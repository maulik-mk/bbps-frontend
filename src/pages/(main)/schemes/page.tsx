'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { schemeService, type Scheme } from '../../../services/scheme.service';
import { PageHeader } from '../../../components/dashboard/PageHeader';

const SchemesPage = () => {
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [loading, setLoading] = useState(true);
    const [schemeDialog, setSchemeDialog] = useState(false);
    const [scheme, setScheme] = useState({ name: '', status: 'active' });
    const [submitted, setSubmitted] = useState(false);

    // Services Canvas State
    const [servicesCanvasVisible, setServicesCanvasVisible] = useState(false);
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadSchemes();
    }, []);

    const loadSchemes = async () => {
        setLoading(true);
        try {
            const data = await schemeService.getSchemes();
            setSchemes(data.schemes || []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load schemes', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setScheme({ name: '', status: 'active' });
        setSubmitted(false);
        setSchemeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSchemeDialog(false);
    };

    const saveScheme = async () => {
        setSubmitted(true);

        if (scheme.name.trim()) {
            try {
                await schemeService.createScheme(scheme);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Scheme Created', life: 3000 });
                setSchemeDialog(false);
                loadSchemes();
            } catch (error: any) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.error || 'Failed to create scheme', life: 3000 });
            }
        }
    };

    const toggleStatus = async (rowData: Scheme, checked: boolean) => {
        const newStatus = checked ? 'active' : 'inactive';

        // Optimistic UI update
        const updatedSchemes = schemes.map((s) => (s.id === rowData.id ? { ...s, status: newStatus } : s));
        setSchemes(updatedSchemes);

        try {
            await schemeService.updateStatus(rowData.id, newStatus);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: `Scheme marked as ${newStatus}`, life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update status', life: 3000 });
            // Revert on error
            loadSchemes();
        }
    };

    const openServicesCanvas = (rowData: Scheme) => {
        setSelectedScheme(rowData);
        setServicesCanvasVisible(true);
    };

    const goToCharges = (serviceName: string) => {
        if (selectedScheme) {
            setServicesCanvasVisible(false);
            navigate(`/master/schemes/${selectedScheme.id}/charges?service=${serviceName}`);
        }
    };

    const actionBodyTemplate = (rowData: Scheme) => {
        return (
            <div className="flex gap-2 align-items-center">
                <Button icon="pi pi-th-large" rounded text severity="info" aria-label="Manage Services" tooltip="Manage Services" tooltipOptions={{ position: 'top' }} onClick={() => openServicesCanvas(rowData)} />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Scheme) => {
        const isActive = rowData.status === 'active';
        return (
            <div className="flex align-items-center gap-2">
                <InputSwitch checked={isActive} onChange={(e) => toggleStatus(rowData, e.value)} />
                <span className={`text-sm font-bold ${isActive ? 'text-green-500' : 'text-500'}`}>{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
        );
    };

    const dateBodyTemplate = (rowData: Scheme) => {
        return new Date(rowData.created_at).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const schemeDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveScheme} />
        </React.Fragment>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <Toast ref={toast} />
                <PageHeader title="Schemes Management" actionLabel="New Scheme" actionIcon="pi pi-plus" actionColor="primary" onActionClick={openNew} />

                <div className="mt-4">
                    <DataTable
                        value={schemes}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="custom-datatable"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} schemes"
                        emptyMessage="No schemes found."
                        loading={loading}
                    >
                        <Column field="id" header="ID" sortable headerStyle={{ width: '10%' }}></Column>
                        <Column field="name" header="Name" sortable headerStyle={{ width: '35%' }}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate} sortable headerStyle={{ width: '20%' }}></Column>
                        <Column field="created_at" header="Created On" body={dateBodyTemplate} sortable headerStyle={{ width: '20%' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={schemeDialog} style={{ width: '450px' }} header="Create Scheme" modal className="p-fluid" footer={schemeDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="name">Scheme Name</label>
                        <InputText
                            id="name"
                            value={scheme.name}
                            onChange={(e) => setScheme({ ...scheme, name: e.target.value })}
                            required
                            autoFocus
                            className={classNames({ 'p-invalid': submitted && !scheme.name })}
                            placeholder="e.g. Diwali Offer, Premium Plan"
                        />
                        {submitted && !scheme.name && <small className="p-invalid text-red-500">Name is required.</small>}
                    </div>
                </Dialog>

                {/* Services Canvas Dialog */}
                <Dialog header={`Select Service for: ${selectedScheme?.name}`} visible={servicesCanvasVisible} style={{ width: '600px' }} modal onHide={() => setServicesCanvasVisible(false)} breakpoints={{ '960px': '75vw', '641px': '90vw' }}>
                    <div className="grid mt-2">
                        <div className="col-12 md:col-6">
                            <div
                                className="surface-0 shadow-2 p-4 border-round-2xl cursor-pointer hover:shadow-4 transition-all transition-duration-200 border-1 border-200 hover:border-blue-500 flex flex-column align-items-center justify-content-center h-full text-center"
                                onClick={() => goToCharges('BBPS')}
                            >
                                <img src="/logo/Bharat_Connect1.png" alt="BBPS" style={{ height: '40px', marginBottom: '1rem' }} />
                                <div className="text-900 font-bold text-xl mb-2">BBPS Charges</div>
                                <span className="text-600 text-sm">Configure commissions for 30+ bill categories</span>
                            </div>
                        </div>

                        {/* Placeholder for future service */}
                        <div className="col-12 md:col-6">
                            <div className="surface-100 p-4 border-round-2xl border-1 border-dashed border-300 flex flex-column align-items-center justify-content-center h-full text-center" style={{ opacity: 0.7 }}>
                                <i className="pi pi-wallet text-400 text-4xl mb-3"></i>
                                <div className="text-500 font-bold text-xl mb-2">AEPS / UPI</div>
                                <span className="text-400 text-sm font-italic">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default SchemesPage;
