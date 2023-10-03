import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dataservice from '../dataservice/dataservice';
import Toast from './Toast';

const Role = () => {
  const [tabValue, setTabValue] = useState(0);
  const [role, setRole] = useState({ name: '', income: '' });
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolesList, setRolesList] = useState([]);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    Dataservice.GetAllRole().then((response) => {
      setRolesList(response.data);
    });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setRole((prevRole) => ({
      ...prevRole,
      [name]: value
    }));
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setEditingRole(role);
    setTabValue(1);
  };

  const handleUpdateRole = () => {
    if (editingRole) {
      Dataservice.updateRoles(editingRole)
        .then((response) => {
          Toast.success("Rôle mis à jour avec succès");
          setRolesList((prevRolesList) => {
            return prevRolesList.map((role) =>
              role.id === editingRole.id ? editingRole : role
            );
          });
          setSelectedRole(null);
        })
        .catch((error) => {
          Toast.error("Erreur lors de la mise à jour du rôle");
          console.error(error);
        });
    }
  };

  const handleCreateRole = () => {
    setRolesList((prevRolesList) => {
      const updatedList = Array.isArray(prevRolesList) ? [...prevRolesList] : [];
      updatedList.push(role);
      return updatedList;
    });

    Dataservice.CreateRole(role)
      .then((response) => {
        Toast.success("Rôle créé avec succès");
      })
      .catch((error) => {
        Toast.error("Erreur lors de la création du rôle");
        console.error(error);
      });
  };

  return (
    <>
      <Box sx={{ width: '500px', mx: 'auto', mt: '50px', maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Créer un rôle" />
          <Tab label="Mettre à jour un rôle" />
        </Tabs>

        <Box
          sx={{ p: 3, border: '1px solid lightgray', borderTop: 'none' }}
          hidden={tabValue !== 0}
        >
          <TextField
            label="Name"
            name="name"
            value={role.name}
            onChange={handleFieldChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Income"
            name="income"
            value={role.income}
            onChange={handleFieldChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleCreateRole}>
            Créer
          </Button>
        </Box>

        <Box
          sx={{ p: 3, border: '1px solid lightgray', borderTop: 'none' }}
          hidden={tabValue !== 1}
        >
          {rolesList && rolesList.length > 0 ? (
            rolesList.map((r) => (
              <Box key={r.name} sx={{ mb: 2 }}>
                <Button onClick={() => handleSelectRole(r)}>Modifier</Button>
                <TextField
                  label="Name"
                  name="name"
                  value={editingRole && editingRole.id === r.id ? editingRole.name : r.name}
                  onChange={(e) =>
                    setEditingRole((prevEditingRole) => {
                      if (prevEditingRole && prevEditingRole.id === r.id) {
                        return {
                          ...prevEditingRole,
                          name: e.target.value,
                        };
                      }
                      return prevEditingRole;
                    })
                  }
                  fullWidth
                  margin="normal"
                  disabled={editingRole && editingRole.id === r.id ? false : true}
                />
                <TextField
                  label="Income"
                  name="income"
                  value={editingRole && editingRole.id === r.id ? editingRole.income : r.income}
                  onChange={(e) =>
                    setEditingRole((prevEditingRole) => {
                      if (prevEditingRole && prevEditingRole.id === r.id) {
                        return {
                          ...prevEditingRole,
                          income: e.target.value,
                        };
                      }
                      return prevEditingRole;
                    })
                  }
                  fullWidth
                  margin="normal"
                  disabled={editingRole && editingRole.id === r.id ? false : true}
                />
                <Button
                  variant="contained"
                  onClick={() => { handleUpdateRole(); setEditingRole(null); }}
                  disabled={selectedRole && selectedRole.id === r.id ? false : true}
                >
                  Appliquer
                </Button>
              </Box>
            ))
          ) : (
            <Box sx={{ fontStyle: 'italic', color: 'gray' }}>
              Aucun rôle trouvé.
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Role;
