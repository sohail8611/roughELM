import React, { useEffect, useState } from "react";
import Papa from "papaparse";

// import L from "leaflet";
import {
    Map as LeafletMap,
    Polyline,
    TileLayer,
    // Marker,
    // Popup,
    // CircleMarker,
    // Circle,
} from "react-leaflet";
// import HeatmapLayer from "react-leaflet-heatmap-layer";
import "../../../node_modules/leaflet/dist/leaflet.css";

import './LightIntensity.css'
import { Button } from "bootstrap";


function LightIntensity(props) {

    const [polyLinesArr, setPolyLinesArr] = useState()
    const [dateFilteredPolyLinesArr, setDateFilteredPolyLinesArr] = useState(null)
    const [fluxSensorDirection, setFluxSensorDirection] = useState('Lux_center')
    const [maxFluxValue, setMaxFluxValue] = useState(10)
    const [fluxInputValue, setFluxInputValue] = useState(maxFluxValue)
    // const [dateInputValue, setDateInputValue] = useState(null)
    const [dateInputValueForamatted, setDateInputValueForamatted] = useState(null)

    var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    console.log("today:", date)

    const [showPopup, setShowPopup] = useState(false)
    const [popUpIntensity, setPopUpIntensity] = useState()
    const [cursor, setCursor] = useState({ x: 0, y: 0 })

    console.log("cursor");
    console.log(cursor);

    const changeFluxSensor = (sensor) => {
        console.log("sensor:", sensor);
        setFluxSensorDirection(sensor)
    }

    const handleChangeIntensityValuFromUser = () => {
        setMaxFluxValue(fluxInputValue)
    }

    const handleDateInput = (e) => {
        let useInputDate = e.target.value
        // setDateInputValue(e.target.value)
        let splittedDate = useInputDate.split("-")
        let newDateFormat = splittedDate[2].toString() + splittedDate[1].toString() + splittedDate[0].toString()[2] + splittedDate[0].toString()[3]
        if (newDateFormat[0] === "0") {
            newDateFormat = newDateFormat.slice(1, newDateFormat.length)
        }
        newDateFormat = newDateFormat + '.0'


        setDateInputValueForamatted(newDateFormat)


        let filteredArray = Object.values(polyLinesArr).filter(function (item) {
            return item.date == newDateFormat;
        });

        console.log("filteredArray:", filteredArray);
        setDateFilteredPolyLinesArr(filteredArray)

        // for (key in polyLinesArr) {
        //     // code block to be executed
        // }


    }

    const handlePolyLineMouseOver = (e, lux) => {
        setShowPopup(false)

        setCursor(e.containerPoint)

        setPopUpIntensity(lux)
        setShowPopup(true)
    }

    const handlePolyLineMouseOut = () => {

        setTimeout(() => {
            setPopUpIntensity(null)
            setShowPopup(false)

        }, 1000);
    }

    useEffect(() => {

        //read from csv file 
        let lightIntensityDataDictionary = {}
        fetch("./lightIntensityCSV/combined_data_2.csv")
            .then((response) => response.text())
            .then((data) =>
                Papa.parse(data, {
                    header: true,
                    complete: (results) => {

                        results.data.map((row) => {
                            if (row.street) {
                                lightIntensityDataDictionary[row.street] = { id: '', street: '', Lux_left: '', Lux_center: '', Lux_right: '', latLngs: [] }
                            }
                        });

                        results.data.map((row) => {
                            // console.log(row)
                            if (row.street) {
                                lightIntensityDataDictionary[row.street].id = row.id
                                lightIntensityDataDictionary[row.street].date = row.Date
                                lightIntensityDataDictionary[row.street].street = row.street
                                lightIntensityDataDictionary[row.street].Lux_left = row.Lux_left
                                lightIntensityDataDictionary[row.street].Lux_center = row.Lux_center
                                lightIntensityDataDictionary[row.street].Lux_right = row.Lux_right
                                lightIntensityDataDictionary[row.street].latLngs.push([row.Lat, row.Long])
                            }
                        });
                        // console.log("arrr:", lightIntensityDataDictionary)
                        setPolyLinesArr(lightIntensityDataDictionary)
                    },
                })
            );
    }, []);






    // const multiPolyline = [[24.72779, 46.66387], [24.67849, 46.68887], [24.67735, 46.68836], [24.67828, 46.68809], [24.68007, 46.69188], [24.68821, 46.71266], [24.69211, 46.71753], [24.69528, 46.73172], [24.72161, 46.77311], [24.71443, 46.76141], [24.70958, 46.75423], [24.71247, 46.75886], [24.71284, 46.76203], [24.71552, 46.763], [24.71874, 46.75974], [24.75937, 46.73955], [24.76216, 46.74451], [24.76036, 46.73945], [24.76105, 46.7387], [24.79116, 46.724], [24.79274, 46.7215], [24.76368, 46.65326], [24.76368, 46.64688], [24.82574, 46.61465], [24.82785, 46.61385], [24.82831, 46.61521], [24.82613, 46.61261], [24.82679, 46.61178], [24.82771, 46.61301], [24.82514, 46.61464], [24.82438, 46.61363], [24.82587, 46.61287], [24.82689, 46.61548], [24.82587, 46.61623], [24.82574, 46.61465], [24.82845, 46.61437], [24.82699, 46.61488], [24.81403, 46.58441], [24.81063, 46.58039], [24.79953, 46.573], [24.79677, 46.56416], [24.79766, 46.56307], [24.7973, 46.56455], [24.7833, 46.56855], [24.73819, 46.58843]]


    const [data, setData] = useState({
        zoom: 12,
        position: [24.722247582630565, 46.69516236275618], //position: [24.558372631414468, 46.53989870910598]
    });

    return (
        <div className="mapParentDiv">
            <div className="luxSensorButtonsDiv">
                <button onClick={() => changeFluxSensor('Lux_left')}>left</button>
                <button onClick={() => changeFluxSensor('Lux_center')}>center</button>
                <button onClick={() => changeFluxSensor('Lux_right')}>right</button>
            </div>

            <div className="intensityInputParentDiv">
                <span>Max Lux Value:</span>
                <input type='number' min={0} value={fluxInputValue} onChange={(e) => setFluxInputValue(e.target.value)}></input>
                <button className="intensitySubmitButton" onClick={handleChangeIntensityValuFromUser}>submit</button>
            </div>
            <div className="dateInputParentDiv">
                <span className="dateInputSpan">Date:</span>
                <input type='date' onChange={(e) => handleDateInput(e)}></input>
                {/* <button className="intensitySubmitButton" onClick={handleChangeIntensityValuFromUser}>submit</button> */}
            </div>

            <LeafletMap center={data.position} zoom={data.zoom}>
                {/* dateFilteredPolyLinesArr */}
                {polyLinesArr ?

                    (dateFilteredPolyLinesArr) ? (
                        dateFilteredPolyLinesArr.map((item, i) =>
                            (
                                item?.latLngs) && (
                                <Polyline positions={item['latLngs']}
                                    key={i}
                                    color={'#eedd82'}
                                    opacity={item[fluxSensorDirection] / maxFluxValue}
                                    // dashArray="10"
                                    lineCap={'square'}
                                    weight={2}
                                    smoothFactor={1}
                                    onMouseOver={(e) => handlePolyLineMouseOver(e, item[fluxSensorDirection])}
                                    onMouseOut={() => handlePolyLineMouseOut()}

                                />
                            )
                        )
                    ) :

                        (
                            Object.keys(polyLinesArr).map((streetName, i) =>
                                (
                                    polyLinesArr[streetName]?.latLngs) && (
                                    <Polyline positions={polyLinesArr[streetName]['latLngs']}
                                        key={i}
                                        color={'#eedd82'}
                                        opacity={polyLinesArr[streetName][fluxSensorDirection] / maxFluxValue}
                                        // dashArray="10"
                                        lineCap={'square'}
                                        weight={2}
                                        smoothFactor={2}
                                        
                                        onMouseOver={(e) => handlePolyLineMouseOver(e, polyLinesArr[streetName][fluxSensorDirection])}
                                        onMouseOut={() => handlePolyLineMouseOut()}

                                    />
                                )
                            )
                        ) : null
                }

                {showPopup && <div className="popUpStyle" style={{ top: cursor.y, left: cursor.x }}>{popUpIntensity}</div>}
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    // url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    url = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
                />

            </LeafletMap>
        </div >
    )
}

export default LightIntensity
