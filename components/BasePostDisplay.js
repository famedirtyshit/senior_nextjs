import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Image from 'next/image';
import IMAGES from '@constants/IMAGES';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import utilStyles from '@styles/Util.module.css';
import moment from 'moment';
import { Button } from "@material-ui/core";
import BaseReportPost from '@components/BaseReportPost';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '49px',
        boxShadow: theme.shadows[5],
        width: '1600px',
        height: '700px'
    },
}));

const mapStyles = makeStyles((theme) => ({
    mapContainer: {
        width: '350px',
        height: '250px'
    }
}))

export default function BasePostDisplay(prop) {
    const [imageSet, setImageSet] = useState([]);
    const [reportStatus, setReportStatus] = useState(false);
    const initMapStatus = useRef(false);
    const classes = useStyles();
    const mapClasses = mapStyles();

    useEffect(() => {
        setImageSet([]);
        initMapStatus.current = false;
        if (prop.modalStatus == true) {
            let checkExist = setInterval(function () {
                if (document.getElementById('map-preview-display')) {
                    clearInterval(checkExist);
                    if (prop.loading == undefined) {
                        initPreviewMap();
                    } else if (prop.post != null) {
                        initMapStatus.current = true;
                        initPreviewMap();
                    }
                }
            }, 100);
            if (checkProp) {
                if (prop.post.data.searchResult[prop.target].urls.length > 0) {
                    setImageSet(prop.post.data.searchResult[prop.target].urls);
                }
            }
        }
    }, [prop.modalStatus, prop.post])


    const checkProp = prop.post != null && prop.post != undefined && prop.target != null && prop.target != undefined && prop.post.data.searchResult[prop.target] != null && prop.post.data.searchResult[prop.target] != undefined;

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

    const openDestination = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${prop.post.data.searchResult[prop.target].location.coordinates[1]},${prop.post.data.searchResult[prop.target].location.coordinates[0]}`);
    }

    let map;

    const initPreviewMap = () => {
        console.log('initmap')
        map = new google.maps.Map(document.getElementById("map-preview-display"), {
            center: { lat: prop.post.data.searchResult[prop.target].location.coordinates[1], lng: prop.post.data.searchResult[prop.target].location.coordinates[0] },
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
        createMarker({ lat: prop.post.data.searchResult[prop.target].location.coordinates[1], lng: prop.post.data.searchResult[prop.target].location.coordinates[0] }, null, map);
    }

    const createMarker = async (latLng, name, map) => {
        let markerObj = await new google.maps.Marker({
            position: latLng,
            map,
            title: name ? name : 'markerTitle',
        });
    }

    const chooseImage = (e) => {
        let oldValue = imageSet[0];
        let newImages = [];
        imageSet.map((item, index) => {
            newImages.push(item)
        })
        newImages[0] = imageSet[e.target.alt];
        newImages[e.target.alt] = oldValue;
        setImageSet(newImages);
    }

    const closeReportModal = () => {
        setReportStatus(false);
    }

    return (
        <div>
            <Modal
                aria-labelledby="post-display-modal-title"
                aria-describedby="post-display-modal-description"
                className={classes.modal}
                open={prop.modalStatus}
                onClose={prop.closeModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={prop.modalStatus}>
                    {prop.loading == true ?
                        <div className="relative">
                            <div className={"absolute " + utilStyles.centerAbsolute} >
                                <CircularProgress />
                            </div>
                        </div>
                        :
                        <div className={classes.paper}>
                            <div className="2xl:pb-20 2xl:pt-10 h-full 2xl:relative">
                                <h1 className="2xl:mb-4 2xl:ml-8 text-lg font-bold">{checkProp ? prop.post.data.searchResult.length > 0 ? prop.post.data.searchResult[prop.target].postType == 'lost' ? 'LOST CAT' : 'FOUND CAT' : null : null} POST</h1>
                                <div className="2xl:absolute 2xl:top-7 2xl:right-8 cursor-pointer" onClick={prop.closeModal}>
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.382 13.0002L25.5059 2.8758C26.1647 2.21725 26.1647 1.15246 25.5059 0.493912C24.8473 -0.164637 23.7826 -0.164637 23.124 0.493912L12.9998 10.6183L2.87597 0.493912C2.21712 -0.164637 1.15267 -0.164637 0.494134 0.493912C-0.164711 1.15246 -0.164711 2.21725 0.494134 2.8758L10.618 13.0002L0.494134 23.1246C-0.164711 23.7831 -0.164711 24.8479 0.494134 25.5065C0.822322 25.835 1.25384 26 1.68505 26C2.11626 26 2.54747 25.835 2.87597 25.5065L12.9998 15.3821L23.124 25.5065C23.4525 25.835 23.8837 26 24.3149 26C24.7462 26 25.1774 25.835 25.5059 25.5065C26.1647 24.8479 26.1647 23.7831 25.5059 23.1246L15.382 13.0002Z" fill="black" />
                                    </svg>
                                </div>
                                <div className="2xl:absolute 2xl:bottom-7 2xl:left-8 cursor-pointer">
                                    <Button
                                        variant="contained"
                                   
                                        size="large"
                                        style={{ width: "112px", height: "33px", backgroundColor: '#E3242B', color: 'white' }}
                                        onClick={() => {
                                            setReportStatus(true);
                                        }}
                                    >
                                        Report
                                    </Button>
                                </div>
                                <BaseReportPost reportStatus={reportStatus} closeReportModal={closeReportModal} post={checkProp ? prop.post.data.searchResult[prop.target]._id : null} type={checkProp ? prop.post.data.searchResult[prop.target].postType : null} />
                                <div className="2xl:grid 2xl:grid-cols-10 gap-6 2xl:px-8 h-full">
                                    <div className="2xl:col-span-1 2xl:grid gap-2 2xl:grid-cols-1 2xl:grid-rows-4 h-5/6">
                                        {checkProp && imageSet.length > 1 ? imageSet.map((item, index) => {
                                            if (index == 0) {
                                                return null;
                                            } else {
                                                return (
                                                    <div key={index} className="2xl:relative 2xl:mx-auto 2xl:w-full border border-solid border-gray-700" >
                                                        <Image className="cursor-pointer" onClick={chooseImage} src={item.url} alt={index} layout='fill' />
                                                    </div>
                                                )
                                            }
                                        })
                                            :
                                            null}
                                    </div>
                                    <div className="2xl:col-span-3">
                                        <div className="2xl:relative 2xl:w-full 2xl:h-5/6 border border-solid border-gray-700" >
                                            {checkProp ?
                                                <Image src={imageSet.length > 0 ? imageSet[0].url : IMAGES.defaultImg} alt={'picture-display'} layout='fill' />
                                                :
                                                null
                                            }
                                        </div>
                                    </div>
                                    <div className="2xl:col-span-3 2xl:grid 2xl:grid-cols-1">
                                        <div className="bg-gray-100 rounded-2xl py-8 px-10">
                                            <p className='text-base mb-2'><span className="text-base font-bold">Date: </span>{checkProp ? convertDateFormat(prop.post.data.searchResult[prop.target].date) + ' ' + moment(prop.post.data.searchResult[prop.target].createdAt).format("h:mm a") : null}</p>
                                            <p className="text-base mb-2"><span className="text-base font-bold">Sex: </span>{checkProp ? prop.post.data.searchResult[prop.target].sex == "unknow" ? 'Unknow' : prop.post.data.searchResult[prop.target].sex == "true" ? 'Male' : 'Female' : null}</p>
                                            <p className="text-base mb-2"><span className="text-base font-bold">Collar: </span>{checkProp ? prop.post.data.searchResult[prop.target].collar == true ? 'Have' : 'Not Have' : null}</p>
                                            <p className="text-base font-bold mb-2">Description: </p>
                                            <TextField
                                                id="post-desc"
                                                multiline
                                                rows={4}
                                                variant="outlined"
                                                className="w-full"
                                                defaultValue={checkProp ? prop.post.data.searchResult[prop.target].description : null}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </div>
                                        <div id="map-preview-display" onClick={openDestination} className={"cursor-pointer mt-4 shadow-lg border border-gray-300 border-solid justify-self-center " + mapClasses.mapContainer} />
                                    </div>
                                    <div className="2xl:col-span-3">
                                        <div className="bg-gray-100 pt-6 px-4 rounded-2xl 2xl:h-full">
                                            <div className="text-center mb-6">
                                                <p className="text-lg font-normal">Post Owner</p>
                                                <div className="mx-auto mt-6">
                                                    {checkProp
                                                        ?
                                                        prop.post.data.searchResult[prop.target].owner.thumbnail ?
                                                            prop.post.data.searchResult[prop.target].owner.thumbnail.url
                                                                ?
                                                                prop.post.data.searchResult[prop.target].owner.thumbnail.url == 'default'
                                                                    ?
                                                                    <Image
                                                                        src={IMAGES.user}
                                                                        alt="default-user"
                                                                        width="119"
                                                                        height="119"
                                                                    />
                                                                    :
                                                                    <Image
                                                                        src={prop.post.data.searchResult[prop.target].owner.thumbnail.url}
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
                                                            height="119" />
                                                    }
                                                </div>
                                            </div>
                                            <p className="text-textGray text-lg font-normal mb-4">Name</p>
                                            <p className="text-lg font-normal mb-4">{checkProp ? prop.post.data.searchResult[prop.target].owner.firstname + ' ' + prop.post.data.searchResult[prop.target].owner.lastname : '-'}</p>
                                            <p className="text-textGray text-lg font-normal mb-4">Number</p>
                                            <p className="text-lg font-normal mb-4">{checkProp ? prop.post.data.searchResult[prop.target].owner.phone : '-'}</p>
                                            <p className="text-textGray text-lg font-normal mb-4">Contact</p>
                                            <p className="text-lg font-normal mb-4 ml-6">Facebook: {checkProp ? prop.post.data.searchResult[prop.target].owner.facebook != null ? prop.post.data.searchResult[prop.target].owner.facebook : '-' : '-'}</p>
                                            <p className="text-lg font-normal mb-4 ml-6">Instragram: {checkProp ? prop.post.data.searchResult[prop.target].owner.instagram != null ? prop.post.data.searchResult[prop.target].owner.instagram : '-' : '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </Fade>
            </Modal>
        </div>
    );
}
{/* <h2>{checkProp ? prop.post.data.searchResult[prop.target].description : null}</h2> */ }