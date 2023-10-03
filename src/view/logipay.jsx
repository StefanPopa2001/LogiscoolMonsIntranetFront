import Public_calendar from "../component/PublicCalendar";
import {Divider, Grid} from "@mui/material";
import React from "react";
import LogipayCalendar from "../component/LogipayCalendar";

const Logipay = () =>{
    return(
        <>
            <Grid container spacing={2}>
                <Grid item xs={10} style={{ margin: "auto" }}>
                    <h1 style={{ textAlign: "center" }}>Logipay</h1>
                    <Divider></Divider>
                    <Grid item xs={10} style={{ margin: "auto" }}>
                    </Grid>
                </Grid>
            </Grid>

            <LogipayCalendar/>

        </>
    )
}

export default Logipay