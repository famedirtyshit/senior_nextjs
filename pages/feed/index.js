import Head from 'next/head'
import FeedStyle from '@styles/Feed.module.css';
import UtilStyle from '@styles/Util.module.css';
import BaseButton from '@components/BaseButton'
import IMAGES from '@constants/IMAGES';
import Image from 'next/image';
import BaseCheckbox from '@components/BaseCheckBox';
import BasePostItem from '@components/BasePostItem';
import BaseModalMap from '@components/BaseModalMap';
import BasePostModal from '@components/BasePostModal';
import Pagination from '@material-ui/lab/Pagination';
import cn from 'classnames';
import Link from 'next/link';
import Script from 'next/script';
import postUtil from '@utils/postUtil';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BasePostDisplay from '@components/BasePostDisplay';
import BaseDashboardAlert from '@components/BaseDashboardAlert';
import BaseSearchMyPostModal from '@components/BaseSearchMyPostModal';
import accountUtil from '@utils/accountUtil';
import initFirebase from '@utils/initFirebase';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import $ from 'jquery';
import 'daterangepicker';
import 'moment';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

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

export default function Feed() {
    const [mapObj, setMapObj] = useState(null);
    // const [googleStatus, setGoogleStatus] = useState(false);
    const googleStatus = useRef(false);
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
    const [unknow, setUnknow] = useState(true);
    const [haveCollar, setHaveCollar] = useState(true);
    const [notHaveCollar, setNotHaveCollar] = useState(true);
    const [radius, setRadius] = useState(1);
    const [fromTo, setFromTo] = useState([startOfDay(new Date(new Date().setDate(new Date().getDate() - 7))), endOfDay(new Date())]);
    const [postType, setPostType] = useState(null);
    const [searchMyPostStatus, setSearchMyPostStatus] = useState(false);
    const [myPostData, setMyPostData] = useState(null);
    const [searchMyPostLoading, setSearchMyPostLoading] = useState(false);
    const [myPostSelected, setMyPostSelected] = useState(null);
    const [searchStatus, setSearchStatus] = useState(false);
    const [searchData, setSearchData] = useState(null);
    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState('latest');
    const [sortMenu, setSortMenu] = useState(null);

    const [displayStatus, setDisplayStatus] = useState(false);
    const [displayTarget, setDisplayTarget] = useState(null);

    const [userAccount, setUserAccount] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const currentDashboardData = useRef(null);

    useEffect(() => {
        let res = initFirebase();
        if (res != false) {
            console.log('init firebase');
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    let account = await accountUtil.getUser(user.uid);
                    if (account.data.result === true) {
                        const socket = io(process.env.API_KEY,{transports: ['websocket']});
                        socket.on('connect', () => {
                            socket.emit("saveSession", account.data.searchResult[0]._id)
                        })
                        setUserAccount(account.data.searchResult[0]);
                        let dashboardRes = await accountUtil.getMyDashboard(account.data.searchResult[0]._id);
                        if (dashboardRes.data.result == false) {
                            setDashboardData(dashboardRes.data);
                            currentDashboardData.current = dashboardRes.data;
                        } else {
                            let formatDashboardData = { result: true, searchResult: [] };
                            dashboardRes.data.searchResult.map(item => {
                                for (let i = 0; i < item.nearFoundCat.length; i++) {
                                    if (item.nearFoundCat[i].status == true) {
                                        formatDashboardData.searchResult.push(item);
                                        i = item.nearFoundCat.length
                                    }
                                }
                            })
                            setDashboardData(formatDashboardData);
                            currentDashboardData.current = formatDashboardData;
                            socket.on("newNearPost", function (data) {
                                let alreadyHave = false;
                                for (let j = 0; j < currentDashboardData.current.searchResult.length; j++) {
                                    if (currentDashboardData.current.searchResult[j]._id == data.lostPost._id) {
                                        alreadyHave = true;
                                        j = currentDashboardData.current.searchResult.length;
                                    }
                                }
                                if (alreadyHave == false) {
                                    currentDashboardData.current.searchResult.push(data.lostPost);
                                }
                            })
                        }
                    } else {
                        setUserAccount(null);
                        alert('user not found');
                        signOut(auth).then(() => {
                            console.log('signout')
                        }).catch((error) => {
                            console.log('signout fail')
                            console.log(error)
                        });
                    }
                } else {
                    setUserAccount(null);
                }
            });
        } else {
            console.log('init firebase error')
        }
    }, [])

    useEffect(() => {
        $(function () {
            $('input[name="daterange"]').daterangepicker({
                opens: 'right',
                startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
                endDate: new Date(),
                maxDate: new Date()
            }, function (start, end, label) {
                setFromTo([new Date(start), new Date(end)])
            });
        });
    }, [])

    useEffect(() => {
        try {
            if (modalMap === true) {
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
    }, [googleStatus.current, modalMap])

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
    }, [locationConfirmStatus, locationConfirm, radius])

    useEffect(() => {
        if (searchData != null) {
            // console.log(searchData.data);
        }
    }, [searchData])

    useEffect(() => {
        if (locationConfirm == null && sortType == 'radius') {
            setSortType('latest');
        } else {
            if (page != 1) {
                setPage(1);
            } else if (page == 1) {
                setSearchStatus(true);
                submitSearch();
            }
        }
    }, [male, female, unknow, haveCollar, notHaveCollar, radius, locationConfirm, searchType, sortType, fromTo])

    useEffect(() => {
        setSearchStatus(true);
        submitSearch();
    }, [page])

    useEffect(() => {
        if (searchMyPostStatus == true) {
            async function fetchMyPost() {
                setSearchMyPostLoading(true);
                let myPostRes = await accountUtil.getMyPost(userAccount._id);
                if (myPostRes.data.result == false) {
                    setMyPostData(myPostRes.data);
                    setSearchMyPostLoading(false);
                } else {
                    let formatData = [];
                    let dataPerPage = [];
                    if (searchType == 'all') {
                        myPostRes.data.searchResult.postLost.concat(myPostRes.data.searchResult.postFound).map((item, index) => {
                            dataPerPage.push(item);
                            if ((index + 1) % 3 == 0 || index == myPostRes.data.searchResult.postLost.concat(myPostRes.data.searchResult.postFound).length - 1) {
                                formatData.push(dataPerPage);
                                dataPerPage = [];
                            }
                        })
                        setMyPostData({ result: true, searchResult: formatData });
                        setSearchMyPostLoading(false);
                    } else {
                        let postWithTargetType = searchType == 'lost' ? myPostRes.data.searchResult.postLost : myPostRes.data.searchResult.postFound;
                        postWithTargetType.map((item, index) => {
                            dataPerPage.push(item);
                            if ((index + 1) % 3 == 0 || index == postWithTargetType.length - 1) {
                                formatData.push(dataPerPage);
                                dataPerPage = [];
                            }
                        })
                        setMyPostData({ result: true, searchResult: formatData });
                        setSearchMyPostLoading(false);
                    }
                }
            }
            fetchMyPost();
        }
    }, [searchMyPostStatus])

    useEffect(() => {
        if (myPostSelected != null && myPostData != null && myPostData.result != false) {
            let postFilter = myPostData.searchResult[myPostSelected.page][myPostSelected.post];
            if (postFilter.sex == 'unknow') {
                setUnknow(true);
                setMale(false);
                setFemale(false);
            } else if (postFilter.sex == 'true') {
                setUnknow(false);
                setMale(true);
                setFemale(false);
            } else {
                setUnknow(false);
                setMale(false);
                setFemale(true);
            }
            if (postFilter.collar == true) {
                setHaveCollar(true);
                setNotHaveCollar(false);
            } else {
                setHaveCollar(false);
                setNotHaveCollar(true);
            }
            createMarker({ lat: postFilter.location.coordinates[1], lng: postFilter.location.coordinates[0] }, null, mapObj, false, false, true)
            setLocationConfirmStatus(true);
            setLocationConfirm({ lat: postFilter.location.coordinates[1], lng: postFilter.location.coordinates[0] });
        }
    }, [myPostSelected])

    const closeDisplayModal = () => {
        setDisplayStatus(false);
    }

    const openDisplayModal = (position) => {
        setDisplayStatus(true);
        setDisplayTarget(position);
    }

    let map, infoWindow;

    const createMarker = async (latLng, name, map, isOldPosition, isPreview, locationCustom) => {
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
            if (locationCustom == true) {
                setLocation(latLng)
            } else {
                setLocation(latLng.toJSON())
            }
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
            zoom: 15,
            disableDefaultUI: true,
            draggable: false,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true,
            clickableIcons: false
        });
        createMarker(locationConfirm, null, map, true, true);
        const circle = new google.maps.Circle({
            strokeColor: "#356053",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#356053",
            fillOpacity: 0.35,
            map,
            // center: marker.current.position,
            center: locationConfirm,
            radius: radius * 1000,
        });
        map.fitBounds(circle.getBounds(), 0);
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

    const closeSearchByMyPostModal = () => {
        setSearchMyPostStatus(false);
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

    const handleOpenSortMenu = (event) => {
        setSortMenu(event.currentTarget);
    };

    const handleCloseSortMenu = () => {
        setSortMenu(null);
    };

    const handleSetSort = (e) => {
        handleCloseSortMenu();
        let value = e.target.textContent;
        setSortType(value);
    }

    const handleMaleChange = (event) => {
        setMale(event.target.checked);
    };

    const handleFemaleChange = (event) => {
        setFemale(event.target.checked);
    };

    const handleUnknowChange = (event) => {
        setUnknow(event.target.checked);
    }

    const handleHaveCollarChange = (event) => {
        setHaveCollar(event.target.checked);
    };

    const handleNotHaveCollarChange = (event) => {
        setNotHaveCollar(event.target.checked);
    };

    const submitSearch = async () => {
        // console.log('search')
        let valid = validateSearch();
        if (!valid) {
            let sexInput = { male: male, female: female, unknow: unknow };
            let collarInput = { haveCollar: haveCollar, notHaveCollar: notHaveCollar };
            let res = await postUtil.searchNoMap(sexInput, collarInput, searchType, page, fromTo)
            setSearchData(res);
            setSearchStatus(false);
        } else {
            let sexInput = { male: male, female: female, unknow: unknow };
            let collarInput = { haveCollar: haveCollar, notHaveCollar: notHaveCollar };
            let res = await postUtil.search(locationConfirm.lat, locationConfirm.lng, sexInput, collarInput, radius, searchType, page, sortType, fromTo)
            setSearchData(res);
            setSearchStatus(false);
        }
    }

    const validateSearch = () => {
        if (locationConfirm == null) {
            return false;
        }
        return true;
    }

    return (
        <div className={"2xl:container mx-auto " + FeedStyle.bgImg}>
            <Head>
                <title>CatUs</title>
                <meta name="description" content="CatUs Service" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
            </Head>
            <Script async defer src={`https://maps.googleapis.com/maps/api/js?v=3.44&key=${process.env.GMAPKEY}&libraries=places&region=TH&language=th`} onLoad={() => { googleStatus.current = true }} />
            <ThemeProvider theme={theme}>
                <div className={"head-sec"}>
                    <header className="2xl:flex 2xl:flex-wrap 2xl:justify-between 2xl:mx-64 pt-3">
                        <Link href='/'>
                            <a>
                                <h1 className="2xl:text-5xl 2xl:font-black text-white">Catus</h1>
                            </a>
                        </Link>
                    </header>
                    <section className="relative w-9/12 bg-mainCream mx-auto rounded-2xl shadow-lg 2xl:mt-20">
                        <div onClick={()=>{window.location.href="/account"}} className={"absolute top-4 right-4 cursor-pointer"}>
                            <Image alt={'account-link-img'} src={IMAGES.accountLink} width="30" height="30"></Image>
                        </div>
                        <div className="2xl:flex 2xl:flex-wrap 2xl:py-16">
                            <div className="2xl:ml-16">
                                <Image src={IMAGES.user} alt='default-user' width="112" height="112" />
                            </div>
                            <div className="2xl:ml-12 text-xl font-normal">
                                {userAccount == null
                                    ?
                                    <div>
                                        <p>Name: Guest</p>
                                        <p>Facebook: -</p>
                                        <p>Instragram: -</p>
                                        <p>Tel: -</p>
                                    </div>
                                    :
                                    <div>
                                        <p>Name: {`${userAccount.firstname} ${userAccount.lastname}`}</p>
                                        <p>Facebook: {userAccount.facebook != null ? userAccount.facebook : '-'}</p>
                                        <p>Instragram: {userAccount.instagram != null ? userAccount.instagram : '-'}</p>
                                        <p>Tel: {userAccount.phone}</p>
                                    </div>
                                }
                            </div>
                            {
                                userAccount == null ?
                                    <div className="2xl:ml-64 2xl:text-center 2xl:pl-12">
                                        <p className="text-xl font-normal text-textGray">Please login</p>
                                        <BaseButton onClickFunction={() => { window.location.href = '/authen' }} fill={true} fillColor={'mainGreen'} textColor={'white'} round={true} roundSize={'lg'} value={'Login'} customClass={'2xl:mt-4 2xl:px-32'}></BaseButton>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        {userAccount != null ?
                            <div className="2xl:grid 2xl:grid-cols-2 bg-white rounded-2xl 2xl:relative">
                                <p onClick={setPostFoundType} className={"2xl:text-center 2xl:py-4 text-2xl font-medium cursor-pointer " + cn({
                                    'bg-mainGreen text-white rounded-bl-2xl': postType === "found",
                                    'text-mainGreen': postType !== "found",
                                })
                                }>Post Found</p>
                                <p onClick={setPostLostType} className={"2xl:text-center 2xl:py-4 text-2xl font-medium cursor-pointer " + cn({
                                    'bg-mainGreen text-white rounded-br-2xl': postType === "lost",
                                    'text-mainGreen': postType !== "lost",
                                })
                                }>Post Lost</p>
                                {postType != null ? <BasePostModal user={userAccount} cancelFunction={togglePostType} type={postType} closeBasePostModal={togglePostType} /> : null}
                            </div>
                            : null
                        }
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
                            <p className="text-xl font-medium">ITEM ({searchData != null && searchData != undefined && searchData.data.result == true ? searchData.data.count : 0})</p>
                            {
                                userAccount != null ?
                                    <div>
                                        <p onClick={() => { setSearchMyPostStatus(true) }} className="text-white 2xl:px-6 py-2 bg-darkCream rounded-3xl shadow-lg cursor-pointer 2xl:mt-10 text-center">ค้นหาด้วยข้อมูล Post ของฉัน</p>
                                        <BaseSearchMyPostModal setMyPostSelected={setMyPostSelected} myPostData={myPostData} searchMyPostLoading={searchMyPostLoading} closeSearchByMyPostModal={closeSearchByMyPostModal} searchMyPostStatus={searchMyPostStatus} />
                                    </div>
                                    :
                                    null
                            }
                            <p className={"text-xl font-medium 2xl:mt-11 "}>Change Location</p>
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
                            <BaseModalMap handleClose={closeMapModal} radiusDefault={radius} setRadius={setRadius} modalMap={modalMap} searchPlace={searchPlace} map={mapObj} location={location} confirmStatusLocation={confirmStatusLocation} cancelLocation={cancelLocation} />
                            <p className="text-xl font-medium 2xl:mt-8">Sex</p>
                            <div className="sex-checkbox 2xl:ml-8">
                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={male} setValue={handleMaleChange} label='male' />
                                <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5">Male</p>
                                <br />
                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={female} setValue={handleFemaleChange} label='female' />
                                <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5" >Female</p>
                                <br />
                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={unknow} setValue={handleUnknowChange} label='unknow' />
                                <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5" >Unknow</p>
                            </div>
                            <p className="text-xl font-medium 2xl:mt-3">Pet collar</p>
                            <div className="collar-checkbox 2xl:ml-8">
                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={haveCollar} setValue={handleHaveCollarChange} label='have collar' />
                                <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5">Have</p>
                                <br />
                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={notHaveCollar} setValue={handleNotHaveCollarChange} label='not have collar' />
                                <p className="2xl:inline-block text-xl font-medium align-middle 2xl:ml-2.5" >Not have</p>
                            </div>
                            <p className="text-xl font-medium 2xl:my-3">From-To</p>
                            <div className="dateRangeSelect 2xl:mt-3 2xl:ml-6">
                                <input readOnly type="text" name="daterange" className="border border-solid border-gray-700 p-1 text-center rounded-lg text-base font-medium cursor-pointer" />
                            </div>
                            {/* <div className="2xl:flex flex-wrap">
                            <BaseButton onClickFunction={submitSearch} fill={true} fillColor={'mainOrange'} textColor={'white'} round={true} roundSize={'lg'} value={'Search'} customClass={'2xl:mt-6'}></BaseButton>
                        </div> */}
                            {/* <p className="2xl:mt-6 text-red-500 text-xl">{validateMsg.msg}</p> */}
                        </div>
                        <div className="2xl:col-span-3">
                            <div className="2xl:flex flex-wrap">
                                <div className="2xl:py-1 2xl:px-6 2xl:ml-auto">
                                    <Button color="primary" variant="contained" aria-controls="sort-menu" aria-haspopup="true" onClick={handleOpenSortMenu}>
                                        {sortType}
                                    </Button>
                                    <Menu
                                        id="sort-menu"
                                        anchorEl={sortMenu}
                                        keepMounted
                                        open={Boolean(sortMenu)}
                                        onClose={handleCloseSortMenu}
                                    >
                                        <MenuItem disabled={searchStatus == true ? true : false} selected={sortType == 'latest' ? true : false} onClick={handleSetSort}>latest</MenuItem>
                                        <MenuItem disabled={searchStatus == true || locationConfirm == null ? true : false} selected={sortType == 'radius' ? true : false} onClick={handleSetSort}>radius</MenuItem>
                                    </Menu>
                                </div>
                            </div>
                            <div className="2xl:grid 2xl:grid-cols-3 2xl:gap-4 2xl:ml-9 2xl:mt-8">
                                {searchStatus == true ?
                                    <div className="2xl:col-span-3 2xl:mx-auto 2xl:mt-72">
                                        <CircularProgress />
                                    </div>
                                    :
                                    searchData != null && searchData != undefined && searchData.data.result == true ?
                                        searchData.data.searchResult.length > 0
                                            ?
                                            searchData.data.searchResult.map((item, index) => {
                                                return (<BasePostItem key={index} data={item} position={index} onClickFunction={openDisplayModal} />)
                                            })
                                            :
                                            <p className="text-2xl font-bold text-center 2xl:col-span-3 2xl:mt-72">nothing found here.</p>
                                        :
                                        <p className="text-2xl font-bold text-center 2xl:col-span-3 2xl:mt-72">error please retry later :(</p>
                                }
                            </div>
                        </div>
                        <div className="2xl:col-span-4 2xl:mt-16 2xl:mb-8">
                            <div className="2xl:flex flex-wrap">
                                <div className="2xl:ml-auto">
                                    {searchData != null && searchData != undefined && searchData.data.result == true ? <Pagination onChange={(e, page) => { setPage(page) }} page={page} count={searchData.data.count == 0 ? 1 : Math.ceil(searchData.data.count / 12)} disabled={searchStatus == true ? true : false} /> : null}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <footer className="2xl:h-48 bg-mainGreen">
                </footer>
                {userAccount != null ? <BaseDashboardAlert dashboardData={dashboardData} /> : null}
                <BasePostDisplay modalStatus={displayStatus} closeModal={closeDisplayModal} post={searchData} target={displayTarget} />
            </ThemeProvider>
        </div >
    )
}
