import Head from "next/head"
import { makeStyles } from '@material-ui/core/styles';
import accountUtil from '@utils/accountUtil';
import postUtil from '@utils/postUtil';
import initFirebase from '@utils/initFirebase';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Script from 'next/script';
import { useState, useEffect, useRef } from "react";
import Carousel from 'react-material-ui-carousel'
import CircularProgress from '@material-ui/core/CircularProgress';
import utilStyles from '@styles/Util.module.css';
import Image from 'next/image'
import IMAGES from '@constants/IMAGES';
import ICONS from '@constants/ICONS';
import BasePostDisplay from "@components/BasePostDisplay";
import cn from 'classnames';
import { io } from 'socket.io-client';
import BaseConfirmation from "@components/BaseConfirmation";
import Footer from '@components/Footer';

const mainStyles = makeStyles((theme) => ({
    style: {
        width: '1366px',
        height: '1450px',
        background: '#FFFFFF',
        borderRadius: '20px 20px 0px 0px',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
    },
}));

const mapStyles = makeStyles((theme) => ({
    style: {
        width: '1326px',
        height: '625px',
    }
}));

const postDataStyles = makeStyles((theme) => ({
    style: {
        height: '546px'
    },
    itemStyle: {
        height: '500px'
    },
}))

const bgStyles = makeStyles((theme) => ({
    style: {
        backgroundImage: `url(${IMAGES.greenBg})`,
        backgroundSize: 'contain',
        backgroundPosition: '100% 0%',
        backgroundRepeat: 'no-repeat',
    }
}))

export default function Dashboard() {

    const [useAccount, setUserAccount] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const currentDashboardData = useRef(null);
    const mapObj = useRef(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const currentSelectedPost = useRef(null);
    const [nearPost, setNearPost] = useState(null);
    const currentNearPost = useRef(null);
    const googleStatus = useRef(false);
    const [displayStatus, setDisplayStatus] = useState(false);
    const [foundPostDetail, setFoundPostDetail] = useState(null);
    const [checkPostLoading, setCheckPostLoading] = useState(false);
    const [alertChecker, setAlertChecker] = useState(0);
    const currentAlertChecker = useRef(0);
    const markerPositions = useRef(new Map());
    const [confirmationStatus, setConfirmationStatus] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmContent, setConfirmContent] = useState('');

    useEffect(() => {
        let res = initFirebase();
        if (res != false) {
            console.log('init firebase');
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    let account = await accountUtil.getUser(user.uid);
                    if (account.data.result === true) {
                        // socket
                        const socket = io(process.env.API_KEY);
                        socket.on('connect', () => {
                            socket.emit("saveSession", account.data.searchResult[0]._id)
                        })

                        setUserAccount(account.data.searchResult[0]);
                        let dashboardResult = await accountUtil.getMyDashboard(account.data.searchResult[0]._id);
                        if (dashboardResult.data.result == false) {
                            setDashboardData(dashboardResult.data);
                            currentDashboardData.current = dashboardResult.data;
                        } else {
                            let dataFormat = [];
                            let dataPerPage = [];
                            dashboardResult.data.searchResult.map((item, index) => {
                                dataPerPage.push(item);
                                if ((index + 1) % 3 == 0 || index == dashboardResult.data.searchResult.length - 1) {
                                    dataFormat.push(dataPerPage);
                                    dataPerPage = [];
                                }
                            })
                            setDashboardData({ result: true, searchResult: dataFormat });
                            currentDashboardData.current = { result: true, searchResult: dataFormat };
                            if (dashboardResult.data.searchResult.length > 0) {
                                setSelectedPost({ page: 0, post: 0 })
                                currentSelectedPost.current = { page: 0, post: 0 };
                            } else {
                                setSelectedPost({ page: -1, post: -1 })
                                currentSelectedPost.current = { page: -1, post: -1 };
                            }
                            socket.on("newNearPost", function (data) {
                                updateDashboardData(data.foundPost, data.lostPost);
                                createFoundMarkerRealtime(data.foundPost, data.lostPost, mapObj.current)
                            })
                            // socket
                        }
                    } else {
                        setUserAccount(null);
                        alert('user not found');
                        signOut(auth).then(() => {
                            window.location.href = '/authen';
                            console.log('signout')
                        }).catch((error) => {
                            window.location.href = '/authen';
                            console.log('signout fail')
                            console.log(error)
                        });
                    }
                } else {
                    setUserAccount(null);
                    window.location.href = '/authen';
                }
            });
        } else {
            console.log('init firebase error')
        }
    }, [])

    useEffect(() => {
        if (selectedPost != null) {
            if (selectedPost.page == -1) {
                setNearPost({ result: 0, searchResult: [] });
                currentNearPost.current = { result: 0, searchResult: [] };
            } else {
                const fetchNearPost = async () => {
                    let nearPostRes = await postUtil.getNearPost(dashboardData.searchResult[selectedPost.page][selectedPost.post]._id)
                    if (nearPostRes.data.result == true) {
                        if (nearPostRes.data.searchResult == null) {
                            setCheckPostLoading(false);
                            setDisplayStatus(false);
                            setConfirmTitle('Post Deleted');
                            setConfirmContent('your post is deleted please refresh.');
                            setConfirmationStatus(true);
                        } else {
                            setNearPost({ result: true, searchResult: nearPostRes.data.searchResult.nearFoundCat });
                            currentNearPost.current = { result: true, searchResult: nearPostRes.data.searchResult.nearFoundCat };
                            dashboardData.searchResult[selectedPost.page][selectedPost.post] = nearPostRes.data.searchResult;
                            currentDashboardData.current = dashboardData
                            let newAlertCount = currentAlertChecker.current + 1
                            setAlertChecker(newAlertCount);
                            currentAlertChecker.current = newAlertCount;
                        }
                    } else {
                        setNearPost({ result: false });
                        currentNearPost.current = { result: false };
                        // let newAlertCount = currentAlertChecker.current + 1
                        // setAlertChecker(newAlertCount);
                        // currentAlertChecker.current = newAlertCount;
                    }
                }
                fetchNearPost();
            }
        }
    }, [selectedPost])

    useEffect(() => {
        if (nearPost != null && nearPost.result == true) {
            initMap();
        }
    }, [nearPost])

    useEffect(() => {
        // console.log(currentDashboardData.current)
    }, [currentDashboardData])

    let mainClasses = mainStyles();
    let mapClasses = mapStyles();
    let postDataClasses = postDataStyles();
    let bgClasses = bgStyles();

    const closeDisplayModal = () => {
        setDisplayStatus(false);
    }

    const closeConfirmation = () => {
        setConfirmationStatus(false);
    }

    const convertDateFormat = (dateData) => {
        let dateConvert = new Date(dateData);
        let year;
        let month;
        let date;
        year = dateConvert.getFullYear();
        month = dateConvert.getMonth() + 1;
        date = dateConvert.getDate();
        return `${date}/${month}/${year}`;
    }

    const updateDashboardData = (newFoundPost, lostPostTarget) => {
        let updatedDashboardData = currentDashboardData.current;
        updatedDashboardData.searchResult.map((page, pageIndex) => {
            page.map((lostPost) => {
                if (lostPostTarget._id.toString() == lostPost._id.toString()) {
                    lostPost.nearFoundCat.push({ _id: newFoundPost._id.toString(), status: true })
                }
            })
        });
        let newAlertCount = currentAlertChecker.current + 1
        setAlertChecker(newAlertCount);
        currentAlertChecker.current = newAlertCount;
        currentDashboardData.current = updatedDashboardData;
    }



    let infoWindow;

    const createLostMarker = async (map, post) => {
        let markerObj = await new google.maps.Marker({
            position: { lat: post.location.coordinates[1], lng: post.location.coordinates[0] },
            map,
            icon: { url: ICONS.lostMarker, scaledSize: new google.maps.Size(60, 60) },
            title: 'my cat lost here',
        });
    }

    const createFoundMarkerRealtime = async (foundPost, lostPost, mapToPlace) => {
        if (currentSelectedPost.current != null && currentSelectedPost.current.page != -1) {
            if (lostPost._id.toString() == currentDashboardData.current.searchResult[currentSelectedPost.current.page][currentSelectedPost.current.post]._id.toString() && mapToPlace != null) {
                let markerPosition = { lat: 0, lng: 0 };
                let offsetLatRandom = Math.random() * (0.0001 - 0.00004) + 0.00004;
                let offsetLngRandom = Math.random() * (0.0001 - 0.00004) + 0.00004;
                let Lat = foundPost.location.coordinates[1];
                let Lng = foundPost.location.coordinates[0];
                if (markerPositions.current.get(foundPost.location.coordinates[1].toString() + ',' + foundPost.location.coordinates[0].toString()) != true) {
                    markerPositions.current.forEach((value, key) => {
                        let splitPosition = key.split(',');
                        let oldMarkerLat = Number(splitPosition[0]);
                        let oldMarkerLng = Number(splitPosition[1]);
                        let latDistance = oldMarkerLat - Lat;
                        let lngDistance = oldMarkerLng - Lng;
                        if (Math.abs(latDistance) <= 0.000040 && Math.abs(lngDistance) <= 0.000040) {
                            const offsetXAxis = isEven(Math.floor(Math.random() * 10) + 1);
                            const offsetYAxis = isEven(Math.floor(Math.random() * 10) + 1);
                            Lat = offsetXAxis == true ? Lat + offsetLatRandom : Lat - offsetLatRandom;
                            Lng = offsetYAxis == true ? Lng + offsetLngRandom : Lng - offsetLngRandom;
                        }
                    })
                    markerPosition.lat = Lat;
                    markerPosition.lng = Lng;
                    markerPositions.current.set(`${Lat.toString()},${Lng.toString()}`, true)
                } else {
                    const randomOffsetXAxis = isEven(Math.floor(Math.random() * 10) + 1);
                    const randomOffsetYAxis = isEven(Math.floor(Math.random() * 10) + 1);
                    Lat = randomOffsetXAxis == true ? Lat + offsetLatRandom : Lat - offsetLatRandom;
                    Lng = randomOffsetYAxis == true ? Lng + offsetLngRandom : Lng - offsetLngRandom;
                    markerPosition.lat = Lat;
                    markerPosition.lng = Lng;
                    markerPositions.current.set(`${Lat.toString()},${Lng.toString()}`, true)
                }
                let markerObj = await new google.maps.Marker({
                    position: markerPosition,
                    map: mapToPlace,
                    icon: { url: ICONS.foundMarker, scaledSize: new google.maps.Size(35, 35) },
                    title: foundPost.description,
                });
                markerObj.addListener('click', async () => {
                    setCheckPostLoading(true);
                    setDisplayStatus(true);
                    let foundPostDetail = await postUtil.checkNearPost(currentDashboardData.current.searchResult[currentSelectedPost.current.page][currentSelectedPost.current.post]._id, foundPost._id)
                    if (foundPostDetail.data.result == true) {
                        let updatedDashboardData = currentDashboardData.current;
                        updatedDashboardData.searchResult[currentSelectedPost.current.page][currentSelectedPost.current.post].nearFoundCat.map((nearPostItem, nearPostIndex) => {
                            if (nearPostItem._id == foundPost._id) {
                                updatedDashboardData.searchResult[currentSelectedPost.current.page][currentSelectedPost.current.post].nearFoundCat[nearPostIndex].status = false;
                                return;
                            }
                        });
                        setDashboardData(updatedDashboardData);
                        currentDashboardData.current = updatedDashboardData;
                        if (foundPostDetail.data.updateResult != null) {
                            markerObj.setIcon({ url: ICONS.foundCheckedMarker, scaledSize: new google.maps.Size(35, 35) })
                            setFoundPostDetail({ data: { searchResult: [foundPostDetail.data.updateResult] } })
                            setCheckPostLoading(false);
                        } else {
                            let newNearPostSet = [];
                            currentNearPost.current.searchResult.map(item => {
                                if (item._id._id) {
                                    if (item._id._id.toString() != foundPost._id.toString()) {
                                        newNearPostSet.push(item);
                                    }
                                } else {
                                    if (item._id.toString() != foundPost._id.toString()) {
                                        newNearPostSet.push(item);
                                    }
                                }
                            })
                            setNearPost({ result: true, searchResult: newNearPostSet });
                            currentNearPost.current = { result: true, searchResult: newNearPostSet };
                            setCheckPostLoading(false);
                            setDisplayStatus(false);
                            setConfirmTitle('Post Deleted');
                            setConfirmContent('this post is deleted.');
                            setConfirmationStatus(true);
                        }
                    } else {
                        setCheckPostLoading(false);
                        setDisplayStatus(false);
                        setConfirmTitle('Error');
                        setConfirmContent('failed retry later.');
                        setConfirmationStatus(true);
                    }
                })
            }
        }
    }

    const isEven = (n) => {
        return n % 2 == 0;
    }

    const createFoundMarker = async (map) => {
        nearPost.searchResult.map(async (item, index) => {
            let markerPosition = { lat: 0, lng: 0 };
            let offsetLatRandom = Math.random() * (0.0001 - 0.00004) + 0.00004;
            let offsetLngRandom = Math.random() * (0.0001 - 0.00004) + 0.00004;
            let Lat = item._id.location.coordinates[1];
            let Lng = item._id.location.coordinates[0];
            if (markerPositions.current.get(item._id.location.coordinates[1].toString() + ',' + item._id.location.coordinates[0].toString()) != true) {
                markerPositions.current.forEach((value, key) => {
                    let splitPosition = key.split(',');
                    let oldMarkerLat = Number(splitPosition[0]);
                    let oldMarkerLng = Number(splitPosition[1]);
                    let latDistance = oldMarkerLat - Lat;
                    let lngDistance = oldMarkerLng - Lng;
                    if (Math.abs(latDistance) <= 0.000040 && Math.abs(lngDistance) <= 0.000040) {
                        const offsetXAxis = isEven(Math.floor(Math.random() * 10) + 1);
                        const offsetYAxis = isEven(Math.floor(Math.random() * 10) + 1);
                        Lat = offsetXAxis == true ? Lat + offsetLatRandom : Lat - offsetLatRandom;
                        Lng = offsetYAxis == true ? Lng + offsetLngRandom : Lng - offsetLngRandom;
                    }
                })
                markerPosition.lat = Lat;
                markerPosition.lng = Lng;
                markerPositions.current.set(`${Lat.toString()},${Lng.toString()}`, true)
            } else {
                const randomOffsetXAxis = isEven(Math.floor(Math.random() * 10) + 1);
                const randomOffsetYAxis = isEven(Math.floor(Math.random() * 10) + 1);
                Lat = randomOffsetXAxis == true ? Lat + offsetLatRandom : Lat - offsetLatRandom;
                Lng = randomOffsetYAxis == true ? Lng + offsetLngRandom : Lng - offsetLngRandom;
                markerPosition.lat = Lat;
                markerPosition.lng = Lng;
                markerPositions.current.set(`${Lat.toString()},${Lng.toString()}`, true)
            }
            let markerObj = await new google.maps.Marker({
                position: markerPosition,
                map,
                icon: item.status == true ? { url: ICONS.foundMarker, scaledSize: new google.maps.Size(35, 35) } : { url: ICONS.foundCheckedMarker, scaledSize: new google.maps.Size(35, 35) },
                title: item._id.description,
            });
            markerObj.addListener('click', async () => {
                setCheckPostLoading(true);
                setDisplayStatus(true);
                let foundPostDetail = await postUtil.checkNearPost(dashboardData.searchResult[selectedPost.page][selectedPost.post]._id, item._id._id)
                if (foundPostDetail.data.result == true) {
                    let updatedDashboardData = dashboardData;
                    updatedDashboardData.searchResult[selectedPost.page][selectedPost.post].nearFoundCat.map((nearPostItem, nearPostIndex) => {
                        if (nearPostItem._id._id == item._id._id) {
                            updatedDashboardData.searchResult[selectedPost.page][selectedPost.post].nearFoundCat[nearPostIndex].status = false;
                            return;
                        }
                    });
                    setDashboardData(updatedDashboardData);
                    currentDashboardData.current = updatedDashboardData;
                    if (foundPostDetail.data.updateResult != null) {
                        markerObj.setIcon({ url: ICONS.foundCheckedMarker, scaledSize: new google.maps.Size(35, 35) })
                        setFoundPostDetail({ data: { searchResult: [foundPostDetail.data.updateResult] } })
                        setCheckPostLoading(false);
                    } else {
                        let newNearPostSet = [];
                        currentNearPost.current.searchResult.map(oldItem => {
                            if (oldItem._id._id) {
                                if (oldItem._id._id != item._id._id) {
                                    newNearPostSet.push(oldItem);
                                }
                            }
                        })
                        setNearPost({ result: true, searchResult: newNearPostSet });
                        currentNearPost.current = { result: true, searchResult: newNearPostSet };
                        setCheckPostLoading(false);
                        setDisplayStatus(false);
                        setConfirmTitle('Post Deleted');
                        setConfirmContent('this post is deleted.');
                        setConfirmationStatus(true);
                    }
                } else {
                    setCheckPostLoading(false);
                    setDisplayStatus(false);
                    setConfirmTitle('Error');
                    setConfirmContent('failed retry later.');
                    setConfirmationStatus(true);
                }
            })
        })
    }

    const initMap = async () => {
        let position;
        let markerPosition = null;
        let postInformation = dashboardData.searchResult[selectedPost.page][selectedPost.post];
        let map = await new google.maps.Map(document.getElementById("map-dashboard"), {
            center: { lat: postInformation.location.coordinates[1], lng: postInformation.location.coordinates[0] },
            zoom: 16,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            fullscreenControl: false,
        });
        mapObj.current = map;
        markerPositions.current = new Map();
        createLostMarker(map, postInformation);
        createFoundMarker(map);
        const circle = new google.maps.Circle({
            strokeColor: "#356053",
            strokeOpacity: 0.5,
            strokeWeight: 2,
            fillColor: "#356053",
            fillOpacity: 0.1,
            map,
            center: { lat: postInformation.location.coordinates[1], lng: postInformation.location.coordinates[0] },
            radius: 2000,
        });
        map.fitBounds(circle.getBounds(), 0);
        infoWindow = new google.maps.InfoWindow();
    }

    return (
        <div className={"2xl:container mx-auto " + bgClasses.style}>
            <Head>
                <title>CatUs</title>
                <meta name="description" content="CatUs Service" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Script async defer src={`https://maps.googleapis.com/maps/api/js?v=3.44&key=${process.env.GMAPKEY}&libraries=places&region=TH&language=th`} strategy="beforeInteractive" onLoad={() => { googleStatus.current = true }} />
            <Script src="https://unpkg.com/@googlemaps/markerclustererplus/dist/index.min.js" strategy="beforeInteractive"></Script>
            <h1 className="text-6xl font-bold text-white pt-10 ml-72 ">Catus</h1>
            <main className={"2xl:mt-28 2xl:mb-48 mx-auto border border-solid border-gray-300 " + mainClasses.style}>
                <h1 className="text-4xl font-bold text-center mt-8 mb-4">Dashboard</h1>
                {
                    nearPost != null
                        ?
                        nearPost.result == true
                            ?
                            <div id="map-dashboard" className={"mx-auto pb-11 " + mapClasses.style} ></div>
                            :
                            nearPost.result === false
                                ?
                                <div id="map-dashboard" className={"relative mx-auto pb-11 " + mapClasses.style} >
                                    <h1 className={"text-4xl font-bold absolute " + utilStyles.centerAbsolute}>error please retry later :(</h1>
                                </div>
                                :
                                <div id="map-dashboard" className={"relative mx-auto pb-11 " + mapClasses.style} >
                                    <h1 className={"text-4xl font-bold absolute " + utilStyles.centerAbsolute}>no post selected</h1>
                                </div>
                        :
                        <div className={"relative mx-auto pb-11 " + mapClasses.style}>
                            {
                                dashboardData != null && dashboardData.result == false
                                    ?
                                    <h1 className={"text-4xl font-bold absolute " + utilStyles.centerAbsolute}>error please retry later :(</h1>
                                    :
                                    <div className={'absolute ' + utilStyles.centerAbsolute}>
                                        <CircularProgress />
                                    </div>
                            }
                        </div>
                }
                <div className='border-b border-solid border-gray-300'></div>
                <h1 className="mt-9 ml-11 mb-11 text-4xl font-semibold">Select a post for monitoring.</h1>
                <div className={"w-full relative " + postDataClasses.style}>
                    {
                        dashboardData == null
                            ?
                            <div className={'absolute ' + utilStyles.centerAbsolute}>
                                <CircularProgress />
                            </div>
                            :
                            dashboardData.result == true
                                ?
                                dashboardData.searchResult.length > 0
                                    ?
                                    <div className="block h-full">
                                        <Carousel animation="slide" autoPlay={false} navButtonsAlwaysVisible={dashboardData.searchResult.length > 1 ? true : false} className="h-full">
                                            {dashboardData.searchResult.map((item, i) => {
                                                return (
                                                    <div className={"grid 2xl:grid-cols-3 px-4 justify-items-center mt-4 " + postDataClasses.itemStyle} key={'dashboard-page-' + (i + 1)}>
                                                        {item.map((pageItem, pageItemIndex) => {
                                                            return (
                                                                <div className={`cursor-pointer ` + cn({
                                                                    'border-b-8 border-solid border-red-500': dashboardData.searchResult[i][pageItemIndex].nearFoundCat.some(item => item.status == true),
                                                                    'shadow-dashboardItemSelected': selectedPost != null && selectedPost.page === i && selectedPost.post === pageItemIndex
                                                                })} onClick={() => { setSelectedPost({ page: i, post: pageItemIndex }); currentSelectedPost.current = { page: i, post: pageItemIndex }; }} key={'dashboard-item-' + (i + 1) + '-' + (pageItemIndex + 1)}>
                                                                    {
                                                                        pageItem.urls.length > 0
                                                                            ?
                                                                            <Carousel navButtonsAlwaysInvisible={pageItem.urls.length < 2 ? true : false} indicators={false} className="">
                                                                                {pageItem.urls.map((urlItem, urlIndex) => {
                                                                                    return (
                                                                                        <div key={'image-preview-dashboard-' + (pageItemIndex + 1) + '-' + urlIndex} className="mx-auto">
                                                                                            <Image src={urlItem.url} alt={'previewImg-dashboard-' + (pageItemIndex + 1) + '-' + urlIndex} width="326" height="326" />
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </Carousel>
                                                                            :
                                                                            <Image key={'image-preview-dashboard-default-' + (pageItemIndex + 1)} src={IMAGES.defaultImg} alt={'previewImg-dashboard-default' + (pageItemIndex + 1)} width="326" height="326" />
                                                                    }
                                                                    <div className="px-3 pt-3">
                                                                        <p className="text-lg font-medium"><span className="text-lg font-medium">Date: </span>{convertDateFormat(pageItem.date)}</p>
                                                                        <p className="text-lg font-medium"><span className="text-lg font-medium">Sex: </span>{pageItem.sex != "unknow" ? pageItem.sex == "true" ? "Male" : "Female" : 'Unknow'}</p>
                                                                        <p className="text-lg font-medium"><span className="text-lg font-medium">Collar: </span>{pageItem.collar ? 'Have' : 'Not Have'}</p>
                                                                        <p className="text-lg font-medium"><span className="text-lg font-medium">Description: </span>{pageItem.description ? pageItem.description.length > 15 ? pageItem.description.substring(0, 15) + '...' : pageItem.description : '-'}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )
                                            })}
                                        </Carousel>
                                    </div>
                                    :
                                    <h1 className={"text-4xl font-bold absolute " + utilStyles.centerAbsolute}>you have no lost post</h1>
                                :
                                <h1 className={"text-4xl font-bold absolute " + utilStyles.centerAbsolute}>error please retry later :(</h1>
                    }
                    <BasePostDisplay loading={checkPostLoading} modalStatus={displayStatus} closeModal={closeDisplayModal} post={foundPostDetail} target={0} />
                    <BaseConfirmation confirmOnly={true} confirmationStatus={confirmationStatus} closeConfirmation={closeConfirmation} title={confirmTitle} content={confirmContent} confirmAction={() => { console.log('confirm') }} />
                    <p className="hidden">{alertChecker}</p>
                </div>
            </main>
            <Footer />
        </div>
    )
}