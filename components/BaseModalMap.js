import React, { useState, useEffect } from 'react';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const theme = createTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#356053',
            dark: '#3f50b5',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#db4132',
            dark: '#ba000d',
            contrastText: '#fff',
        },
    },
});

const modalStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: '80%',
        height: '80%',
    },
}));

const mapStyles = makeStyles((theme) => ({
    height: {
        height: '85%'
    }
}));

const buttonStyles = makeStyles((theme) => ({
    style: {
        marginLeft: '20px'
    }
}));

const inputTextStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
}));

export default function TransitionsModal(prop) {
    const [placeQuery, setPlaceQuery] = useState('');

    useEffect(() => {
        let checkExist = setInterval(function () {
            if (document.getElementById('placeQuery')) {
                clearInterval(checkExist);
                initAutoComplete();
            }
        }, 100);
    })

    const modalClass = modalStyles();
    const inputClass = inputTextStyles();
    const mapClass = mapStyles();
    const buttonClass = buttonStyles();

    let autoComplete;
    const initAutoComplete = () => {
        const options = {
            // bounds: defaultBounds,
            componentRestrictions: { country: "th" },
            fields: ["address_components", "geometry", "icon", "name"],
            // strictBounds: false,
            types: ["establishment"],
        };
        autoComplete = new google.maps.places.Autocomplete(document.getElementById('placeQuery'), options)
        autoComplete.addListener('place_changed', onPlaceChanged);
    }

    const onPlaceChanged = () => {
        let place = autoComplete.getPlace();
        if (!place.geometry) {
            document.getElementById('placeQuery').placeholder = 'ป้อนตำแหน่ง';
        } else {
            setPlaceQuery(place.name);
        }
    }

    const searchPlace = () => {
        prop.searchPlace(placeQuery, prop.map)
    };

    const queryPlaceHandler = (e) => {
        let query = document.getElementById('placeQuery').value;
        setPlaceQuery(query);
    }

    return (
        <div>
            <Modal
                aria-labelledby="map-modal-title"
                aria-describedby="map-modal-description"
                className={modalClass.modal}
                open={prop.modalMap}
                onClose={prop.handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={prop.modalMap}>
                    <ThemeProvider theme={theme}>
                        <div id="map-container" className={modalClass.paper}>
                            <div className="2xl:flex flex-wrap 2xl:justify-between">
                                <div className={"2xl:flex-grow-0.5 " + inputClass.root} >
                                    <TextField onInput={queryPlaceHandler} className="2xl:w-3/5" id="placeQuery" label="Search" variant="outlined" />
                                </div>
                                <div className="button-action flex items-center">
                                    {placeQuery.length > 0 ? <Button onClick={searchPlace} variant="contained" color="default" className="2xl:max-h-9" >Search</Button> : <Button variant="contained" color="default" className="2xl:max-h-9" disabled>Search</Button>}
                                    {prop.location != null ? <Button onClick={prop.confirmStatusLocation} variant="contained" color="primary" className={"2xl:max-h-9 " + buttonClass.style}>Confirm</Button> : <Button onClick={prop.confirmStatusLocation} variant="contained" color="primary" className={"2xl:max-h-9 " + buttonClass.style} disabled>Confirm</Button>}
                                    <Button onClick={prop.cancelLocation} variant="contained" color="secondary" className={"2xl:max-h-9 " + buttonClass.style}>Cancel</Button>
                                </div>
                            </div>
                            <div id="map" className={"w-auto mt-2 border border-gray-300 border-solid " + mapClass.height}></div>
                        </div>
                    </ThemeProvider>
                </Fade>
            </Modal>
        </div>
    );
}