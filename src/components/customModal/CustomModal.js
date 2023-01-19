import React, { useEffect, useState } from "react";
import { Modal, Carousel, Image } from "react-bootstrap";
// import listReactFiles from 'list-react-files'

export default function CustomModal(props) {
  // const [images, setImages] = useState([2, 3, 4, 5, 6, 7, 8, 9]);

  const images = [2, 3, 4, 5, 6]

  // useEffect(() => { 
    // listReactFiles('/').then(files => console.log(files))
  // }, [])

  return (
    <div>
      {/* <button type="button" onClick={props.handleShow}>
        Launch Carousel Modal
      </button> */}

      <Modal
        show={props.show}
        onHide={props.handleClose}
        size={props.fullscreen ? "xl" : "lg"}
        contentClassName={props.fullscreen ? `vh-100 vw-100` : 'w-100'}
        style={{
          top: !props.fullscreen && "15%",
          left: !props.fullscreen && "15%",
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel>
            {/* {props.slides.map((slide, index) => ( */}

            {images.map((im, index) => {
              return (
                <Carousel.Item key={index}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    <Image
                      className=""
                      style={{
                        width: "50%",
                        height: "100%",
                        objectFit: "fill",
                      }}
                      fluid
                      // src={require(`../../images/Data sample/raw/frame00${im}.jpg`)}
                      src={`visual_distortion_data/${props.folderName}/raw/${im}.jpg`}
                      alt={`{im}.jpeg`}
                    />
                    <Image
                      style={{
                        width: "50%",
                        height: "100%",
                        objectFit: "fill",
                      }}
                      fluid
                      // src={require(`../../images/Data sample/pred/frame00${im}.jpg`)}
                      src={`visual_distortion_data/${props.folderName}/pred/${im}.jpg`}
                      alt={`{im}.jpeg`}
                    />
                  </div>
                  {/* <Carousel.Caption>
                    <h3>{`image${im}.jpeg`}</h3>
                    <p>{"slide.caption"}</p>
                  </Carousel.Caption> */}
                </Carousel.Item>
              );
            })}

            {/* ))} */}
          </Carousel>
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
