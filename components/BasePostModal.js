import BasePostModalStyles from "@styles/BasePostModal.module.css";
import UtilStyles from "@styles/Util.module.css";
import Image from 'next/dist/client/image';
import IMAGES from '@constants/IMAGES';
import BaseModalMap from '@components/BaseModalMap';
import BaseImageUpload from "@components/BaseImageUpload";
import BaseButton from "@components/BaseButton";
import TextField from '@material-ui/core/TextField';
import { useState, useEffect, useRef } from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

// const formStyles = makeStyles((theme) => ({
//     root: {
//       '& .MuiTextField-root': {
//         margin: theme.spacing(1),
//         width: '25ch',
//       },
//     },
//   }));

const GreenRadio = withStyles({
    root: {
        color: '#787878',
        '&$checked': {
            color: '#356053',
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

export default function BasePostModal(prop) {
    const [mapObj, setMapObj] = useState(null);
    const [modalMap, setModalMap] = useState(false);
    const [mapPreview, setMapPreview] = useState(false);
    const marker = useRef(null);
    const markerPreview = useRef(null);
    const [defaultPos, setDefaultPos] = useState({ lat: 13.6511752, lng: 100.4944552 });
    const [location, setLocation] = useState(null);
    const [locationConfirmStatus, setLocationConfirmStatus] = useState(false);
    const [locationConfirm, setLocationConfirm] = useState(null);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [sexSelected, setSexSelected] = useState('unknow');
    const [collarSelected, setCollarSelected] = useState('notHave');

    useEffect(() => {
        try {
            if (modalMap === true) {
                let checkExist = setInterval(function () {
                    if (document.getElementById('map-post')) {
                        clearInterval(checkExist);
                        initMap();
                    }
                }, 100);
            }
        } catch (e) {
            console.warn(e)
        }
    }, [modalMap])

    useEffect(() => {
        if (locationConfirmStatus === true && locationConfirm != null) {
            setMapPreview(true);
            let checkExist = setInterval(function () {
                if (document.getElementById('map-preview-post')) {
                    clearInterval(checkExist);
                    initPreviewMap();
                }
            }, 100);
        } else {
            setMapPreview(false);
        }
    }, [locationConfirmStatus, locationConfirm])

    // useEffect(() => {
    //     let dateField = document.getElementById('dateField');
    //     let curDate = new Date();
    //     let defaultYear = curDate.getUTCFullYear()
    //     let defaultMonth = curDate.getMonth() + 1
    //     let defaultDate = curDate.getDate();
    //     if (defaultMonth.toString().length < 2) {
    //         defaultMonth = "0" + defaultMonth;
    //     }
    //     let defaultDateField = defaultYear + '-' + defaultMonth + '-' + defaultDate;
    //     dateField.value = defaultDateField;
    // }, [])

    // const formClasses = formStyles();

    let map, infoWindow;

    const createMarker = async (latLng, name, map, isOldPosition, isPreview) => {
        let oldMarkerTarget = isPreview ? markerPreview : marker;
        if (oldMarkerTarget.current != null) {
            oldMarkerTarget.current.setMap(null);
            oldMarkerTarget.current = null;
        }
        let markerObj = await new google.maps.Marker({
            position: latLng,
            map,
            title: name ? name : 'markerTitle',
        });
        oldMarkerTarget.current = markerObj;
        if (!isOldPosition) {
            setLocation(latLng.toJSON())
        }
    }

    const confirmStatusLocation = () => {
        setLocationConfirmStatus(true);
        setLocationConfirm(location);
        setModalMap(false);
    }

    const cancelLocation = () => {
        setLocationConfirmStatus(false);
        setModalMap(false);
        setLocation(null);
        setLocationConfirm(null);
    }

    const initMap = () => {
        let position;
        let markerPosition = null;
        if (locationConfirm != null && locationConfirmStatus === true) {
            position = locationConfirm;
            markerPosition = locationConfirm;
        } else {
            position = defaultPos;
        }
        map = new google.maps.Map(document.getElementById("map-post"), {
            center: position,
            zoom: 18,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true
        });
        if (markerPosition != null) {
            createMarker(markerPosition, null, map, true);
        }
        infoWindow = new google.maps.InfoWindow();
        const locationButton = document.createElement("button");
        locationButton.textContent = "Pan to Current Location";
        locationButton.classList.add("custom-map-control-button");
        locationButton.classList.add("text-sm");
        locationButton.classList.add("text-white");
        locationButton.classList.add("px-6");
        locationButton.classList.add("py-2");
        locationButton.classList.add("mt-1");
        locationButton.classList.add("bg-mainGreen");
        locationButton.classList.add("rounded-3xl");
        locationButton.classList.add("bg-opacity-80");
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
        map.addListener("click", (event) => {
            createMarker(event.latLng, null, map);
        });
        locationButton.addEventListener("click", () => {
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        infoWindow.setPosition(pos);
                        infoWindow.setContent("Location found.");
                        infoWindow.open(map);
                        map.setCenter(pos);
                    },
                    () => {
                        handleLocationError(true, infoWindow, map.getCenter(), false, map);
                    }
                );
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter(), false, map);
            }
        });
        setMapObj(map);
    }

    const initPreviewMap = () => {
        map = new google.maps.Map(document.getElementById("map-preview-post"), {
            center: locationConfirm,
            zoom: 17,
            disableDefaultUI: true,
            draggable: false,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true
        });
        console.log('create preview marker')
        createMarker(locationConfirm, null, map, true, true);
    }

    const searchPlace = (query, map) => {
        let request = {
            query: query,
            fields: ['name', 'geometry'],
        };
        let service = new google.maps.places.PlacesService(map);
        let placeInfoWindow = new google.maps.InfoWindow();
        service.findPlaceFromQuery(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                createMarker(results[0].geometry.location, results[0].name, map);
                map.setCenter(results[0].geometry.location);
            } else {
                console.log('search failed')
                handleLocationError(true, placeInfoWindow, map.getCenter(), true, map);
            }
        });
    }

    const handleLocationError = (browserHasGeolocation, infoWindow, pos, queryError, map) => {
        infoWindow.setPosition(pos);
        if (queryError) {
            infoWindow.setContent("can't find your search location.");
        } else {
            infoWindow.setContent(
                browserHasGeolocation
                    ? "Error: The Geolocation service failed."
                    : "Error: Your browser doesn't support geolocation."
            );
        }
        infoWindow.open(map);
    }

    const openMapModal = () => {
        setModalMap(true);
    }

    const closeMapModal = () => {
        setModalMap(false);
        if (!locationConfirmStatus) {
            setLocation(null);
        }
    }

    const handleSexChange = (event) => {
        setSexSelected(event.target.value);
    }

    const handleCollarChange = (event) => {
        setCollarSelected(event.target.value);
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className={"2xl:absolute bg-white shadow-lg rounded-lg " + BasePostModalStyles.modal}>
            <div className="2xl:grid 2xl:grid-cols-3">
                <div className="2xl:mt-8 2xl:mb-6 2xl:ml-12">
                    <p className={"text-2xl font-medium " + BasePostModalStyles.postTitleColor}>Google Map *</p>
                    {
                        mapPreview === true ?
                            <div id="map-preview-post" onClick={openMapModal} className="2xl:mt-7 h-60 2xl:relative shadow-lg border border-gray-300 border-solid " style={{ width: '100%', height: '400px' }}>
                            </div>
                            :
                            <div id="map-preview-default" onClick={openMapModal} className="2xl:mt-3 h-60 2xl:relative shadow-lg border border-gray-300 border-solid " style={{ width: '100%', height: '400px' }}>
                                <Image src={IMAGES.map} alt='default-map' layout="fill" className="2xl:absolute cursor-pointer 2xl:top-1/3 2xl:left-16 " />
                                <p className={"2xl:absolute text-white 2xl:px-6 py-2 bg-mainGreen rounded-3xl shadow-lg cursor-pointer bg-opacity-90 " + UtilStyles.centerAbsolute}>ระบุตำแหน่งด้วยตนเอง</p>
                            </div>
                    }
                    <BaseModalMap handleClose={closeMapModal} modalMap={modalMap} searchPlace={searchPlace} map={mapObj} location={location} confirmStatusLocation={confirmStatusLocation} cancelLocation={cancelLocation} type={'post'} />
                </div>
                <div className="2xl:mt-16 2xl:mb-6 2xl:mx-auto 2xl:w-4/6">
                    {/* <form className={formClasses.root} autoComplete="off"> */}
                    {/* <TextField id="dateField" label="Date" variant="outlined" type="date" className="2xl:w-full" required /> */}
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            id="date-picker-dialog"
                            label="Date"
                            format="dd/MM/yyyy"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            required
                            className="w-full"
                        />
                    </MuiPickersUtilsProvider>
                    <div className="sex-section 2xl:flex flex-wrap items-center text-textGray font-medium 2xl:my-2">
                        <p className="2xl:mr-4">Sex</p>
                        <GreenRadio
                            checked={sexSelected === 'male'}
                            onChange={handleSexChange}
                            value="male"
                            name="radio-sex"
                            inputProps={{ 'aria-label': 'sex-male' }}
                        />
                        <p>Male</p>
                        <GreenRadio
                            checked={sexSelected === 'female'}
                            onChange={handleSexChange}
                            value="female"
                            name="radio-sex"
                            inputProps={{ 'aria-label': 'sex-female' }}
                        />
                        <p>Female</p>
                        <GreenRadio
                            checked={sexSelected === 'unknow'}
                            onChange={handleSexChange}
                            value="unknow"
                            name="radio-sex"
                            inputProps={{ 'aria-label': 'sex-unknow' }}
                        />
                        <p>Unknow</p>
                    </div>
                    <div className="collar-section 2xl:flex flex-wrap items-center text-textGray font-medium 2xl:mt-2 2xl:mb-4">
                        <p className="2xl:mr-4">Pet collar</p>
                        <GreenRadio
                            checked={collarSelected === 'have'}
                            onChange={handleCollarChange}
                            value="have"
                            name="radio-collar"
                            inputProps={{ 'aria-label': 'collar-have' }}
                        />
                        <p>Have</p>
                        <GreenRadio
                            checked={collarSelected === 'notHave'}
                            onChange={handleCollarChange}
                            value="notHave"
                            name="radio-collar"
                            inputProps={{ 'aria-label': 'collar-notHave' }}
                        />
                        <p>Not have</p>
                    </div>
                    <TextField
                        id="post-desc-field"
                        label="Note"
                        multiline
                        rows={8}
                        variant="outlined"
                        className="w-full"
                    />
                    <p className="text-xs font-medium 2xl:mt-2 text-textGray">Add more information such as a short tail, three legs.</p>
                </div>
                {/* </form> */}
                <div className="2xl:mt-8 2xl:mb-6 2xl:mr-12">
                    <p className={"text-2xl font-medium " + BasePostModalStyles.postTitleColor}>Cat photo</p>
                    <BaseImageUpload />
                </div>
            </div>
            <div className="2xl:flex flex-wrap 2xl:justify-end">
            <BaseButton value={'Cancel'} customClass={'2xl:my-6 2xl:mr-8'}></BaseButton>
            <BaseButton fill={true} fillColor={'mainGreen'} textColor={'white'} round={true} roundSize={'lg'} value={'Submit'} customClass={'2xl:my-6 2xl:mr-28'}></BaseButton>
            </div>
        </div>
    )
}