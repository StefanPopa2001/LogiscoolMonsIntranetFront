import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay, isWithinInterval, eachDayOfInterval } from 'date-fns';
import Dataservice from '../dataservice/dataservice';
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@mui/material";

const AdminSettings = JSON.parse(localStorage.getItem('AdminSettings'));

async function sendDatesToBackend(dates) {
    // Convert each date to ISO format and send a request to the backend.
    const isoDates = dates.map(date => ({
        // Adjust the timezone offset to ensure the date is interpreted correctly on the server.
        date: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0]
    }));

    // Replace with your actual backend API call.
    await Dataservice.addDayOff(isoDates);
}

const HolidayCalendar = () => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [removedDates, setRemovedDates] = useState([]);

    useEffect(() => {
        async function loadDatesFromBackend() {
            const dates1 = await Dataservice.getDaysOff(2023);
            const dates2 = await Dataservice.getDaysOff(2024);
            const dates = dates1.concat(dates2);

            setSelectedDates(dates.map(date => {
                const [year, month, day] = date.date.split('T')[0].split('-');
                return new Date(year, month - 1, day);
            }));
        }

        loadDatesFromBackend();
    }, []);

    const handleSelect = (dateRange) => {
        const [start, end] = Array.isArray(dateRange) ? dateRange : [dateRange, dateRange];
        let datesToAdd = eachDayOfInterval({ start: start, end: end });

        setSelectedDates((prevSelectedDates) => {
            let newSelectedDates = [...prevSelectedDates];
            let newRemovedDates = [...removedDates];

            datesToAdd.forEach((dateToAdd) => {
                const index = newSelectedDates.findIndex((selectedDate) => isSameDay(selectedDate, dateToAdd));
                if (index === -1) {
                    newSelectedDates.push(dateToAdd);
                    const removedIndex = newRemovedDates.findIndex((removedDate) => isSameDay(removedDate, dateToAdd));
                    if (removedIndex !== -1) {
                        newRemovedDates.splice(removedIndex, 1);
                    }
                } else {
                    newSelectedDates.splice(index, 1);
                    newRemovedDates.push(dateToAdd);
                }
            });

            setRemovedDates(newRemovedDates);
            return newSelectedDates;
        });
    };

    const tileClassName = ({ date }) => {
        return selectedDates.some((selectedDate) => isSameDay(selectedDate, date)) ? 'selected' : null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const isSelected = selectedDates.some((selectedDate) => isSameDay(selectedDate, date));
            return isSelected ? <div className="selected-day" /> : null;
        }
        return null;
    };

    const handleSave = async () => {
        await sendDatesToBackend(selectedDates);

        const isoDates = removedDates.map(date => ({
            date: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0]
        }));

        await Dataservice.deleteDayOff(isoDates);
        setRemovedDates([]);
    };

    const calendarStartingDate = new Date(AdminSettings.calendarStartingDate);
    const calendarNumberOfMonths = parseInt(AdminSettings.calendarNumberOfMonths);

    return (
        <div>
            <Button
                color="success"
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handleSave}
            >
                Sauvegarder
            </Button>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '10px',
                    overflowY: "auto",
                    maxHeight: '600px',
                }}
            >
                {Array.from({ length: calendarNumberOfMonths }).map((_, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                        <Calendar
                            selectRange
                            view="month"
                            tileClassName={tileClassName}
                            tileContent={tileContent}
                            onChange={handleSelect}
                            activeStartDate={new Date(calendarStartingDate.getFullYear(), calendarStartingDate.getMonth() + index)}
                            calendarType="ISO 8601"
                            style={{ flex: '1 0 auto' }}
                            showNeighboringMonth={false}
                            locale="fr-FR"
                        />
                    </div>
                ))}
            </div>

            <style jsx>
                {`
          .selected-day,
          .selected {
            background-color: rgba(255, 0, 0, 0.5);
          }
        `}
            </style>
        </div>
    );
};

export default HolidayCalendar;
