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
import Footer from '@components/Footer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import * as React from 'react';

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

    const [alertChecker, setAlertChecker] = useState(0);
    const currentAlertChecker = useRef(0);

    const [accountMenu, setAccountMenu] = useState(null);

    const [drawerStatus, setDrawerStatus] = useState(false);

    useEffect(() => {
        let res = initFirebase();
        if (res != false) {
            console.log('init firebase');
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    let account = await accountUtil.getUser(user.uid);
                    let myPost = await accountUtil.getMyPost(account.data.searchResult[0]._id);
                    if (account.data.result === true) {
                        const socket = io(process.env.API_KEY);
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
                                    let newAlertCount = currentAlertChecker.current + 1
                                    setAlertChecker(newAlertCount);
                                    currentAlertChecker.current = newAlertCount;
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
        if (drawerStatus == true) {
            $(function () {
                $('input[name="daterange-m"]').daterangepicker({
                    opens: 'left',
                    drops: 'up',
                    startDate: fromTo[0],
                    endDate: fromTo[1],
                    maxDate: new Date()
                }, function (start, end, label) {
                    setFromTo([new Date(start), new Date(end)])
                });
            });
        }
    }, [drawerStatus])

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
    }, [locationConfirmStatus, locationConfirm, radius, drawerStatus])



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
                        let postWithTargetType = searchType == 'lost' ? myPostRes.data.searchResult.postFound : myPostRes.data.searchResult.postLost;
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

    const toggleDrawer = (status) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setDrawerStatus(status);
    };

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
        let mapPreviewTargetId;
        if (document.getElementById("map-preview-m") == null) {
            mapPreviewTargetId = 'map-preview';
        } else {
            mapPreviewTargetId = 'map-preview-m';
        }
        map = new google.maps.Map(document.getElementById(mapPreviewTargetId), {
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

    const handleCloseAccountMenu = () => {
        setAccountMenu(null);
    };

    const handleOpenAccountMenu = (event) => {
        setAccountMenu(event.currentTarget);
    }

    const logout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            setUserAccount(null);
        }).catch((error) => {
            alert('fail please retry later');
        });
    }

    return (
        <div style={{ fontFamily: 'Prompt' }} className={"w-100 mx-auto " + FeedStyle.bgImg}>
            <Head>
                <title>CatUs</title>
                <meta name="description" content="CatUs Service" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
            </Head>
            <Script async defer src={`https://maps.googleapis.com/maps/api/js?v=3.44&key=${process.env.GMAPKEY}&libraries=places&region=TH&language=th`} onLoad={() => { googleStatus.current = true }} />
            <ThemeProvider theme={theme}>
                <div className={"head-sec"}>
                    <header className="flex flex-wrap justify-between mx-10 sm:mx-24 lg:mx-64 md:mx-32 pt-3">
                        <Link href='/'>
                            <a>
                                <h1 className="text-xl md:text-5xl font-black text-white">Catus</h1>
                            </a>
                        </Link>
                        {
                            userAccount != null
                                ?
                                <div>
                                    <div className="account-action mt-4 mb-8 md:block hidden">
                                        <div onClick={handleOpenAccountMenu} className='flex flex-wrap cursor-pointer'>
                                            <p className="text-base text-white">
                                                {userAccount.firstname ? userAccount.firstname.length > 15 ? userAccount.firstname.substring(0, 15) + '... ' : userAccount.firstname + ' ' : null}
                                                {userAccount.lastname ? userAccount.lastname.length > 15 ? userAccount.lastname.substring(0, 15) + '... ' : userAccount.lastname + ' ' : null}
                                            </p>
                                            <div className="pt-3 ml-3">
                                                <svg width="12" height="6" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.62878 7.74068C7.53883 7.67259 7.46291 7.59722 7.39688 7.51892L0.504162 2.26459C-0.167948 1.75178 -0.168267 0.920687 0.504481 0.407648C1.17691 -0.105147 2.26753 -0.105132 2.9406 0.407681L8.87667 4.93303L14.844 0.384986C15.5161 -0.128052 16.6071 -0.128037 17.2801 0.385019C17.616 0.641547 17.7841 0.97734 17.7841 1.31313C17.7841 1.64892 17.616 1.98544 17.2795 2.24123L10.3565 7.51896C10.2904 7.59725 10.2148 7.67239 10.1246 7.74071C9.78005 8.00331 9.32772 8.12925 8.87667 8.12341C8.4253 8.12948 7.97233 8.00328 7.62878 7.74068Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                        <Menu
                                            id="account-menu"
                                            anchorEl={accountMenu}
                                            keepMounted
                                            open={Boolean(accountMenu)}
                                            onClose={handleCloseAccountMenu}
                                        >
                                            <MenuItem className='cursor-pointer' onClick={() => { window.location.href = '/account' }}>My Account</MenuItem>
                                            <MenuItem className='cursor-pointer' onClick={logout}>Logout</MenuItem>
                                        </Menu>
                                    </div>
                                    <div className='ml-2 md:ml-0 md:hidden'>
                                        <div onClick={toggleDrawer(true)} className='mt-1'>
                                            <svg width="37" height="15" viewBox="0 0 37 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <line x1="1.5" y1="1.5" x2="34.5139" y2="1.5" stroke="#E2881B" strokeWidth="3" strokeLinecap="square" />
                                                <line x1="5.5" y1="7.5" x2="34.5" y2="7.5" stroke="#E2881B" strokeWidth="3" strokeLinecap="square" />
                                                <line x1="12.5" y1="13.5" x2="34.5" y2="13.5" stroke="#E2881B" strokeWidth="3" strokeLinecap="square" />
                                            </svg>
                                        </div>
                                        <SwipeableDrawer
                                            anchor={'right'}
                                            open={drawerStatus}
                                            onClose={toggleDrawer(false)}
                                            onOpen={toggleDrawer(true)}
                                        >
                                            <div className='px-2'>
                                                <div className="account-action mt-4 mb-8">
                                                    <div onClick={handleOpenAccountMenu} className='flex flex-wrap cursor-pointer'>
                                                        <p className="text-xl text-black font-bold">
                                                            {userAccount.firstname ? userAccount.firstname.length > 15 ? userAccount.firstname.substring(0, 15) + '... ' : userAccount.firstname + ' ' : null}
                                                            {userAccount.lastname ? userAccount.lastname.length > 15 ? userAccount.lastname.substring(0, 15) + '... ' : userAccount.lastname + ' ' : null}
                                                        </p>
                                                        {/* <div className="pt-3 ml-3">
                                                        <svg width="12" height="6" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M7.62878 7.74068C7.53883 7.67259 7.46291 7.59722 7.39688 7.51892L0.504162 2.26459C-0.167948 1.75178 -0.168267 0.920687 0.504481 0.407648C1.17691 -0.105147 2.26753 -0.105132 2.9406 0.407681L8.87667 4.93303L14.844 0.384986C15.5161 -0.128052 16.6071 -0.128037 17.2801 0.385019C17.616 0.641547 17.7841 0.97734 17.7841 1.31313C17.7841 1.64892 17.616 1.98544 17.2795 2.24123L10.3565 7.51896C10.2904 7.59725 10.2148 7.67239 10.1246 7.74071C9.78005 8.00331 9.32772 8.12925 8.87667 8.12341C8.4253 8.12948 7.97233 8.00328 7.62878 7.74068Z" fill="black" />
                                                        </svg>
                                                    </div> */}
                                                    </div>
                                                    {/* <Menu
                                                    id="account-menu"
                                                    anchorEl={accountMenu}
                                                    keepMounted
                                                    open={Boolean(accountMenu)}
                                                    onClose={handleCloseAccountMenu}
                                                > */}
                                                    <p className="my-5" onClick={() => { window.location.href = '/account' }}>My Account</p>
                                                    <p className="my-5" onClick={logout}>Logout</p>
                                                    {/* </Menu> */}
                                                </div>
                                                <p className="text-xl font-bold mt-4">ITEM ({searchData != null && searchData != undefined && searchData.data.result == true ? searchData.data.count : 0})</p>
                                                {
                                                    userAccount != null ?
                                                        <div>
                                                            <p onClick={() => { setSearchMyPostStatus(true) }} className="text-white py-2 bg-darkCream rounded-3xl shadow-lg cursor-pointer text-center mt-2">ค้นหาด้วยข้อมูล Post ของฉัน</p>
                                                            <BaseSearchMyPostModal searchType={searchType} setMyPostSelected={setMyPostSelected} myPostData={myPostData} searchMyPostLoading={searchMyPostLoading} closeSearchByMyPostModal={closeSearchByMyPostModal} searchMyPostStatus={searchMyPostStatus} />
                                                        </div>
                                                        :
                                                        null
                                                }
                                                <p className={"text-xl font-medium mt-4"}>Change Location</p>
                                                {
                                                    mapPreview === true ?
                                                        <div id="map-preview-m" onClick={openMapModal} className="mt-2 h-44 relative shadow-lg border border-gray-300 border-solid w-100">
                                                        </div>
                                                        :
                                                        <div id="map-preview-default" onClick={openMapModal} className="mt-2 h-44 relative shadow-lg border border-gray-300 border-solid w-100">
                                                            <Image src={IMAGES.map} layout="fill" alt='default-map' className="absolute cursor-pointer top-1/3 left-16 " />
                                                            <p className={"absolute text-white px-2 text-sm text-center text-base py-2 bg-mainGreen rounded-3xl shadow-lg cursor-pointer bg-opacity-90 " + UtilStyle.centerAbsolute}>ระบุตำแหน่งด้วยตนเอง</p>
                                                        </div>
                                                }
                                                {/* <BaseModalMap handleClose={closeMapModal} radiusDefault={radius} setRadius={setRadius} modalMap={modalMap} searchPlace={searchPlace} map={mapObj} location={location} confirmStatusLocation={confirmStatusLocation} cancelLocation={cancelLocation} /> */}
                                                <p className="text-xl font-medium mt-3">Sex</p>
                                                <div className="sex-checkbox ml-1">
                                                    <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={male} setValue={handleMaleChange} label='male' />
                                                    <p className="inline-block text-xl font-medium align-middle ml-1.5">Male</p>
                                                    <br />
                                                    <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={female} setValue={handleFemaleChange} label='female' />
                                                    <p className="inline-block text-xl font-medium align-middle ml-1.5" >Female</p>
                                                    <br />
                                                    <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={unknow} setValue={handleUnknowChange} label='unknow' />
                                                    <p className="inline-block text-xl font-medium align-middle ml-1.5" >Unknow</p>
                                                </div>
                                                <p className="text-xl font-medium mt-3">Pet collar</p>
                                                <div className="collar-checkbox ml-1">
                                                    <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={haveCollar} setValue={handleHaveCollarChange} label='have collar' />
                                                    <p className="inline-block text-xl font-medium align-middle ml-1.5">Have</p>
                                                    <br />
                                                    <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={notHaveCollar} setValue={handleNotHaveCollarChange} label='not have collar' />
                                                    <p className="inline-block text-xl font-medium align-middle ml-1.5" >Not have</p>
                                                </div>
                                                <p className="text-xl font-medium my-3">From-To</p>
                                                <div className="dateRangeSelect mt-3 ml-2">
                                                    <input readOnly type="text" name="daterange-m" className="border border-solid border-gray-700 p-1 text-center rounded-lg text-base font-medium cursor-pointer" />
                                                </div>
                                            </div>
                                        </SwipeableDrawer>
                                    </div>
                                </div>
                                :
                                <div className='ml-2 md:ml-0 md:hidden'>
                                    <div onClick={toggleDrawer(true)} className='mt-1'>
                                        <svg width="37" height="15" viewBox="0 0 37 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <line x1="1.5" y1="1.5" x2="34.5139" y2="1.5" stroke="#E2881B" strokeWidth="3" strokeLinecap="square" />
                                            <line x1="5.5" y1="7.5" x2="34.5" y2="7.5" stroke="#E2881B" strokeWidth="3" strokeLinecap="square" />
                                            <line x1="12.5" y1="13.5" x2="34.5" y2="13.5" stroke="#E2881B" strokeWidth="3" strokeLinecap="square" />
                                        </svg>
                                    </div>
                                    <SwipeableDrawer
                                        anchor={'right'}
                                        open={drawerStatus}
                                        onClose={toggleDrawer(false)}
                                        onOpen={toggleDrawer(true)}
                                    >
                                        <div className='px-2'>
                                            <p className="text-xl font-bold mt-4">ITEM ({searchData != null && searchData != undefined && searchData.data.result == true ? searchData.data.count : 0})</p>
                                            {
                                                userAccount != null ?
                                                    <div>
                                                        <p onClick={() => { setSearchMyPostStatus(true) }} className="text-white py-2 bg-darkCream rounded-3xl shadow-lg cursor-pointer text-center mt-2">ค้นหาด้วยข้อมูล Post ของฉัน</p>
                                                        <BaseSearchMyPostModal searchType={searchType} setMyPostSelected={setMyPostSelected} myPostData={myPostData} searchMyPostLoading={searchMyPostLoading} closeSearchByMyPostModal={closeSearchByMyPostModal} searchMyPostStatus={searchMyPostStatus} />
                                                    </div>
                                                    :
                                                    null
                                            }
                                            <p className={"text-xl font-medium mt-4"}>Change Location</p>
                                            {
                                                mapPreview === true ?
                                                    <div id="map-preview-m" onClick={openMapModal} className="mt-2 h-44 relative shadow-lg border border-gray-300 border-solid w-100">
                                                    </div>
                                                    :
                                                    <div id="map-preview-default" onClick={openMapModal} className="mt-2 h-44 relative shadow-lg border border-gray-300 border-solid w-100">
                                                        <Image src={IMAGES.map} layout="fill" alt='default-map' className="absolute cursor-pointer top-1/3 left-16 " />
                                                        <p className={"absolute text-white px-2 text-sm text-center text-base py-2 bg-mainGreen rounded-3xl shadow-lg cursor-pointer bg-opacity-90 " + UtilStyle.centerAbsolute}>ระบุตำแหน่งด้วยตนเอง</p>
                                                    </div>
                                            }
                                            {/* <BaseModalMap handleClose={closeMapModal} radiusDefault={radius} setRadius={setRadius} modalMap={modalMap} searchPlace={searchPlace} map={mapObj} location={location} confirmStatusLocation={confirmStatusLocation} cancelLocation={cancelLocation} /> */}
                                            <p className="text-xl font-medium mt-3">Sex</p>
                                            <div className="sex-checkbox ml-1">
                                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={male} setValue={handleMaleChange} label='male' />
                                                <p className="inline-block text-xl font-medium align-middle ml-1.5">Male</p>
                                                <br />
                                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={female} setValue={handleFemaleChange} label='female' />
                                                <p className="inline-block text-xl font-medium align-middle ml-1.5" >Female</p>
                                                <br />
                                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={unknow} setValue={handleUnknowChange} label='unknow' />
                                                <p className="inline-block text-xl font-medium align-middle ml-1.5" >Unknow</p>
                                            </div>
                                            <p className="text-xl font-medium mt-3">Pet collar</p>
                                            <div className="collar-checkbox ml-1">
                                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={haveCollar} setValue={handleHaveCollarChange} label='have collar' />
                                                <p className="inline-block text-xl font-medium align-middle ml-1.5">Have</p>
                                                <br />
                                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={notHaveCollar} setValue={handleNotHaveCollarChange} label='not have collar' />
                                                <p className="inline-block text-xl font-medium align-middle ml-1.5" >Not have</p>
                                            </div>
                                            <p className="text-xl font-medium my-3">From-To</p>
                                            <div className="dateRangeSelect mt-3 ml-2">
                                                <input readOnly type="text" name="daterange-m" className="border border-solid border-gray-700 p-1 text-center rounded-lg text-base font-medium cursor-pointer" />
                                            </div>
                                        </div>
                                    </SwipeableDrawer>
                                </div>
                        }
                    </header>
                    <section className="relative w-9/12 bg-mainCream mx-auto rounded-lg shadow-lg mt-6 lg:mt-20 md:mt-20 xl:mt-16">
                        {
                            userAccount != null
                                ?
                                <div onClick={() => { window.location.href = "/account" }} className={"absolute top-4 right-4 cursor-pointer"}>
                                    <Image alt={'account-link-img'} src={IMAGES.accountLink} width="30" height="30"></Image>
                                </div>
                                : null
                        }
                        <div className="flex flex-wrap py-4 md:py-16">
                            <div className="ml-8 md:ml-16">
                                {
                                    userAccount
                                        ?
                                        userAccount.thumbnail ?
                                            userAccount.thumbnail.url
                                                ?
                                                userAccount.thumbnail.url == 'default'
                                                    ?
                                                    <Image
                                                        src={IMAGES.user}
                                                        alt="default-user"
                                                        width="119"
                                                        height="119"
                                                    />
                                                    :
                                                    <Image
                                                        src={userAccount.thumbnail.url}
                                                        alt="default-user"
                                                        width="119"
                                                        height="119"
                                                    />
                                                :
                                                <Image
                                                    src={IMAGES.user}
                                                    alt="default-user"
                                                    width="119"
                                                    height="119"
                                                />
                                            :
                                            <Image
                                                src={IMAGES.user}
                                                alt="default-user"
                                                width="119"
                                                height="119"
                                            />
                                        :
                                        <Image
                                            src={IMAGES.user}
                                            alt="default-user"
                                            width="119"
                                            height="119"
                                        />
                                }
                            </div>
                            <div className="ml-6 lg:ml-12 md:ml-12 text-base md:text-xl font-normal">
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
                                    <div className="ml-16 sm:ml-52 lg:ml-64 md:ml-64 text-center lg:pl-12 md:pl-12">
                                        <p className="text-xl font-normal text-textGray">Please login</p>
                                        <BaseButton onClickFunction={() => { window.location.href = '/authen' }} fill={true} fillColor={'mainGreen'} textColor={'white'} round={true} roundSize={'lg'} value={'Login'} customClass={'mt-4 px-14 md:px-32 '}></BaseButton>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        {userAccount != null ?
                            <div className="grid grid grid-cols-2 bg-white rounded-lg lg:relative md:relative">
                                <p onClick={setPostFoundType} className={"text-center py-2 lg:py-4 md:py-4 xl:py-3 text-lg cursor-pointer border-r border-solid border-gray-400 " + cn({
                                    'bg-mainGreen text-white rounded-bl-lg bg-opacity-80 font-bold': postType === "found",
                                    'text-mainGreen font-medium': postType !== "found",
                                })
                                }>Post Found</p>
                                <p onClick={setPostLostType} className={"text-center py-2 lg:py-4 md:py-4 xl:py-3 text-lg cursor-pointer border-l border-solid border-gray-400 " + cn({
                                    'bg-mainGreen text-white rounded-br-lg bg-opacity-80 font-bold': postType === "lost",
                                    'text-mainGreen font-medium': postType !== "lost",
                                })
                                }>Post Lost</p>
                                {postType != null ? <BasePostModal user={userAccount} cancelFunction={togglePostType} type={postType} closeBasePostModal={togglePostType} /> : null}
                            </div>
                            : null
                        }
                    </section>
                    <section className="mt-12 md:mt-32 grid grid-cols-3 lg:mx-56 md:mt-24 md:grid md:grid-cols-3 md:mx-32 text-center">
                        <p className={"cursor-pointer text-lg font-medium lg:pb-2 md:pb-2 " + cn({
                            'text-mainGreen font-semibold border-b-4 border-mainGreen': searchType === 'all',
                            'text-textGray': searchType != 'all'
                        })} onClick={setSearchAllType}>All</p>
                        <p className={"cursor-pointer text-lg font-medium lg:pb-2 md:pb-2 " + cn({
                            'text-mainGreen font-semibold border-b-4 border-mainGreen': searchType === 'found',
                            'text-textGray': searchType != 'found'
                        })} onClick={setSearchFoundType}>Found</p>
                        <p className={"cursor-pointer text-lg font-medium lg:pb-2 md:pb-2 " + cn({
                            'text-mainGreen font-semibold border-b-4 border-mainGreen': searchType === 'lost',
                            'text-textGray': searchType != 'lost'
                        })} onClick={setSearchLostType}>Lost</p>
                    </section>
                </div >
                <main>
                    <section className="mt-16 md:mt-24 lg:mt-32 grid grid-cols-1 lg:grid-cols-4 lg:mx-56 md:grid md:grid-cols-4 md:mx-32">
                        <div className="hidden md:block">
                            <p className="text-xl font-bold">ITEM ({searchData != null && searchData != undefined && searchData.data.result == true ? searchData.data.count : 0})</p>
                            {
                                userAccount != null ?
                                    <div>
                                        <p onClick={() => { setSearchMyPostStatus(true) }} className="text-white lg:px-6 md:px-6 py-2 bg-darkCream rounded-3xl shadow-lg cursor-pointer lg:mt-10 md:mt-10 text-center">ค้นหาด้วยข้อมูล Post ของฉัน</p>
                                        <BaseSearchMyPostModal searchType={searchType} setMyPostSelected={setMyPostSelected} myPostData={myPostData} searchMyPostLoading={searchMyPostLoading} closeSearchByMyPostModal={closeSearchByMyPostModal} searchMyPostStatus={searchMyPostStatus} />
                                    </div>
                                    :
                                    null
                            }
                            <p className={"text-xl font-medium lg:mt-11 md:mt-11 "}>Change Location</p>
                            {
                                mapPreview === true ?
                                    <div id="map-preview" onClick={openMapModal} className="lg:mt-7 md:mt-7 lg:h-52 md:h-40 xl:h-60 md:relative lg:relative shadow-lg border border-gray-300 border-solid w-100">
                                    </div>
                                    :
                                    <div id="map-preview-default" onClick={openMapModal} className="lg:mt-7 md:mt-7 lg:h-52 md:h-40 xl:h-60 lg:relative md:relative shadow-lg border border-gray-300 border-solid w-100">
                                        <Image src={IMAGES.map} layout="fill" alt='default-map' className="lg:absolute md:absolute cursor-pointer lg:top-1/3 md:top-1/3 lg:left-16 md:left-16 " />
                                        <p className={"md:absolute text-white lg:px-6 md:px-2 md:text-sm text-center lg:text-base py-2 bg-mainGreen rounded-3xl shadow-lg cursor-pointer bg-opacity-90 " + UtilStyle.centerAbsolute}>ระบุตำแหน่งด้วยตนเอง</p>
                                    </div>
                            }
                            <BaseModalMap handleClose={closeMapModal} radiusDefault={radius} setRadius={setRadius} modalMap={modalMap} searchPlace={searchPlace} map={mapObj} location={location} confirmStatusLocation={confirmStatusLocation} cancelLocation={cancelLocation} />
                            <p className="text-xl font-medium lg:mt-8 md:mt-8">Sex</p>
                            <div className="sex-checkbox lg:ml-8 md:ml-1">
                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={male} setValue={handleMaleChange} label='male' />
                                <p className="lg:inline-block md:inline-block text-xl font-medium align-middle lg:ml-2.5 md:ml-1.5">Male</p>
                                <br />
                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={female} setValue={handleFemaleChange} label='female' />
                                <p className="lg:inline-block md:inline-block text-xl font-medium align-middle lg:ml-2.5 md:ml-1.5" >Female</p>
                                <br />
                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={unknow} setValue={handleUnknowChange} label='unknow' />
                                <p className="lg:inline-block md:inline-block text-xl font-medium align-middle lg:ml-2.5 md:ml-1.5" >Unknow</p>
                            </div>
                            <p className="text-xl font-medium lg:mt-3 md:mt-3">Pet collar</p>
                            <div className="collar-checkbox lg:ml-8 md:ml-1">
                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={haveCollar} setValue={handleHaveCollarChange} label='have collar' />
                                <p className="lg:inline-block md:inline-block text-xl font-medium align-middle lg:ml-2.5 md:ml-1.5">Have</p>
                                <br />
                                <BaseCheckbox disabled={searchStatus == true ? true : false} checkValue={notHaveCollar} setValue={handleNotHaveCollarChange} label='not have collar' />
                                <p className="lg:inline-block md:inline-block text-xl font-medium align-middle lg:ml-2.5 md:ml-1.5" >Not have</p>
                            </div>
                            <p className="text-xl font-medium lg:my-3 md:my-3">From-To</p>
                            <div className="dateRangeSelect lg:mt-3 md:mt-3 lg:ml-6 md:-ml-14">
                                <input readOnly type="text" name="daterange" className="border border-solid border-gray-700 p-1 text-center rounded-lg text-base font-medium cursor-pointer" />
                            </div>
                            {/* <div className="lg:flex flex-wrap">
                            <BaseButton onClickFunction={submitSearch} fill={true} fillColor={'mainOrange'} textColor={'white'} round={true} roundSize={'lg'} value={'Search'} customClass={'lg:mt-6'}></BaseButton>
                        </div> */}
                            {/* <p className="lg:mt-6 text-red-500 text-xl">{validateMsg.msg}</p> */}
                        </div>
                        <div className="lg:col-span-3 md:col-span-3">
                            <div className="md:flex md:flex-wrap">
                                <div className="lg:py-1 md:py-1 px-6 lg:px-6 md:px-6 lg:ml-auto md:ml-auto">
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
                            <div className="grid md:grid-cols-3 md:gap-4 md:ml-9 md:mt-8">
                                {searchStatus == true ?
                                    <div className="lg:col-span-3 col-span-3 mx-auto mx-auto lg:mt-72 md:mt-72">
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
                                            <p className="text-lg font-bold text-center lg:col-span-3 md:col-span-3 lg:mt-72 md:mt-72">nothing found here.</p>
                                        :
                                        <p className="text-lg font-bold text-center lg:col-span-3 md:col-span-3 lg:mt-72 md:mt-72">error please retry later :(</p>
                                }
                            </div>
                        </div>
                        <div className="md:col-span-4 lg:mt-16 md:mt-16 lg:mb-8 md:mb-8 my-8">
                            <div className="flex flex-wrap">
                                <div className="ml-auto ml-auto">
                                    {searchData != null && searchData != undefined && searchData.data.result == true ? <Pagination onChange={(e, page) => { setPage(page) }} page={page} count={searchData.data.count == 0 ? 1 : Math.ceil(searchData.data.count / 12)} disabled={searchStatus == true ? true : false} /> : null}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
                {userAccount != null ? <BaseDashboardAlert dashboardData={dashboardData} /> : null}
                <p className="hidden">{alertChecker}</p>
                <BasePostDisplay modalStatus={displayStatus} closeModal={closeDisplayModal} post={searchData} target={displayTarget} />
            </ThemeProvider>
        </div >
    )
}
