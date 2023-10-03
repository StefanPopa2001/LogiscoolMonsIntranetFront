import React, { useEffect, useState } from "react";
import {Paper, Button, Modal, Box, Typography, TextField} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Dataservice from "../dataservice/dataservice";
import {styled} from "@mui/material/styles";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

const StudentList = () => {
    const [rows, setRows] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editedStudent, setEditedStudent] = useState(null);

    const StyledModal = styled(Modal)(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }));

    const handleChange = (field, value) => {
        setEditedStudent((prevStudent) => ({
            ...prevStudent,
            [field]: value,
        }));
    };

    const handleConfirmChanges = () => {
        // Call your own method to update the data in the backend
        //updateStudentData(editedStudent); // Replace `updateStudentData` with your own method

        handleCloseModal();
    };

    const columns = [
        { field: "lastName", headerName: "Nom", flex: 1, minWidth: 100 },
        { field: "firstName", headerName: "Prénom", flex: 1, minWidth: 100 },
        { field: "logiscoolUsername", headerName: "Identifiant", flex: 1, minWidth: 100 },
        { field: "logiscoolPassword", headerName: "MDP", flex: 1, minWidth: 100 },
        { field: "birthDayDate", headerName: "Date de naissance", flex: 1, minWidth: 100 },
        { field: "nationalNumber", headerName: "Num. National", flex: 1, minWidth: 100 },
        { field: "age", headerName: "Age", flex: 1, minWidth: 100 },
        {
            field: "dataButton",
            headerName: "Plus",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => (
                <Button
                    color="primary"
                    onClick={() => handleOpenModal(params.row)}
                >
                    <InfoIcon/>
                </Button>
            ),
        },
        {
            field: "deleteButton",
            headerName: "Supprimer",
            flex: 1,
            minWidth: 30,
            renderCell: (params) => (
                <Button
                    color="error"
                    onClick={() => alert('suuuuuuuuuuuu')}
                >
                    <DeleteIcon/>
                </Button>
            ),
        },
    ];

    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setEditedStudent({ ...student });
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedStudent(null);
        setModalOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Dataservice.GetStudents();

                const transformedStudents = response.map((student) => ({
                    id: student.id,
                    lastName: student.lastName,
                    firstName: student.firstName,
                    returnsAlone: student.returnsAlone,
                    pickupPerson: student.pickupPerson,
                    logiscoolUsername: student.logiscoolUsername || "",
                    logiscoolPassword: student.logiscoolPassword || "",
                    birthDayDate: student.birthDayDate || "",
                    note: student.note || "",
                    nationalNumber: student.nationalNumber || "",
                    r1_Firstname: student.r1_Firstname || "",
                    r1_Lastname: student.r1_Lastname || "",
                    r1_LinkToTheStudent: student.r1_LinkToTheStudent || "",
                    r1_Phone: student.r1_Phone || "",
                    r1_Email: student.r1_Email || "",
                    r1_PostalAdress: student.r1_PostalAdress || "",
                    r1_NationalNumber: student.r1_NationalNumber || "",
                    r2_Firstname: student.r2_Firstname || "",
                    r2_Lastname: student.r2_Lastname || "",
                    r2_LinkToTheStudent: student.r2_LinkToTheStudent || "",
                    r2_Phone: student.r2_Phone || "",
                    r2_Email: student.r2_Email || "",
                    r2_PostalAdress: student.r2_PostalAdress || "",
                    r3_Firstname: student.r3_Firstname || "",
                    r3_Lastname: student.r3_Lastname || "",
                    r3_LinkToTheStudent: student.r3_LinkToTheStudent || "",
                    r3_Phone: student.r3_Phone || "",
                    r3_Email: student.r3_Email || "",
                    r3_PostalAdress: student.r3_PostalAdress || "",
                    studentClassId: student.studentClassId,
                    studentClass: student.studentClass,
                    Age: calculateAge(student.birthDayDate),
                }));

                setRows(transformedStudents);
            } catch (e) {
                console.error(e);
            }
        };

        fetchData();
    }, []);


    const calculateAge = (birthdate) => {
        // Calculate the age based on birthdate
        // Implement your own logic here
    };

    return (
        <div style={{ height: "calc(100vh - 200px)", width: "100%" }}>
            <Paper>
                <DataGrid
                    columns={columns}
                    rows={rows}
                    autoHeight
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    editMode="row"
                />
            </Paper>
            <StyledModal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={{ p: 3, maxWidth: 600, backgroundColor: "#fff", borderRadius: 4 }}>
                    {selectedStudent && (
                        <Typography>
                            <Typography variant="h2" gutterBottom>
                                {selectedStudent.firstName} {selectedStudent.lastName}
                            </Typography>
                            <TextField label={"Identifiant"}  value={selectedStudent.logiscoolUsername || ""}   onChange={(event) => handleChange("logiscoolUsername", event.target.value)}></TextField>
                            <Typography>MDP: {selectedStudent.logiscoolPassword || "-"}</Typography>
                            <Typography>Date de naissance: {selectedStudent.birthDayDate || "-"}</Typography>
                            <Typography>Num. National: {selectedStudent.nationalNumber || "-"}</Typography>
                            <Typography>Note: {selectedStudent.note || "-"}</Typography>

                            <Typography variant="subtitle1">Parent 1:</Typography>
                            <Typography>Prénom: {selectedStudent.r1_Firstname || "-"}</Typography>
                            <Typography>Nom: {selectedStudent.r1_Lastname || "-"}</Typography>
                            <Typography>Lien avec l'étudiant: {selectedStudent.r1_LinkToTheStudent || "-"}</Typography>
                            <Typography>Téléphone: {selectedStudent.r1_Phone || "-"}</Typography>
                            <Typography>Email: {selectedStudent.r1_Email || "-"}</Typography>
                            <Typography>Adresse postale: {selectedStudent.r1_PostalAdress || "-"}</Typography>
                            <Typography>Num. National: {selectedStudent.r1_NationalNumber || "-"}</Typography>

                            <Typography variant="subtitle1">Parent 2:</Typography>
                            <Typography>Prénom: {selectedStudent.r2_Firstname || "-"}</Typography>
                            <Typography>Nom: {selectedStudent.r2_Lastname || "-"}</Typography>
                            <Typography>Lien avec l'étudiant: {selectedStudent.r2_LinkToTheStudent || "-"}</Typography>
                            <Typography>Téléphone: {selectedStudent.r2_Phone || "-"}</Typography>
                            <Typography>Email: {selectedStudent.r2_Email || "-"}</Typography>
                            <Typography>Adresse postale: {selectedStudent.r2_PostalAdress || "-"}</Typography>

                            <Typography variant="subtitle1">Parent 3:</Typography>
                            <Typography>Prénom: {selectedStudent.r3_Firstname || "-"}</Typography>
                            <Typography>Nom: {selectedStudent.r3_Lastname || "-"}</Typography>
                            <Typography>Lien avec l'étudiant: {selectedStudent.r3_LinkToTheStudent || "-"}</Typography>
                            <Typography>Téléphone: {selectedStudent.r3_Phone || "-"}</Typography>
                            <Typography>Email: {selectedStudent.r3_Email || "-"}</Typography>
                            <Typography>Adresse postale: {selectedStudent.r3_PostalAdress || "-"}</Typography>


                            <Button onClick={handleCloseModal}>Close</Button>
                            <Button onClick={handleConfirmChanges}>Modifier</Button>
                        </Typography>
                    )}
                </Box>
            </StyledModal>

        </div>
    );
};

export default StudentList;
