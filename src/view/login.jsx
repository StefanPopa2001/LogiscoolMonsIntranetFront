import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Toast from '../component/Toast';
import dataservice from "../dataservice/dataservice";
import Dataservice from "../dataservice/dataservice";

function SignInSide({ setToken }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (loginPayload) => {
    login(loginPayload, navigate);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const email = data.get('email');
    const password = data.get('password');

    if (!email || !password) {
      Toast.error('Mot de passe ou email manquant, ré-essaie');
      return;
    }

    const loginPayload = {
      email,
      mdp: password,
    };

    await handleLogin(loginPayload);
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(./logolmi.png)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} />
            <Typography component="h1" variant="h5">
              Connexion
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Adresse mail"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Se souvenir de moi"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Connexion'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Mot de passe oublié?
                  </Link>
                </Grid>
              </Grid>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
                {'Copyright © '}
                <Link color="inherit" href="#">
                  Logiscool Mons Intranet
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

const login = async (loginPayload, navigate) => {
    const API_URL = 'https://localhost:7152/api/Authentication';

    try {
        const response = await axios.post(API_URL + '/login', loginPayload);
        const token = response.data;

        // Set the cookie
        document.cookie = `AUTH_COOKIE=${token}; path=/`; 

        Toast.success("Connexion réussie !");

        Dataservice.getAdminSettings().then(settings=>{
            localStorage.setItem("AdminSettings",JSON.stringify(settings.data))
        })



        navigate('/Accueil');
    } catch (error) {
        Toast.error("E-mail ou mot de passe incorrect, ré-essaie");
    }
};

export default SignInSide;
