import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import 'dayjs/locale/fr'; // import French locale
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import Dataservice from "../dataservice/dataservice";
import moment from "moment/moment";
import utc from 'dayjs/plugin/utc';
import SaveIcon from "@mui/icons-material/Save";
import dataservice from "../dataservice/dataservice";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";


dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);

dayjs.locale('fr');

const AdminSettings = () => {
    const [calendarStartingDate, setCalendarStartingDate] = useState(null);
    const [calendarNumberOfMonths, setCalendarNumberOfMonths] = useState('');
    const [calendarFirstWeek, setCalendarFirstWeek] = useState(null);
    let updatedDate = {}

    const handleSetData = () =>{

        const data = {
            "calendarStartingDate": calendarStartingDate,
            "calendarNumberOfMonths": calendarNumberOfMonths,
            "calendarWeeksStartingDate": calendarFirstWeek
        }

        dataservice.setAdminSettings(data).then(

            localStorage.setItem("AdminSettings",JSON.stringify(data))

        )
    }

    // Fetching the settings
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Dataservice.getAdminSettings();
                const startingDate = dayjs.utc(response.data.calendarStartingDate);
                const firstWeek = dayjs.utc(response.data.firstWeek);
                setCalendarStartingDate(startingDate);
                setCalendarFirstWeek(firstWeek);
                setCalendarNumberOfMonths(response.data.calendarNumberOfMonths)
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleCalendarStartingDateChange = (date) => {
        setCalendarStartingDate(dayjs(date).toISOString());
    };

    const handleCalendarFirstWeekChange = (date) => {
        setCalendarFirstWeek(dayjs(date).toISOString());
    };

    const localeMap = {
        fr: {
            firstDayOfWeek: 1,
        },
    };

    const frenchLocale = {
        ...dayjs.localeData(),
        firstDayOfWeek: () => localeMap.fr.firstDayOfWeek,
    };

    return (
        <div>
            <Button
                color="success"
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handleSetData}
            >
                Sauvegarder
            </Button>
            <Paper sx={{ p: 4, maxWidth: 600, width: '100%' }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Paramètres globaux
                </Typography>

                <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                    Paramètres calendrier congés
                </Typography>
                <Grid container spacing={2}>
                    <Tooltip
                        placement={'top'}
                        title={
                            'Vous devez sélectionner une date. Le mois de cette date représentera le mois de départ affiché dans le calendrier de la gestion des congés.'
                        }
                    >
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} locale={frenchLocale}>
                                <DateTimePicker
                                    label="Mois de départ"
                                    value={calendarStartingDate}
                                    onChange={handleCalendarStartingDateChange}
                                    views={['day', 'month','year']}
                                    format="DD/MM/YYYY"
                                    fullWidth
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Tooltip>

                    <Grid item xs={12} sm={6}>
                        <Tooltip
                            title={
                                'Vous devez entrer un nombre. Ce nombre représente la quantité de mois qui sera affichée dans le calendrier de gestion des congés après le mois de départ. Si le mois de départ est Janvier et que le nombre de mois vaut 2, alors le calendrier aura 3 mois, de Janvier à Mars.'
                            }
                        >
                            <TextField
                                label="Nombre de mois"
                                onChange={(e) => setCalendarNumberOfMonths(e.target.value)}
                                value={calendarNumberOfMonths}
                            />
                        </Tooltip>
                    </Grid>
                </Grid>

                <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                    Paramètres calendrier général
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Tooltip
                            title={
                                'Vous devez choisir une date. La semaine de cette date correspondra à la première des 15 semaines de cours.'
                            }
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs} locale={frenchLocale}>
                                <DateTimePicker
                                    label="Semaine de départ"
                                    value={calendarFirstWeek}
                                    onChange={handleCalendarFirstWeekChange}
                                    views={['day','month','year']}
                                    format="DD/MM/YYYY"
                                    fullWidth
                                />
                            </LocalizationProvider>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default AdminSettings;
