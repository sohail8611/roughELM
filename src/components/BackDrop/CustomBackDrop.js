import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'

function CustomBackDrop(props) {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={props.loading}
            onClick={() => { }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default CustomBackDrop