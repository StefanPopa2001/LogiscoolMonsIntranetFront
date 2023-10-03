import {Divider, Grid} from "@mui/material";
import React from "react";
import Public_calendar from "../component/PublicCalendar";

const calendar = () =>{
    return(
        <>
            <Grid container spacing={2}>
                <Grid item xs={10} style={{ margin: "auto" }}>
                    <h1 style={{ textAlign: "center" }}>Calendrier Logiscool</h1>
                    <Divider></Divider>
                    <Grid item xs={10} style={{ margin: "auto" }}>
                    </Grid>
                </Grid>
            </Grid>

            <Public_calendar/>

        </>
    )
}

export default calendar