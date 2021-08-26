import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Image from 'next/dist/client/image';
import IMAGES from '@constants/IMAGES';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
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
    // const [imagePreview, setImagePreview] = useState(0);
    const [imageSet, setImageSet] = useState([]);
    const classes = useStyles();
    const mapClasses = mapStyles();

    useEffect(() => {
        setImageSet([]);
        if (prop.modalStatus == true) {
            let checkExist = setInterval(function () {
                if (document.getElementById('map-preview')) {
                    clearInterval(checkExist);
                    initPreviewMap();
                }
            }, 100);
            if (checkProp) {
                if (prop.post.data.searchResult[prop.target].urls.length > 0) {
                    setImageSet(prop.post.data.searchResult[prop.target].urls);
                }
            }
        }
    }, [prop.modalStatus])

    const checkProp = prop.post != null && prop.post != undefined && prop.target != null && prop.target != undefined;

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
        map = new google.maps.Map(document.getElementById("map-preview"), {
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
        imageSet.map((item,index)=>{
            newImages.push(item)
        })
        newImages[0] = imageSet[e.target.alt];
        newImages[e.target.alt] = oldValue;
        setImageSet(newImages);
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
                    <div className={classes.paper}>
                        <div className="2xl:py-20 h-full">
                            <div className="2xl:grid 2xl:grid-cols-10 gap-6 2xl:px-8 h-full">
                                <div className="2xl:col-span-1 2xl:grid gap-2 h-5/6">
                                    {checkProp && imageSet.length > 1 ? imageSet.map((item, index) => {
                                        if (index == 0) {
                                            return null;
                                        } else {
                                            return (
                                                <div key={index} className="2xl:relative 2xl:mx-auto 2xl:w-full 2xl:h-full border border-solid border-gray-700" >
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
                                        <p className='text-base mb-2'><span className="text-base font-bold">Date: </span>{checkProp ? convertDateFormat(prop.post.data.searchResult[prop.target].date) : null}</p>
                                        <p className="text-base mb-2"><span className="text-base font-bold">Sex: </span>{checkProp ? prop.post.data.searchResult[prop.target].sex == true ? 'Male' : 'Female' : null}</p>
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
                                    <div id="map-preview" onClick={openDestination} className={"cursor-pointer mt-4 shadow-lg border border-gray-300 border-solid justify-self-center " + mapClasses.mapContainer} />
                                </div>
                                <div className="2xl:col-span-3">
                                    <div className="bg-gray-100 pt-6 px-4 rounded-2xl 2xl:h-full">
                                        <div className="text-center mb-6">
                                            <p className="text-lg font-normal">Post Owner</p>
                                            <div className="mx-auto mt-6">
                                                <Image src={IMAGES.user} alt='default-user' width="100" height="100" />
                                            </div>
                                        </div>
                                        <p className="text-textGray text-lg font-normal mb-4">Name</p>
                                        <p className="text-lg font-normal mb-4">สมชาย บินทะลุบ้าน</p>
                                        <p className="text-textGray text-lg font-normal mb-4">Number</p>
                                        <p className="text-lg font-normal mb-4">091-xxx-xxxx</p>
                                        <p className="text-textGray text-lg font-normal mb-4">Contact</p>
                                        <p className="text-lg font-normal mb-4 ml-6">Facebook: somchai flyhigh</p>
                                        <p className="text-lg font-normal mb-4 ml-6">Instragram: somchaiFly657</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
{/* <h2>{checkProp ? prop.post.data.searchResult[prop.target].description : null}</h2> */ }