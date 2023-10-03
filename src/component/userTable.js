import React, { useEffect, useState } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Paper, Select, MenuItem, Button } from '@mui/material';
import AddUser from './AddUser';
import Dataservice from '../dataservice/dataservice';
import Toast from './Toast';

const UserTable = () => {
    const [rows, setRows] = useState([]);
    const [roles, setRoles] = useState([]);

    const columns = [
        { field: 'name', headerName: 'Nom', flex: 1, minWidth: 100 },
        { field: 'firstName', headerName: 'Prénom', flex: 1, minWidth: 100 },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
        { field: 'startingDate', headerName: 'Date début', flex: 1, minWidth: 150 },
        {
            field: 'roleId',
            headerName: 'Role',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <Select
                    value={params.value}
                    onChange={(event) => handleRoleChange(params.id, event.target.value)}
                    defaultValue={params.row.role || ''} 
                >
                    {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                            {role.name}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
        { 
            field: 'resetPassword', 
            headerName: 'Réinitialiser mot de passe', 
            flex: 1, 
            minWidth: 200,
            renderCell: (params) => (
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleResetPassword(params.id)}
                >
                    Réinitialiser
                </Button>
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Dataservice.getUser();

                const transformedEvents = response.map((user) => ({
                    id: user.id,
                    name: user.name,
                    firstName: user.firstName,
                    email: user.email,
                    startingDate: user.startingDate,
                    roleId : user.roleId,
                }));
                setRows(transformedEvents);

                const roleResponse = await Dataservice.GetAllRole();

                const transformedRoles = roleResponse.data.map((role) => ({
                    id: role.id,
                    name: role.name,
                }));

                setRoles(transformedRoles);
            } catch (e) {
                console.error(e);
            }
        };

        fetchData();
    }, []);

    const handleRoleChange = async (id, newRoleId) => {
        const updatedRows = rows.map((row) =>
            row.id === id ? { ...row, roleId: newRoleId } : row
        );
        setRows(updatedRows);

        try {
            const user = updatedRows.find((row) => row.id === id);

            var entity = {
                id: user.id,
                roleId: user.roleId
            };
            await Dataservice.changeRole(entity);
            Toast.success("Rôle changé avec succés");
        } catch (error) {
            console.error('Error updating role:', error);
            Toast.error("Erreur lors de la mise à jour du rôle");
        }
    };

    const handleResetPassword = (id) => {
        Dataservice.ResetPassword(id).then(()=>{
            Toast.success("Mail de réinitialisation de mot de passe envoyé");
        })
        .catch(()=>{    
            Toast.error("Erreur lors de l'envoie du mail");
        });
        
    };

    return (
        <div style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
            <Paper>
                <AddUser />
                <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    editMode="row"
                    onEditCellChangeCommitted={handleRoleChange}
                />
            </Paper>
        </div>
    );
};

export default UserTable;
