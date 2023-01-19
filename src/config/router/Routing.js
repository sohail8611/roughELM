import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../components/header";
import CarDamage from "../../views/CarDamage/CarDamage";
import ContactUs from "../../views/ContactUs/ContactUs";
import Error from "../../views/Error/Error";
import LightIntensity from "../../views/LightIntensity/LightIntensity";
import Satellite from "../../views/Satellite/Satellite";
import VisualDistortion from "../../views/VisualDistortion/VisualDistortion";

function Routing() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<VisualDistortion />} />
        <Route path="/light" element={<LightIntensity />} />
        <Route path="/satellite" element={<Satellite />} />
        <Route path="/carDamage" element={<CarDamage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default Routing;
