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
import { EnterpriseProfileService } from '@/service/EnterpriseProfileService';

const EnterpriseProfile = () => {
    let emptyEnterpriseProfile: Project.EnterpriseProfile = {
        id: 0,
        description: ''
    };

    const [enterpriseProfiles, setEnterpriseProfiles] = useState<Project.EnterpriseProfile[] | null>([]);
    const [enterpriseProfileDialog, setEnterpriseProfileDialog] = useState(false);
    const [deleteEnterpriseProfileDialog, setDeleteEnterpriseProfileDialog] = useState(false);
    const [deleteEnterpriseProfilesDialog, setDeleteEnterpriseProfilesDialog] = useState(false);
    const [enterpriseProfile, setEnterpriseProfile] = useState<Project.EnterpriseProfile>(emptyEnterpriseProfile);
    const [selectedEnterpriseProfiles, setSelectedEnterpriseProfiles] = useState<Project.EnterpriseProfile[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const enterpriseProfileService = useMemo(() => new EnterpriseProfileService(), []);

    useEffect(() => {
        if (!enterpriseProfiles) {
            /* Conexão com BD */
            enterpriseProfileService
                .findAll()
                .then((response) => {
                    console.log(response.data);
                    setEnterpriseProfiles(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [enterpriseProfileService, enterpriseProfiles]);

    const openNew = () => {
        setEnterpriseProfile(emptyEnterpriseProfile);
        setSubmitted(false);
        setEnterpriseProfileDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEnterpriseProfileDialog(false);
    };

    const hideDeleteEnterpriseProfileDialog = () => {
        setDeleteEnterpriseProfileDialog(false);
    };

    const hideDeleteEnterpriseProfilesDialog = () => {
        setDeleteEnterpriseProfilesDialog(false);
    };

    const saveEnterpriseProfile = () => {
        setSubmitted(true);
        if (!enterpriseProfile.id) {
            enterpriseProfileService
                .save(enterpriseProfile)
                .then((response) => {
                    setEnterpriseProfileDialog(false);
                    setEnterpriseProfile(emptyEnterpriseProfile);
                    setEnterpriseProfiles(null);
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
            enterpriseProfileService
                .update(enterpriseProfile.id, enterpriseProfile)
                .then((response) => {
                    setEnterpriseProfileDialog(false);
                    setEnterpriseProfile(emptyEnterpriseProfile);
                    setEnterpriseProfiles(null);
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

    const editEnterpriseProfile = (enterpriseProfile: Project.EnterpriseProfile) => {
        setEnterpriseProfile({ ...enterpriseProfile });
        setEnterpriseProfileDialog(true);
    };

    const confirmDeleteEnterpriseProfile = (enterpriseProfile: Project.EnterpriseProfile) => {
        setEnterpriseProfile(enterpriseProfile);
        setDeleteEnterpriseProfileDialog(true);
    };

    const deleteEnterpriseProfile = () => {
        if (enterpriseProfile.id) {
            enterpriseProfileService
                .delete(enterpriseProfile.id)
                .then((response) => {
                    setDeleteEnterpriseProfileDialog(false);
                    setEnterpriseProfile(emptyEnterpriseProfile);
                    setEnterpriseProfiles(null);
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
        setDeleteEnterpriseProfilesDialog(true);
    };

    const deleteSelectedEnterpriseProfiles = () => {
        Promise.all(
            selectedEnterpriseProfiles.map(async (_enterpriseProfile) => {
                if (_enterpriseProfile.id) {
                    await enterpriseProfileService.delete(_enterpriseProfile.id);
                }
            })
        )
            .then((response) => {
                setEnterpriseProfiles(null);
                setSelectedEnterpriseProfiles([]);
                setDeleteEnterpriseProfilesDialog(false);
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
        let _enterpriseProfile = { ...enterpriseProfile };
        _enterpriseProfile[`${description}`] = val;

        setEnterpriseProfile(_enterpriseProfile);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedEnterpriseProfiles || !(selectedEnterpriseProfiles as any).length} />
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

    const idBodyTemplate = (rowData: Project.EnterpriseProfile) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: Project.EnterpriseProfile) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.description}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Project.EnterpriseProfile) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editEnterpriseProfile(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteEnterpriseProfile(rowData)} />
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

    const enterpriseProfileDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveEnterpriseProfile} />
        </>
    );
    const deleteEnterpriseProfileDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteEnterpriseProfileDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteEnterpriseProfile} />
        </>
    );
    const deleteEnterpriseProfilesDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteEnterpriseProfilesDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedEnterpriseProfiles} />
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
                        value={enterpriseProfiles}
                        selection={selectedEnterpriseProfiles}
                        onSelectionChange={(e) => setSelectedEnterpriseProfiles(e.value as any)}
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

                    <Dialog visible={enterpriseProfileDialog} style={{ width: '450px' }} header="Detalhes do recurso" modal className="p-fluid" footer={enterpriseProfileDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputText
                                id="description"
                                value={enterpriseProfile.description}
                                onChange={(e) => onInputChange(e, 'description')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !enterpriseProfile.description
                                })}
                            />
                            {submitted && !enterpriseProfile.description && <small className="p-invalid">Descrição é obrigatória!</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteEnterpriseProfileDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteEnterpriseProfileDialogFooter} onHide={hideDeleteEnterpriseProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {enterpriseProfile && (
                                <span>
                                    Você realmente deseja deletar <b>{enterpriseProfile.description}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteEnterpriseProfilesDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteEnterpriseProfilesDialogFooter} onHide={hideDeleteEnterpriseProfilesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {enterpriseProfile && <span>Você realmente deseja deletar os perfis selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseProfile;
