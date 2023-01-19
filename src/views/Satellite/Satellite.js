import React, { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import Swal from "sweetalert2";
import { Button, FormControl, MenuItem, Select } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BootButton from 'react-bootstrap/Button';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import styles from './satellite.module.css'
import styles1 from '../VisualDistortion/visualDistortion.module.css'
import CustomBackDrop from "../../components/BackDrop/CustomBackDrop";


import L from "leaflet";
import {
    Map as LeafletMap,
    TileLayer,
    Marker,
    CircleMarker,
    Circle,
    ImageOverlay,
} from "react-leaflet";
import "../../../node_modules/leaflet/dist/leaflet.css";

import HeatmapLayer from "react-leaflet-heatmap-layer";


function Satellite() {

    // const zoomLevel = 3

    const [zoomLevel, setZoomLevel] = useState(1)
    const [translateX, setTranlateX] = useState(0)
    const [translateY, setTranlateY] = useState(0)
    const [translate, setTranslate] = useState({ x: 0, y: 0 })
    const [transitionSpeed, setTransitionSpeed] = useState(2)
    const [canvasPointer, setCanvasPointer] = useState('grab')

    const [switchData, setSwitchData] = useState(
        [
            {
                fileName: 'data_1/data1.csv',
                images: ['data_1/combinedImage.jpg', 'data_1/combinedImageHeatMap.jpg']
            },
            {
                fileName: 'data_2/data2.csv',
                images: ['data_2/combined_image_1.jpg']
            }
        ]


    )
    const [globalIndex, setGlobalIndex] = useState(0)

    const [bound, setBound] = useState(
        [
            // [0, 5637],
            // [5562, 0]
            [0, 500],
            [500, 0]

        ]
    )


    //////////////////  csv read states and functions start ////////////////////
    const [satelliteData, setSatelliteData] = useState(null)
    const [catagories, setCatagories] = useState(null)
    const [markersCatagory, setMarkersCatagory] = useState(null)
    const [markersCatagorySorted, setMarkersCatagorySorted] = useState(null)
    const [activeButton, setActiveButton] = useState(null)
    const [loading, setLoading] = useState(false)

    const [allCoordinates, setAllCoordinates] = useState()


    console.log("satelliteData:", satelliteData);
    console.log("markersCatagory:", markersCatagory);
    console.log("allCoordinates:", allCoordinates);
    console.log("catagories:", catagories);

    const handleSatelliteCatagoryButton = (categoryName) => {
        // setMarkersCatagorySorted(markersCatagory[categoryName])
        // setIndex(0)
        // setActiveButton(categoryName)
        // setZoomLevel(3)
        // setTranslate({ x: 0, y: 0 })
        // setTransitionSpeed(2)

    }

    const handleMouseHoverOnHeatMapButton = (heatMapButtonText, index) => {


        // let filteredArray =catagories.filter(function (item) {
        //     return item.name == heatMapButtonText;
        //   });

        let copyHeatMapButtons = [...catagories]

        copyHeatMapButtons[index].hover = true
        setCatagories(copyHeatMapButtons)


        setMarkersCatagorySorted(markersCatagory[heatMapButtonText])

    };
    const handleMouseOutOnHeatMapButton = (index) => {
        let copyHeatMapButtons = [...catagories]
        copyHeatMapButtons[index].hover = false
        setCatagories(copyHeatMapButtons)
        setMarkersCatagorySorted(null)
    };

    function countNames(data, findBy) {
        const nameCounts = {};
        for (let i = 0; i < data.length; i++) {
            const name = data[i][findBy];
            if (nameCounts[name]) {
                nameCounts[name]++;
            } else {
                nameCounts[name] = 1;
            }
        }
        return nameCounts;
    }

    useEffect(() => {
        let filterDataForMarkersZoom = {}
        setMarkersCatagory(null)
        setSatelliteData(null)
        setCatagories(null)
        //read from detect_draf_satellite.csv file 
        let checkIndex = 0
        if (switchData[globalIndex].fileName) {
            checkIndex = globalIndex
        } else {
            checkIndex = 0
        }
        let tempCoordinates = []

        fetch(`/satellite/${switchData[checkIndex].fileName}`)
            .then((response) => response.text())
            .then((data) =>

                Papa.parse(data, {
                    header: true,
                    complete: (results) => {
                        console.log("results:", results);

                        let uniqueObjTypes = [...new Set(results.data.map(item => item.obj_type))];
                        uniqueObjTypes = uniqueObjTypes.filter(element => element !== undefined);

                        let nameAndCount = countNames(results.data, 'obj_type')

                        let tempArray = []
                        uniqueObjTypes.map((name, index) => {
                            tempArray.push({ name, nameAndCount, hover: false })
                        })

                        setCatagories(tempArray)

                        uniqueObjTypes.map((item) => {
                            filterDataForMarkersZoom[item] = { data: [] }
                        });

                        // seperating markers catagory wise eg: openLane, construction, waterLeakage
                        results.data.map((item, index) => {
                            if (item.obj_type) {
                                tempCoordinates.push({
                                    // coordinates: [5562 - 695.0, 2603.0]
                                    // coordinates: [5562 - (JSON.parse(item.center)[1]), (JSON.parse(item.center)[0])]
                                    coordinates: [500 - ((JSON.parse(item.center)[1] * 500) / 5562), ((JSON.parse(item.center)[0]) * 500) / 5637]
                                    // coordinates: [5562 - 3536.0, 4191.0]

                                })
                                filterDataForMarkersZoom[item.obj_type].data.push({
                                    coordinates: [500 - ((JSON.parse(item.center)[1] * 500) / 5562), ((JSON.parse(item.center)[0]) * 500) / 5637], name: item.obj_type,
                                    intensity: 5000
                                })
                            }

                        })
                        setMarkersCatagory(filterDataForMarkersZoom)
                        setSatelliteData(results.data)
                        setAllCoordinates(tempCoordinates)
                    },
                })
            ).catch((e) => {
                console.log("errorReadingFile:", e);
            });
    }, [globalIndex]);


    return (

        <div className={styles.main}>
            <CustomBackDrop loading={loading} />
            <div className={[`${styles.leftDiv}`]}>
                <div className={styles.heatMapButtonsDiv}>
                    <div className={styles.categoriesTitleDiv}>
                        <h2>Satellite View</h2>
                    </div>
                    <div className={styles.labels}>
                        <ul className={styles.heatmapButtonBox}>
                            {

                                (catagories) && (
                                    catagories.map((item, index) => (
                                        // heatMapButtons.map((item, index) => (
                                        <div className={styles.liAndCheckIcon}
                                            onMouseEnter={() => handleMouseHoverOnHeatMapButton(item.name, index)}
                                            onMouseOut={() => handleMouseOutOnHeatMapButton(index)}
                                        >
                                            <span>
                                                {(item.hover) && <CheckOutlinedIcon sx={{ fontSize: 12 }} />}
                                            </span>
                                            <li className={styles.heatmapButton}>
                                                {item.name}
                                            </li>
                                            <div className={styles.count}>
                                                {item.nameAndCount[item.name]}
                                            </div>
                                        </div>
                                        // ))
                                    ))

                                )
                            }

                        </ul>
                    </div>

                </div>
            </div>
            <div className={styles.rightDiv}>
                <LeafletMap
                    className=""
                    crs={L.CRS.Simple}
                    bounds={bound}
                    scrollWheelZoom={true}
                    attributionControl={false}
                    zoomControl={true}
                    maxBounds={bound}
                    style={{ background: 'url(/stars.gif)', background: 'black' }}
                    setView={[500, 500]}
                >

                    {allCoordinates && (
                        markersCatagorySorted ? (

                            <HeatmapLayer
                                points={markersCatagorySorted.data}
                                longitudeExtractor={(m) => m.coordinates[1]}
                                latitudeExtractor={(m) => m.coordinates[0]}
                                intensityExtractor={(m) => m.intensity}
                            // max={100}
                            />
                        ) :
                            null
                        // <HeatmapLayer
                        //     points={allCoordinates}
                        //     longitudeExtractor={(m) => m.coordinates[1]}
                        //     latitudeExtractor={(m) => m.coordinates[0]}
                        //     intensityExtractor={(m) => 100}
                        // />
                    )}
                    <ImageOverlay
                        url={`/satellite/data_1/combinedImage.jpg`}
                        bounds={bound}

                    />
                </LeafletMap>
            </div>
        </div >

    )
}

export default Satellite