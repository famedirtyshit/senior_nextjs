import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';

const theme = createTheme({
    palette: {
        primary: {
            light: '#356053',
            main: '#356053',
            dark: '#356053',
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
    },
    heightWithRadius: {
        height: '100%'
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

export default function BaseModalMap(prop) {
    const [placeQuery, setPlaceQuery] = useState('');
    const [radiusSelected, setRadiusSelected] = useState(1);

    useEffect(() => {
        setPlaceQuery('');
        let checkExist = setInterval(function () {
            if (document.getElementById('placeQuery')) {
                clearInterval(checkExist);
                initAutoComplete();
            }
        }, 100);
    }, [prop.modalMap])

    useEffect(() => {
        if (prop.radius != undefined && prop.radius != null) {
            setRadiusSelected(prop.radius)
        }
    }, [prop.radius])

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

    const getRadiusValue = (value) => {
        setRadiusSelected(value);
        return value;
    }

    const confirm = () => {
        prop.confirmStatusLocation();
        // check have radius with map or not
        if (prop.radiusDefault) {
            console.log('set radius')
            prop.setRadius(radiusSelected);
        }
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
                                <div className="button-action 2xl:flex items-center">
                                    {placeQuery.length > 0 ? <Button onClick={searchPlace} variant="contained" color="default" className="2xl:max-h-9" >Search</Button> : <Button variant="contained" color="default" className="2xl:max-h-9" disabled>Search</Button>}
                                    {prop.location != null ? <Button onClick={confirm} variant="contained" color="primary" className={"2xl:max-h-9 " + buttonClass.style}>Confirm</Button> : <Button onClick={confirm} variant="contained" color="primary" className={"2xl:max-h-9 " + buttonClass.style} disabled>Confirm</Button>}
                                    <Button onClick={prop.cancelLocation} variant="contained" color="secondary" className={"2xl:max-h-9 " + buttonClass.style}>Cancel</Button>
                                </div>
                            </div>
                            {prop.radiusDefault ?
                                <div className="grid grid-cols-12 h-5/6">
                                    <div className="h-full my-auto">
                                        <p className="text-xl font-medium mt-16">Radius</p>
                                        <div className="h-4/6 mt-6">
                                            <Slider
                                                defaultValue={prop.radiusDefault}
                                                orientation="vertical"
                                                getAriaValueText={getRadiusValue}
                                                aria-labelledby="vertical-slider"
                                                valueLabelDisplay="auto"
                                                step={1}
                                                marks={[{ value: 1, label: '1KM' }, { value: 2, label: '2KM' }, { value: 3, label: '3KM' }, { value: 4, label: '4KM' }, { value: 5, label: '5KM' }]}
                                                min={1}
                                                max={5}
                                                color="primary"
                                            />
                                        </div>
                                    </div>
                                    <div id={prop.type == 'post' ? "map-post" : "map"} className={"w-auto col-span-11 mt-2 border border-gray-300 border-solid " + mapClass.heightWithRadius}></div>
                                </div>
                                :
                                <div id={prop.type == 'post' ? "map-post" : "map"} className={"w-auto mt-2 border border-gray-300 border-solid " + mapClass.height}></div>
                            }
                        </div>
                    </ThemeProvider>
                </Fade>
            </Modal>
        </div>
    );
}