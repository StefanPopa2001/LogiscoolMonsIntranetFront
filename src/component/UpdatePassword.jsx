import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Checkbox, Typography } from '@mui/material';
import Toast from './Toast';
import Dataservice from '../dataservice/dataservice';

const UpdatePassword = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    password1: '',
    password2: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialCharacter, setHasSpecialCharacter] = useState(false);
  const [hasMinimumLength, setHasMinimumLength] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Password validation
    const password = value;
    const isValidPassword = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setHasNumber(hasNumber);
    setHasSpecialCharacter(hasSpecialCharacter);
    setHasMinimumLength(isValidPassword);
    setIsPasswordValid(isValidPassword && hasNumber && hasSpecialCharacter);
  };

  const handleSave = () => {
    if (formData.password1 !== formData.password2) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      setShowPasswordError(true);
      return;
    }

    if (!isPasswordValid) {
      setPasswordError('Le mot de passe ne respecte pas les critères de validation.');
      setShowPasswordError(true);
      return;
    }

    setPasswordError('');
    setShowPasswordError(false);

    // Hash the password
    const hashedPassword = "d"//bcrypt.hashSync(formData.password1, 10);

    Dataservice.UpdatePassword(hashedPassword)
      .then((response) => {
        Toast.success('Mot de passe mis à jour avec succès.');
        handleCloseModal();
      })
      .catch((error) => {
        const errorMessage = error.response.data;
        Toast.error(errorMessage);
      });
    handleCloseModal();
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpenModal} style={{ marginBottom: '1em' }}>
        Changer mon mot de passe
      </Button>

      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Changement de mot de passe</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={hasNumber} />}
            label="Contient un chiffre"
          />
          <FormControlLabel
            control={<Checkbox checked={hasSpecialCharacter} />}
            label="Contient un caractère spécial"
          />
          <FormControlLabel
            control={<Checkbox checked={hasMinimumLength} />}
            label="A une longueur minimale de 8 caractères"
          />
          {showPasswordError && (
            <Typography variant="body2" color="error" style={{ marginBottom: '1em' }}>
              {passwordError}
            </Typography>
          )}
          <TextField
            label="Mot de passe"
            type="password"
            name="password1"
            value={formData.password1}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Répéter votre mot de passe"
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Annuler</Button>
          <Button onClick={handleSave} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdatePassword;
