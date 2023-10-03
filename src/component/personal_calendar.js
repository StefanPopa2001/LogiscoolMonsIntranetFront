import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/fr";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Modal, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Dataservice from "../dataservice/dataservice";

moment.locale("fr");
const localizer = momentLocalizer(moment);
const DnDCalendar = Calendar;
const filter = {
    Quad: null,
    Year: null,
    Type: null,
    HasUserId: true,
}


const StyledDiv = styled('div')({
    height: '100%',
    width: '100%',
    overflow: 'auto',
});

const StyledCalendar = styled(DnDCalendar)({
    height: '100%',
    width: '100%',
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

const PersonalCalendar = () => {

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [showEventInfoModal, setShowEventInfoModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Dataservice.getAllAssignations(filter);
                const transformedEvents = response.map((event) => ({
                    start: moment.utc(event.start).toDate(),
                    end: moment.utc(event.end).toDate(),
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
    }, [filter]);

    // Handle event select
    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setShowEventInfoModal(true);
    };

    const handleEventInfoModalClose = () => {
        setSelectedEvent(null);
        setShowEventInfoModal(false);
    };

    return (
        <>
            <StyledCalendar
                localizer={localizer}
                events={calendarEvents}
                step={30}
                defaultView={Views.WEEK}
                views={{ week: true }}
                showMultiDayTimes={false}
                formats={{ dayFormat: "dddd", }}
                defaultDate={new Date(2023, 3, 20)}
                popup={true}
                messages={messages}
                timeslots={2}
                min={new Date(2023, 3, 20, 8, 0, 0)}
                max={new Date(2023, 3, 20, 22, 0, 0)}
                onSelectEvent={handleEventSelect}
                eventPropGetter={eventStyleGetter}
                components={{ toolbar: () => null, }}
            />
            <StyledModal open={showEventInfoModal} onClose={handleEventInfoModalClose}>
                <Box sx={{ p: 2, width: 300, backgroundColor: "#fff", borderRadius: 4 }}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Détails du cours
                    </Typography>

                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Classe: {selectedEvent?.type+" "+selectedEvent?.title}
                    </Typography>

                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Début: {moment(selectedEvent?.start).format('HH:mm')}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Fin: {moment(selectedEvent?.end).format('HH:mm')}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Salle: {selectedEvent?.color}
                    </Typography>
                </Box>
            </StyledModal>

        </>
    );
};

export default PersonalCalendar;