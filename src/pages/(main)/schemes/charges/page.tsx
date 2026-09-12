'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { schemeService, SchemeCharge } from '../../../../services/scheme.service';

const SchemeChargesPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [charges, setCharges] = useState<SchemeCharge[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const typeOptions = [
        { label: 'Flat (₹)', value: 'flat' },
        { label: 'Percent (%)', value: 'percentage' }
    ];

    useEffect(() => {
        if (id) {
            loadCharges(parseInt(id));
        }
    }, [id]);

    const loadCharges = async (schemeId: number) => {
        setLoading(true);
        try {
            const data = await schemeService.getCharges(schemeId);
            setCharges(data.charges || []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load charges', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!id) return;
        setSaving(true);
        try {
            const formattedCharges = charges.map((c) => ({
                ...c,
                retailer_charge: Number(c.retailer_charge || 0).toFixed(4),
                md_comm: Number(c.md_comm || 0).toFixed(4),
                d_comm: Number(c.d_comm || 0).toFixed(4)
            }));
            await schemeService.saveCharges(parseInt(id), formattedCharges);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'All charges saved successfully', life: 3000 });
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.error || 'Failed to save charges', life: 3000 });
        } finally {
            setSaving(false);
        }
    };

    const onInputChange = (val: any, rowIndex: number, field: keyof SchemeCharge) => {
        const newCharges = [...charges];
        newCharges[rowIndex] = { ...newCharges[rowIndex], [field]: val };
        setCharges(newCharges);
    };

    const typeTemplate = (rowData: SchemeCharge, options: any, field: keyof SchemeCharge) => {
        return <Dropdown value={rowData[field]} options={typeOptions} onChange={(e) => onInputChange(e.value, options.rowIndex, field)} className="w-full" />;
    };

    const numberTemplate = (rowData: SchemeCharge, options: any, field: keyof SchemeCharge) => {
        return <InputNumber value={Number(rowData[field])} onValueChange={(e) => onInputChange(e.value || 0, options.rowIndex, field)} mode="decimal" minFractionDigits={2} maxFractionDigits={2} min={0} className="w-full" />;
    };

    return (
        <div className="grid">
            <div className="col-12">
                <Toast ref={toast} />

                <div className="flex justify-content-between align-items-center mb-4">
                    <Button icon="pi pi-arrow-left" label="Back to Schemes" text onClick={() => navigate('/master/schemes')} />
                    <Button label="Save All Charges" icon="pi pi-save" severity="success" onClick={handleSave} loading={saving} />
                </div>

                <div className="card">
                    <h4 className="mb-4">Manage Charges (Scheme ID: {id})</h4>

                    <DataTable value={charges} dataKey="category_id" loading={loading} stripedRows className="custom-datatable p-datatable-sm" emptyMessage="No categories found." scrollable scrollHeight="600px">
                        <Column field="category_name" header="Category Name" style={{ minWidth: '200px' }} />
                        <Column header="Commission Type" body={(data, opt) => typeTemplate(data, opt, 'commission_type')} style={{ minWidth: '150px' }} />
                        <Column header="Master Distributor" body={(data, opt) => numberTemplate(data, opt, 'md_comm')} style={{ minWidth: '120px' }} />
                        <Column header="Distributor" body={(data, opt) => numberTemplate(data, opt, 'd_comm')} style={{ minWidth: '120px' }} />
                        <Column header="Service Type" body={(data, opt) => typeTemplate(data, opt, 'retailer_charge_type')} style={{ minWidth: '150px' }} />
                        <Column header="Service Charges" body={(data, opt) => numberTemplate(data, opt, 'retailer_charge')} style={{ minWidth: '120px' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default SchemeChargesPage;
