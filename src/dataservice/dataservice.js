import axios from "axios";
import queryString from 'query-string'; // Install the 'query-string' package
import Toast from "../component/Toast";

const API_auth = 'https://localhost:7152/api/Authentication';
const API_app = 'https://localhost:7152/api/v1/AppController';

// Create a new instance of axios with default headers
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    function (config) {
        let token = null;

        // Fetch the token from cookies
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('AUTH_COOKIE=')) {
                token = cookie.substring('AUTH_COOKIE='.length, cookie.length);
                break;
            }
        }

        if (token) {
            // Add the 'Authorization' header with the token
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);


class Dataservice {
    static GetUserConnected = async () => {
        try {
            const response = await axiosInstance.get(API_app + '/fetchUser');
            return response;
        } catch (error) {
            console.error(error);
        }
    };

    static addRangeAssignations = async (assignationsList,itemToDelete) => {
        try {
            const response = await axiosInstance.post(API_app + '/addRangeAssignations', {assignationsList,itemToDelete});
            Toast.success("Assignations ajoutées avec succès !");
            return response;
        } catch (e) {
            Toast.error("Erreur de l'ajout d'assignations !");
            console.error(e);
        }
    };

    static getAllAssignations = async (filter) => {
        try {
            const serializedFilter = queryString.stringify(filter, { arrayFormat: 'bracket' });
            const url = `${API_app}/GetAssignation?${serializedFilter}`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };



    static getUser = async () => {
        try {
            const response = await axiosInstance.get(API_app + '/GetUser');
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    static getMonthlyAssignations = async (filter) => {
        try {
            const serializedFilter = queryString.stringify(filter, { arrayFormat: 'bracket' });
            const url = `${API_app}/GetAssignationOfMonth?${serializedFilter}`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    static getWeekIndex = (dateString) => {
        return axiosInstance.post(API_app + '/GetWeekIndex', `"${dateString}"`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.data) // <- return response.data
            .catch(error => {
                console.error(error);
                throw error;
            });
    };



    static addDayOff = async (dayOffList) => {
        try {
            const response = await axiosInstance.post(API_app + '/AddDayOff', dayOffList);
            Toast.success("Journée(s) ajoutées avec succès !");
            return response;
        } catch (e) {
            Toast.error("Erreur lors de l'ajout des jours !");
            console.error(e);
        }
    };

    static deleteDayOff = async (dayOffList) =>{

        const response = await axiosInstance.post(API_app + '/DeleteDayOff', dayOffList);
        return response;

    };

    static getDaysOff = async (year) => {

        const response = await axiosInstance.post(API_app + `/GetDaysOff?Year=${year}`, null);
        return response.data;
    };

    static getEvents = async () => {
        try {
            const response = await axiosInstance.get(API_app + "/GetEvents");
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    static createEvent = async (eventData) => {
        try {
            const response = await axiosInstance.post(API_app + '/CreateEvent', eventData);
            Toast.success("Évènement créé avec succès");
            return response;
        } catch (error) {
            Toast.error("Erreur lors de l'ajout de l'évènement");
            console.error(error);
        }
    };

    static updateUserStatus = async (eventId, status) => {
        try {
            const data = {
                EventId: eventId,
                Status: status,
            };

            const response = await axiosInstance.post(API_app + '/UpdateStatus', data);
            return response;
        } catch (e) {
            console.error(e);
        }
    };

    static getDoneWorkOfMonth = async (filter) => {
        try {
            const serializedFilter = queryString.stringify(filter, { arrayFormat: 'bracket' });
            const url = `${API_app}/GetDoneWorkOfMonth?${serializedFilter}`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    static AddUser = async (entity) => {
        const response = await axiosInstance.post(API_app + '/CreateAccount', entity);
        return response;
    }

    static UpdatePassword = async(entity)=>{
        const requestBody = JSON.stringify(entity);
        const response = await axiosInstance.post(API_app + '/UpdatePassword', requestBody, {
            headers: { 'Content-Type': 'application/json' },
        })
        return response
    }


    static logout = async () => {
        try {
            const url = `${API_auth}/disconnect`;
            const response = await axiosInstance.post(url);
            Toast.success("Déconnecté");
            document.cookie =
                'AUTH_COOKIE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.reload();
            return response;

        } catch (error) {
            console.error(error);
            Toast.error("Erreur lors de la déconnexion");
            throw error;
        }
    };

    static verifyToken = async () => {

        try {
            const url = `${API_auth}/verifyToken`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    static updateProfilePicture = async (entity) => {

        const response = await axiosInstance.post(API_app + '/UpdateProfilePicture', entity);
        return response;

    };

    static AddExtraEvent = async (extraEvent) => {
        const response = await axiosInstance.post(API_app + '/CreateExtraEvent', extraEvent);
        return response;
    };

    static GetAllRole = async ()=>{
        const response = await axiosInstance.get(API_app + '/GetAllRoles');
        return response;
    };

    static CreateRole = async (entity)=>{
        const response = await axiosInstance.post(API_app + '/CreateRoles', entity);
        return response;
    }

    static updateRoles =async (entity) =>{
        const response = await axiosInstance.post(API_app + '/UpdateRoles', entity);
        return response;
    }

    static changeRole = async (entity)=>{
        const response = await axiosInstance.post(API_app + '/ChangeRoleUser', entity);
        return response;
    }

    static setAdminSettings = async (entity) =>{
        const response = await axiosInstance.post(API_app + '/setAdminSettings', entity);
        return response;
    }

    static getAdminSettings = async () =>{
        const response = await axiosInstance.get(API_app + '/getAdminSettings');
        return response;
    }

    static ResetPassword = async (userId) => {
        const response = await axiosInstance.post(API_app + '/ResetPassword?UserId='+userId);
        return response;
    };

    static GetStudents = async (filter) => {
        try {
            const serializedFilter = queryString.stringify(filter, { arrayFormat: 'bracket' });
            const url = `${API_app}/GetStudents?${serializedFilter}`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

}

export default Dataservice;
