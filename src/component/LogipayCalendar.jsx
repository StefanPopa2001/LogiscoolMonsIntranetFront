import React, {useEffect, useRef, useState} from "react";
import moment from "moment";
import "moment/locale/fr";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import {Modal, Typography, Box, Table, TableHead, TableBody, TableRow, TableCell, Divider} from "@mui/material";
import { styled } from "@mui/material/styles";
import dataservice from "../dataservice/dataservice";
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import { PDFViewer, Document, Page, Text } from '@react-pdf/renderer';
import jsPDF from "jspdf";
import SignaturePad from "./SignaturePad";
import HandwrittenSignature from "./SignaturePad";
import html2canvas from "html2canvas";

let prepaIncome = 10;

const localizer = momentLocalizer(moment);
const filter = {
    Quad: 1,
    Year: 2023,
    Month: 5,
};

const StyledCalendar = styled(({ children, ...other }) => <Calendar {...other}>{children}</Calendar>)({
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

const LogipayCalendar = () => {
    const pdfRef = useRef();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [showEventInfoModal, setShowEventInfoModal] = useState(false);
    const [newEvent, setNewEvent] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date(2023, 4, 20)); // Default date is set to May
    const [showNewEventModal, setShowNewEventModal] = useState(false);
    const [showIncomeModal, setShowIncomeModal] = useState(false); // New state variable for income modal
    const [showFicheModal, setShowFicheModal] = useState(false); // New state variable for income modal
    const [userData, setUserData] = useState("");

    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setShowEventInfoModal(true);
    };


    const StyledModal = styled(Modal)(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }));

    const ModalContent = styled(Box)({
        p: 2,
        backgroundColor: "#fff",
        borderRadius: 4,
        maxHeight: "85vh",
        overflowY: "auto",
        maxWidth:"85vw"
    });

    const eventStyleGetter = (event, start, end, isSelected) => {
        const backgroundColor = event.color;
        const style = {
            backgroundColor,
        };

        return {
            style,
        };
    };

    const handleEventUpdate = (updatedEvent) => {
        const updatedEvents = calendarEvents.map((ev) =>
            ev.id === updatedEvent.id ? updatedEvent : ev
        );
        setCalendarEvents(updatedEvents);
        setShowEventInfoModal(false);
    };

    const groupEventsByDate = () => {
        const groupedEvents = {};
        for (const event of calendarEvents) {
            const date = moment(event.start).format("YYYY-MM-DD");
            if (groupedEvents[date]) {
                groupedEvents[date].push(event);
            } else {
                groupedEvents[date] = [event];
            }
        }

        return groupedEvents;
    };

    const handleEventDelete = (deletedEvent) => {
        const updatedEvents = calendarEvents.filter((ev) =>
            ev.id !== deletedEvent.id
        );
        setCalendarEvents(updatedEvents);
        setShowEventInfoModal(false);
    };

    const handleEventCreate = (createdEvent) => {
        const eventWithId = { ...createdEvent, id: uuidv4() };
        setCalendarEvents([...calendarEvents, eventWithId]);
        setShowNewEventModal(false);
    };

    const handleSelectSlot = ({ start, end }) => {
        setNewEvent({ start, end: moment(end).subtract(1, 'milliseconds'), title: "", color: "" });
        setShowNewEventModal(true);
    };

    const handleNewEventChange = (field, value) => {
        setNewEvent({
            ...newEvent,
            [field]: value,
        });
    };

    const handleDragStart =()=>{

    }

    const handleDisplayIncome = () => {
        setUserData(dataservice.getUser().data)
        setShowIncomeModal(true); // Show the income modal
    };

    const handleDisplayFiche = () =>{
        setShowIncomeModal(false);
        setShowFicheModal(true);
    };

    const handleNewEventSubmit = (e) => {
        e.preventDefault();
        handleEventCreate(newEvent);
        setNewEvent({}); // Clear the form after submission
    };

    const handleEventInfoModalClose = () => {
        setSelectedEvent(null);
        setShowEventInfoModal(false);
    };

    const handleMonthChange = (date) => {
        setCurrentDate(date); // Update the date displayed in the calendar

        const newFilter = {
            ...filter,
            Month: date.getMonth() + 1, // Update the Month property based on the selected month
            Year: date.getFullYear(),
        };
    };

    const setCalendar = async (assignations) => {
        const updatedCalendarEvents = updateCalendarEvents(assignations);
        const newCalendarEvents = createPrepaDeCoursEvents(
            assignations,
            updatedCalendarEvents
        );
        setCalendarEvents(newCalendarEvents);
    };

    function getDaysInMonth(year, month) {
        const daysInMonth = new Date(year, month, 0).getDate();
        const daysArray = [];

        for (let day = 1; day <= daysInMonth; day++) {
            daysArray.push(day);
        }

        return daysArray;
    }



    const createPrepaDeCoursEvents = (assignations, calendarEvents) => {
        const coursEvents = assignations.filter(event => event.type === 'cours');

        const days = getDaysInMonth(filter.Year, filter.Month);
        let daysOfWork = []
        for(let i = 0 ; i<days.length;i++)
        {
            daysOfWork.push({
                dayNb: i+1,
                work: [],
                total: 0
            })
        }

        //Putting all the cours in their day
        let prepaArray = []
        coursEvents.forEach(cours=>{
            cours.income = cours.income - prepaIncome;
            var dayNumber = new Date(cours.start).getDate();
            daysOfWork[dayNumber-1].work.push(cours)

            prepaArray.push({
                title: 'prépa de cours',
                id: uuidv4(),
                income: prepaIncome
            })
        })

        //console.log(prepaArray)

        let currentDayIndex = 0;
        while (prepaArray.length > 0)
        {

            let incomeToAdd = prepaArray[prepaArray.length-1].income
            let incomeThatDay = (daysOfWork[currentDayIndex].work.reduce((total,event)=>total+=event.income,0))
            //console.log("comparing = "+incomeThatDay +" "+ incomeToAdd)
            while((incomeThatDay + incomeToAdd) < 40.67-incomeToAdd && prepaArray[prepaArray.length-1])
            {
                incomeToAdd = prepaArray[prepaArray.length-1].income
                incomeThatDay = (daysOfWork[currentDayIndex].work.reduce((total,event)=>total+=event.income,0))
                //console.log("now comparing = "+incomeThatDay +" "+ incomeToAdd)
                let eventToAdd = prepaArray.pop()

                eventToAdd.start = moment(currentDayIndex+1+"/"+(filter.Month)+"/"+filter.Year+" 12:00:00", "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
                eventToAdd.end = moment(currentDayIndex+1+"/"+(filter.Month)+"/"+filter.Year+" 12:00:00", "DD/MM/YYYY HH:mm:ss").add(90, 'minutes').format("YYYY-MM-DD HH:mm:ss")

                daysOfWork[currentDayIndex].work.push(eventToAdd)
                coursEvents.push(eventToAdd);
            }

            currentDayIndex++
        }

        console.log(coursEvents)
        setCalendarEvents(coursEvents)
        return coursEvents;
    };

    const updateCalendarEvents = (assignations) => {
        let newCalendarEvents = assignations;
        setCalendarEvents([...newCalendarEvents]); // Update the state using the setter function
        return newCalendarEvents;
    };

    useEffect(() => {
        const fetchAssignations = async () => {
            try {
                dataservice.getDoneWorkOfMonth(filter).then((assignations) => {
                    assignations.forEach((assignation) => {
                        assignation.id = uuidv4();
                    });

                    setCalendar(assignations);
                });
            } catch (error) {
                console.error("Failed to fetch assignations:", error);
            }
        };
        fetchAssignations();
    }, [filter.Month]);

    useEffect(() => {
        const fetchCurrentUser = async () => {

            dataservice.getUser()

        };
        fetchCurrentUser();
    }, []);

    const handleEventDrop = ({ event, start, end }) => {
        const updatedEvent = {
            ...event,
            start,
            end
        };
        handleEventUpdate(updatedEvent);
    };

    const handleSpreadWork = () => {
        const days = getDaysInMonth(filter.Year, filter.Month);
        let daysOfWork = [];

        for (let i = 0; i < days.length; i++) {
            daysOfWork.push({
                dayNb: i + 1,
                work: [],
                total: 0,
            });
        }

        calendarEvents.forEach((work) => {
            const dayNumber = new Date(work.start).getDate();
            // Check if work has an 'income' property
            work.income = work.income ? work.income : 0;
            daysOfWork[dayNumber - 1].work.push(work);
        });

        let extraWorkToSpread = [];
        for (let index = 0; index < daysOfWork.length; index++) {
            const currentDay = daysOfWork[index];
            currentDay.total = currentDay.work.reduce((total, event) => total + (event.income || 0), 0);

            while (currentDay.total > 40.67) {
                let excessWork = currentDay.work.pop();
                currentDay.total -= excessWork.income;
                extraWorkToSpread.push(excessWork);
            }
        }

        let currentDayIndex = 0;
        while (extraWorkToSpread.length > 0) {
            if (currentDayIndex >= daysOfWork.length) {
                throw new Error("Unable to spread work evenly across days");
            }

            let workToAdd = extraWorkToSpread[extraWorkToSpread.length - 1];
            if (daysOfWork[currentDayIndex].total + workToAdd.income <= 40.67) {

                workToAdd.start = moment(currentDayIndex+1+"/"+(filter.Month)+"/"+filter.Year+" 12:00:00", "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
                workToAdd.end = moment(currentDayIndex+1+"/"+(filter.Month)+"/"+filter.Year+" 12:00:00", "DD/MM/YYYY HH:mm:ss").add(90, 'minutes').format("YYYY-MM-DD HH:mm:ss")

                daysOfWork[currentDayIndex].work.push(workToAdd);
                daysOfWork[currentDayIndex].total += workToAdd.income;
                extraWorkToSpread.pop();
            } else {
                currentDayIndex++;
            }
        }

        let newCalendarEvents = daysOfWork.flatMap(day => day.work);
        setCalendarEvents(newCalendarEvents);
        return daysOfWork;
    };






    function groupEventsByDateAndType(events) {
        let grouped = {};
        events.forEach(event => {
            const date = moment(event.date).format("DD-MM-YYYY");
            const type = event.type;
            if (!grouped[date]) {
                grouped[date] = {};
            }
            if (!grouped[date][type]) {
                grouped[date][type] = [];
            }
            grouped[date][type].push(event);
        });
        return grouped;
    }

    const DnDCalendar = withDragAndDrop(StyledCalendar);


    const handlePrintPdf = () => {
        const pdfElement = pdfRef.current;
        if (pdfElement) {
            html2canvas(pdfElement, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps= pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save("download.pdf");
            });
        }
    };

    return (
        <>
            <DnDCalendar
                localizer={localizer}
                events={calendarEvents}
                views={{ month: true }}
                defaultDate={currentDate} // Use currentDate state to control the displayed date
                defaultView={Views.MONTH}
                step={60}
                formats={{ dayFormat: "dddd" }}
                popup={true}
                messages={messages}
                timeslots={1}
                min={new Date(0, 0, 0, 8, 0, 0)}
                max={new Date(0, 0, 0, 22, 0, 0)}
                onSelectEvent={handleEventSelect}
                handleDragStart ={handleDragStart}
                eventPropGetter={eventStyleGetter}
                selectable={true}
                onEventDrop={handleEventDrop}
                onSelectSlot={handleSelectSlot}
                onNavigate={handleMonthChange}
            />



            <StyledModal open={showEventInfoModal} onClose={handleEventInfoModalClose}>
                <ModalContent>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Détails du cours
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Professeur: {selectedEvent?.title}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Début: {selectedEvent && moment(selectedEvent.start).format("HH:mm")}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Fin: {selectedEvent && moment(selectedEvent.end).format("HH:mm")}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Salle: {selectedEvent?.color}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                        Income: {selectedEvent?.income}
                    </Typography>

                    <button onClick={() => handleEventUpdate(selectedEvent)}>Mettre à jour</button>
                    <button onClick={() => handleEventDelete(selectedEvent)}>Supprimer</button>
                </ModalContent>
            </StyledModal>

            <StyledModal open={showNewEventModal} onClose={() => setShowNewEventModal(false)}>
                <ModalContent>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Nouvel événement
                    </Typography>
                    <form onSubmit={handleNewEventSubmit}>
                        <input
                            type="text"
                            value={newEvent.title || ""}
                            onChange={(e) => handleNewEventChange('title', e.target.value)}
                            placeholder="Title"
                            required
                        />
                        <input
                            type="color"
                            value={newEvent.color || "#000000"}
                            onChange={(e) => handleNewEventChange('color', e.target.value)}
                        />
                        <button type="submit">Enregistrer</button>
                    </form>
                </ModalContent>
            </StyledModal>

            <StyledModal open={showIncomeModal} onClose={() => setShowIncomeModal(false)}>
                <ModalContent>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }} style={{ textAlign: "center", marginTop: "10px" }}>
                        Récapitulatif du mois de {new Date(Date.UTC(1999, filter.Month, 1)).toLocaleString('fr-FR', { month: 'long' })}
                    </Typography>
                    {Object.keys(groupEventsByDate())
                        .sort()
                        .map((date) => (
                            <React.Fragment key={date}>
                                <Divider />
                                <Typography variant="subtitle1" component="h3" style={{ textAlign: "center", marginTop: "5px", marginBottom: "-10px", textDecoration: "underline" }}>
                                    {moment(date).format("dddd D MMMM")}
                                </Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ width: '50%', textAlign: "center", paddingBottom: "2px" }}>Intitulé</TableCell>
                                            <TableCell style={{ width: '50%', textAlign: "center", paddingBottom: "2px" }}>Montant</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {groupEventsByDate()[date].map((event) => (
                                            <React.Fragment key={event.id}>
                                                <TableRow>
                                                    <TableCell style={{ width: '50%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }}>
                                                        {event.type} {event.title}
                                                    </TableCell>
                                                    <TableCell style={{ width: '50%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }}>
                                                        {event.income.toFixed(2)} €
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))}
                                        <TableRow>
                                            <TableCell style={{ width: '50%', textAlign: "center", paddingTop: "5px", paddingBottom: "5px", fontWeight: "bold" }}>Total</TableCell>
                                            <TableCell style={{ width: '50%', textAlign: "center", paddingTop: "5px", paddingBottom: "5px", fontWeight: "bold", color: groupEventsByDate()[date].reduce((total, event) => total + event.income, 0) > 40 ? 'red' : 'inherit' }}>
                                                {groupEventsByDate()[date].reduce((total, event) => total + event.income, 0).toFixed(2)} €
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </React.Fragment>
                        ))}
                    <Typography variant="subtitle1" component="h3" sx={{ mb: 2 }} style={{textAlign:"center",marginTop:"10px",fontWeight:"bolder",fontSize:"1.2em"}}>
                        {"Total du mois de " + new Date(Date.UTC(1999, filter.Month, 1)).toLocaleString('fr-FR', { month: 'long' }) +
                            " : " + Object.values(groupEventsByDate()).reduce((total, events) => total + events.reduce((acc, event) => acc + event.income, 0), 0).toFixed(2)} €
                        <Button variant="contained" onClick={handleDisplayFiche}>
                            Créer fiche de défraiement
                        </Button>

                    </Typography>


                </ModalContent>
            </StyledModal>

            <StyledModal open={showFicheModal} onClose={() => setShowFicheModal(false)} style={{}}>
                <ModalContent style={{maxWidth:"90wh"}}>
                    <div style={{ width: '210mm', height: '297mm', backgroundColor:"white" }} ref={pdfRef}>

                        <h1 style={{textAlign:"center",textDecoration:"underline"}}>FICHE DE DÉFRAIEMENT - VOLONTARIAT</h1>
                        <h2 style={{textAlign:"center"}}>MOIS DE : {new Date(Date.UTC(1999, filter.Month, 1)).toLocaleString('fr-FR', { month: 'long' })} </h2>

                        <div style={{}}>
                            <h5>Nom et Prénom du volontaire : xxx</h5>
                            <h5>Compte bancaire n° : xxx</h5>

                            <Table style={{border: '1px solid red', width: '80%', margin: 'auto'}} size="small">
                                <TableHead>
                                    <TableRow >
                                        <TableCell style={{textAlign:"center",border:"1px black solid"}}>Date</TableCell>
                                        <TableCell style={{textAlign:"center",border:"1px black solid"}}>Objet</TableCell>
                                        <TableCell style={{textAlign:"center",border:"1px black solid"}}>Tarif</TableCell>
                                        <TableCell style={{textAlign:"center",border:"1px black solid"}}>Quantité</TableCell>
                                        <TableCell style={{textAlign:"center",border:"1px black solid"}}>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(groupEventsByDate())
                                        .sort()
                                        .flatMap((date) => {
                                            const numericalDate = moment(date).format("DD/MM/yyyy");
                                            const eventsForDate = groupEventsByDate()[date];
                                            const eventTypes = [...new Set(eventsForDate.map((event) => event.type))];

                                            return eventTypes.flatMap((type) => {
                                                const eventsForType = eventsForDate.filter((event) => event.type === type);
                                                const totalIncomeForType = eventsForType.reduce((total, event) => total + event.income, 0);
                                                const totalQuantityForType = eventsForType.length;
                                                const firstEvent = eventsForType[0];

                                                return (
                                                    <TableRow key={`${date}-${type}`}>
                                                        <TableCell style={{textAlign:"center",border:"1px black solid"}}>{numericalDate}</TableCell>
                                                        <TableCell style={{textAlign:"left",border:"1px black solid"}}>{firstEvent.type} {firstEvent.title}</TableCell>
                                                        <TableCell style={{textAlign:"right",border:"1px black solid"}}>{firstEvent.income.toFixed(2)} €</TableCell>
                                                        <TableCell style={{textAlign:"center",border:"1px black solid"}}>{totalQuantityForType}</TableCell>
                                                        <TableCell style={{ fontWeight: 'bold',textAlign:"right",border:"1px black solid"}}>
                                                            {totalIncomeForType.toFixed(2)} €
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            });
                                        })}
                                    <TableRow>
                                        <TableCell colSpan={3} style={{ fontWeight: 'bold',textAlign:"center",border:"1px black solid"}}>Total</TableCell>
                                        <TableCell style={{ fontWeight: 'bold',textAlign:"center",border:"1px black solid"}}>
                                            {Object.keys(groupEventsByDate())
                                                .flatMap((date) => {
                                                    const eventsForDate = groupEventsByDate()[date];
                                                    return eventsForDate.length;
                                                })
                                                .reduce((prev, curr) => prev + curr, 0)}
                                        </TableCell>
                                        <TableCell style={{ fontWeight: 'bold',textAlign:"right",border:"1px black solid"}}>
                                            {Object.keys(groupEventsByDate())
                                                .flatMap((date) => {
                                                    const eventsForDate = groupEventsByDate()[date];
                                                    return eventsForDate.reduce((total, event) => total + event.income, 0);
                                                })
                                                .reduce((prev, curr) => prev + curr, 0).toFixed(2)} €
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>


                            <h3>Date et signature</h3>
                            <HandwrittenSignature name={userData.firstName}/>

                            <div style={{textAlign:"center",fontSize:"0.7em"}}>
                                <h4 style={{marginBottom:"1px"}}>Code It Bryan ! asbl</h4>
                                <div>RPM : BE0770.479.710</div>
                                <div>Banque : BE02 1431 1606 4140</div>
                                <div>Rampe Sainte Waudru 8 – 7000 MONS</div>
                            </div>
                        </div>
                    </div>
                    <Button onClick={handlePrintPdf} variant="contained">
                        Print PDF
                    </Button>
                </ModalContent>
            </StyledModal>

            <Button onClick={handleDisplayIncome}>
                Afficher récapitulatif
            </Button>
            <Button onClick={handleSpreadWork}>
                Répartir défraiement
            </Button>
        </>
    );
};
export default LogipayCalendar;