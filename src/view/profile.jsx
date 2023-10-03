import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  CardMedia,
  Divider,
  Badge,
  Tooltip,
  InputAdornment
} from "@mui/material";
import Dataservice from "../dataservice/dataservice";
import Personal_calendar from "../component/personal_calendar";
import UpdatePassword from "../component/UpdatePassword";
import Avatar from "@mui/material/Avatar";
import dataservice from "../dataservice/dataservice";
import Toast from "../component/Toast";
import {deepPurple} from "@mui/material/colors";
import {AccountCircle} from "@mui/icons-material";
import CakeIcon from '@mui/icons-material/Cake';
import EmailIcon from '@mui/icons-material/Email';

const Profile = () => {

  const [pfpImage, setPfpImage] = useState(null);
  const [user, setUser] = useState({});
  const [hover, setHover] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roleResponse = await Dataservice.GetAllRole();

        const transformedRoles = roleResponse.data.map((role) => ({
          id: role.id,
          name: role.name,
        }));

        setRoles(transformedRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);



  useEffect(() => {
    const findRoleName = () => {
      const role = roles.find(item => item.id === user.roleId);
      if (role) {
        setRoleName(role.name);
      }
    };

    findRoleName();
  }, [user.roleId, roles]);

  const handleHover = () => {
    setHover(!hover);
  };

  const handlePfpUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Strip out the data URL scheme declaration
      const base64String = reader.result.replace(/^data:.+;base64,/, "");

      const newPfpImage = {
        image: base64String,
        imageMimeType: file.type,
      };

      setPfpImage(newPfpImage);

      const eventData = {
        Image: newPfpImage.image,
        ImageMimeType: newPfpImage.imageMimeType,
      };

      dataservice.updateProfilePicture(eventData)
          .then((response) => {
            Toast.success("Image changée avec succés (que vous êtes beau)")
            setUser(prevState => ({
              ...prevState,
              image: newPfpImage.image,
              mimeType: newPfpImage.imageMimeType
            }));
          })
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Dataservice.GetUserConnected();
        setUser(response.data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (

      <Grid container spacing={2}>
        <Grid item xs={12} sm={10} style={{ margin: "auto" }}>
          <h1 style={{ textAlign: "center" }}>My Logi-Profile</h1>
          <Divider></Divider>
          <Grid container style={{ marginTop: "1em", justifyContent: 'center' }}>
            <Grid item xs={12} sm={3}>
              <Paper elevation={3} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label htmlFor="raised-button-file">

                  <Tooltip title="Importer une photo de profil" >
                    <Avatar
                        alt="My profile pic"
                        src={`data:image/${user.mimeType};base64,${user.image}`}
                        sx={{ width: 112, height: 112, margin: "auto", '&:hover': {
                            filter: 'brightness(0.6)',
                            cursor:'Pointer'}}}
                        style={{ marginTop: "1em", alignSelf: 'center' }}
                    />
                  </Tooltip>


                  <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="raised-button-file"
                      type="file"
                      onChange={handlePfpUpload}
                  />

                </label>

                <TextField
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                      ),
                    }}
                    disabled
                    id="outlined-disabled"
                    value={roleName?roleName:"Aucun rôle précisé"}
                    style={{ marginTop: "1em", width: '80%' }}
                    label="Rôle"
                />

                <TextField
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                      ),
                    }}
                    label="Nom"
                    disabled
                    id="outlined-disabled"
                    value={user.name || ""}
                    style={{ marginTop: "1em", width: '80%' }}
                />
                <TextField
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                      ),
                    }}
                    label="Prénom"
                    disabled
                    id="outlined-disabled"
                    value={user.firstName || ""}
                    style={{ marginTop: "1em", width: '80%' }}
                />
                <TextField
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                      ),
                    }}
                    label="Email"
                    disabled
                    id="outlined-disabled"
                    value={user.email || ""}
                    style={{ marginTop: "1em", width: '80%' }}
                />
                <TextField
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <CakeIcon />
                          </InputAdornment>
                      ),
                    }}
                    label="Expérience"
                    disabled
                    id="outlined-disabled"
                    value={
                        Math.floor(
                            (Date.now() - new Date(user.startingDate || "")) /
                            (1000 * 60 * 60 * 24)
                        ) + " Jours à Logiscool"
                    }
                    style={{ marginTop: "1em", width: '80%', marginBottom:"1em" }}
                />
                <UpdatePassword/>
              </Paper>

            </Grid>

            <Grid item xs={12} sm={8} style={{ margin: "0 auto", textAlign: "center" }}>
              <Paper elevation={2}>
                <Grid container>
                  <Personal_calendar />
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
}

export default Profile;
