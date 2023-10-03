import React, {useEffect, useRef, useState} from "react";
import moment from "moment";
import "moment/locale/fr";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Modal, Typography, Box, IconButton, Select, MenuItem, Autocomplete } from "@mui/material";
import { styled } from "@mui/material/styles";
import dataservice from "../dataservice/dataservice";
import FilterListIcon from "@mui/icons-material/FilterList";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TypesAssignations from "../Enum/AssignationType";
import Classes from "../Enum/Classe";
import Dataservice from "../dataservice/dataservice";

moment.locale("fr");
const localizer = momentLocalizer(moment);
const DnDCalendar = Calendar;

const AdminSettings = JSON.parse(localStorage.getItem('AdminSettings')) +'';
let a = AdminSettings.calendarWeeksStartingDate

const calculateWeekNumber = (date) => {
    let firstWeekDate = moment(a);
    const currentDate = moment(date);
    const diffInWeeks = currentDate.diff(firstWeekDate, 'weeks');
    return diffInWeeks + 1;
};

const StyledCalendar = styled(DnDCalendar)({
    minHeight: "600px",
    width: "100%",
});

const messages = {
    allDay: "Toute la journée",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    agenda: "Agenda",
    date: "Date",
    time: "Heure",
    event: "Événement",
    today: "Mois actuel",
    previous: "<",
    next: ">",
    showMore: (total) => `Voir plus (${total})`,
};

const StyledModal = styled(Modal)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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



const PublicCalendar = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [showEventInfoModal, setShowEventInfoModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profList, setProfList] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [assignations, setAssignations] = useState([]);
    const [weekNumber, setWeekNumber] = useState(null);

    const initialFilter = {
        Quad: 2,
        Year: new Date().getFullYear(),
        Month: new Date().getMonth() + 1,
        userId: null,
        color: null,
        title: null,
        type: null
    };
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [filter, setFilter] = useState(initialFilter);

    const handleFilterOpen = () => {
        setShowFilterModal(true);
    };

    const handleFilterClose = () => {
        setShowFilterModal(false);
    };

    function formatDate(date) {
        var d = new Date(date);
        return d.toISOString().split('.')[0];
    }


    const handleFilterChange = (event) => {
        setFilter({
            ...filter,
            [event.target.name]: event.target.value
        });
    };
    const applyFilter = () => {
        setShowFilterModal(false);
        setFilter(prevFilter => ({
            ...prevFilter,
            userId: filter.userId,
            color: filter.color,
            title: filter.title,
            type: filter.type
        }));
    };

    const handleEventSelect = (event) => {
        const start = moment.utc(event.start).local();
        const end = moment.utc(event.end).local();
        setSelectedEvent({ ...event, start, end });
        setShowEventInfoModal(true);
    };
    const handleEventInfoModalClose = () => {
        setSelectedEvent(null);
        setShowEventInfoModal(false);
    };
    const startOfWeek = (date) => {
        let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    const weekOfYear = (date) => {
        let start = new Date(date.getFullYear(), 0, 1);
        let weekStart = startOfWeek(start);
        let dateStart = startOfWeek(date);
        let diffInWeeks = Math.round(((dateStart - weekStart) / 86400000) / 7);
        return diffInWeeks + 1;
    };






    const handleMonthChange = (date) => {
        // Update filter with the new month
        filter.Month = date.getMonth() + 1; // JavaScript counts months from 0 to 11, so we add 1 to get the correct month value.

        // Update filter with the current year
        filter.Year = date.getFullYear();

        // Calculate the quad based on the current month
        const currentMonth = date.getMonth() + 1;
        if (currentMonth >= 2 && currentMonth <= 6) {
            filter.Quad = null; // February to June is quad 1
        } else if (currentMonth >= 9 || currentMonth <= 1) {
            filter.Quad = null; // September to January is quad 2
        } else {
            filter.Quad = null; // Set to null or handle other cases if needed
        }

        dataservice.getMonthlyAssignations(filter).then((assignations) => {
            const events = assignations.map(a => ({
                ...a,
                start: moment.utc(a.start).toDate(),
                end: moment.utc(a.end).toDate()
            }));
            setAssignations(assignations);  // Update assignations state
            setCalendarEvents(events);
            setLoading(false);
        });
    }

    useEffect(() => {
        const fetchAssignations = async () => {
            try {
                dataservice.getMonthlyAssignations(filter).then((assignations) => {
                    const events = assignations.map(a => ({
                        ...a,
                        start: moment.utc(a.start).toDate(),
                        end: moment.utc(a.end).toDate()
                    }));
                    setCalendarEvents(events);
                    setLoading(false);
                });
            } catch (error) {
                console.error("Failed to fetch assignations:", error);
            }
        };
        fetchAssignations();
    }, [filter]);


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


    if (loading) {
        return <div>Loading...</div>;
    }


    const WeekIndicator = ({ date }) => {
        const [weekNumber, setWeekNumber] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (!date) {
                console.warn('Date prop is not defined. Unable to fetch week number.');
                return;
            }

            const formattedDate = formatDate(date);

            if (!formattedDate) {
                console.warn('Formatted date is not defined. Unable to fetch week number.');
                return;
            }

            console.log(`Fetching week number for date: ${formattedDate}`);

            dataservice
                .getWeekIndex(formattedDate)
                .then((data) => { // <- response.data is now just data
                    if (data !== undefined) {
                        console.log(`Fetched week number: ${data}`);
                        setWeekNumber(data);
                        setLoading(false);
                    } else {
                        console.warn('Data from getWeekIndex is undefined');
                    }
                })
                .catch((error) => {
                    console.error(`Failed to fetch week number: ${error}`);
                });
        }, [date]);

        return (
            <span>
            {loading ? 'Loading...' : weekNumber ? `Semaine ${weekNumber}` : 'No week number available'}
        </span>
        );
    };


    return (



        <>
            <IconButton onClick={handleFilterOpen}>
                <FilterListIcon />
            </IconButton>

            <Dialog open={showFilterModal} onClose={handleFilterClose}>
                <DialogTitle>Filtrer le calendrier</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choississez sur quoi vous-voulez filter
                    </DialogContentText>

                    <Autocomplete
                        disablePortal
                        name="userId"
                        id="combo-box-prof"
                        options={profList}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                            <TextField
                                name="userId"
                                {...params}
                                label="Utilisateur"
                            />
                        )}
                        onChange={(event, value) => {
                            const selectedOption = value ? value : null;
                            const selectedOptionId = selectedOption ? selectedOption.id : null;
                            handleFilterChange({ target: { name: "userId", value :selectedOption } });
                            setFilter({
                                ...filter,
                                userId: selectedOptionId
                            });
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Select
                        margin="dense"
                        name="color"
                        label="Color"
                        onChange={handleFilterChange}
                        fullWidth
                    >
                        {Object.values(Classes).map((classe) => (
                            <MenuItem key={classe.value} value={classe.value}>
                                {classe.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        value={filter.title}
                        onChange={handleFilterChange}
                    />

                    <Select
                        name="Type"
                        value={TypesAssignations.ACCUEIL.label}
                        onChange={handleFilterChange}
                        fullWidth

                    >
                        {Object.values(TypesAssignations).map((type) => (
                            <MenuItem key={type.value} value={type.value}
                                      label="Type">
                                {type.label}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilterClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={applyFilter} color="primary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
            <WeekIndicator date={currentDate}/>
            <StyledCalendar
                localizer={localizer}
                events={calendarEvents}
                step={60}
                formats={{ dayFormat: "dddd" }}
                defaultDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}
                popup={true}
                defaultView="week"
                messages={messages}
                timeslots={1}
                min={new Date(0, 0, 0, 8, 0, 0)}
                max={new Date(0, 0, 0, 22, 0, 0)}
                onSelectEvent={handleEventSelect}
                eventPropGetter={eventStyleGetter}
                onNavigate={(date) => {
                    handleMonthChange(date);
                    setCurrentDate(date);
                }}

            />
            <StyledModal open={showEventInfoModal} onClose={handleEventInfoModalClose}>
                <Box sx={{ p: 2, width: 300, backgroundColor: "#fff", borderRadius: 4 }}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Détails du cours
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Professeur: {selectedEvent?.title}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Début: {selectedEvent && selectedEvent.start.format("HH:mm")}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Fin: {selectedEvent && selectedEvent.end.format("HH:mm")}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Salle: {selectedEvent?.color}
                    </Typography>
                </Box>
            </StyledModal>
        </>
    );
};

export default PublicCalendar;