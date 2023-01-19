import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./videoModal.css";

export default function VideoModal(props) {
  //   const [images, setImages] = useState([2, 3, 4, 5, 6, 7, 8, 9]);

  return (
    <div>
      {/* <button type="button" onClick={props.handleShow}>
        Launch Carousel Modal
      </button> */}

      <Modal
        show={props.show}
        onHide={props.handleClose}
        size={props.fullscreen ? "xl" : "lg"}
        contentClassName={props.fullscreen ? `vh-100 vw-100` : "vh-90 w-100"}
        style={{
          top: !props.fullscreen && "15%",
          left: !props.fullscreen && "15%",
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            width="100%"
            height="100%"
            // src="https://www.youtube.com/embed/M7lc1UVf-VE"
            src={require("../../videos/Video 3.mp4")}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            width="100%"
            height="100%"
            // src="https://www.youtube.com/embed/M7lc1UVf-VE"
            src={require("../../videos/Video3 Output.mp4")}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" onClick={props.handleFullscreen}>
            {props.fullscreen ? 'Exit Full Screen' : 'Full Screen'}
          </button>
          <button type="button" onClick={props.handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
