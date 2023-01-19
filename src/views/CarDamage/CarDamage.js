import { IconButton } from '@mui/material';
import React, { useState } from 'react'

import CarDamageModal from '../../components/carDamageModal/CarDamageModal';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import './carDamage.css'

function CarDamage() {

    const [imagesCheckBoxes, setImagesCheckBoxes] = useState([
        {
            value: 1,
            icon: <CheckOutlinedIcon />,
            success: false
        }, {
            value: 2,
            icon: <CheckOutlinedIcon />,
            success: false
        }, {
            value: 3,
            icon: <CheckOutlinedIcon />,
            success: false
        }, {
            value: 4,
            icon: <CheckOutlinedIcon />,
            success: false
        }, {
            value: 5,
            icon: <CheckOutlinedIcon />,
            success: false
        }, {
            value: 6,
            icon: <CheckOutlinedIcon />,
            success: false
        }, {
            value: 7,
            icon: <CheckOutlinedIcon />,
            success: false
        }, {
            value: 8,
            icon: <CheckOutlinedIcon />,
            success: false
        },
    ])
    const [imageAngles, setImageAngles] = useState([
        {
            count: 1,
            angle: 'Front',
            image: 'front.png'
        }, {
            count: 2,
            angle: 'Back',
            image: 'back.png'
        }, {
            count: 3,
            angle: 'Left',
            image: 'left.jpg'
        }, {
            count: 4,
            angle: 'Right',
            image: 'right.jfif'
        }, {
            count: 5,
            angle: 'Front Left',
            image: 'front_left.png'
        }, {
            count: 6,
            angle: 'Back Left',
            image: 'back_left.png'
        }, {
            count: 7,
            angle: 'Front Right',
            image: 'front_right.png'
        }, {
            count: 8,
            angle: 'Back Right',
            image: 'back_right.png'
        }, {
            angle: 'Final Result',
            image: 'damageSubmitImage.png'
        }

    ])

    const [angleIndex, setAngleIndex] = useState(0)
    const [showcarDamageModal, setShowCarDamageModal] = useState(false);
    const [userInputImage, setUserInputImage] = useState([]);
    // console.log('userInputImage');
    // console.log('userInputImage:', userInputImage.length);

    const handleCloseCarDamageModal = () => setShowCarDamageModal(false);
    const handleShowCarDamageModal = () => setShowCarDamageModal(true);


    const [fullscreen, setFullscreen] = useState(false);
    const handleFullscreen = () => {
        setFullscreen(!fullscreen);
    };
    return (
        <div className='carDamageMain'>
            <div className='carDamageModalParent'>
                {/* <Button variant='contained' onClick={handleShowCarDamageModal}>Add Car Images</Button> */}
                <h1 className="uploadCarImages">Upload Car Images</h1>
                <IconButton className='plusIconButton' color="primary" aria-label="upload picture" component="label" onClick={handleShowCarDamageModal}>
                    {/* <input hidden accept="image/*" type="file" /> */}
                    <AddOutlinedIcon className='plusIconButtonIcon' />
                </IconButton>
                <CarDamageModal
                    modalTitle="Car Damage"
                    handleClose={handleCloseCarDamageModal}
                    show={showcarDamageModal}
                    setShow={setShowCarDamageModal}
                    fullscreen={fullscreen}
                    setFullscreen={setFullscreen}
                    handleFullscreen={handleFullscreen}
                    imagesCheckBoxes={imagesCheckBoxes}
                    setImagesCheckBoxes={setImagesCheckBoxes}
                    imageAngles={imageAngles}
                    angleIndex={angleIndex}
                    setAngleIndex={setAngleIndex}
                    userInputImage={userInputImage}
                    setUserInputImage={setUserInputImage}
                />

            </div>
        </div>
    )
}

export default CarDamage