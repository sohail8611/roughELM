import React, { useEffect, useState } from "react";
import Map from "../../components/leafletMap/Map";
import styles from "./visualDistortion.module.css";
import Papa from "papaparse";
import { Button } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

function VisualDistortion() {
  const [geoJsonHeatMapDataGlobal, setgeoJsonHeatMapDataGlobal] = useState(null);
  const [geoJsonHeatMapData, setgeoJsonHeatMapData] = useState(null);
  const ButtonsHeading = "Visual Distortions"
  const [heatMapButtons, setHeatMapButtons] = useState([
    { name: "Trees", hover: false },
    { name: "Road Cracks", hover: false },
    { name: "Light Intensity", hover: false },
    { name: "Garbage", hover: false },
    { name: "Towers", hover: false },
    { name: "Street sweeping", hover: false },
    { name: "Rubble unknown source", hover: false },
    { name: "Fly-poster", hover: false },
    { name: "Minor Asphalting Damage", hover: false },
    { name: "Garbage Waste", hover: false },
    { name: "Abandoned car", hover: false },
    { name: "Random paintings", hover: false },
    { name: "Room boxes", hover: false },
    //  { name: "Ready made room",hover: false },

    { name: "Add Sign", hover: false },
    { name: "Alligator Crack", hover: false },
    { name: "Asphalting waste", hover: false },
    { name: "Barrier", hover: false },
    //  { name: "Barrier Group",hover: false },
    { name: "Blurred Crosswalk", hover: false },
    { name: "Blurred Lane Line", hover: false },
    { name: "Colored garbage", hover: false },
    { name: "Concrete Barrier Group", hover: false },
    { name: "Concrete barrier", hover: false },
    //  { name: "Construction materials",hover: false },
    { name: "Crack", hover: false },
    { name: "Crosswalk", hover: false },
    // "Curbs",hover: false },
    { name: "Damage garbage can", hover: false },
    { name: "Digging", hover: false },
    // "Fly-posters",hover: false },
    { name: "Garbage can", hover: false },
    { name: "Grass", hover: false },
    { name: "Horizontal Crack", hover: false },
    { name: "Lighting pole on", hover: false },
    { name: "Lightning pole off", hover: false },
    { name: "Manhole", hover: false },
    //  { name: "Median",hover: false },
    // { name:  "Mountain",hover: false },
    // { name:  "No Median",hover: false },
    { name: "Overflowing Garbage", hover: false },
    { name: "Parking area", hover: false },
    { name: "Plant", hover: false },
    { name: "Ponding water", hover: false },
    // { name:  "Ready-made rooms",hover: false },
    //  { name: "Repaired Area",hover: false },
    { name: "Rubble", hover: false },
    { name: "Signboard", hover: false },
    { name: "Speed bumps", hover: false },
    { name: "Sun canopy", hover: false },
    { name: "Traffic cones", hover: false },
    { name: "Vertical Crack", hover: false },
    { name: "Waste container", hover: false },
    { name: "sidewalk", hover: false },

  ]);
  const [circle, setCircle] = useState([
    {
      circleName: "firstCircle",
      radius: 5,
      latLongs: [24.549466983888195, 46.53895087804749],
    },
    {
      circleName: "secondCircle",
      radius: 5,
      latLongs: [24.5554909472383, 46.552853326737576],
    },
  ]);

  const handleMouseHoverOnHeatMapButton = (heatMapButtonText, index) => {


    let filteredArray = geoJsonHeatMapDataGlobal?.features.filter(function (item) {
      return item.case == heatMapButtonText;
    });

    let copyHeatMapButtons = [...heatMapButtons]

    copyHeatMapButtons[index].hover = true
    setHeatMapButtons(copyHeatMapButtons)



    setgeoJsonHeatMapData({
      type: "FeatureCollection",
      features: filteredArray,
    });
  };
  const handleMouseOutOnHeatMapButton = (index) => {
    setgeoJsonHeatMapData(null);


    let copyHeatMapButtons = [...heatMapButtons]

    copyHeatMapButtons[index].hover = false
    setHeatMapButtons(copyHeatMapButtons)
  };
  useEffect(() => {
    // Read HEATMAP DATA FROM CSV
    var featuresArr = [];
    let fetechedData = [];
    let circlesArr = [];
    fetch("./heatMap_2.csv")
      .then((response) => response.text())
      .then((data) =>
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            results.data.map((row, index) => {
              circlesArr.push({
                circleName: row.id,
                radius: parseFloat(row.radius),
                latLongs: [parseFloat(row.lat), parseFloat(row.lng)],
                opacity: row.opacity,
                clickable: row.clickable,
                circle: row.circle,
                isVideo: row.isVideo,
                case: row.case,
                circleColor: row.color,
                images_location: row.images_location
              });

              // console.log("hu:", row);
              fetechedData.push(row);

              featuresArr.push({
                case: row.case,
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [parseFloat(row.lng), parseFloat(row.lat)],
                  intensity: row.intensity,
                },
                properties: { rating: 3.2, restaurant_name: "None" },
              });
            });
            // setgeoJsonHeatMapData({
            //   type: "FeatureCollection",
            //   features: featuresArr,
            // });
            setgeoJsonHeatMapDataGlobal({
              type: "FeatureCollection",
              features: featuresArr,
            });

            setCircle(circlesArr);
          },
        })
      );
  }, []);

  return (
    <div className={styles.dashboardMainDiv}>
      <div className={styles.dashboardMapParentDiv}>
        <Map
          geoJsonHeatMapData={geoJsonHeatMapData}
          circle={circle}
          setCircle={setCircle}
        />
      </div>
      <div className={styles.dashboardCategoriesDiv}>

        <div className={styles.heatMapButtonsDiv}>
          <div className={styles.categoriesTitleDiv}>
            <h4>{ButtonsHeading}</h4>
          </div>
          <div className={styles.labels}>
            <ul className={styles.heatmapButtonBox}>
              {heatMapButtons.map((item, index) => (
                <div className={styles.liAndCheckIcon}>
                  <span>
                    {(item.hover) && <CheckOutlinedIcon sx={{ fontSize: 12 }} />}
                  </span>
                  <li className={styles.heatmapButton}
                    onMouseEnter={() => handleMouseHoverOnHeatMapButton(item.name, index)}
                    onMouseOut={() => handleMouseOutOnHeatMapButton(index)}
                  >
                    {item.name}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default VisualDistortion;
