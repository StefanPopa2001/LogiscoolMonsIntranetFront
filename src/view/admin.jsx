import React from 'react';
import {Button, ButtonGroup, Divider, Grid} from "@mui/material";
import {Link, Outlet} from "react-router-dom";

const Admin = () => {
    return(
        <Grid container spacing={2}>
            <Grid item xs={10} style={{ margin: "auto" }}>
                <h1 style={{ textAlign: "center" }}>Admin</h1>
                <Divider/>
                <Grid item xs={10} style={{ margin: "auto" }}>

                    <ButtonGroup  variant="outlined" aria-label="outlined button group" style={{marginTop:"1em",marginBottom:"1em"}}>
                        <Link to="assignations"><Button>Assignations</Button></Link>
                        <Link to="conges"><Button>Congés</Button></Link>
                        <Link to="createEvent"><Button>Créer un évènement</Button></Link>
                        <Link to="userTable"><Button>Gérer le personnel</Button></Link>
                        <Link to="extraEvent"><Button>Ajouter une préstation exceptionnelle</Button></Link>
                        <Link to="Role"><Button>Gérer les roles</Button></Link>
                        <Link to="ParametresAdministrateur"><Button>Paramètres</Button></Link>
                        <Link to="StudentList"><Button>Etudiants</Button></Link>
                    </ButtonGroup>

                    <Outlet/>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Admin;
