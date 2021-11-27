import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, createTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Image from 'next/image';
import IMAGES from '@constants/IMAGES';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import utilStyles from '@styles/Util.module.css';
import Script from 'next/script';
import Button from '@material-ui/core/Button';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    validate,
} from '@material-ui/pickers';
import Radio from '@material-ui/core/Radio';
import BasePostResModal from '@components/BasePostResModal';
const CryptoJS = require("crypto-js");
import postUtil from '@utils/postUtil';
import ICONS from '@constants/ICONS';
import BaseCropModal from "@components/BaseCropModal";
import BaseConfirmation from "@components/BaseConfirmation";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        "@media (min-width: 1280px)": {
            backgroundColor: theme.palette.background.paper,
            borderRadius: '49px',
            boxShadow: theme.shadows[5],
            width: '1600px',
            height: '700px'
        },
        "@media (min-width: 1px) and (max-width: 1279px)": {
            backgroundColor: theme.palette.background.paper,
            borderRadius: '49px',
            boxShadow: theme.shadows[5],
            width: '80%',
            height: '80%'
        },
    },
}));

const mapStyles = makeStyles((theme) => ({
    mapContainer: {
        width: '100%',
        height: '420px'
    }
}))

const buttonActionStyles = makeStyles((theme) => ({
    buttonAction: {
        "@media (min-width: 1px) and (max-width: 1439px)": {
            display: 'hidden'
        }
    }
}))

const editTheme = createTheme({
    palette: {
        primary: {
            light: "#0DF075",
            main: "#0DF075",
            dark: "#0DF075",
            contrastText: "#fff",
        },
        secondary: {
            light: "#F94848",
            main: "#F94848",
            dark: "#F94848",
            contrastText: "#fff",
        }
    },
})

const completeTheme = createTheme({
    palette: {
        primary: {
            light: "#29b6f6",
            main: "#29b6f6",
            dark: "#29b6f6",
            contrastText: "#fff",
        }
    },
})

const GreenRadio = withStyles({
    root: {
        color: '#787878',
        '&$checked': {
            color: '#356053',
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

export default function BasePostEdit(prop) {
    const [imageSet, setImageSet] = useState([{ url: IMAGES.defaultImg, default: true }]);
    const initMapStatus = useRef(false);
    const [editStatus, setEditStatus] = useState(false);
    const classes = useStyles();
    const mapClasses = mapStyles();

    const [validateMsg, setValidateMsg] = useState({});
    const [newDate, setNewDate] = useState(null);
    const [newSex, setNewSex] = useState(null);
    const [newCollar, setNewCollar] = useState(null);
    const [newDescription, setNewDescription] = useState(null);

    const [editResStatus, setEditResStatus] = useState(false);
    const [editRes, setEditRes] = useState(null);

    const [imageRawFile, setImageRawFile] = useState([]);
    const imageRawFileRef = useRef(null);
    const [cropModalStatus, setCropModalStatus] = useState(false);

    const [alertChecker, setAlertChecker] = useState(0);
    const currentAlertChecker = useRef(0);
    // const [imageCropFile, setImageCropFile] = useState([]);

    const [deleteAction, setDeleteAction] = useState(false);
    const [confirmationStatus, setConfirmationStatus] = useState(false);
    const [extendAction, setExtendAction] = useState(false);
    const [extendConfirmationStatus, setExtendConfirmationStatus] = useState(false);
    const [completeConfirmationStatus, setCompleteConfirmationStatus] = useState(false);

    useEffect(() => {
        initMapStatus.current = false;
        if (prop.modalStatus == true) {
            let checkExist = setInterval(function () {
                if (document.getElementById('map-preview-edit')) {
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
                if (prop.post[prop.target].urls.length > 0) {
                    setImageSet(prop.post[prop.target].urls);
                } else {
                    setImageSet([{ url: IMAGES.defaultImg, default: true }]);
                }
            }
        }
    }, [prop.modalStatus, prop.post, alertChecker])

    useEffect(() => {
        if (checkProp) {
            setNewDate(prop.post[prop.target].date);
            setNewSex(prop.post[prop.target].sex);
            setNewCollar(prop.post[prop.target].collar == true ? 'true' : 'false');
            setNewDescription(prop.post[prop.target].description);
            setEditStatus(false);
            setValidateMsg({});
            setEditResStatus(false);
        }
    }, [prop.post, prop.target, prop.modalStatus])

    useEffect(() => {
        if (imageRawFile.length > 0) {
            setCropModalStatus(true);
        } else {
            setCropModalStatus(false);
        }
    }, [imageRawFile])

    const closeConfirmation = async () => {
        setConfirmationStatus(false);
    }

    const closeExtendConfirmation = async () => {
        setExtendConfirmationStatus(false);
    }

    const closeCompleteConfirmation = async () => {
        setCompleteConfirmationStatus(false);
    }

    const addNewImage = async (cropData) => {
        if (cropData.length > 0) {
            setEditResStatus(true);
            let cipherCredential = CryptoJS.AES.encrypt(prop.userAccount._id, process.env.PASS_HASH).toString();
            let res = await postUtil.addImage(prop.post[prop.target].owner, cipherCredential, prop.post[prop.target]._id, prop.editPostType, cropData, imageRawFileRef.current, imageSet);
            setEditRes(res);
            if (res.data.result == true) {
                let oldPostSet = prop.post;
                res.data.newImages.map((url, index) => {
                    if (imageSet[0].default == true && index == 0) {
                        oldPostSet[prop.target].urls[0] = url;
                    } else {
                        console.log(oldPostSet[prop.target].urls)
                        oldPostSet[prop.target].urls.push(url);
                    }
                })
                if (prop.editPostType == 'found') {
                    prop.setCurrentFoundPost(oldPostSet);
                } else if (prop.editPostType == 'lost') {
                    prop.setCurrentLostPost(oldPostSet);
                }
                prop.setEditDataInState(oldPostSet[prop.target]);
                let newAlertCount = currentAlertChecker.current + 1
                setAlertChecker(newAlertCount);
                currentAlertChecker.current = newAlertCount;
            }
        }
    }

    const deleteImage = async () => {
        if (imageSet[0] != undefined && imageSet[0] != null) {
            let fileDeletedName = imageSet[0].fileName;
            setEditResStatus(true);
            let cipherCredential = CryptoJS.AES.encrypt(prop.userAccount._id, process.env.PASS_HASH).toString();
            let res = await postUtil.deleteImage(prop.post[prop.target]._id, cipherCredential, imageSet[0].fileName, prop.editPostType);
            setEditRes(res);
            if (res.data.result == true) {
                let oldPost = prop.post[prop.target];
                if (oldPost.urls.length > 1) {
                    const index = oldPost.urls.map(item => item.fileName).indexOf(fileDeletedName);
                    oldPost.urls.splice(index, 1);
                } else {
                    oldPost.urls[0] = { url: IMAGES.defaultImg, default: true };
                    setImageSet([{ url: IMAGES.defaultImg, default: true }]);
                }
                prop.setEditDataInState(oldPost);
                let newAlertCount = currentAlertChecker.current + 1
                setAlertChecker(newAlertCount);
                currentAlertChecker.current = newAlertCount;
            }
        }
    }

    const selectUploadImage = () => {
        let inputEle = document.getElementById('file-upload');
        inputEle.click();
    }

    const inputImageHandle = (event) => {
        let files = event.target.files;
        if (!checkImageLength(files)) {
            setImageRawFile([]);
            return false;
        } else {
            if (files.length > 0) {
                let fileNameArray = [];
                for (let i = 0; i < files.length; i++) {
                    fileNameArray.push(files[i].name)
                }
                imageRawFileRef.current = fileNameArray;
            }
            setImageRawFile(files);
        }
    }

    const checkImageLength = (img) => {
        let lengthChecker = [];
        imageSet.map(item => {
            if (!item.default) {
                lengthChecker.push(item);
            }
        })
        if (img.length + lengthChecker.length > 5) {
            alert('maximum image upload is 5 image');
            document.getElementById('file-upload').value = null;
            return false;
        }
        return true;
    }

    const closeCropModal = () => {
        setCropModalStatus(false);
        document.getElementById('file-upload').value = null;
    }

    const handleDateChange = (date) => {
        setNewDate(date);
    }

    const handleSexChange = (sex) => {
        setNewSex(sex.target.value);
    }

    const handleCollarChange = (collar) => {
        setNewCollar(collar.target.value);
    }

    const checkProp = prop.post != null && prop.post != undefined && prop.target != null && prop.target != undefined && prop.post[prop.target] != null && prop.post[prop.target] != undefined;

    const deletePost = async () => {
        setDeleteAction(true);
        setEditResStatus(true);
        let cipherCredential = CryptoJS.AES.encrypt(prop.userAccount._id, process.env.PASS_HASH).toString();
        let res = await postUtil.deletePost(prop.post[prop.target]._id, cipherCredential, prop.editPostType);
        setEditRes(res);
        if (res.data.result == true) {
            prop.post.splice(prop.target, 1);
            if (prop.editPostType == 'found') {
                prop.setCurrentFoundPost(prop.post);
            } else if (prop.editPostType == 'lost') {
                prop.setCurrentLostPost(prop.post);
            }
            prop.setDeleteDataInState();
        }
    }

    const extendPost = async () => {
        if (prop.type == 'inactive') {
            setExtendAction(true);
        }
        setEditResStatus(true);
        let cipherCredential = CryptoJS.AES.encrypt(prop.userAccount._id, process.env.PASS_HASH).toString();
        let res = await postUtil.extendPost(prop.post[prop.target]._id, cipherCredential, prop.editPostType);
        setEditRes(res);
        if (res.data.result == true) {
            if (prop.type == 'inactive') {
                let targetPost = res.data.updateResult;
                prop.post.splice(prop.target, 1);
                if (prop.editPostType == 'found') {
                    let newActiveFoundSet = prop.activeFoundPost.push(targetPost);
                    prop.setActiveFoundPost(prop.activeFoundPost);
                    prop.setCurrentFoundPost(prop.post);
                } else if (prop.editPostType == 'lost') {
                    let newActiveLostSet = prop.activeLostPost.push(targetPost);
                    prop.setActiveLostPost(prop.activeLostPost);
                    prop.setCurrentLostPost(prop.post);
                }
                prop.setDeleteDataInState();
            } else {
                let oldPostSet = prop.post;
                oldPostSet[prop.target].idle = res.data.updateResult.idle;
                prop.setEditDataInState(oldPostSet[prop.target]);
            }
        }
    }

    const completePost = async () => {
        setDeleteAction(true);
        setEditResStatus(true);
        let cipherCredential = CryptoJS.AES.encrypt(prop.userAccount._id, process.env.PASS_HASH).toString();
        let res = await postUtil.completePost(prop.post[prop.target]._id, cipherCredential, prop.editPostType);
        setEditRes(res);
        if (res.data.result == true) {
            prop.post.splice(prop.target, 1);
            if (prop.editPostType == 'found') {
                prop.setCurrentFoundPost(prop.post);
            } else if (prop.editPostType == 'lost') {
                prop.setCurrentLostPost(prop.post);
            }
            prop.setDeleteDataInState();
        }
    }

    const openDestination = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${prop.post[prop.target].location.coordinates[1]},${prop.post[prop.target].location.coordinates[0]}`);
    }

    let map;

    const initPreviewMap = () => {
        map = new google.maps.Map(document.getElementById("map-preview-edit"), {
            center: { lat: prop.post[prop.target].location.coordinates[1], lng: prop.post[prop.target].location.coordinates[0] },
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
        createMarker({ lat: prop.post[prop.target].location.coordinates[1], lng: prop.post[prop.target].location.coordinates[0] }, null, map);
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

    const updatePostDetail = async () => {
        if (prop.userAccount != null && prop.userAccount != undefined && prop.editPostType != null && prop.editPostType != undefined) {
            let validResult = validatePostDetail();
            if (validResult == true) {
                setEditResStatus(true);
                setValidateMsg({ type: 'pass', msg: '' })
                let cipherCredential = CryptoJS.AES.encrypt(prop.userAccount._id, process.env.PASS_HASH).toString();
                let res = await postUtil.update(newDate, newSex, newCollar, newDescription, prop.post[prop.target].owner, cipherCredential, prop.post[prop.target]._id, prop.editPostType);
                setEditRes(res);
                if (res.data.result == true) {
                    setEditStatus(false);
                    let oldPostSet = prop.post;
                    oldPostSet[prop.target].date = res.data.updateResult.date;
                    oldPostSet[prop.target].sex = res.data.updateResult.sex;
                    oldPostSet[prop.target].collar = res.data.updateResult.collar;
                    oldPostSet[prop.target].description = res.data.updateResult.description;
                    prop.setEditDataInState(oldPostSet[prop.target]);
                }
            }
        }
    }

    const validatePostDetail = () => {
        if (newDate == null) {
            setValidateMsg({ type: 'date', msg: 'please select the date.' })
            document.getElementById('date-picker-dialog').focus();
            return false;
        } else if (document.getElementById('date-picker-dialog-helper-text') != null) {
            setValidateMsg({ type: 'date', msg: 'please input correct date format.' })
            document.getElementById('date-picker-dialog').focus();
            return false;
        } else if (checkIsFuture()) {
            setValidateMsg({ type: 'date', msg: 'your selected date has not yet arrived, please input correct date.' })
            document.getElementById('date-picker-dialog').focus();
            return false;
        }
        return true;
    }

    const checkIsFuture = () => {
        let current = new Date();
        if (current < newDate) {
            return true;
        } else {
            return false;
        }
    }

    const closeEditResModal = () => {
        if (editRes != null) {
            setEditResStatus(false);
            setEditRes(null)
            if (deleteAction == true || extendAction == true) {
                prop.closeModal();
                setDeleteAction(false);
                setExtendAction(false);
                if (prop.editPostType == 'found') {
                    prop.renderFoundPost();
                    if (prop.post.length < 1 && prop.pageFoundPost > 1) {
                        prop.setPageFoundPost(prop.pageFoundPost - 1);
                    }
                    let updateTriggerCount = prop.updateTrigger + 1;
                    prop.setUpdateTrigger(updateTriggerCount);
                } else if (prop.editPostType == 'lost') {
                    prop.renderLostPost();
                    if (prop.post.length < 1 && prop.pageLostPost > 1) {
                        prop.setPageLostPost(prop.pageLostPost - 1);
                    }
                    let updateTriggerCount = prop.updateTrigger + 1;
                    prop.setUpdateTrigger(updateTriggerCount);
                }
            }
        }
    }

    return (
        <div>
            <Script async defer src={`https://maps.googleapis.com/maps/api/js?v=3.44&key=${process.env.GMAPKEY}&libraries=places&region=TH&language=th`} strategy="beforeInteractive" onLoad={() => { googleStatus.current = true }} />
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
                            <input style={{ display: 'none' }} type="file" name='file-image' multiple accept="image/png,image/jpeg" id='file-upload' onChange={inputImageHandle} />
                            <div className="py-10 h-5/6 relative">
                                <h1 className="sm:mb-4 my-6 sm:ml-8 text-center sm:text-left text-lg font-bold">EDIT YOUR {checkProp ? prop.post[prop.target].postType == 'lost' ? 'LOST CAT' : 'FOUND CAT' : null} POST</h1>
                                <div className="absolute top-7 right-8 cursor-pointer" onClick={prop.closeModal}>
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.382 13.0002L25.5059 2.8758C26.1647 2.21725 26.1647 1.15246 25.5059 0.493912C24.8473 -0.164637 23.7826 -0.164637 23.124 0.493912L12.9998 10.6183L2.87597 0.493912C2.21712 -0.164637 1.15267 -0.164637 0.494134 0.493912C-0.164711 1.15246 -0.164711 2.21725 0.494134 2.8758L10.618 13.0002L0.494134 23.1246C-0.164711 23.7831 -0.164711 24.8479 0.494134 25.5065C0.822322 25.835 1.25384 26 1.68505 26C2.11626 26 2.54747 25.835 2.87597 25.5065L12.9998 15.3821L23.124 25.5065C23.4525 25.835 23.8837 26 24.3149 26C24.7462 26 25.1774 25.835 25.5059 25.5065C26.1647 24.8479 26.1647 23.7831 25.5059 23.1246L15.382 13.0002Z" fill="black" />
                                    </svg>
                                </div>
                                <div className="grid grid-cols-12 lg:grid-cols-10 sm:gap-6 gap-2 sm:px-8 px-2 h-full overflow-y-scroll lg:overflow-visible">
                                    <div className="lg:col-span-1 col-span-3 grid gap-2 grid-cols-1 grid-rows-4 lg:h-5/6 sm:h-96 h-44 lg:w-5/6 md:w-4/6 sm:w-full w-5/6 mx-auto">
                                        {checkProp && imageSet.length > 1 ? imageSet.map((item, index) => {
                                            if (index == 0) {
                                                return null;
                                            } else {
                                                return (
                                                    <div key={index} className="relative mx-auto w-full border border-solid border-gray-700" >
                                                        <Image className="cursor-pointer" onClick={chooseImage} src={item.url} alt={index} layout='fill' />
                                                    </div>
                                                )
                                            }
                                        })
                                            :
                                            null}
                                    </div>
                                    <div className="lg:col-span-3 col-span-9">
                                        <div className="relative lg:w-full md:w-5/6 lg:h-5/6 sm:h-96 h-44 border border-solid border-gray-700" >
                                            {checkProp ?
                                                <div>
                                                    <Image src={imageSet[0].url} alt={'picture-display'} layout='fill' />
                                                    {
                                                        imageSet.length < 5
                                                            ?
                                                            <div className="absolute sm:top-36 top-16 sm:left-16 left-8">
                                                                <div className="relative sm:w-24 w-12 sm:h-24 h-12">
                                                                    <Image onClick={selectUploadImage} alt='addImage' src={ICONS.addImage} layout="fill" className="cursor-pointer"></Image>
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        prop.post[prop.target].urls.length > 0 && imageSet[0].default != true
                                                            ?
                                                            <div className="absolute sm:top-36 top-16 sm:right-16 right-8">
                                                                <div className="relative sm:w-24 w-12 sm:h-24 h-12">
                                                                    <Image onClick={deleteImage} alt='deleteImage' src={ICONS.deleteImage} layout="fill" className="cursor-pointer"></Image>
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                </div>
                                                :
                                                null
                                            }
                                        </div>
                                    </div>
                                    <div className="relative col-span-12 lg:col-span-3 grid grid-cols-1">
                                        <div className="relative bg-gray-100 rounded-2xl pt-8 sm:px-10 px-2 sm:pb-0 pb-2">
                                            {
                                                editStatus == false
                                                    ?
                                                    <div onClick={function () { setEditStatus(true) }} className={"cursor-pointer absolute top-4 right-4"}>
                                                        <Image alt='editPostDetail' src={IMAGES.accountLink} width='21' height='21' ></Image>
                                                    </div>
                                                    : null
                                            }
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    margin="normal"
                                                    id="date-picker-dialog"
                                                    label="Date"
                                                    format="dd/MM/yyyy"
                                                    value={newDate}
                                                    onChange={handleDateChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                    required
                                                    className="w-full"
                                                    error={validateMsg.type === "date" ? true : false}
                                                    disabled={editStatus == true ? false : true}
                                                />
                                            </MuiPickersUtilsProvider>
                                            <div className="sex-section flex flex-wrap items-center text-textGray font-medium my-2">
                                                <p className="sm:mr-4 mr-0 font-bold">Sex</p>
                                                <GreenRadio
                                                    checked={newSex === 'true'}
                                                    onChange={handleSexChange}
                                                    value="true"
                                                    name="radio-sex"
                                                    inputProps={{ 'aria-label': 'sex-male' }}
                                                    disabled={editStatus == true ? false : true}
                                                />
                                                <p>Male</p>
                                                <GreenRadio
                                                    checked={newSex === 'false'}
                                                    onChange={handleSexChange}
                                                    value="false"
                                                    name="radio-sex"
                                                    inputProps={{ 'aria-label': 'sex-female' }}
                                                    disabled={editStatus == true ? false : true}
                                                />
                                                <p>Female</p>
                                                <GreenRadio
                                                    checked={newSex === 'unknow'}
                                                    onChange={handleSexChange}
                                                    value="unknow"
                                                    name="radio-sex"
                                                    inputProps={{ 'aria-label': 'sex-unknow' }}
                                                    disabled={editStatus == true ? false : true}
                                                />
                                                <p>Unknow</p>
                                            </div>
                                            <div className="collar-section flex flex-wrap items-center text-textGray font-medium mt-2 mb-4">
                                                <p className="sm:mr-4 mr-0 font-bold">Pet collar</p>
                                                <GreenRadio
                                                    checked={newCollar == 'true'}
                                                    onChange={handleCollarChange}
                                                    value='true'
                                                    name="radio-collar"
                                                    inputProps={{ 'aria-label': 'collar-have' }}
                                                    disabled={editStatus == true ? false : true}
                                                />
                                                <p>Have</p>
                                                <GreenRadio
                                                    checked={newCollar == 'false'}
                                                    onChange={handleCollarChange}
                                                    value="false"
                                                    name="radio-collar"
                                                    inputProps={{ 'aria-label': 'collar-notHave' }}
                                                    disabled={editStatus == true ? false : true}
                                                />
                                                <p>Not have</p>
                                            </div>
                                            <p className="text-base font-bold mb-2">Description: </p>
                                            <TextField
                                                id="post-desc"
                                                multiline
                                                rows={6}
                                                variant="outlined"
                                                className="w-full"
                                                defaultValue={checkProp ? prop.post[prop.target].description : null}
                                                InputProps={{
                                                    readOnly: editStatus == true ? false : true
                                                }}
                                                onChange={(changeEvent) => { setNewDescription(changeEvent.target.value) }}
                                            />
                                            <ThemeProvider theme={editTheme}>
                                                {
                                                    editStatus == true
                                                        ?
                                                        <div>
                                                            <div className="my-4 flex justify-end flex-wrap">
                                                                <p onClick={function () { setEditStatus(false); setNewDate(prop.post[prop.target].date); setNewSex(prop.post[prop.target].sex); setNewCollar(prop.post[prop.target].collar == true ? 'true' : 'false'); setNewDescription(prop.post[prop.target].description); document.getElementById('post-desc').value = prop.post[prop.target].description; setValidateMsg({ type: 'pass', msg: '' }) }} className="cursor-pointer self-center mr-4 font-semibold">cancel</p>
                                                                <Button onClick={updatePostDetail} className="w-24" variant="contained" color="primary">
                                                                    Save
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        :
                                                        null
                                                }
                                            </ThemeProvider>
                                        </div>
                                        <p className="absolute mt-4 text-sm text-red-500 -bottom-6">{validateMsg != null && validateMsg.type != 'pass' ? validateMsg.msg : null}</p>
                                    </div>
                                    <div className="col-span-12 lg:col-span-3">
                                        <div id="map-preview-edit" onClick={openDestination} className={"cursor-pointer shadow-lg border border-gray-300 border-solid justify-self-center " + mapClasses.mapContainer} />
                                        <p className="mt-4 text-sm text-textGray">ไม่สามารถแก้ไขสถานที่ได้</p>
                                    </div>
                                    <div className="block lg:col-span-10 col-span-12">
                                        <ThemeProvider theme={editTheme}>
                                            {checkProp ? prop.post[prop.target].idle == true || prop.post[prop.target].status == 'inactive'
                                                ?
                                                prop.post[prop.target].status == 'inactive'
                                                    ?
                                                    <div className="sm:mt-2 sm:justify-end sm:flex sm:flex-wrap sm:justify-between sm:px-8">
                                                        <Button onClick={() => { setExtendConfirmationStatus(true); }} className="w-40" variant="contained" color="primary">
                                                            Republish
                                                        </Button>
                                                        <div className="sm:w-3/12 sm:flex sm:flex-wrap sm:justify-between">
                                                            <ThemeProvider theme={completeTheme}>
                                                                <Button onClick={() => { setCompleteConfirmationStatus(true); }} className="w-40" variant="contained" color="primary">
                                                                    Complete Post
                                                                </Button>
                                                            </ThemeProvider>
                                                            <Button onClick={() => { setConfirmationStatus(true); }} className="w-40" variant="contained" color="secondary">
                                                                Delete Post
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="sm:mt-8 sm:flex sm:flex-wrap sm:justify-end sm:px-8">
                                                        <div className="sm:w-3/12 sm:flex sm:flex-wrap sm:justify-between">
                                                            <ThemeProvider theme={completeTheme}>
                                                                <Button onClick={() => { setCompleteConfirmationStatus(true); }} className="w-40" variant="contained" color="primary">
                                                                    Complete Post
                                                                </Button>
                                                            </ThemeProvider>
                                                            <Button onClick={() => { setConfirmationStatus(true); }} className="w-40" variant="contained" color="secondary">
                                                                Delete Post
                                                            </Button>
                                                        </div>
                                                    </div>
                                                :
                                                <div className="sm:mt-8 sm:flex sm:flex-wrap sm:justify-end sm:px-8">
                                                    <div className="sm:w-3/12 sm:flex sm:flex-wrap sm:justify-between">
                                                        <ThemeProvider theme={completeTheme}>
                                                            <Button onClick={() => { setCompleteConfirmationStatus(true); }} className="w-40" variant="contained" color="primary">
                                                                Complete Post
                                                            </Button>
                                                        </ThemeProvider>
                                                        <Button onClick={() => { setConfirmationStatus(true); }} className="w-40" variant="contained" color="secondary">
                                                            Delete Post
                                                        </Button>
                                                    </div>
                                                </div>
                                                :
                                                null
                                            }
                                        </ThemeProvider>
                                    </div>
                                </div>
                            </div>
                            <p className="hidden">{alertChecker}</p>
                            <BaseCropModal setImage={addNewImage} cropModalStatus={cropModalStatus} closeCropModal={closeCropModal} imageRawFile={imageRawFile} />
                            <BasePostResModal closePostResModal={closeEditResModal} postResStatus={editResStatus} postRes={editRes} />
                            <BaseConfirmation confirmationStatus={confirmationStatus} closeConfirmation={closeConfirmation} title={'Delete Post'} content={'confirm to delete your post'} confirmAction={deletePost} />
                            <BaseConfirmation confirmationStatus={extendConfirmationStatus} closeConfirmation={closeExtendConfirmation} title={'Extend Post'} content={'confirm to extend your post for 30 days'} confirmAction={extendPost} />
                            <BaseConfirmation confirmationStatus={completeConfirmationStatus} closeConfirmation={closeCompleteConfirmation} title={'Complete Post'} content={'confirm to complete your post'} confirmAction={completePost} />
                        </div>
                    }
                </Fade>
            </Modal>
        </div>
    );
}