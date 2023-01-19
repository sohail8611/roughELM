import React, { useState } from "react";
import { useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import './header.css'

export default function DenseAppBar(props) {



  const navigate = useNavigate()

  const handleChangePage = (route, name) => {
    navigate(route)
    props.setPageName(name)
  }

  return (
    <Box sx={{ flexGrow: 1 }} className="headerDenseMain">
      <AppBar position="static" className="headerDense">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="black"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={props.toggleDrawer("left", true)}
          >
            <MenuIcon />
          </IconButton>
          <Box className="logoBox">
            {/* <img src="/images/logo.png" className="headerLogo" style={{ height: logoHeightWidth.height, width: logoHeightWidth.width }} /> */}
            <img src="/images/logo.png" className="headerLogo" />
          </Box>
          {/* <Typography variant="h6" color="inherit" component="div">
            Elm
          </Typography> */}
          <Box className="PagesNameParentDiv">
            <ul>
              <li onClick={() => handleChangePage("/", "VisualDistortion")} className={(props.pageName === "VisualDistortion") && "activePage"}> Visual Distortion</li>
              <li onClick={() => handleChangePage("/light", "LightIntensity")} className={(props.pageName === "LightIntensity") && "activePage"}> Light Intensity</li>
              <li onClick={() => handleChangePage("/satellite", "Satellite")} className={(props.pageName === "Satellite") && "activePage"}> Satellite</li>
              <li onClick={() => handleChangePage("/carDamage", "CarDamage")} className={(props.pageName === "CarDamage") && "activePage"}> Car Damage</li>
            </ul>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
