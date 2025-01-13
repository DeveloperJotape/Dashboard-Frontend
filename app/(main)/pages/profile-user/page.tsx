/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Project } from '@/types';
import { ProfileUserService } from '@/service/ProfileUserService';

const ProfileUser = () => {
    let emptyProfileUser: Project.ProfileUser = {
        id: 0,
        description: ''
    };

    const [profileUsers, setProfileUsers] = useState<Project.ProfileUser[] | null>([]);
    const [profileUserDialog, setProfileUserDialog] = useState(false);
    const [deleteProfileUserDialog, setDeleteProfileUserDialog] = useState(false);
    const [deleteProfileUsersDialog, setDeleteProfileUsersDialog] = useState(false);
    const [profileUser, setProfileUser] = useState<Project.ProfileUser>(emptyProfileUser);
    const [selectedProfileUsers, setSelectedProfileUsers] = useState<Project.ProfileUser[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const profileUserService = useMemo(() => new ProfileUserService(), []);

    useEffect(() => {
        if (!profileUsers) {
            /* Conexão com BD */
            profileUserService
                .findAll()
                .then((response) => {
                    console.log(response.data);
                    setProfileUsers(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [profileUserService, profileUsers]);

    const openNew = () => {
        setProfileUser(emptyProfileUser);
        setSubmitted(false);
        setProfileUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProfileUserDialog(false);
    };

    const hideDeleteProfileUserDialog = () => {
        setDeleteProfileUserDialog(false);
    };

    const hideDeleteProfileUsersDialog = () => {
        setDeleteProfileUsersDialog(false);
    };

    const saveProfileUser = () => {
        setSubmitted(true);
        if (!profileUser.id) {
            profileUserService
                .save(profileUser)
                .then((response) => {
                    setProfileUserDialog(false);
                    setProfileUser(emptyProfileUser);
                    setProfileUsers(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Perfil cadastrado com sucesso!',
                        life: 3000
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao salvar!',
                        life: 3000
                    });
                });
        } else {
            profileUserService
                .update(profileUser.id, profileUser)
                .then((response) => {
                    setProfileUserDialog(false);
                    setProfileUser(emptyProfileUser);
                    setProfileUsers(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Perfil atualizado com sucesso!',
                        life: 3000
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao atualizar!<br>' + error.data.message,
                        life: 3000
                    });
                });
        }
    };

    const editProfileUser = (profileUser: Project.ProfileUser) => {
        setProfileUser({ ...profileUser });
        setProfileUserDialog(true);
    };

    const confirmDeleteProfileUser = (profileUser: Project.ProfileUser) => {
        setProfileUser(profileUser);
        setDeleteProfileUserDialog(true);
    };

    const deleteProfileUser = () => {
        if (profileUser.id) {
            profileUserService
                .delete(profileUser.id)
                .then((response) => {
                    setDeleteProfileUserDialog(false);
                    setProfileUser(emptyProfileUser);
                    setProfileUsers(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Perfil excluído!',
                        life: 3000
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erroao deletar recurso!<br>' + error.data.message,
                        life: 3000
                    });
                });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProfileUsersDialog(true);
    };

    const deleteSelectedProfileUsers = () => {
        Promise.all(
            selectedProfileUsers.map(async (_profileUser) => {
                if (_profileUser.id) {
                    await profileUserService.delete(_profileUser.id);
                }
            })
        )
            .then((response) => {
                setProfileUsers(null);
                setSelectedProfileUsers([]);
                setDeleteProfileUsersDialog(false);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Perfils excluídos com sucesso!',
                    life: 3000
                });
            })
            .catch((error) => {
                console.log(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao excluir perfis!<br>' + error.data.message,
                    life: 3000
                });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, description: string) => {
        const val = (e.target && e.target.value) || '';
        let _profileUser = { ...profileUser };
        _profileUser[`${description}`] = val;

        setProfileUser(_profileUser);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProfileUsers || !(selectedProfileUsers as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Project.ProfileUser) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: Project.ProfileUser) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.description}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Project.ProfileUser) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProfileUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProfileUser(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciar perfis</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Procurar..." />
            </span>
        </div>
    );

    const profileUserDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveProfileUser} />
        </>
    );
    const deleteProfileUserDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteProfileUserDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteProfileUser} />
        </>
    );
    const deleteProfileUsersDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteProfileUsersDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedProfileUsers} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={profileUsers}
                        selection={selectedProfileUsers}
                        onSelectionChange={(e) => setSelectedProfileUsers(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} perfis"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum recurso encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Descrição" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/*<Column field="login" header="Login" sortable body={loginBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>*/}

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={profileUserDialog} style={{ width: '450px' }} header="Detalhes do recurso" modal className="p-fluid" footer={profileUserDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputText
                                id="description"
                                value={profileUser.description}
                                onChange={(e) => onInputChange(e, 'description')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !profileUser.description
                                })}
                            />
                            {submitted && !profileUser.description && <small className="p-invalid">Descrição é obrigatória!</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProfileUserDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProfileUserDialogFooter} onHide={hideDeleteProfileUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {profileUser && (
                                <span>
                                    Você realmente deseja deletar <b>{profileUser.description}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProfileUsersDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProfileUsersDialogFooter} onHide={hideDeleteProfileUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {profileUser && <span>Você realmente deseja deletar os perfis selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ProfileUser;
