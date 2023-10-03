import React, { useEffect, useState } from "react";
import {

    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container, Divider,
    Fab
} from "@mui/material";
import "./cssAccueil.css";
import { AvatarGroup } from '@mui/material';
import { Pagination } from '@mui/material';
import Dataservice from "../dataservice/dataservice";
import moment from 'moment';
import 'moment/locale/fr';
import { styled } from "@mui/material/styles";
import InfoIcon from '@mui/icons-material/Info';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import RoomIcon from '@mui/icons-material/Room';
import { Modal, Box, Typography, Button, Avatar, Tooltip } from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import TodayIcon from '@mui/icons-material/Today';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';

function AddIcon() {
    return null;
}

const Accueil = () => {
    const [page, setPage] = useState(1);
    const [events, setEvents] = useState([]);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const itemsPerPage = 1;

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleStatus = async (eventId, status) => {
        try {
            const response = await Dataservice.updateUserStatus(eventId, status);
        } catch (e) {
            console.error(e);
        }
    };



    const StyledModal = styled(Modal)(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }));



    const formatDateTime = (startTime, endTime) => {
        const startMoment = moment.utc(startTime).local();
        const endMoment = moment.utc(endTime).local();

        if (startMoment.isSame(endMoment, 'day')) {
            // Start and end times are on the same day
            return `${startMoment.format('LL')} de ${startMoment.format('LT')} jusqu'à ${endMoment.format('LT')}`;
        } else {
            // Start and end times are on different days
            return `${startMoment.format('LL [à] LT')} - ${endMoment.format('LL [à] LT')}`;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Dataservice.getEvents();
                const reversedResponse = response.reverse();


                const transformedEvents = reversedResponse.map((event) => ({
                    id: event.id,
                    title: event.title,
                    subtitle: event.subtitle,
                    location: event.location,
                    description: event.description,
                    image: event.image,
                    imageMimeType: event.imageMimeType,
                    startTime: event.startTime,
                    endTime: event.endTime,
                    userEvents: event.userEvents,
                }));
                setEvents(transformedEvents);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const EventCards = () => (
        <div style={{ marginTop: "1em" }}>
          {events.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((event, index) => (
            <div key={index} style={{ marginBottom: "1em" }}>
              <Card>
                <CardMedia sx={{ height: 300 }} image={`data:image/${event.imageMimeType};base64,${event.image}`} title={event.title} />
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Évènement Logiscool à venir
                  </Typography>
                  <Typography variant="h5" component="div">
                    {event.title}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {event.subtitle}
                  </Typography>
                  <Typography color="text.secondary">
                    {event.location}
                  </Typography>
                  <Typography color="text.secondary">
                    {formatDateTime(event.startTime,event.endTime)}
                  </Typography>
                  <Typography variant="body2">
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                      <AvatarGroup total={event.userEvents ? event.userEvents.filter(user => user.status == "0").length : 0} max={20}>
                        {event.userEvents &&
                          event.userEvents
                            .filter((user) => user.status == "0")
                            .map((user, index) => (
                              <Tooltip title={user.user.firstName + " " + user.user.name} key={index}>
                                <Avatar
                                    src={`data:image/${user.user.mimeType};base64,${user.user.image}`}
                                />
                              </Tooltip>
                            ))}
                      </AvatarGroup>
                    </div>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Fab size="small" color="primary" variant="extended" onClick={() => { setShowEventDetails(true); setSelectedEvent(event) }}>
                    <InfoIcon sx={{ mr: 1 }} /> En savoir plus
                  </Fab>
                  <Fab size="small" color="success" variant="extended" onClick={() => handleStatus(event.id, 0)}>
                    <ThumbUpAltIcon sx={{ mr: 1 }} /> Je viens!
                  </Fab>
                  <Fab size="small" color="error" variant="extended" onClick={() => handleStatus(event.id, 2)}>
                    <ThumbDownAltIcon sx={{ mr: 1 }} /> Je ne viens pas...
                  </Fab>
                </CardActions>
              </Card>
            </div>
          ))}
          <Pagination count={Math.ceil(events.length / itemsPerPage)} page={page} onChange={handleChange} />
        </div>
      );
      




    return (
        <>

            <Modal
                open={showEventDetails}
                onClose={() => {
                    setShowEventDetails(false);
                    setSelectedEvent(null);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: 600,
                        width: '100%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <TodayIcon sx={{ marginRight: '0.5rem' }} />
                        Détails de l'événement
                    </Typography>
                    {selectedEvent && (
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <TitleIcon sx={{ marginRight: '0.5rem' }} />
                                <Typography variant="body1">Titre: {selectedEvent.title}</Typography>
                            </Box>
                            <Divider sx={{ marginBottom: '0.5rem' }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <SubtitlesIcon sx={{ marginRight: '0.5rem' }} />
                                <Typography variant="body1">Sous-titre: {selectedEvent.subtitle}</Typography>
                            </Box>
                            <Divider sx={{ marginBottom: '0.5rem' }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <RoomIcon sx={{ marginRight: '0.5rem' }} />
                                <Typography variant="body1">Lieu: {selectedEvent.location}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        const encodedLocation = encodeURIComponent(selectedEvent.location);
                                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
                                    }}
                                    sx={{ marginLeft: '0.5rem' }}
                                >
                                    <RoomIcon />
                                </Button>
                            </Box>
                            <Divider sx={{ marginBottom: '0.5rem' }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <DescriptionIcon sx={{ marginRight: '0.5rem' }} />
                                <Typography variant="body1">Description: {selectedEvent.description}</Typography>
                            </Box>
                            <Divider sx={{ marginBottom: '0.5rem' }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <TodayIcon sx={{ marginRight: '0.5rem' }} />
                                <Typography variant="body1">Date: {formatDateTime(selectedEvent.startTime,selectedEvent.endTime)}</Typography>
                            </Box>

                            <Divider sx={{ marginBottom: '0.5rem' }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <ThumbUpAltIcon sx={{ marginRight: '0.5rem' }} />
                                <Typography variant="body1">Viendra ({selectedEvent.userEvents.filter(user => user.status == "0").length})</Typography>
                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                                    <AvatarGroup total={selectedEvent.userEvents ? selectedEvent.userEvents.filter(user => user.status == "0").length : 0} >
                                        {selectedEvent.userEvents &&
                                            selectedEvent.userEvents
                                                .filter((user) => user.status == "0")
                                                .map((user, index) => (
                                                    <Tooltip title={`${user.user.firstName} ${user.user.name}`} key={index}>
                                                        <Avatar    src={`data:image/${user.user.mimeType};base64,${user.user.image}`} />
                                                    </Tooltip>
                                                ))}
                                    </AvatarGroup>
                                </div>
                            </Box>
                            <Divider sx={{ marginBottom: '0.5rem' }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <ThumbDownAltIcon sx={{ marginRight: '0.5rem' }} />
                                <Typography variant="body1">Ne viendra pas ({selectedEvent.userEvents.filter(user => user.status == "2").length})</Typography>
                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                                    <AvatarGroup total={selectedEvent.userEvents ? selectedEvent.userEvents.filter(user => user.status == "2").length : 0}>
                                        {selectedEvent.userEvents &&
                                            selectedEvent.userEvents
                                                .filter((user) => user.status == "2")
                                                .map((user, index) => (
                                                    <Tooltip title={`${user.user.firstName} ${user.user.name}`} key={index}>
                                                        <Avatar    src={`data:image/${user.user.mimeType};base64,${user.user.image}`} />
                                                    </Tooltip>
                                                ))}
                                    </AvatarGroup>
                                </div>
                            </Box>
                            <Divider sx={{ marginBottom: '0.5rem' }} />

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ThumbsUpDownIcon sx={{ marginRight: '0.5rem' }} />
                                <Typography variant="body1">N'a pas répondu ({selectedEvent.userEvents.filter(user => user.status == "1").length})</Typography>
                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                                    <AvatarGroup total={selectedEvent.userEvents ? selectedEvent.userEvents.filter(user => user.status == "1").length : 0}>
                                        {selectedEvent.userEvents &&
                                            selectedEvent.userEvents
                                                .filter((user) => user.status == "1")
                                                .map((user, index) => (
                                                    <Tooltip title={`${user.user.firstName} ${user.user.name}`} key={index}>
                                                        <Avatar    src={`data:image/${user.user.mimeType};base64,${user.user.image}`} />
                                                    </Tooltip>
                                                ))}
                                    </AvatarGroup>
                                </div>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Modal>

            <Container>
                <EventCards />
            </Container>
        </>
    );
};

export default Accueil;

