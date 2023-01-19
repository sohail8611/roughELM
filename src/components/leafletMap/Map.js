import React, { useState } from "react";
import L from "leaflet";
import {
  Map as LeafletMap,
  TileLayer,
  Marker,

  CircleMarker,
  Circle,
} from "react-leaflet";
import "../../../node_modules/leaflet/dist/leaflet.css";

import HeatmapLayer from "react-leaflet-heatmap-layer";
import "./map.css";
// import { geojson } from "./atd";
import CustomModal from "../customModal/CustomModal";
import VideoModal from "../videoModal/VideoModal";

function Map(props) {
  const [data, setData] = useState({
    // lat: 26.6114, //12.9716
    // lng: 37.9257, //77.5946
    zoom: 13,
    position: [26.584583308730522, 37.9418390651161], //position: [24.558372631414468, 46.53989870910598]
  });

  const [folderName, setFolderName] = useState('')

  const dummyPosition = [26.584583308730522, 37.9418390651161];

  const myMarkers = [
    [24.549466983888195, 46.53895087804749, 10],
    [24.5554909472383, 46.552853326737576, 10],
    [24.56356678419343, 46.57616172414532, 10],
  ];

  ///////// HANDLE CIRCLE HOVERING ///////////////////
  const handleIncreaseRadiusCircleOnHovering = (circleText) => {
    let circleCopy = props.circle;
    let circleSize = 10;
    circleCopy.map((item, index) => {
      if (item.circleName === circleText) {
        circleCopy[index]["radius"] = circleSize;
        props.setCircle([...circleCopy]);
      }
    });
  };

  const handleDecreaseRadiusCircleOnAfterHovering = (circleText) => {
    let circleCopy = props.circle;
    circleCopy.map((item, index) => {
      if (item.circleName === circleText) {
        circleCopy[index]["radius"] = 5;
        props.setCircle([...circleCopy]);
      }
    });
  };

  ////////// image modal start //////////////
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalTitle, setImageModalTitle] = useState('')
  const handleCloseImageModal = () => setShowImageModal(false);
  const handleShowImageModal = (modalTitle, folder) => {
    setImageModalTitle(modalTitle)
    setShowImageModal(true)
    console.log("jsdf:", folder);
    setFolderName(folder)
  };
  // const handleOpenImageModal = () => {
  //   handleShowImageModal(true);
  // };

  const [fullscreen, setFullscreen] = useState(false);
  const handleFullscreen = () => {
    setFullscreen(!fullscreen);
  };
  ////////// image modal end //////////////

  /////////// video modal start ////////////
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoModalTitle, setVideoModalTitle] = useState('')
  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setFullscreen(false);
  };

  const handleShowVideoModal = (modalTitle) => {
    setVideoModalTitle(modalTitle)
    setShowVideoModal(true)
  };
  // const handleShowVideoModal = () => {
  //   setShowVideoModal(true);
  // };
  const handleOpenVideoModal = () => {
    // handleShowVideoModal(true);
    setShowVideoModal(true);
    setFullscreen(false)
  };
  /////////// video modal end ////////////

  return (
    <div className="mapParentDiv" style={{opacity:0.9}}>
      <CustomModal
        modalTitle={'Detections'}
        handleClose={handleCloseImageModal}
        // handleShow={handleShowImageModal}
        // handleModalOpen={handleShowImageModal}
        show={showImageModal}
        setShow={setShowImageModal}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
        handleFullscreen={handleFullscreen}
        folderName={folderName}
      />
      <VideoModal
        modalTitle={'Detections'}
        handleClose={handleCloseVideoModal}
        // handleShow={handleShowVideoModal}
        // handleModalOpen={handleOpenVideoModal}
        show={showVideoModal}
        setShow={setShowVideoModal}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
        handleFullscreen={handleFullscreen}
      />


      <LeafletMap center={data.position} zoom={data.zoom} minZoom={12} maxZoom={16} maxBounds={[
        [26.586383555469038, 37.60184915296756],
        [26.980792083106675, 37.89225389020113],
        [26.65093239768291, 38.304732931508845],
        [26.374715313335813, 38.03425297302984],
      ]}
      // zoomDelta = {0.1}
      // wheelPxPerZoomLevel={2}
      zoomControl={true}
      zoomAnimation={true}
      zoomAnimationDuration={100000}
      // fadeAnimation={true}
      // animate={true}
      opacity={0.5}
      >


        {props.circle.map((m, i) =>
          m.circle == "FALSE" ? (
            null
          ) : m.clickable == "TRUE" ? (
            null
          ) : (
            <CircleMarker
              key={i}
              center={m.latLongs}
              // pathOptions={{ fillColor: "red", }}

              fillColor={m.circleColor}
              fillOpacity={0.5}
              radius={m.radius - 3}

              stroke={false}
              opacity={1}
            // O={m.opacity}
            // onmouseover={() => setCircleRadiusOnHover(10)}
            />
          )
        )}


        {props.circle.map((m, i) =>
          m.circle == "FALSE" ? null : m.clickable ==
            "FALSE" ? null : m.isVideo == "FALSE" ? (
              <>
                <CircleMarker
                  key={i}
                  center={m.latLongs}
                  // pathOptions={{ fillColor: "red", }}

                  fillColor={m.circleColor}
                  fillOpacity={0.9}
                  radius={2}

                  stroke={false}
                  opacity={1}
                // O={m.opacity}
                // onmouseover={() => setCircleRadiusOnHover(10)}
                />

                <CircleMarker
                  key={i}
                  center={m.latLongs}
                  // stroke={100}
                  weight={1}
                  fillOpacity={0}
                  color={'white'}
                  // circleColor={'red'}
                  radius={m.radius+1}
                  onmouseover={() =>
                    handleIncreaseRadiusCircleOnHovering(m.circleName)
                  }
                  onmouseout={() =>
                    handleDecreaseRadiusCircleOnAfterHovering(m.circleName)
                  }
                  onClick={() => handleShowImageModal(m.case, m.images_location)}
                >

                </CircleMarker>


              </>

            ) : (
            <Marker
              icon={
                new L.Icon({
                  iconUrl: require("../../images/videoMarker2.png"),
                  iconRetinaUrl: require("../../images/videoMarker2.png"),
                  iconAnchor: null,
                  popupAnchor: null,
                  shadowUrl: null,
                  shadowSize: null,
                  shadowAnchor: null,
                  iconSize: new L.Point(m.radius + 20, m.radius + 20),
                  // className: "leaflet-div-icon",
                  className: "videoMarker",
                })
              }
              // key={item.toString()}
              position={m.latLongs}
              onmouseover={() =>
                handleIncreaseRadiusCircleOnHovering(m.circleName)
              }
              onmouseout={() =>
                handleDecreaseRadiusCircleOnAfterHovering(m.circleName)
              }
              onClick={() => handleShowVideoModal(m.case)}
            >
              {/* {item.title && (
                <Popup>
                  <span>{item.title}</span>
                </Popup>
              )} */}
            </Marker>
          )
        )}




        {props.geoJsonHeatMapData && (
          <HeatmapLayer
            points={props.geoJsonHeatMapData.features}
            longitudeExtractor={(m) => m.geometry.coordinates[0]}
            latitudeExtractor={(m) => m.geometry.coordinates[1]}
            intensityExtractor={(m) => parseFloat(m.geometry.intensity)}
            max={100}
          // minOpacity={0.1}
          />
        )}

        {/* <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          // url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        // https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg
        /> */}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          // transparency
          
        // url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        // url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        // url = 'https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'
        // url = 'https://tile.osm.ch/switzerland/{z}/{x}/{y}.png'
        />
        {/*             
        'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'   noname tile
    <Marker>

    </Marker> */}
      </LeafletMap>
    </div>
  );
}

export default Map;