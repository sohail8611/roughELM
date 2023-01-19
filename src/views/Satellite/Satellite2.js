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

import styles from './satellite.module.css'
import CustomBackDrop from "../../components/BackDrop/CustomBackDrop";
import { set } from "lodash";


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

    // useRef hook for getting the canvas element
    const canvas = useRef(null);
    // useRef hook for getting the image element
    const image = useRef(null);


    //////////////////  csv read states and functions start ////////////////////
    const [satelliteData, setSatelliteData] = useState(null)
    const [catagories, setCatagories] = useState(null)
    const [markersCatagory, setMarkersCatagory] = useState(null)
    const [markersCatagorySorted, setMarkersCatagorySorted] = useState(null)
    const [activeButton, setActiveButton] = useState(null)
    // const [imageToggle, setImageToggle] = useState("combinedImage")
    const [imageToggleIndex, setImageToggleIndex] = useState(0)
    const [index, setIndex] = useState(0)

    const [loading, setLoading] = useState(true)


    let imageLoaded = false

    const Previous = () => {
        setIndex(index - 1)
        // setTranlateX(0)
        // setTranlateY(0)
        setTranslate({ x: 0, y: 0 })
        setTransitionSpeed(2)
    }
    const Next = () => {

        let markersCatagorySortedLength = markersCatagorySorted?.data.length;
        if (index == markersCatagorySortedLength - 1) {
            setIndex(0)
        } else {
            setIndex(index + 1)

        }

        setTranlateX(0)
        setTranlateY(0)
        setTransitionSpeed(2)

    }
    const Reset = () => {
        setIndex(0)
        setMarkersCatagorySorted(null)
        setActiveButton(null)
        setZoomLevel(1)

        // setTranlateX(0)
        // setTranlateY(0)
        setTranslate({ x: 0, y: 0 })
        setTransitionSpeed(2)
    };

    const handleSatelliteCatagoryButton = (categoryName) => {
        setMarkersCatagorySorted(markersCatagory[categoryName])
        setIndex(0)
        setActiveButton(categoryName)
        setZoomLevel(3)
        // setTranlateX(0)
        // setTranlateY(0)
        setTranslate({ x: 0, y: 0 })
        setTransitionSpeed(2)

        console.log("transloate:", translate);
        console.log(markersCatagorySorted?.data[index]['marker'][0]);
        console.log(markersCatagorySorted?.data[index]['marker'][1]);
    }

    let heatMap = true

    const handleToggleImage = () => {
        setLoading(true)
        heatMap = !heatMap
        drawCanvasAndMarkers(heatMap) // false means no heatmap

    }

    const handleChangeView = (e) => {
        imageLoaded = false
        Reset()
        setLoading(true)
        setImageToggleIndex(0)

        setSatelliteData(null)
        setCatagories(null)
        setMarkersCatagory(null)

        setGlobalIndex(e.target.value)

    }

    const handleTranslateX = (direction) => {

        // if (activeButton) {
        if (direction === 'right') {
            // setTranlateX(translateX + 1)
            setTranslate({ ...translate, x: (translate.x + 5) })
            console.log("right");
        } else {
            // setTranlateX(translateX - 1)
            setTranslate({ ...translate, x: (translate.x - 5) })
            console.log("left");
        }
        // }


        // console.log(markersCatagorySorted?.data[index]['marker'][0] + 1)

    }
    const handleTranslateY = (direction) => {

        // if (activeButton) {
        if (direction === 'up') {
            // setTranlateY(translateY - 5)
            setTranslate({ ...translate, y: (translate.y - 5) })
            // console.log("up");
        } else {
            // setTranlateY(translateY + 5)
            setTranslate({ ...translate, y: translate.y + 5 })
            // console.log("down");
        }
        // }
    }
    const onScroll = (e) => {
        const delta = e.deltaY * -0.01;

        if (delta > 0) {
            if (zoomLevel < 10) {
                setZoomLevel(zoomLevel + 1)
            }
        } else {
            if (zoomLevel > 1) {
                setZoomLevel(zoomLevel - 1)
            }
        }
    };

    let coords = {}

    let dragging = false
    const handleMouseDown = function (e) {
        dragging = true;
        //Set coords
        coords = {
            x: e.pageX,
            y: e.pageY,
        };
        setTransitionSpeed(0.5)
        console.log("1a");
        // setCanvasPointer('grabbing')
    }
    const handleMouseUp = function () {
        dragging = false;
        coords = {};
        console.log("2a");

        // setTimeout(() => {
        //     setCanvasPointer('grab')
        // }, 100)

    }
    const handleMouseMove = function (e) {
        //If we are dragging
        if (dragging) {
            e.preventDefault();

            //Get mouse change differential
            let xDiff = coords.x - e.pageX
            let yDiff = coords.y - e.pageY;

            //Update to our new coordinates
            coords.x = e.pageX;
            coords.y = e.pageY;
            //Adjust our x,y based upon the x/y diff from before
            // var x = this.state.x - xDiff;
            // var y = this.state.y - yDiff;

            //Re-render
            // this.setState(this.state);

            // console.log("x, y:", coords.x/1000, coords.y/1000);
            console.log("coords.x, coords.y:", coords.x, coords.y);
            console.log("e.pageX, e.pageY:", e.pageX, e.pageY);
            console.log("x, y:", xDiff, yDiff);

            // coords.x = xDiff * 5;
            // coords.y = yDiff * 5;

            setTranslate({ x: (translate.x + xDiff), y: (translate.y + yDiff) })

            // if ((xDiff > 0) && (yDiff > 0)) {
            //     // setTranslate({ x: (xDiff + 5), y: (yDiff + 5) })
            //     setTranslate({ x: (translate.x + xDiff), y: (translate.y + yDiff) })
            //     console.log("1");
            // } else if ((xDiff < 0) && (yDiff < 0)) {
            //     // setTranslate({ x: (xDiff - 5), y: (yDiff - 5) })
            //     setTranslate({ x: (translate.x - xDiff), y: (translate.y + yDiff) })
            //     console.log("2");
            // } else if ((xDiff > 0) && (yDiff < 0)) {
            //     // setTranslate({ x: (xDiff + 5), y: (yDiff - 5) })
            //     setTranslate({ x: (translate.x + xDiff), y: (translate.y - yDiff) })
            //     console.log("3");
            // } else if ((xDiff < 0) && (yDiff > 0)) {
            //     // setTranslate({ x: (xDiff - 5), y: (yDiff + 5) })
            //     setTranslate({ x: (translate.x - xDiff), y: (translate.y + yDiff) })
            //     console.log("4");
            // }
            // else {
            //     setTranslate({ x: (xDiff - 5), y: (yDiff - 5) })
            //     console.log(5);
            // }
            // if (yDiff > 0) {
            //     // setTranlateY(translateY + (yDiff + 5))
            //     setTranslate({ ...translate, y: (xDiff + 5) })
            // } else {
            //     // setTranlateY(translateY + (yDiff - 5))
            //     setTranslate({ ...translate, y: (xDiff - 5) })
            // }

            // setTranlateX(translateX + (xDiff))
            // setTranlateY(translateY + (yDiff))
        }
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


        fetch(`/satellite/${switchData[checkIndex].fileName}`)
            .then((response) => response.text())
            .then((data) =>

                Papa.parse(data, {
                    header: true,
                    complete: (results) => {
                        console.log("results:", results);

                        let uniqueObjTypes = [...new Set(results.data.map(item => item.obj_type))];
                        uniqueObjTypes = uniqueObjTypes.filter(element => element !== undefined);

                        setCatagories(uniqueObjTypes)


                        uniqueObjTypes.map((item) => {
                            filterDataForMarkersZoom[item] = { data: [] }
                        });

                        // seperating markers catagory wise eg: openLane, construction, waterLeakage
                        results.data.map((item, index) => {
                            // console.log("item:", item);
                            if (item.obj_type) {
                                filterDataForMarkersZoom[item.obj_type].data.push({ img_id: item.img_id, center: item.center, marker: JSON.parse(item.marker), zoomLevel: zoomLevel })
                            }
                        })


                        // console.log("filterDataForMarkersZoom");
                        // console.log(filterDataForMarkersZoom);
                        setMarkersCatagory(filterDataForMarkersZoom)

                        // console.log("satesate");
                        // console.log(results.data);
                        setSatelliteData(results.data)
                    },
                })
            ).catch((e) => {
                console.log("errorReadingFile:", e);
            });
    }, [globalIndex]);


    // const [marker, setMarker] = useState([289.5, 2033.0])
    // const [customZoom, setCustomZoom] = useState([1, 29])




    function drawMarkers(canvasC, ctx, img) {
        if (satelliteData) {
            // ctx.reset()
            canvasC.width = img.width;
            canvasC.height = img.height;
            ctx.drawImage(img, 0, 0, canvasC.width, canvasC.height);
            if (heatMap) {
                setTimeout(() => {
                    satelliteData.map((item, index) => {
                        if (item.center) {
                            // console.log("loader")
                            // console.log(JSON.parse(item.center)[0]);
                            // console.count()
                            let radius = 40
                            let x = JSON.parse(item.center)[0]
                            let y = JSON.parse(item.center)[1]
                            // console.log("item.x2:", Number(item.x2) - Number(item.x1));
                            let width = Number(item.x2) - Number(item.x1)
                            let heigth = Number(item.y2) - Number(item.y1)

                            if (item.obj_type == "Open Land") {
                                ctx.fillStyle = `red`;
                                radius = 20
                            } else if (item.obj_type == "Water leakage") {
                                ctx.fillStyle = `blue`;
                                radius = 30
                            } else if (item.obj_type == "Construction site") {
                                ctx.fillStyle = `yellow`;
                                radius = 50
                            } else if (item.obj_type == "Green area") {
                                ctx.fillStyle = `green`;
                                radius = 20
                            }
                            ctx.globalAlpha = item.intensity - 0.2
                            ctx.beginPath();
                            // ctx.arc(x, y, radius, 0, 2 * Math.PI);
                            ctx.ellipse(x, y, width / 2, heigth / 2, 0, 0, 2 * Math.PI);
                            ctx.fill();
                        }

                    })
                    setLoading(false)
                }, 500);
            } else {
                setLoading(false)
            }

            // let radius = 40
            // ctx.fillStyle = `red`;
            // radius = 20
            // ctx.beginPath();
            // // ctx.globalAlpha = 0.4;
            // ctx.arc(marker[0], marker[1], radius, 0, 2 * Math.PI);
            // // ctx.ellipse(x, y, 150 / 2, 100 / 2, 0, 0, 2 * Math.PI);
            // ctx.fill();

        } else {
            setLoading(false)
        }
    }

    function drawCanvasAndMarkers() {
        const canvasC = canvas.current;
        const ctx = canvasC.getContext("2d");
        const img = image.current


        img.onload = () => {
            canvasC.width = img.width;
            canvasC.height = img.height;
            ctx.drawImage(img, 0, 0, canvasC.width, canvasC.height);
            ctx.save()
            imageLoaded = true
        }

        img.onError = () => {
            console.log("error aagay");
        }

        if (imageLoaded = true) {

            drawMarkers(canvasC, ctx, img)
        }



    }


    useEffect(() => {
        drawCanvasAndMarkers()
    }, [satelliteData, globalIndex])


    let xPosition = markersCatagorySorted?.data[index]['marker'][0]
    let yPosition = markersCatagorySorted?.data[index]['marker'][1]


    return (

        <div className={styles.main}>
            <CustomBackDrop loading={loading} />
            <div className={[`${styles.leftDiv}`]}>
                <div className={styles.heatMapButtonsDiv}>
                    <div className={styles.categoriesTitleDiv}>
                        <h2>Satellite View</h2>
                    </div>
                    {
                        (catagories) && (
                            catagories.map((item, index) => (
                                <Button
                                    key={index}
                                    variant="text"
                                    fullWidth={true}
                                    size="small"
                                    className={styles.heatmapButton}
                                    onClick={() => handleSatelliteCatagoryButton(item)}
                                    style={{ background: (item == activeButton) && '#243A73', fontFamily: 'DINArabic_Regular' }}
                                    startIcon={<CircleIcon style={{ color: (item == "Open Land") ? 'red' : (item == "Water leakage") ? 'blue' : (item == "Construction site") ? 'yellow' : 'green' }} />}

                                >
                                    {item}
                                </Button>
                            ))
                        )
                    }
                </div>
            </div>
            <div className={styles.rightDiv}>
                <div className={styles.zoomParentDiv} >
                    <BootButton variant="primary"
                        onClick={
                            () => {
                                if (zoomLevel < 10) {
                                    setTransitionSpeed(2)
                                    setZoomLevel(zoomLevel + 1)
                                }
                            }
                        }
                        className={styles.changeBorderRadius}
                    >+</BootButton>
                    <BootButton variant="primary"
                        onClick={
                            () => {
                                if (zoomLevel > 1) {
                                    setTransitionSpeed(2)
                                    setZoomLevel(zoomLevel - 1)
                                }
                            }
                        }
                        className={styles.changeBorderRadius}
                    >-</BootButton>


                </div>


                {
                    (activeButton || zoomLevel > 1) ?
                        (
                            <div className={styles.translateButtonsDiv}>
                                <div style={{ position: 'relative' }}>
                                    <BootButton
                                        variant="primary"
                                        className={`${styles.translateButton} ${styles.forward_button}`}
                                        onClick={() => handleTranslateY('up')}
                                    // disabled={(!activeButton ? true : false)}
                                    >
                                        <ArrowUpwardIcon fontSize="small" />
                                    </BootButton>
                                    <BootButton
                                        variant="primary"
                                        className={`${styles.translateButton} ${styles.backward_button}`}
                                        onClick={() => handleTranslateY('down')}
                                    // disabled={(!activeButton ? true : false)}
                                    >
                                        <ArrowDownwardIcon fontSize="small" />
                                    </BootButton>
                                    <BootButton
                                        variant="primary"
                                        className={`${styles.translateButton} ${styles.right_button}`}
                                        onClick={() => handleTranslateX('right')}
                                    // disabled={(!activeButton ? true : false)}
                                    >
                                        <ArrowForwardIcon fontSize="small" />
                                    </BootButton>
                                    <BootButton
                                        variant="primary"
                                        className={`${styles.translateButton} ${styles.left_button}`}
                                        onClick={() => handleTranslateX('left')}
                                    // disabled={(!activeButton ? true : false)}
                                    >
                                        <ArrowBackIcon fontSize="small" />
                                    </BootButton>
                                </div>
                            </div>
                        ) :
                        null
                }



                <div style={{ display: 'none' }}>
                    <img ref={image} src={`/satellite/${switchData[globalIndex].images[imageToggleIndex]}`} style={{ display: 'none' }} alt='Satellite Image'></img>
                </div>
                <Button variant="contained" className={styles.toggleImage} size={'small'} onClick={handleToggleImage} style={{ fontFamily: 'DINArabic_Regular' }}>Toggle Image</Button>
                <div className={styles.switchMapDropDownParent}>
                    <FormControl fullWidth size="small">
                        {/* <InputLabel id="demo-simple-select-label">Select</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={globalIndex}
                            label="Change View"
                            onChange={handleChangeView}
                            className={styles.changeViewDropDown}
                            style={{ fontFamily: 'DINArabic_Regular' }}
                        >
                            <MenuItem value={0} style={{ fontFamily: 'DINArabic_Regular', borderRadius: '0px' }}>View 1</MenuItem>
                            <MenuItem value={1} style={{ fontFamily: 'DINArabic_Regular', borderRadius: '0px' }}>View 2</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className={styles.buttonsParentDiv}>
                    {
                        activeButton ? (
                            <>
                                <button className={styles.nextResetButton} onClick={Previous} disabled={(index == 0) && true}>Previous</button>
                                <button className={styles.nextResetButton} onClick={Reset}>Reset</button>
                                <button className={styles.nextResetButton} onClick={Next} disabled={(index == markersCatagorySorted?.data.length - 1) && true}>Next</button>
                            </>
                        ) :
                            <>
                                <button className={styles.nextResetButton} onClick={Reset}>Reset</button>
                            </>
                    }
                </div>
                {/* <div className={styles.imageParentDiv} style={{ transform: `scale(${box[index][0]})`, transformOrigin: `${box[index][1]}px ${box[index][2]}px` }}> */}
                {/* <div className={styles.imageParentDiv} style={{ transform: `scale(${(markersCatagorySorted?.data[index]['zoomLevel']) ? markersCatagorySorted?.data[index]['zoomLevel'] : 1})`, transformOrigin: `${markersCatagorySorted?.data[index]['marker'][0]}% ${markersCatagorySorted?.data[index]['marker'][1]}%` }}> */}
                <div
                    className={styles.imageParentDiv}
                    onWheelCapture={onScroll}
                    // onMouseDown={handleMouseDown}
                    // onMouseUp={handleMouseUp}
                    // onMouseMove={handleMouseMove}
                    style={{
                        transform: `scale(${zoomLevel}`,
                        transformOrigin: `${(xPosition != undefined) ? (xPosition + translate.x) : translate.x + 50}% ${(yPosition != undefined) ? (yPosition + translate.y) : (translate.y + 80)}%`,
                        transition: `all ease ${transitionSpeed}s`,
                        cursor: canvasPointer
                    }}
                >


                    <canvas ref={canvas} className={styles.myCanvas} />
                </div>
            </div>
        </div >

    )
}

export default Satellite