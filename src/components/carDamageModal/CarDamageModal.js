import { CoPresentOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { display } from "@mui/system";
import React, { useRef, useState, useEffect } from "react";
import { Modal, Carousel } from "react-bootstrap";
import Swal from 'sweetalert2';
import './carDamageModal.css';

export default function CarDamageModal(props) {
    const imageInputRef = useRef()

    const [upImage, setUpImage] = useState('')

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    const handleImageUpload = async (e) => {
        // props.setUserInputImage([...props.userInputImage, imageInputRef.current.value])
        // props.setUserInputImage([...props.userInputImage, e.target.value.split('\\')[2]])


        const file = e.target.files[0]
        const base64 = await convertBase64(file)
        setUpImage(base64)
        // props.setUserInputImage([...props.userInputImage, base64])
    }

    const handleNextButton = (index) => {
        if (!imageInputRef.current.value) {
            Swal.fire({
                title: 'Error!',
                text: 'Please upload the required image',
                icon: 'error',
                confirmButtonText: 'Cancel'
            })  
        }
        else if (props.angleIndex < props.imagesCheckBoxes.length) {

            let imagesCheckBoxes = props.imagesCheckBoxes

            imagesCheckBoxes[props.angleIndex].success = true
            imagesCheckBoxes[props.angleIndex].img = upImage


            props.setImagesCheckBoxes(imagesCheckBoxes)

            props.setAngleIndex(props.angleIndex + 1)

            imageInputRef.current.value = ""
        }

        else {
            let imagesCheckBoxes = props.imagesCheckBoxes
            imagesCheckBoxes[props.angleIndex].success = true
            props.setImagesCheckBoxes(imagesCheckBoxes)
        }
    }

    const handleConfirmation = () => {
        Swal.fire({
            title: 'Are all images correct?',
            // text: 'Please upload the required image',
            icon: 'question',
            confirmButtonText: 'Yes',
            showCloseButton: true,
            buttons: {
                confirm: {
                    text: "Yes, delete it!",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: false,
                },
            },
        }).then((value) => {
            if (value) {
                if (value.isConfirmed === true) {
                    handleConfirm();
                }
                else {
                    console.log("value.isDismissed", value.isDismissed)
                }
            }
        });
    }
    const handleResetButton = () => {
        Swal.fire({
            title: 'Do you want to Reset?',
            icon: 'question',
            showCloseButton: true,
            buttons: {
                cancel: {
                    text: "No, cancel plx!",
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: true,
                },
                confirm: {
                    text: "Yes, delete it!",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: false,
                },
            },
        }).then((value) => {
            if (value) {
                if (value.isConfirmed === true) {
                    handleReset();
                }
                else {
                    console.log("value.isDismissed", value.isDismissed)
                }
            }
        });
    }
    const handleReset = () => {
        setFinalImage(false);
        props.setAngleIndex(0);
        let defaultImagesCheckBoxes = props.imagesCheckBoxes.map((item, index) => {
            item.success = false
            return item
        })
        props.setImagesCheckBoxes(defaultImagesCheckBoxes)
    }

    const [FinalImage, setFinalImage] = useState(false);
    
    const canvasRef = useRef(null);
    const drawCircle = (ctx) => {
        console.log("Inside drawCircle")
        ctx.beginPath();
        ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        ctx.stroke();
    }
    const [getCanvasImage, setCanvasImage] = useState(false);
    const handleConfirm = () => {
        setFinalImage(true);
        // setTimeout(() => {
        //     loadCanvasImage()
        // }, 0);
        setImmediate(() => {
            loadCanvasImage()
        });        
    }

    const loadCanvasImage = () => {
        console.log("canvasRef",canvasRef)
        if(canvasRef.current){
            // const ctx = canvasRef.current.getContext('2d');
            // drawCircle(ctx);
            const ctx = canvasRef.current.getContext('2d');
            const img = new Image();
            setCanvasImage(true)
            img.src = `/carDamage/images/${props.imageAngles[props.angleIndex]['image']}`;
            img.onload = () => {
                // ctx.beginPath();
                // ctx.arc(50, 50, 40, 0, 2 * Math.PI);
                // ctx.fillStyle = "black";
                // ctx.fill();
                ctx.drawImage(img, 0, 0, 300, 300);
            };            
        }
        else{
            console.log("Something wrong in the code..")
        }
    }

    const showDefectedAreaImage = () =>{
        alert("you touch the defected area..")
    }
    console.log("getCanvasImage",getCanvasImage);
    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            size="xl"
            centered
            dialogClassName='adjust-modal'
            contentClassName="h-100"
        >
            <Modal.Header closeButton>
                <Modal.Title>{props.modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <Carousel style={{ width: '100%' }}>
                    <div className="checkBoxAndImageUploadParentDiv">

                        <div className="carDamageModalCheckBoxParent">
                            {props.imagesCheckBoxes.map((item, index) => {
                                return (
                                    <div key={index} className="carDamageModalCheckBoxDiv" >
                                        {
                                            (item.success) ?
                                                (<img src={props.imagesCheckBoxes[index]?.img} width={50} height={40} alt="img" />) :
                                                (item.value)
                                            // <img src={`/carDamage/images/back.png`} style={{width: '10px', height: '10px'}}></img>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                        <div className="imageUpload">
                            <div className="imageUploadTop">
                                {   
                                    (FinalImage ?                                         
                                    <div className="image-grid" >
                                        {/* <canvas ref={canvasRef} width={300} height={300} onLoad={drawImage} /> */}
                                        {/* <canvas ref={canvasRef} width={300} height={300} /> */}
                                        <svg  style={{position:'absolute'}} xmlns={`http://www.w3.org/2000/svg`} version={`1.1`}>
                                            <circle onClick={showDefectedAreaImage} cx={45} cy={52} r={2} stroke="red" stroke-width={2} fill="none" />
                                        </svg>
                                        <svg style={{position:'absolute'}} xmlns={`http://www.w3.org/2000/svg`} version={`1.1`}>
                                            <circle onClick={showDefectedAreaImage} cx={100} cy={52} r={2} stroke="red" stroke-width={2} fill="none" />
                                        </svg>                                                                                
                                    {
                                        <img src={`/carDamage/images/${props.imageAngles[props.angleIndex]['image']}`} style={{ width: '300px', height: '300px' }} />
                                    }
                                    </div> 
                                    :                                     
                                    (props.imageAngles[props.angleIndex]?.count != undefined) ?
                                    <>
                                        <h2>Step {props.imageAngles[props.angleIndex]['count']}/8</h2>
                                        <h3>{props.imageAngles[props.angleIndex]['angle']}</h3>
                                        <img src={`/carDamage/images/${props.imageAngles[props.angleIndex]['image']}`} style={{ width: '250px', height: '250px' }} />

                                        <div style={{ marginLeft: '10%' }}>
                                            <input
                                                type="file"
                                                onChange={(e) => handleImageUpload(e)}
                                                ref={imageInputRef}
                                            />
                                        </div>
                                    </> 
                                    :
                                    <div className="image-grid" >
                                        {
                                            props.imagesCheckBoxes.map((item, index) =>
                                                (item?.img) &&
                                                < img key={index} src={item.img} className="setImageDimension" />
                                            )
                                        }
                                    </div>
                                    )

                                }
                            </div>

                        </div>
                    </div>
                </Carousel>
            </Modal.Body>
            <Modal.Footer>
                {/* <button type="button" onClick={props.handleFullscreen}>
                        {props.fullscreen ? 'Exit Full Screen' : 'Full Screen'}
                    </button> */}
                <div className="footerButtonsDiv">
                    {
                        (props.imageAngles[props.angleIndex]?.count != undefined) ?
                            <>
                                <Button
                                    variant="contained"
                                    sx={{ background: '#243A73' }}
                                    onClick={() => handleNextButton(props.angleIndex)}
                                    style={{ fontFamily: 'DINArabic_Regular', borderRadius: 0 }}
                                >Next
                                </Button>
                                <Button variant="contained" color="error" onClick={props.handleClose} style={{ fontFamily: 'DINArabic_Regular', borderRadius: 0 }}>
                                    Close
                                </Button>
                            </>
                            :
                            <>
                                <Button
                                    variant="contained"
                                    sx={{ background: '#243A73' }}
                                    onClick={handleConfirmation}
                                    style={{ fontFamily: 'DINArabic_Regular', borderRadius: 0 }}
                                >Confirm
                                </Button>
                                <Button variant="contained" color="error" onClick={handleResetButton} style={{ fontFamily: 'DINArabic_Regular', borderRadius: 0 }}>
                                    Reset
                                </Button>
                            </>
                    }
                    {/* <Button variant="contained" color="error" onClick={props.handleClose} style={{ fontFamily: 'DINArabic_Regular', borderRadius: 0 }}>
                        Close
                    </Button> */}
                </div>
            </Modal.Footer>
        </Modal>
    );
}
