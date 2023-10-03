import { useState } from "react";
import { Box, TextField, Typography, Grid, Paper, Button, Autocomplete, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Dataservice from "../dataservice/dataservice";
import { useEffect } from "react";
import Toast from "./Toast";

const CreateExtraEventButton = () => {
    const [extraEvent, setExtraEvent] = useState({
        Title: "",
        Type: "",
        UserId: null,
        Color: "blue",
        start: null,
        end: null,
    });
    const [profList, setProfList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Dataservice.getUser();

                const transformedEvents = response.map((event) => ({
                    label: event.name + " " + event.firstName,
                    id: event.id
                }));

                setProfList(transformedEvents);
            } catch (e) { }
        };
        fetchData();
    }, []);

    const AddExtraEvent = () => {
        Dataservice.AddExtraEvent(extraEvent).then((response) => {
            Toast.success("Préstation ajoutée avec succés");
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Paper sx={{ p: 4, maxWidth: 600, width: "100%" }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Créer une prestation exceptionnelle
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Titre"
                            value={extraEvent.Title}
                            onChange={(e) =>
                                setExtraEvent({ ...extraEvent, Title: e.target.value })
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Type"
                            value={extraEvent.Type}
                            onChange={(e) =>
                                setExtraEvent({ ...extraEvent, Type: e.target.value })
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-prof"
                            options={profList}
                            getOptionLabel={(option) => option.label} // Remplacez "nom" par le champ approprié pour afficher le nom du professeur
                            renderInput={(params) => <TextField {...params} label="Professeur" />}
                            onChange={(event, selectedProf) => {
                                if (selectedProf) {
                                    setExtraEvent({ ...extraEvent, UserId: selectedProf.id }); // Remplacez "id" par le champ approprié pour l'ID du professeur
                                }
                            }}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Classe</InputLabel>
                        <Select value={extraEvent.Color}  onChange={(e) =>
                                setExtraEvent({ ...extraEvent, Color: e.target.value })
                            }>
                            <MenuItem value="blue">Halbardiers</MenuItem>
                            <MenuItem value="red">Diables</MenuItem>
                            <MenuItem value="green">Chinchins</MenuItem>
                            <MenuItem value="gray">Accueil</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}  locale="fr">
                            <DateTimePicker
                                label="Date et heure du début"
                                value={extraEvent.start}
                                onChange={(date) =>
                                    setExtraEvent({ ...extraEvent, start: date })
                                }
                                format="DD/MM/YYYY HH:mm"
                                views={["day", "hours", "minutes"]}
                                ampm={false}
                                fullWidth
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}  locale="fr">
                            <DateTimePicker
                                label="Date et heure de fin"
                                value={extraEvent.end}
                                onChange={(date) => setExtraEvent({ ...extraEvent, end: date })}
                                ampm={false}
                                format="DD/MM/YYYY HH:mm"
                                views={["day", "hours", "minutes"]}
                                fullWidth
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={AddExtraEvent} variant="contained">
                            Créer une préstation Exceptionnelle
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default CreateExtraEventButton;
