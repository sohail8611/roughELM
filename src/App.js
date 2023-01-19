import React, { useEffect } from "react";
import Routing from "./config/router/Routing";
import { useNavigate } from "react-router";
import './App.css'

function App() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/')
  }, [])
  return <Routing />;
}

export default App;
