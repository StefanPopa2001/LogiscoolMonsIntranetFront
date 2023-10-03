import React from 'react';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import Dataservice from '../dataservice/dataservice';
import { Navigate } from 'react-router-dom';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

const Logout = () => {
  const handleLogout = () => {
    Dataservice.logout();
  };

  return (
      <></>

  );
};

export default Logout;
