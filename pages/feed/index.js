import Head from 'next/head'
import FeedStyle from '@styles/Feed.module.css';
import UtilStyle from '@styles/Util.module.css';
import BaseButton from '@components/BaseButton'
import IMAGES from '@constants/IMAGES';
import Image from 'next/dist/client/image';
import Slider from '@material-ui/core/Slider';
import BaseCheckbox from '@components/BaseCheckBox';
import BasePostItem from '@components/BasePostItem';
import BaseModalMap from '@components/BaseModalMap';
import BasePostModal from '@components/BasePostModal';
import Pagination from '@material-ui/lab/Pagination';
import cn from 'classnames';
import Link from 'next/link';
import Script from 'next/script';
import postUtil from '@utils/postUtil';
import { useState, useEffect, useRef } from 'react';

export default function Feed() {
    const [mapObj, setMapObj] = useState(null);
    const [googleStatus, setGoogleStatus] = useState(false);
    const [modalMap, setModalMap] = useState(false);
    const [mapPreview, setMapPreview] = useState(false);
    const marker = useRef(null);
    const markerPreview = useRef(null);
    const [searchType, setSearchType] = useState('all');
    const [defaultPos, setDefaultPos] = useState({ lat: 13.6511752, lng: 100.4944552 });
    const [location, setLocation] = useState(null);
    const [locationConfirmStatus, setLocationConfirmStatus] = useState(false);
    const [locationConfirm, setLocationConfirm] = useState(null);
    const [male, setMale] = useState(true);
    const [female, setFemale] = useState(true);
    const [haveCollar, setHaveCollar] = useState(true);
    const [notHaveCollar, setNotHaveCollar] = useState(true);
    const [postType, setPostType] = useState(null);

    useEffect(() => {
        try {
            if (googleStatus === true && modalMap === true) {
                let checkExist = setInterval(function () {
                    if (document.getElementById('map')) {
                        clearInterval(checkExist);
                        initMap();
                    }
                }, 100);
            }
        } catch (e) {
            console.warn(e)
        }
    }, [googleStatus, modalMap])

    useEffect(() => {
        if (locationConfirmStatus === true && locationConfirm != null) {
            setMapPreview(true);
            let checkExist = setInterval(function () {
                if (document.getElementById('map-preview')) {
                    clearInterval(checkExist);
                    initPreviewMap();
                }
            }, 100);
        } else {
            setMapPreview(false);
        }
    }, [locationConfirmStatus, locationConfirm])

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
        map = new google.maps.Map(document.getElementById("map"), {
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
        map = new google.maps.Map(document.getElementById("map-preview"), {
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
        createMarker(locationConfirm, null, map, true,true);
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

    const setSearchAllType = () => {
        setSearchType('all');
    }

    const setSearchFoundType = () => {
        setSearchType('found');
    }

    const setSearchLostType = () => {
        setSearchType('lost');
    }

    const togglePostType = () => {
        setPostType(null);
    }

    const setPostFoundType = () => {
        if (postType != 'found') {
            setPostType('found');
        } else {
            togglePostType();
        }
    }

    const setPostLostType = () => {
        if (postType != 'lost') {
            setPostType('lost');
        } else {
            togglePostType();
        }
    }

    const getRadiusValue = (value) => {
        return value;
    }

    const handleMaleChange = (event) => {
        setMale(event.target.checked);
    };

    const handleFemaleChange = (event) => {
        setFemale(event.target.checked);
    };

    const handleHaveCollarChange = (event) => {
        setHaveCollar(event.target.checked);
    };

    const handleNotHaveCollarChange = (event) => {
        setNotHaveCollar(event.target.checked);
    };
    return (
        <div className={"2xl:container mx-auto " + FeedStyle.bgImg}>
            <Head>
                <title>CatUs</title>
                <meta name="description" content="CatUs Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Script async defer src={`https://maps.googleapis.com/maps/api/js?v=3.44&key=${process.env.GMAPKEY}&libraries=places&region=TH&language=th`} onLoad={() => { setGoogleStatus(true) }} />
            <div className={"head-sec"}>
                <header className="2xl:flex 2xl:flex-wrap 2xl:justify-between 2xl:mx-64 pt-3">
                    <Link href='/'>
                        <a>
                            <h1 className="2xl:text-5xl 2xl:font-black text-white">Catus</h1>
                        </a>
                    </Link>
                </header>
                <section className="w-9/12 bg-mainCream mx-auto rounded-2xl shadow-lg 2xl:mt-20">
                    <div className="2xl:flex 2xl:flex-wrap 2xl:py-16">
                        <div className="2xl:ml-16">
                            <Image src={IMAGES.user} alt='default-user' width="112" height="112" />
                        </div>
                        <div className="2xl:ml-12 text-xl font-normal">
                            <p>Name: Guest</p>
                            <p>Facebook: -</p>
                            <p>Instragram: -</p>
                            <p>Tel: -</p>
                        </div>
                        <div className="2xl:ml-64 2xl:text-center 2xl:pl-12">
                            <p className="text-xl font-normal text-textGray">Please login</p>
                            <BaseButton fill={true} fillColor={'mainGreen'} textColor={'white'} round={true} roundSize={'lg'} value={'Login'} customClass={'2xl:mt-4 2xl:px-32'}></BaseButton>
                        </div>
                    </div>
                    <div className="2xl:grid 2xl:grid-cols-2 bg-white rounded-2xl 2xl:relative">
                        <p onClick={setPostFoundType} className={"2xl:text-center 2xl:py-4 text-2xl font-medium " + cn({
                            'bg-mainGreen text-white rounded-bl-2xl': postType === "found",
                            'text-mainGreen': postType !== "found",
                        })
                        }>Post Found</p>
                        <p onClick={setPostLostType} className={"2xl:text-center 2xl:py-4 text-2xl font-medium " + cn({
                            'bg-mainGreen text-white rounded-br-2xl': postType === "lost",
                            'text-mainGreen': postType !== "lost",
                        })
                        }>Post Lost</p>
                        <BasePostModal />
                    </div>
                </section>
                <section className="2xl:mt-32 2xl:grid 2xl:grid-cols-3 2xl:mx-56 text-center">
                    <p className={"cursor-pointer text-2xl font-bold 2xl:pb-2 " + cn({
                        'text-mainGreen border-b-4 border-mainGreen': searchType === 'all',
                    })} onClick={setSearchAllType}>All</p>
                    <p className={"cursor-pointer text-2xl font-bold 2xl:pb-2 " + cn({
                        'text-mainGreen border-b-4 border-mainGreen': searchType === 'found',
                    })} onClick={setSearchFoundType}>Found</p>
                    <p className={"cursor-pointer text-2xl font-bold 2xl:pb-2 " + cn({
                        'text-mainGreen border-b-4 border-mainGreen': searchType === 'lost',
                    })} onClick={setSearchLostType}>Lost</p>
                </section>
            </div >
            <main>
                <section className="2xl:mt-32 2xl:grid 2xl:grid-cols-4 2xl:mx-56">
                    <div>
                        <p className="text-xl font-medium">ITEM (90)</p>
                        <p className="text-white 2xl:px-6 py-2 bg-darkCream rounded-3xl shadow-lg cursor-pointer 2xl:mt-10 text-center">ค้นหาด้วยข้อมูล Post ของฉัน</p>
                        <p className="text-xl font-medium 2xl:mt-11">Change Location</p>
                        {
                            mapPreview === true ?
                                <div id="map-preview" onClick={openMapModal} className="2xl:mt-7 h-60 2xl:relative shadow-lg border border-gray-300 border-solid " style={{ width: '355px', height: '255px' }}>
                                </div>
                                :
                                <div id="map-preview-default" onClick={openMapModal} className="2xl:mt-7 h-60 2xl:relative shadow-lg border border-gray-300 border-solid " style={{ width: '355px', height: '255px' }}>
                                    <Image src={IMAGES.map} alt='default-map' width="355" height="255" className="2xl:absolute cursor-pointer 2xl:top-1/3 2xl:left-16 " />
                                    <p className={"2xl:absolute text-white 2xl:px-6 py-2 bg-mainGreen rounded-3xl shadow-lg cursor-pointer bg-opacity-90 " + UtilStyle.centerAbsolute}>ระบุตำแหน่งด้วยตนเอง</p>
                                </div>
                        }
                        <BaseModalMap handleClose={closeMapModal} modalMap={modalMap} searchPlace={searchPlace} map={mapObj} location={location} confirmStatusLocation={confirmStatusLocation} cancelLocation={cancelLocation} />
                        <p className="text-xl font-medium 2xl:mt-6">Radius</p>
                        <Slider
                            defaultValue={1}
                            getAriaValueText={getRadiusValue}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks={[{ value: 1, label: '1KM' }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5, label: '5KM' }]}
                            min={1}
                            max={5}
                            color="primary"
                        />
                        <p className="text-xl font-medium 2xl:mt-3">Sex</p>
                        <div className="sex-checkbox 2xl:ml-8">
                            <BaseCheckbox checkValue={male} setValue={handleMaleChange} label='male' />
                            <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5">Male</p>
                            <br />
                            <BaseCheckbox checkValue={female} setValue={handleFemaleChange} label='female' />
                            <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5" >Female</p>
                        </div>
                        <p className="text-xl font-medium 2xl:mt-3">Pet collar</p>
                        <div className="collar-checkbox 2xl:ml-8">
                            <BaseCheckbox checkValue={haveCollar} setValue={handleHaveCollarChange} label='have collar' />
                            <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5">Have</p>
                            <br />
                            <BaseCheckbox checkValue={notHaveCollar} setValue={handleNotHaveCollarChange} label='not have collar' />
                            <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5" >Not have</p>
                        </div>
                        <div onClick={postUtil.search} className="2xl:flex flex-wrap">
                            <BaseButton fill={true} fillColor={'mainOrange'} textColor={'white'} round={true} roundSize={'lg'} value={'Search'} customClass={'2xl:mt-6'}></BaseButton>
                        </div>
                    </div>
                    <div className="2xl:col-span-3">
                        <div className="2xl:flex flex-wrap">
                            <p className="text-xl font-normal text-white bg-mainGreen cursor-pointer 2xl:py-1 2xl:px-6 2xl:ml-auto">latest</p>
                        </div>
                        <div className="2xl:grid 2xl:grid-cols-3 2xl:gap-4 2xl:ml-9 2xl:mt-8">
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                            <BasePostItem />
                        </div>
                    </div>
                    <div className="2xl:col-span-4 2xl:mt-16 2xl:mb-8">
                        <div className="2xl:flex flex-wrap">
                            <div className="2xl:ml-auto">
                                <Pagination count={10} />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="2xl:h-48 bg-mainGreen">
            </footer>
        </div >
    )
}
