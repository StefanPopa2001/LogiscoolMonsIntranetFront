import React, { useState } from 'react';
import { Button, ButtonGroup, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Dataservice from '../dataservice/dataservice';
import Toast from './Toast';

const AddUser = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    firstName: '',
    startingDate: null,
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // Vérifier que tous les champs sont remplis
    if (formData.email && formData.name && formData.firstName && formData.startingDate) {
      Dataservice.AddUser(formData)
        .then((response) => {
          Toast.success("Compte créé avec succès. Un email a été envoyé à " + formData.email);
          setOpen(false);
        })
        .catch((error) => {
          const errorMessage = error.response.data;
          Toast.error(errorMessage);
        });
    } else {
      Toast.error("Veuillez remplir tous les champs");
    }
  };
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      startingDate: date,
    }));
  };

  return (
    <div>
      <ButtonGroup variant="outlined" aria-label="outlined button group" style={{ marginTop: "1em", marginBottom: "1em" }}>
        <Button onClick={handleClickOpen}>Ajouter un utilisateur</Button>
      </ButtonGroup>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter un utilisateur</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Nom" name="name" value={formData.name} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} locale="fr">
                <DateTimePicker
                  label="Date de début"
                  value={formData.startingDate}
                  onChange={handleDateChange}
                  views={["day", "hours", "minutes"]}
                  ampm={false}
                  format="DD/MM/YYYY HH:mm"
                  fullWidth
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Annuler</Button>
          <Button onClick={handleSave} color="primary">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddUser;
