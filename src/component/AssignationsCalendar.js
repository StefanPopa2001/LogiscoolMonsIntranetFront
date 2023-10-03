import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/fr"; // Import the French locale
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
    Modal,
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete
} from "@mui/material";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { styled } from "@mui/material/styles";
import Dataservice from "../dataservice/dataservice";
import SaveIcon from '@mui/icons-material/Save';
import TypesAssignations from "../Enum/AssignationType";
import Classes from "../Enum/Classe";


moment.locale("fr"); // Set the locale to French
const assignationsToDelete = []
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
const filter = {
    Quad: null,
    Year: null,
    Type: null,
    HasUserId: false,
}




const classes = [
    {
        niveau: "b2",
        eleves: []
    },
    {
        niveau: "c6",
        eleves: []
    },
    {
        niveau: "c4",
        eleves: []
    },
]

const rbcAlldayCell = {
    display: 'none',
};

const rbcTimeGutter = {
    position: 'sticky',
    left: 0,
    backgroundColor: 'white',
};

const StyledDiv = styled('div')({
    height: '600px',
    width: '1000',
    overflow: 'auto',
});

const StyledCalendar = styled(DnDCalendar)`
  & .rbc-allday-cell {
    ${rbcAlldayCell}
  }

  & .rbc-time-gutter {
    ${rbcTimeGutter}
  }
  
  width: 300%;
  

`;



const messages = {
    allDay: "Toute la journée",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    agenda: "Agenda",
    date: "Date",
    time: "Heure",
    event: "Événement",
    showMore: (total) => `Voir plus (${total})`,
};

const StyledModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const eventStyleGetter = (event, start, end, isSelected) => {
    const backgroundColor = event.color;
    const style = {
        backgroundColor,

    };

    return {
        style,
    };
};





const AdminCalendar = () => {


    const [newEventModalOpen, setNewEventModalOpen] = useState(false);
    const [newEventType, setNewEventType] = useState('');
    const [newEventClassLevel, setNewEventClassLevel] = useState('');
    const [newEventColor, setNewEventColor] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEmptySpace, setSelectedEmptySpace] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [showEventInfoModal, setShowEventInfoModal] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventUserId, setNewEventUserId] = useState(1);
    const [editEventId, setEditEventId] = useState("");
    const [editEventTitle, setEditEventTitle] = useState("");
    const [editEventColor, setEditEventColor] = useState("");
    const [editEventStart, setEditEventStart] = useState(null);
    const [editEventEnd, setEditEventEnd] = useState(null);
    const [editEventType, setEditEventType] = useState(null);
    const [editEventClassLevel, setEditEventClassLevel] = useState(null);
    const [editEventUserId, setEditEventUserId] = useState(null);
    const [profList, setProfList] = useState([]);
    const [newItemId, setNewItemId] = useState(0);
    const handleDeleteEvent = () => {
        // Ensure that there is a selected event to delete
        if (selectedEvent) {
            // Filter the selected event out of the events array
            console.log(editEventId)
            const updatedEvents = calendarEvents.filter(event => event.id != editEventId);

            const eventsToDelete = calendarEvents.filter(event => event.id == editEventId);

            eventsToDelete.forEach(event => {
                assignationsToDelete.push(event)
            })

            // Update the events in state
            setCalendarEvents(updatedEvents);
            // Close the modal
            setShowEventInfoModal(false);
            // Clear the selected event
            setSelectedEvent(null);


        }
    }

    // Create an effect that logs the calendarEvents state whenever it changes
    useEffect(() => {
        console.log(calendarEvents)
    }, [calendarEvents]);




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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Dataservice.getAllAssignations(filter);
                const transformedEvents = response.map((event) => ({
                    start: moment.utc(event.start).toDate(), // Convert to UTC
                    end: moment.utc(event.end).toDate(), // Convert to UTC
                    title: event.title,
                    color: event.color,
                    type: event.type,
                    quad: event.quad,
                    year: event.year,
                    userId: event.userId,
                    id: event.id,
                }));
                setCalendarEvents(transformedEvents);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    // Handle event select
    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setEditEventTitle(event.title);
        setEditEventColor(event.color);
        setEditEventStart(event.start);
        setEditEventEnd(event.end);
        setEditEventId(event.id);
        setShowEventInfoModal(true);
    };

    const mergeDateAndTime = (date, time) => {
        const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

        const year = date.getFullYear();
        const month = date.getMonth(); // Be careful! January is 0, not 1!
        const day = date.getDate();

        const dateString = `${year}-${month + 1}-${day} ${timeString}`;

        return new Date(dateString);
    };

    // Modify start time
    const handleStartTimeChange = (e) => {
        const newTime = new Date(e.target.value);
        const mergedDateTime = mergeDateAndTime(editEventStart, newTime);
        setEditEventStart(mergedDateTime);
    };

    // Modify end time
    const handleEndTimeChange = (e) => {
        const newTime = new Date(e.target.value);
        const mergedDateTime = mergeDateAndTime(editEventEnd, newTime);
        setEditEventEnd(mergedDateTime);
    };

    const handleEventInfoModalClose = () => {
        setSelectedEvent(null);
        setShowEventInfoModal(false);
    };

    const handleSelectSlot = ({ start, end }) => {
        setSelectedEmptySpace({ start, end });
        setSelectedEvent(null);
        setNewEventModalOpen(true);
    };



    const handleNewEventSave = () => {
        let tempEventId = `temp-${newItemId}`;

        console.log(profList)
        if (newEventType.trim() !== "") {
            const newEvent = {
                start: selectedEmptySpace.start,
                end: selectedEmptySpace.end,
                userId: newEventUserId,
                type: newEventType,
                title: newEventType + " " + newEventClassLevel + " " + profList.find((element) => element.id === newEventUserId).label,
                id: tempEventId,
                color: newEventColor == "" ? "gray" : newEventColor,
                year: 2023,
                quad: 1,
            };
            setCalendarEvents([...calendarEvents, newEvent]);
            setNewItemId(newItemId + 1);
            setNewEventModalOpen(false);
        }
        console.log(tempEventId)
    };

    const handleNewEventCancel = () => {
        setNewEventModalOpen(false);
    };

    const handleEventResize = ({ event, start, end }) => {
        const updatedEvents = calendarEvents.map((ev) =>
            ev.id === event.id ? { ...ev, start, end } : ev
        );
        setCalendarEvents(updatedEvents);
    };

    const handleEventDrop = ({ event, start, end }) => {
        const updatedEvents = calendarEvents.map((ev) =>
            ev.id == event.id ? { ...ev, start, end } : ev
        );
        setCalendarEvents(updatedEvents);
    };

    const handleModifyEvent = () => {
        if (editEventTitle.trim() !== "" && selectedEvent) {
            const updatedEvents = calendarEvents.map((ev) =>
                ev.id === selectedEvent.id ? { ...ev, title: editEventTitle, color: editEventColor, start: editEventStart, end: editEventEnd } : ev
            );
            setCalendarEvents(updatedEvents);
            setShowEventInfoModal(false);
        }
    };

    const handleDragStart = (event) => { };

    const handleResizeStart = ({ action, event, direction }) => { };
    return (

        <StyledDiv>

            <Button
                color="success"
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={() => {
                    let itemsToSave = calendarEvents.map(item => {
                        if (typeof item.id === 'string' && item.id.startsWith('temp-')) {
                            let { id, ...otherProperties } = item;
                            return otherProperties;
                        } else {
                            return item;
                        }
                    });

                    Dataservice.addRangeAssignations(itemsToSave, assignationsToDelete)
                    .finally(() => {
                        const fetchData = async () => {
                            try {
                                const response = await Dataservice.getAllAssignations(filter);
                                const transformedEvents = response.map((event) => ({
                                    start: moment.utc(event.start).toDate(), // Convert to UTC
                                    end: moment.utc(event.end).toDate(), // Convert to UTC
                                    title: event.title,
                                    color: event.color,
                                    type: event.type,
                                    quad: event.quad,
                                    year: event.year,
                                    userId: event.userId,
                                    id: event.id,
                                }));
                                setCalendarEvents(transformedEvents);
                            } catch (error) {
                                console.error(error);
                            }
                        };
                        fetchData();
                    });
                                
                }}
            >
                Sauvegarder
            </Button>

            <div className="calendar-container">
                <StyledCalendar
                    localizer={localizer}
                    events={calendarEvents}
                    step={10}
                    defaultView={Views.WEEK}
                    views={{ week: true }}
                    showMultiDayTimes={false}
                    formats={{
                        dayFormat: "dddd",
                    }}
                    defaultDate={new Date(2023, 3, 20)}
                    popup={true}
                    messages={messages}
                    timeslots={2}
                    min={new Date(2023, 3, 20, 8, 0, 0)}
                    max={new Date(2023, 3, 20, 22, 0, 0)}
                    onSelectEvent={handleEventSelect}
                    onSelectSlot={handleSelectSlot}
                    onEventResize={handleEventResize}
                    onEventDrop={handleEventDrop}
                    onDragStart={handleDragStart}
                    onResizeStart={handleResizeStart}
                    selectable
                    resizable
                    eventPropGetter={eventStyleGetter}
                    components={{
                        toolbar: () => null,
                    }}
                />
            </div>
            <StyledModal open={showEventInfoModal} onClose={handleEventInfoModalClose}>
                <Box sx={{ p: 2, width: 300, backgroundColor: "#fff", borderRadius: 4 }}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Modifier une assignation
                    </Typography>
                    <TextField
                        label="Titre"
                        value={editEventTitle}
                        onChange={(e) => setEditEventTitle(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />


                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Salle</InputLabel>
                        <Select value={editEventColor} fullWidth onChange={(e) => setEditEventColor(e.target.value)}>
                            <MenuItem value="blue">Chinchins</MenuItem>
                            <MenuItem value="red">Diables</MenuItem>
                            <MenuItem value="green">Halbardiers</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={editEventType}
                            onChange={(e) => setEditEventType(e.target.value)}
                        >
                            {Object.values(TypesAssignations).map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {editEventType && editEventType === 'cours' && (
                        <Autocomplete
                            disablePortal
                            id="combo-box-class"
                            options={Array.from(new Set(classes.map((c) => c.niveau)))}
                            renderInput={(params) => <TextField {...params} label="Niveau de la classe" />}
                            onChange={(event, newValue) => setEditEventClassLevel(newValue)}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    )}

                    <Autocomplete
                        disablePortal
                        id="combo-box-prof"
                        options={profList}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={editEventType === 'cours' ? 'Professeur' : 'Responsable'}
                            />
                        )}
                        onChange={(event, newValue) => setEditEventUserId(newValue?.id || 1)}
                        sx={{ mb: 2 }}
                    />



                    <Button onClick={handleEventInfoModalClose} variant="contained" color="error">
                        Annuler
                    </Button>
                    <Button onClick={handleModifyEvent} variant="contained" sx={{ mr: 2 }}>
                        Modify
                    </Button>
                    <Button onClick={handleDeleteEvent} variant="contained" color="error">
                        Supprimer
                    </Button>
                </Box>
            </StyledModal>



            <StyledModal open={newEventModalOpen} onClose={handleNewEventCancel}>
                <Box sx={{ p: 2, width: 300, backgroundColor: "#fff", borderRadius: 4 }}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Créer une assignation
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={newEventType}
                            onChange={(e) => setNewEventType(e.target.value)}
                        >
                            {Object.values(TypesAssignations).map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {newEventType && newEventType == 'cours' && (
                        <Autocomplete
                            disablePortal
                            id="combo-box-class"
                            options={Array.from(new Set(classes.map((c) => c.niveau)))}
                            renderInput={(params) => <TextField {...params} label="Nom de la classe" />}
                            onChange={(event, newValue) => setNewEventClassLevel(newValue)}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    )}


                    <Autocomplete
                        disablePortal
                        id="combo-box-prof"
                        options={profList}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={
                                    newEventType === 'cours'
                                        ? 'Professeur'
                                        : 'Responsable'
                                }
                            />
                        )}
                        onChange={(event, newValue) => setNewEventUserId(newValue?.id || 1)}
                        sx={{ mb: 2 }}
                    />


                    {newEventType && newEventType !== 'accueil' && newEventType !== 'ratrapage' && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Classe</InputLabel>
                            <Select
                                value={newEventColor}
                                onChange={(e) => setNewEventColor(e.target.value)}
                            >
                                {Object.values(Classes).map((classe) => (
                                    <MenuItem key={classe.value} value={classe.value}>
                                        {classe.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <Button
                        onClick={handleNewEventSave}
                        variant="contained"
                        sx={{ mr: 2 }}
                        disabled={
                            !newEventType ||
                            (newEventType === 'cours' && (!newEventUserId || !newEventClassLevel || !newEventColor)) ||
                            ((newEventType === 'accueil' || newEventType === 'ratrapage') && !newEventUserId)
                        }
                    >
                        Save
                    </Button>
                    <Button onClick={handleNewEventCancel} variant="contained" color="error">
                        Cancel
                    </Button>
                </Box>
            </StyledModal>





        </StyledDiv >
    );
};

export default AdminCalendar;
