'use client';
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { userService } from '../../../services/user.service';

interface UserManagementTableProps {
    role: string;
    title: string;
}

const UserManagementTable = ({ role, title }: UserManagementTableProps) => {
    const emptyUser = {
        name: '',
        mobile: '',
        email: ''
    };

    const [users, setUsers] = useState<any[]>([]);
    const [userDialog, setUserDialog] = useState(false);
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

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveUser} />
        </React.Fragment>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        value={users}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
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
                        <Column field="created_by" header="Created By" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={userDialog} style={{ width: '450px' }} header={`Add ${title}`} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                            {submitted && !user.name && <small className="p-invalid text-red-500">Name is required.</small>}
                        </div>
                        <div className="field mt-3">
                            <label htmlFor="mobile">Mobile</label>
                            <InputText id="mobile" value={user.mobile} onChange={(e) => onInputChange(e, 'mobile')} required className={classNames({ 'p-invalid': submitted && !user.mobile })} />
                            {submitted && !user.mobile && <small className="p-invalid text-red-500">Mobile is required.</small>}
                        </div>
                        <div className="field mt-3">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default UserManagementTable;
