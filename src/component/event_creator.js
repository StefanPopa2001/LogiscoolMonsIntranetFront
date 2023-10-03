import { useState } from "react";
import { Box, Button, TextField, Typography, Grid, Paper, CardMedia } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import Dataservice from "../dataservice/dataservice";
import Toast from "./Toast";

const EventCreator = () => {
    const [eventTitle, setEventTitle] = useState("");
    const [eventSubtitle, setEventSubtitle] = useState("");
    const [eventStartTime, setEventStartTime] = useState(null);
    const [eventEndTime, setEventEndTime] = useState(null);
    const [eventLocation, setEventLocation] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventImage, setEventImage] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(""); // New state for storing the selected file name

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            // Strip out the data URL scheme declaration
            const base64String = reader.result.replace(/^data:.+;base64,/, "");

            setEventImage({
                data: base64String,
                mimeType: file.type,
            });
            setSelectedFileName(file.name); // Set the selected file name
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleEventCreation = () => {
        if (!eventTitle || !eventSubtitle || !eventStartTime || !eventEndTime || !eventLocation || !eventDescription || !eventImage || !eventImage.data || !eventImage.mimeType) {
            Toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }
    
        const eventData = {
            Title: eventTitle,
            Subtitle: eventSubtitle,
            StartTime: eventStartTime,
            EndTime: eventEndTime,
            Location: eventLocation,
            Description: eventDescription,
            Image: eventImage.data,
            ImageMimeType: eventImage.mimeType,
        };
        Dataservice.createEvent(eventData);
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
                    Créer un nouvel évènement
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Titre"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Sous titre"
                            value={eventSubtitle}
                            onChange={(e) => setEventSubtitle(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Lieu"
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <label htmlFor="raised-button-file">
                            <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="raised-button-file"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <Button variant="contained" component="span">
                                Upload Image
                            </Button>
                        </label>
                        {selectedFileName && (
                            <Box sx={{ mt: 2 }}>
                                <Typography>{selectedFileName}</Typography>
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} locale="fr">
                            <DateTimePicker
                                label="Date et heure du début"
                                value={eventStartTime}
                                onChange={setEventStartTime}
                                ampm={false}
                                format="DD/MM/YYYY HH:mm"
                                fullWidth
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} locale="fr">
                            <DateTimePicker
                                label="Date et heure de fin"
                                value={eventEndTime}
                                onChange={setEventEndTime}
                                views={["day", "hours", "minutes"]}
                                ampm={false}
                                format="DD/MM/YYYY HH:mm"
                                fullWidth
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleEventCreation} variant="contained">
                            Créer évènement
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default EventCreator;
