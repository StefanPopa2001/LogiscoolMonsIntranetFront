import './App.css';
import Accueil from "./view/accueil";
import { Route, Routes, useNavigate } from "react-router-dom";
import SignInSide from "./view/login";
import ProtectedRoute from "./rooting/ProtectedRoute";
import { useEffect, useState } from 'react';
import MiniDrawer from './component/navbar';
import Profile from "./view/profile";
import Calendar from "./view/calendar";
import Admin from "./view/admin";
import AdminCalendar from "./component/AssignationsCalendar";
import HolidayCalendar from "./component/HolidayCalendar";
import EventCreator from "./component/event_creator";
import UserTable from "./component/userTable";
import Logipay from "./view/logipay";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logout from './component/Logout';
import CreateExtraEventButton from './component/AddExtraEvent';
import Role from './component/Role';
import AdminSettings from "./component/AdminSettings";
import StudentList from "./component/StudentList";

const App = () => {
    const getToken = () => {
        return document.cookie
          .split('; ')
          .find(row => row.startsWith('AUTH_COOKIE='))
          ?.split('=')[1];
      };
      

    const Navigate = useNavigate();
    const [LoggedIn, setLoggedIn] = useState(getToken());

    useEffect(() => {
        const token = getToken();
      
        if (token) {
          setLoggedIn(token);
        } else {
          setLoggedIn(null);
        }
      }, [Navigate, document.cookie]);

    return (
        <div style={{ display: 'flex' }}>
            {LoggedIn && <MiniDrawer />}
            <div style={{ flex: 1, marginLeft: LoggedIn ? 15 : 0, marginTop: LoggedIn ? 50 : 0 }}>
                <Routes>
                    <Route path="/" element={<ProtectedRoute> <Accueil /> </ProtectedRoute>}></Route>
                    <Route path="/Accueil" element={<ProtectedRoute> <Accueil /> </ProtectedRoute>}></Route>
                    <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>}></Route>
                    <Route path="/calendrier" element={<ProtectedRoute> <Calendar /> </ProtectedRoute>}></Route>
                    <Route path="/Défraiement" element={<ProtectedRoute> <Logipay /> </ProtectedRoute>}></Route>

                    <Route path="/admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute>}>
                        <Route path="assignations" element={<AdminCalendar />} />
                        <Route path="conges" element={<HolidayCalendar />} />
                        <Route path="createEvent" element={<EventCreator />} />
                        <Route path="userTable" element={< UserTable />} />
                        <Route path="extraEvent" element={< CreateExtraEventButton />} />
                        <Route path="Role" element={< Role />} />
                        <Route path="ParametresAdministrateur" element={< AdminSettings />} />
                        <Route path="StudentList" element={< StudentList />} />
                    </Route>
                    
                    <Route path="/Logout" element={<Logout/>}></Route>
                    <Route path="/Login" element={<SignInSide />}></Route>
                </Routes>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default App;
