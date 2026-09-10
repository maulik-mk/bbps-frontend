'use client';
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { userService } from '../../../services/user.service';
import { PageHeader } from '../../../components/dashboard/PageHeader';

interface UserManagementTableProps {
    role: string;
    title: string;
}

const UserManagementTable = ({ role, title }: UserManagementTableProps) => {
    const emptyUser = {
        name: '',
        mobile: '',
        email: '',
        shopname: '',
        aadharcard: '',
        pancard: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        scheme_id: 1,
        bankname: '',
        accountnumber: '',
        ifsccode: ''
    };

    const [users, setUsers] = useState<any[]>([]);
    const [userDialog, setUserDialog] = useState(false);
    const [viewDialog, setViewDialog] = useState(false);
    const [user, setUser] = useState<any>(emptyUser);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadUsers();
    }, [role]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers(role);
            setUsers(data.data || []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load users', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const saveUser = async () => {
        setSubmitted(true);

        if (user.name.trim() && user.mobile.trim()) {
            try {
                await userService.createUser({ ...user, role });
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
                setUserDialog(false);
                setUser(emptyUser);
                loadUsers();
            } catch (error: any) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.error || 'Failed to create user', life: 3000 });
            }
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;
        setUser(_user);
    };

    const viewUser = (userData: any) => {
        setUser({ ...userData });
        setViewDialog(true);
    };

    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveUser} />
        </React.Fragment>
    );

    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const customHeader = (
        <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center w-full pt-3 pb-3 px-3 md:px-4 border-bottom-1 surface-border bg-white border-round-top-xl gap-3">
            <div className="flex align-items-center gap-3">
                <Avatar label={getInitials(user?.name)} size="xlarge" shape="circle" className="bg-indigo-600 text-white font-bold hidden sm:flex" style={{ width: '60px', height: '60px', fontSize: '1.5rem', minWidth: '60px' }} />
                <div>
                    <div className="flex flex-wrap align-items-center gap-2 mb-2 md:mb-1">
                        <span className="text-xl md:text-3xl font-bold text-900">{user?.name || 'Unknown User'}</span>
                        <span className="bg-indigo-50 text-indigo-600 border-round-md px-2 py-1 text-xs font-semibold flex align-items-center gap-1 border-1 border-indigo-200 white-space-nowrap">
                            <i className="pi pi-check-circle"></i> {user?.role ? user.role.replace('_', ' ').toUpperCase() : 'N/A'}
                        </span>
                        <span className="bg-green-50 text-green-600 border-round-md px-2 py-1 text-xs font-semibold flex align-items-center gap-1 border-1 border-green-200 white-space-nowrap">
                            <span className="border-circle bg-green-500 inline-block" style={{ width: '8px', height: '8px' }}></span> {user?.status ? user.status.toUpperCase() : 'ACTIVE'}
                        </span>
                    </div>
                    <div className="text-500 text-xs md:text-sm font-medium line-height-3">
                        Distributor & Merchant Management <span className="mx-2 text-300 hidden md:inline">•</span> <br className="block md:hidden" /> UID: {user?.id ? user.id.substring(0, 8).toUpperCase() : 'N/A'}
                    </div>
                </div>
            </div>
            <div className="flex align-items-center gap-2 w-full md:w-auto justify-content-end">
                <Button icon="pi pi-times" rounded text severity="secondary" onClick={() => setViewDialog(false)} className="ml-1 md:ml-3 text-500" />
            </div>
        </div>
    );

    const DataCard = ({ icon, title, tag, children }: any) => (
        <div className="surface-card border-round-xl shadow-1 border-1 surface-border h-full bg-white flex flex-column">
            <div className="flex justify-content-between align-items-center p-3 border-bottom-1 surface-border">
                <div className="flex align-items-center gap-2">
                    <div className="bg-blue-50 text-blue-500 flex align-items-center justify-content-center border-round" style={{ width: '28px', height: '28px', minWidth: '28px' }}>
                        <i className={`pi ${icon} text-sm`}></i>
                    </div>
                    <span className="font-bold text-900 white-space-nowrap overflow-hidden text-overflow-ellipsis">{title}</span>
                </div>
                {typeof tag === 'string' ? <span className="text-400 text-xs font-semibold hidden sm:block">{tag}</span> : tag}
            </div>
            <div className="p-3 flex-1 overflow-x-auto">{children}</div>
        </div>
    );

    const DetailRow = ({ label, value, subtext, rightIcon, badge, badgeSeverity, copyable }: any) => (
        <div className="flex flex-column sm:flex-row justify-content-between sm:align-items-start py-3 border-bottom-1 surface-border last-of-type:border-none gap-2 sm:gap-4">
            <div className="min-w-0 flex-shrink-0">
                <span className="text-600 font-medium block text-sm">{label}</span>
                {subtext && <span className="text-400 text-xs block mt-1">{subtext}</span>}
            </div>
            <div className="flex align-items-center gap-2 sm:justify-content-end min-w-0">
                {badge ? (
                    <span className={`bg-${badgeSeverity}-50 text-${badgeSeverity}-600 border-round-md px-2 py-1 text-xs font-semibold white-space-nowrap`}>{value}</span>
                ) : (
                    <span className="text-900 font-bold text-sm text-overflow-ellipsis overflow-hidden">{value}</span>
                )}
                {copyable && <i className="pi pi-copy text-400 cursor-pointer hover:text-700 transition-colors text-sm flex-shrink-0"></i>}
                {rightIcon && <i className={`pi ${rightIcon} text-400 cursor-pointer hover:text-700 transition-colors text-sm flex-shrink-0`}></i>}
            </div>
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <Toast ref={toast} />
                <PageHeader title={`${title} Management`} actionLabel="New" actionIcon="pi pi-plus" actionColor="primary" onActionClick={openNew} />

                <div className="mt-4">
                    <DataTable
                        value={users}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="custom-datatable"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        emptyMessage="No users found."
                        loading={loading}
                    >
                        <Column field="id" header="ID" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Name" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="mobile" header="Mobile" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="Email" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Status" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="mainbalance" header="Balance" sortable headerStyle={{ minWidth: '10rem' }} body={(rowData) => `₹ ${rowData.mainbalance}`}></Column>
                        <Column field="parent.name" header="Created By" sortable headerStyle={{ minWidth: '15rem' }} body={(rowData) => (rowData.parent ? rowData.parent.name : 'System')}></Column>
                        <Column
                            body={(rowData) => <Button icon="pi pi-info-circle" rounded outlined severity="info" onClick={() => viewUser(rowData)} tooltip="View Profile" tooltipOptions={{ position: 'top' }} />}
                            headerStyle={{ minWidth: '1rem' }}
                        ></Column>
                    </DataTable>
                </div>

                <Dialog visible={userDialog} style={{ width: '800px' }} header={`Add ${title}`} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <h5>Personal Info</h5>
                            <div className="field">
                                <label htmlFor="name">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                                {submitted && !user.name && <small className="p-invalid text-red-500">Name is required.</small>}
                            </div>
                            <div className="field mt-3">
                                <label htmlFor="mobile">
                                    Mobile <span className="text-red-500">*</span>
                                </label>
                                <InputText id="mobile" value={user.mobile} onChange={(e) => onInputChange(e, 'mobile')} required className={classNames({ 'p-invalid': submitted && !user.mobile })} />
                                {submitted && !user.mobile && <small className="p-invalid text-red-500">Mobile is required.</small>}
                            </div>
                            <div className="field mt-3">
                                <label htmlFor="email">Email</label>
                                <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} />
                            </div>

                            <h5 className="mt-5">Shop & Address</h5>
                            <div className="field">
                                <label htmlFor="shopname">
                                    Shop Name <span className="text-red-500">*</span>
                                </label>
                                <InputText id="shopname" value={user.shopname} onChange={(e) => onInputChange(e, 'shopname')} required className={classNames({ 'p-invalid': submitted && !user.shopname })} />
                                {submitted && !user.shopname && <small className="p-invalid text-red-500">Shop name is required.</small>}
                            </div>
                            <div className="field mt-3">
                                <label htmlFor="address">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <InputText id="address" value={user.address} onChange={(e) => onInputChange(e, 'address')} required className={classNames({ 'p-invalid': submitted && !user.address })} />
                            </div>
                            <div className="grid mt-2">
                                <div className="col-12 md:col-6 field">
                                    <label htmlFor="city">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <InputText id="city" value={user.city} onChange={(e) => onInputChange(e, 'city')} required className={classNames({ 'p-invalid': submitted && !user.city })} />
                                </div>
                                <div className="col-12 md:col-6 field">
                                    <label htmlFor="state">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <InputText id="state" value={user.state} onChange={(e) => onInputChange(e, 'state')} required className={classNames({ 'p-invalid': submitted && !user.state })} />
                                </div>
                            </div>
                            <div className="field mt-3">
                                <label htmlFor="pincode">
                                    Pincode <span className="text-red-500">*</span>
                                </label>
                                <InputText id="pincode" value={user.pincode} onChange={(e) => onInputChange(e, 'pincode')} required className={classNames({ 'p-invalid': submitted && !user.pincode })} />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>KYC Details</h5>
                            <div className="field">
                                <label htmlFor="aadharcard">
                                    Aadhar Card <span className="text-red-500">*</span>
                                </label>
                                <InputText id="aadharcard" value={user.aadharcard} onChange={(e) => onInputChange(e, 'aadharcard')} required className={classNames({ 'p-invalid': submitted && !user.aadharcard })} />
                                {submitted && !user.aadharcard && <small className="p-invalid text-red-500">Aadhar is required.</small>}
                            </div>
                            <div className="field mt-3">
                                <label htmlFor="pancard">
                                    PAN Card <span className="text-red-500">*</span>
                                </label>
                                <InputText id="pancard" value={user.pancard} onChange={(e) => onInputChange(e, 'pancard')} required className={classNames({ 'p-invalid': submitted && !user.pancard })} />
                                {submitted && !user.pancard && <small className="p-invalid text-red-500">PAN is required.</small>}
                            </div>

                            <h5 className="mt-5">Banking Details</h5>
                            <div className="field">
                                <label htmlFor="bankname">Bank Name</label>
                                <InputText id="bankname" value={user.bankname} onChange={(e) => onInputChange(e, 'bankname')} />
                            </div>
                            <div className="field mt-3">
                                <label htmlFor="accountnumber">Account Number</label>
                                <InputText id="accountnumber" value={user.accountnumber} onChange={(e) => onInputChange(e, 'accountnumber')} />
                            </div>
                            <div className="field mt-3">
                                <label htmlFor="ifsccode">IFSC Code</label>
                                <InputText id="ifsccode" value={user.ifsccode} onChange={(e) => onInputChange(e, 'ifsccode')} />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={viewDialog} style={{ width: '1000px', backgroundColor: '#f8f9fa' }} header={customHeader} closable={false} modal onHide={() => setViewDialog(false)} contentClassName="surface-ground pb-5 pt-4 px-4">
                    {user && (
                        <div>
                            {/* Top Metrics Row */}
                            <div className="grid mb-4">
                                <div className="col-12 md:col-3">
                                    <div className="surface-card border-round-xl p-3 shadow-1 border-1 surface-border h-full flex flex-column justify-content-between bg-white">
                                        <span className="text-500 text-xs font-semibold text-uppercase tracking-wide mb-2 block">Wallet Balance</span>
                                        <div className="flex align-items-center justify-content-between">
                                            <span className="text-3xl font-bold text-900">₹{user.mainbalance || '0.00'}</span>
                                            <Button label="+ Top Up" size="small" className="bg-blue-50 text-blue-600 border-none px-2 py-1 text-xs font-semibold border-round-md hover:bg-blue-100" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-3">
                                    <div className="surface-card border-round-xl p-3 shadow-1 border-1 surface-border h-full flex align-items-center gap-3 bg-white">
                                        <div className="flex align-items-center justify-content-center bg-green-50 border-round-md" style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                                            <i className="pi pi-shield text-green-500 text-xl"></i>
                                        </div>
                                        <div>
                                            <span className="text-500 text-xs font-semibold text-uppercase tracking-wide mb-1 block">KYC Verification</span>
                                            <span className="text-green-600 font-bold text-lg block text-capitalize">{user.kyc_status || 'Pending'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-3">
                                    <div className="surface-card border-round-xl p-3 shadow-1 border-1 surface-border h-full flex align-items-center gap-3 bg-white">
                                        <div className="flex align-items-center justify-content-center bg-indigo-50 border-round-md" style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                                            <i className="pi pi-chart-line text-indigo-500 text-xl"></i>
                                        </div>
                                        <div>
                                            <span className="text-500 text-xs font-semibold text-uppercase tracking-wide mb-1 block">Commission Scheme</span>
                                            <span className="text-900 font-bold text-lg block">{user.scheme_name || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 md:col-3">
                                    <div className="surface-card border-round-xl p-3 shadow-1 border-1 surface-border h-full flex align-items-center gap-3 bg-white">
                                        <div className="flex align-items-center justify-content-center bg-orange-50 border-round-md" style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                                            <i className="pi pi-user text-orange-500 text-xl"></i>
                                        </div>
                                        <div>
                                            <span className="text-500 text-xs font-semibold text-uppercase tracking-wide mb-1 block">Created By</span>
                                            <span className="text-900 font-bold text-lg block line-height-1 mt-1">{user.parent ? user.parent.name : 'SuperAdmin (System)'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Data Cards 2x2 Grid */}
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <DataCard icon="pi-user" title="Personal Info">
                                        <DetailRow label="Full Name" value={user.name || 'N/A'} />
                                        <DetailRow label="Mobile Number" value={`+91 ${user.mobile || 'N/A'}`} copyable />
                                        <DetailRow label="Email Address" value={user.email || 'N/A'} copyable />
                                        <DetailRow label="Access Role" value={user.role} badge badgeSeverity="indigo" />
                                        <DetailRow label="User Status" value={user.status} badge badgeSeverity="green" />
                                    </DataCard>
                                </div>

                                <div className="col-12 md:col-6">
                                    <DataCard icon="pi-building" title="Shop & Address">
                                        <DetailRow label="Shop / Enterprise Name" value={user.shopname || 'N/A'} />
                                        <DetailRow label="Street Address" value={user.address || 'N/A'} />
                                        <DetailRow label="City / District" value={user.city || 'N/A'} />
                                        <DetailRow label="State" value={user.state || 'N/A'} />
                                        <DetailRow label="Postal Code" value={user.pincode || 'N/A'} />
                                    </DataCard>
                                </div>

                                <div className="col-12 md:col-6 mt-3">
                                    <DataCard icon="pi-file" title="KYC Details">
                                        <DetailRow label="Aadhar Card" value={user.aadharcard || 'N/A'} />
                                        <DetailRow label="PAN Card" value={user.pancard || 'N/A'} />
                                    </DataCard>
                                </div>

                                <div className="col-12 md:col-6 mt-3">
                                    <DataCard icon="pi-credit-card" title="Banking Details">
                                        <DetailRow label="Bank Name" value={user.bankname || 'N/A'} rightIcon="pi-building text-indigo-500" />
                                        <DetailRow label="Account Number" value={user.accountnumber || 'N/A'} copyable />
                                        <DetailRow label="IFSC Code" value={user.ifsccode || 'N/A'} />
                                        <DetailRow label="Settlement Scheme" value={`${user.scheme_name || 'N/A'}`} badge badgeSeverity="indigo" />
                                    </DataCard>
                                </div>
                            </div>
                        </div>
                    )}
                </Dialog>
            </div>
        </div>
    );
};

export default UserManagementTable;
