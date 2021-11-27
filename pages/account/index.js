import Head from "next/head";
import BaseButton from "@components/BaseButton";
import IMAGES from "@constants/IMAGES";
import Image from "next/dist/client/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AccountStyle from "@styles/Account.module.css";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, Grid, Accordion } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Footer from "@components/Footer";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import initFirebase from "@utils/initFirebase";
import accountUtil from "@utils/accountUtil";
import CircularProgress from "@material-ui/core/CircularProgress";
import utilStyles from "@styles/Util.module.css";
import { Skeleton } from "@material-ui/lab";
import BasePostEdit from "@components/BasePostEdit";
import TextField from "@material-ui/core/TextField";
import BaseModalChangePassword from "@components/BaseModalChangePassword";
import BaseModalChangeEmail from "@components/BaseModalChangeEmail";
import BaseCropModal from "@components/BaseCropModal";
const CryptoJS = require("crypto-js");
import BasePostResModal from "@components/BasePostResModal";
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
    fontSize: "20",
  },
  root: {
    width: "100%",
  },
  rootInput: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  buttonStyle:{
    [theme.breakpoints.down("sm")]: {
    width: "70px",
     height: "33px",
    },
    [theme.breakpoints.up("sm")]: {
      width: "119px",
       height: "33px",
      }
  },
  carousel: {
    width: "326px",
    height: "350px",
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: "20",
  },
  list: {
    border: "#e5e5e5 1px solid",
    boxShadow: "1px 2px #c4c4c4",
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      light: "#378566",
      main: "#378566",
      dark: "#356053",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#F0930D",
      dark: "#E17F11",
      contrastText: "#fff",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
  },
});

export default function Account() {
  const [userEmail, setUserEmail] = useState("-");
  const [openListMyPost, setOpenListMyPost] = useState(false);
  const [openListMyInactivePost, setOpenListMyInactivePost] = useState(false);
  const [openListSubMyPost1, setOpenListSubMyPost1] = useState(false);
  const [openListSubMyInactivePost1, setOpenListSubMyInactivePost1] = useState(false);
  const [openListSubMyPost2, setOpenListSubMyPost2] = useState(false);
  const [openListSubMyInactivePost2, setOpenListSubMyInactivePost2] = useState(false);
  const [openListMyLost, setOpenListMyLost] = useState(false);
  const [pageFoundPost, setPageFoundPost] = useState(1);
  const [pageFoundInactivePost, setPageFoundInactivePost] = useState(1);
  const [pageLostPost, setPageLostPost] = useState(1);
  const [pageLostInactivePost, setPageLostInactivePost] = useState(1);
  const [currentFoundPost, setCurrentFoundPost] = useState([]);
  const [currentLostPost, setCurrentLostPost] = useState([]);
  const [currentFoundInactivePost, setCurrentFoundInactivePost] = useState([]);
  const [currentLostInactivePost, setCurrentLostInactivePost] = useState([]);
  const [maxPageFoundPost, setMaxPageFoundPost] = useState(4);
  const [maxPageLostPost, setMaxPageLostPost] = useState(4);
  const [maxPageFoundInactivePost, setMaxPageFoundInactivePost] = useState(4);
  const [maxPageLostInactivePost, setMaxPageLostInactivePost] = useState(4);
  const [postFoundData, setPostFoundData] = useState([]);
  const [postLostData, setPostLostData] = useState([]);
  const [postFoundInactiveData, setPostFoundInactiveData] = useState([]);
  const [postLostInactiveData, setPostLostInactiveData] = useState([]);
  const [message, setMessage] = useState("");
  const [inactiveMessage, setInactiveMessage] = useState("");
  const [userAccount, setUserAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editActive, setEditActive] = useState(false);
  // const [editValue, setEditValue] = useState("");
  const [editPostStatus, setEditPostStatus] = useState(false);
  const [editPostType, setEditPostType] = useState(null);
  const [editPostTarget, setEditPostTarget] = useState(0);
  const [editInactivePostStatus, setEditInactivePostStatus] = useState(false);
  const [editInactivePostType, setEditInactivePostType] = useState(null);
  const [editInactivePostTarget, setEditInactivePostTarget] = useState(0);
  const [editSection1Active, setEditSection1Active] = useState(false);
  const [editSection2Active, setEditSection2Active] = useState(false);
  const [editSection3Active, setEditSection3Active] = useState(false);
  const [editFirstname, setEditFirstname] = useState(null);
  const [editLastname, setEditLastname] = useState(null);
  const [editNumber, setEditNumber] = useState(null);
  const [editFacebook, setEditFacebook] = useState(null);
  const [editInstagram, setEditInstagram] = useState(null);
  const [editEmail, setEditEmail] = useState(null);
  const [errorInputFirstName, setErrorInputFirstName] = useState(false);
  const [errorInputLastName, setErrorInputLastName] = useState(false);
  const [errorInputNumber, setErrorInputNumber] = useState(false);
  const [errorInputFacebook, setErrorInputFacebook] = useState(false);
  const [errorInputInstagram, setErrorInputInstagram] = useState(false);
  const [errorInputEmail, setErrorInputEmail] = useState(false);
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
  const [openModalChangeEmail, setOpenModalChangeEmail] = useState(false);

  const [thumbnailCropStatus, setThumbnailCropStatus] = useState(false);
  const [thumbnailRawFile, setThumbnailRawFile] = useState([]);
  const [thumbnailCropFile, setThumbnailCropFile] = useState([]);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState([]);
  const [thumbnailResStatus, setThumbnailResStatus] = useState(false);
  const [thumbnailRes, setThumbnailRes] = useState(null);

  const [mailSubEdit, setMailSubEdit] = useState(false);

  const [updateTrigger, setUpdateTrigger] = useState(0);

  const CryptoJS = require("crypto-js");

  useEffect(() => {
    let res = initFirebase();
    setLoading(true);

    if (res != false) {
      console.log("init firebase");
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          let account = await accountUtil.getUser(user.uid);
          let myPost = await accountUtil.getMyPost(
            account.data.searchResult[0]._id
          );
          let myInactivePost = await accountUtil.getMyInactivePost(
            account.data.searchResult[0]._id
          );
          setUserEmail(user.email);
          if (account.data.result === true) {
            setUserAccount(account.data.searchResult[0]);
            setMailSubEdit(account.data.searchResult[0].mailSubscribe);
            setLoading(false);
          } else {
            setUserAccount(null);
            alert("user not found");
            signOut(auth)
              .then(() => {
                console.log("signout");
              })
              .catch((error) => {
                console.log("signout fail");
                console.log(error);
              });
          }
          if (myPost.data.result === true && myInactivePost.data.result === true) {
            setPostFoundData(myPost.data.searchResult.postFound);
            setPostLostData(myPost.data.searchResult.postLost);
            setPostFoundInactiveData(myInactivePost.data.searchResult.postFound);
            setPostLostInactiveData(myInactivePost.data.searchResult.postLost);
            // console.log("----------------");
            // console.log(myPost.data.searchResult.postFound);
          } else {
            // setMessage("No Post Result !!");
            setPostFoundData([null]);
            setPostLostData([null]);
            setPostFoundInactiveData([null]);
            setPostLostInactiveData([null]);
          }
        } else {
          setUserAccount(null);
          window.location.href = "/authen";
        }
      });
    } else {
      console.log("init firebase error");
    }
  }, []);

  useEffect(() => {
    renderFoundPost();
  }, [pageFoundPost, postFoundData, updateTrigger]);

  useEffect(() => {
    renderLostPost();
  }, [pageLostPost, postLostData, updateTrigger]);

  useEffect(() => {
    renderInactiveFoundPost();
  }, [pageFoundInactivePost, postFoundInactiveData, updateTrigger]);

  useEffect(() => {
    renderInactiveLostPost();
  }, [pageLostInactivePost, postLostInactiveData, updateTrigger]);

  useEffect(() => {
    setMaxPageFoundPost(Math.ceil(postFoundData.length / 3));
    setMaxPageLostPost(Math.ceil(postLostData.length / 3));
  }, [postFoundData, postLostData, currentFoundPost, currentLostPost]);

  useEffect(() => {
    setMaxPageFoundInactivePost(Math.ceil(postFoundInactiveData.length / 3));
    setMaxPageLostInactivePost(Math.ceil(postLostInactiveData.length / 3));
  }, [postFoundInactiveData, postLostInactiveData, currentFoundInactivePost, currentLostInactivePost]);

  useEffect(() => {
    if (thumbnailRawFile.length > 0) {
      setThumbnailCropStatus(true);
    } else {
      setThumbnailCropStatus(false);
    }
  }, [thumbnailRawFile])

  useEffect(() => {
    setThumbnailDataUrl([]);
    for (let i = 0; i < thumbnailCropFile.length; i++) {
      blobToDataURL(thumbnailCropFile[i], function (dataUrl) {
        setThumbnailDataUrl(imageCropFile => [...imageCropFile, dataUrl]);
      });
    }
  }, [thumbnailCropFile])

  useEffect(() => {
    if (thumbnailDataUrl.length > 0) {
      async function changeThumbnail() {
        setThumbnailResStatus(true);
        let cipherCredential = CryptoJS.AES.encrypt(userAccount._id, process.env.PASS_HASH).toString();
        let res = await accountUtil.changeThumbnail(userAccount._id, cipherCredential, thumbnailCropFile);
        setThumbnailRes(res);
        setThumbnailRawFile([]);
        setThumbnailCropFile([]);
        if (res.data.result == true) {
          let userObj = userAccount;
          userObj['thumbnail'] = { url: res.data.updateResult.thumbnail.url };
          setUserAccount(userObj);
        }
      }
      changeThumbnail();
    }
  }, [thumbnailDataUrl])

  useEffect(() => {
    if (userAccount) {
      setMailSubEdit(userAccount.mailSubscribe);
    }
  }, [editSection1Active])

  const classes = useStyles();

  const mailSubChange = (e) => {
    setMailSubEdit(!mailSubEdit);
  }

  const closeThumbnailCropStatus = () => {
    setThumbnailCropStatus(false);
    let inputField = document.getElementById('thumbnail-upload');
    if (inputField) {
      inputField.value = '';
    }
  }

  const inputThumbnailHandle = (event) => {
    let files = event.target.files;
    setThumbnailRawFile(files);
  }

  const emitCroppedImage = (file) => {
    setThumbnailCropFile(file);
  }

  const blobToDataURL = (blob, callback) => {
    let fr = new FileReader();
    fr.onload = function (e) { callback(e.target.result); }
    fr.readAsDataURL(blob);
  }

  const closeThumbnailResModal = () => {
    if (thumbnailRes != null) {
      setThumbnailResStatus(false);
      setThumbnailRes(null);
    }
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

  const handleClickListMyPost = () => {
    setOpenListMyPost(!openListMyPost);
  };

  const handleClickListMyInactivePost = () => {
    setOpenListMyInactivePost(!openListMyInactivePost);
  };

  const handleClickListSubMyPost1 = () => {
    setOpenListSubMyPost1(!openListSubMyPost1);
  };

  const handleClickListSubMyInactivePost1 = () => {
    setOpenListSubMyInactivePost1(!openListSubMyInactivePost1);
  };

  const handleClickListSubMyPost2 = () => {
    setOpenListSubMyPost2(!openListSubMyPost2);
  };

  const handleClickListSubMyInactivePost2 = () => {
    setOpenListSubMyInactivePost2(!openListSubMyInactivePost2);
  };

  const handleClickListMyLost = () => {
    setOpenListMyLost(!openListMyLost);
  };

  const closePostEditModal = () => {
    setEditPostStatus(false);
  }

  const closeInactivePostEditModal = () => {
    setEditInactivePostStatus(false);
  }

  const openEditPost = (type, index) => {
    if (type == 'found') {
      setEditPostType('found');
    } else {
      setEditPostType('lost');
    }
    setEditPostStatus(true);
    setEditPostTarget(index);
  }

  const renderFoundPost = () => {
    let store = [];
    let initIndex = (pageFoundPost - 1) * 3;
    if (postFoundData.length < 1) {
      setMessage("not found");
      return;
    }
    for (
      let i = initIndex;
      i < initIndex + 3 && i < postFoundData.length;
      i++
    ) {
      store.push(postFoundData[i]);
    }
    setCurrentFoundPost(store);
    console.log(store);
  };

  const renderInactiveFoundPost = () => {
    let store = [];
    let initIndex = (pageFoundInactivePost - 1) * 3;
    if (postFoundInactiveData.length < 1) {
      setInactiveMessage("not found");
      return;
    }
    for (
      let i = initIndex;
      i < initIndex + 3 && i < postFoundInactiveData.length;
      i++
    ) {
      store.push(postFoundInactiveData[i]);
    }
    setCurrentFoundInactivePost(store);
  };

  const renderLostPost = () => {
    let store = [];
    let initIndex = (pageLostPost - 1) * 3;
    if (postLostData.length < 1) {
      setMessage("not found");
      return;
    }
    for (let i = initIndex; i < initIndex + 3 && i < postLostData.length; i++) {
      store.push(postLostData[i]);
    }
    setCurrentLostPost(store);
    console.log(store);
  };

  const renderInactiveLostPost = () => {
    let store = [];
    let initIndex = (pageLostInactivePost - 1) * 3;
    if (postLostInactiveData.length < 1) {
      setInactiveMessage("not found");
      return;
    }
    for (let i = initIndex; i < initIndex + 3 && i < postLostInactiveData.length; i++) {
      store.push(postLostInactiveData[i]);
    }
    setCurrentLostInactivePost(store);
  };

  const nextPage = (pageType) => {
    let countFound = pageFoundPost;
    let countLost = pageLostPost;
    if (pageType == "found") {
      if (pageFoundPost >= maxPageFoundPost) {
        return;
      } else {
        setPageFoundPost(++countFound);
      }
    } else if (pageType == "lost") {
      if (pageLostPost >= maxPageLostPost) {
        return;
      } else {
        setPageLostPost(++countLost);
      }
    }
  };

  const nextInactivePage = (pageType) => {
    let countFound = pageFoundInactivePost;
    let countLost = pageLostInactivePost;
    if (pageType == "found") {
      if (pageFoundInactivePost >= maxPageFoundInactivePost) {
        return;
      } else {
        setPageFoundInactivePost(++countFound);
      }
    } else if (pageType == "lost") {
      if (pageLostInactivePost >= maxPageLostInactivePost) {
        return;
      } else {
        setPageLostInactivePost(++countLost);
      }
    }
  };

  const backPage = (pageType) => {
    let countFound = pageFoundPost;
    let countLost = pageLostPost;
    if (pageType == "found") {
      if (pageFoundPost <= 1) {
        return;
      } else {
        setPageFoundPost(--countFound);
      }
    } else if (pageType == "lost") {
      if (pageLostPost <= 1) {
        return;
      } else {
        setPageLostPost(--countLost);
      }
    }
  };

  const backInactivePage = (pageType) => {
    let countFound = pageFoundInactivePost;
    let countLost = pageLostInactivePost;
    if (pageType == "found") {
      if (pageFoundInactivePost <= 1) {
        return;
      } else {
        setPageFoundInactivePost(--countFound);
      }
    } else if (pageType == "lost") {
      if (pageLostInactivePost <= 1) {
        return;
      } else {
        setPageLostInactivePost(--countLost);
      }
    }
  };

  // const handleChangeEdit = (event) => {
  //   setEditValue(event.target.value);
  // }

  const pressEditSection1 = async () => {
    let newFirstName = document.getElementById("newFirstNameID").value;
    let newLastName = document.getElementById("newLastNameID").value;
    let newNumber = document.getElementById("newNumberID").value;
    let newFacbook = document.getElementById("newFacebookID").value;
    let newInstagram = document.getElementById("newInstagramID").value;
    let errorFirstName = false;
    let errorLastName = false;
    let errorNumber = false;
    let errorFacebook = false;
    let errorInstagram = false;

    if (newFirstName == "" || newFirstName.length > 50) {
      setErrorInputFirstName(true);
      errorFirstName = true;
    } else {
      setEditFirstname(newFirstName);
      setErrorInputFirstName(false);
      errorFirstName = false;
    }
    if (newLastName == "" || newLastName.length > 50) {
      setErrorInputLastName(true);
      errorLastName = true;
    } else {
      setEditLastname(newLastName);
      setErrorInputLastName(false);
      errorLastName = false;
      console.log(errorInputLastName);
    }
    if (newNumber == "" || newNumber.length != 10) {
      setErrorInputNumber(true);
      errorNumber = true;
    } else {
      setEditNumber(newNumber);
      setErrorInputNumber(false);
      errorNumber = false;
      console.log(errorInputNumber);
    }

    if (newFacbook.length > 100) {
      setErrorInputFacebook(true);
      errorFacebook = true;
    } else {
      setEditFacebook(newFacbook);
      setErrorInputFacebook(false);
      errorFacebook = false;
      console.log(errorInputFacebook);
    }

    if (newInstagram.length > 30) {
      setErrorInputInstagram(true);
      errorInstagram = true;
    } else {
      setEditInstagram(newInstagram);
      setErrorInputInstagram(false);
      errorInstagram = false;
      console.log(errorInputInstagram);
    }

    if (
      errorFirstName == true ||
      errorLastName == true ||
      errorNumber == true ||
      errorFacebook == true ||
      errorInstagram == true
    ) {
      console.log("something true");
    } else {
      setEditSection1Active(false);
      let cipherCredential = CryptoJS.AES.encrypt(
        userAccount._id,
        process.env.PASS_HASH
      ).toString();

      let res = await accountUtil.editContact(
        userAccount._id,
        cipherCredential,
        newFirstName,
        newLastName,
        newNumber,
        newFacbook,
        newInstagram,
        mailSubEdit
      );
      // console.log(res.data);
      // console.log(userAccount);

      if (res.data.result == true) {
        let accountObject = userAccount;
        setUserAccount(res.data.updateResult);
      }
    }

    // console.log("all false");
  };

  const pressEditSection2 = () => {
    let newEmail = document.getElementById("newEmailID").value;
    let errorEmail = false;

    if (newEmail == "" || newEmail.length > 50) {
      setErrorInputEmail(true);
      console.log(errorInputFirstName);
      errorEmail = true;
    } else {
      setEditEmail(newEmail);
      setErrorInputEmail(false);
      errorEmail = false;
      console.log(errorInputEmail);
    }

    if (errorEmail == true) {
      console.log("something true");
    } else {
      setEditSection2Active(false);
      console.log("all false");
    }
  };

  const handleOpenModalChangePassword = () => {
    setOpenModalChangePassword(true);
  };

  const handleCloseModalChangePassword = () => {
    setOpenModalChangePassword(false);
  };

  const handleOpenModalChangeEmail = () => {
    setOpenModalChangeEmail(true);
  };

  const handleCloseModalChangeEmail = () => {
    setOpenModalChangeEmail(false);
  };

  const setEditDataInState = (data) => {
    if (editPostType == 'found') {
      postFoundData[((pageFoundPost - 1) * 3) + editPostTarget] = data;
    } else if (editPostType == 'lost') {
      postLostData[((pageLostPost - 1) * 3) + editPostTarget] = data;
    }
  }

  const setEditInactiveDataInState = (data) => {
    if (editInactivePostType == 'found') {
      postFoundInactiveData[((pageFoundInactivePost - 1) * 3) + editInactivePostTarget] = data;
    } else if (editInactivePostType == 'lost') {
      postLostInactiveData[((pageLostInactivePost - 1) * 3) + editInactivePostTarget] = data;
    }
  }

  const setDeleteDataInState = () => {
    if (editPostType == 'found') {
      postFoundData.splice(((pageFoundPost - 1) * 3) + editPostTarget, 1);
    } else if (editPostType == 'lost') {
      postLostData.splice(((pageLostPost - 1) * 3) + editPostTarget, 1);
    }
  }

  const setDeleteInactiveDataInState = () => {
    if (editInactivePostType == 'found') {
      postFoundInactiveData.splice(((pageFoundInactivePost - 1) * 3) + editInactivePostTarget, 1);
    } else if (editInactivePostType == 'lost') {
      postLostInactiveData.splice(((pageLostInactivePost - 1) * 3) + editInactivePostTarget, 1);
    }
  }

  return (
    <div style={{ fontFamily: 'Prompt' }} className={" mx-auto " + AccountStyle.bgImg}>
      <BaseModalChangePassword
        handleClose={handleCloseModalChangePassword}
        openModalChangePassword={openModalChangePassword}
      />
      <BaseModalChangeEmail
        handleClose={handleCloseModalChangeEmail}
        openModalChangeEmail={openModalChangeEmail}
      />
      <Head>
        <title>CatUs</title>
        <meta name="description" content="CatUs Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="sm:flex sm:flex-wrap sm:justify-between lg:mx-64 sm:mx-28 mx-3 pt-3">
        <Link href="/">
          <a>
            <h1 className="text-3xl sm:text-5xl sm:font-black text-white">Catus</h1>
          </a>
        </Link>
      </header>
      <main>
        <section

          className="w-full sm:w-11/12 lg:w-9/12 bg-mainYellow mx-auto  sm:rounded-t-2xl shadow-lg sm:mt-20 h-auto"
          // style={{ height: "1000px" }}
        >
          {/* {editSection3Active==true ? <BaseModalChangePassword open={editSection3Active}/> : null} */}
          <div className="sm:mt-11 absolute sm:ml-12 ml-2 mt-4">
            <Link href="/feed">
              <a>
                <ArrowBackIosIcon
                  style={{ color: "white", width: "40px", height: "40px" }}
                  className="cursor-pointer"
                />
              </a>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center">
            <p className="text-3xl sm:text-4xl font-black sm:mt-11 mt-4">My Account</p>
          </div>

          <section className="contact-detail-part1 flex flex-wrap justify-center ">
            <div className="container bg-white w-11/12 sm:w-4/5 lg:w-4/5 xl:w-3/5 sm:h-84  rounded-lg sm:rounded-2xl shadow-lg mt-7 ">
              <section className="flex flex-wrap justify-center pt-5 sm:pt-14">
                {loading == true ? (
                  <Skeleton variant="circle" width={119} height={119} />
                ) : (
                  <div className="cursor-pointer relative" onClick={() => {
                    let inputEle = document.getElementById('thumbnail-upload');
                    if (thumbnailCropStatus == false && thumbnailResStatus == false) {
                      inputEle.click();
                    }
                  }}>
                    <input style={{ display: 'none' }} type="file" name='file-thumbnail' accept="image/png,image/jpeg" id='thumbnail-upload' onChange={inputThumbnailHandle} />
                    <div className={"absolute z-50 " + utilStyles.centerAbsolute}>
                      <Image src={IMAGES.userThumbnailEdit}
                        alt="user-thumbnail-edit"
                        width="40"
                        height="40" />
                    </div>
                    <BaseCropModal setImage={emitCroppedImage} cropModalStatus={thumbnailCropStatus} closeCropModal={closeThumbnailCropStatus} imageRawFile={thumbnailRawFile} />
                    <BasePostResModal closePostResModal={closeThumbnailResModal} postResStatus={thumbnailResStatus} postRes={thumbnailRes} />
                    {editSection1Active ? (
                      <div>
                        {
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
                        }
                      </div>
                    ) : (
                      <div>
                        { 
                          userAccount.thumbnail ?
                            userAccount.thumbnail.url
                              ?
                              userAccount.thumbnail.url == 'default'
                                ?
                                <Image className="rounded-full"
                                  src={IMAGES.user}
                                  alt="default-user"
                                  width="119"
                                  height="119"
                                />
                                :
                                <Image className="rounded-full"
                                  src={userAccount.thumbnail.url}
                                  alt="default-user"
                                  width="119"
                                  height="119"
                                />
                              :
                              <Image className="rounded-full"
                                src={IMAGES.user}
                                alt="default-user"
                                width="119"
                                height="119"
                              />
                            :
                            <Image className="rounded-full"
                              src={IMAGES.user}
                              alt="default-user"
                              width="119"
                              height="119"
                            />
                        }
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div className="sm:m-9 m-9">
                    {loading == true ? (
                      <Skeleton variant="text" width={350} height={35} />
                    ) : (
                      <p className="text-xl sm:text-3xl font-bold">
                        {editSection1Active ? (
                          // <TextField
                          //   error={errorInputFirstName}
                          //   label="New firstname"
                          //   id="newFirstNameID"
                          //   size="small"
                          //   required
                          //   defaultValue={userAccount.firstname}
                          // />

                          <input
                            className={
                              errorInputFirstName
                                ? "shadow appearance-none border border-red-500 rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                : "shadow appearance-none border rounded w-56  py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            }
                            id="newFirstNameID"
                            type="text"
                            defaultValue={userAccount.firstname}
                          />
                        ) : (
                          userAccount.firstname
                        )}{" "}
                        {editSection1Active ? (
                          // <TextField
                          //   error={errorInputLastName}
                          //   label="New lastname"
                          //   id="newLastNameID"
                          //   size="small"
                          //   required
                          //   defaultValue={userAccount.lastname}
                          // />
                          <input
                            className={
                              errorInputLastName
                                ? "shadow appearance-none border border-red-500 rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                : "shadow appearance-none border rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            }
                            id="newLastNameID"
                            type="text"
                            defaultValue={userAccount.lastname}
                          />
                        ) : (
                          userAccount.lastname
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:mt-10">
                  {loading == true ? (
                    <Skeleton animation="rect" height={30} width={112} />
                  ) : (
                    <ThemeProvider theme={theme}>
                      {editSection1Active == true ? (
                        <div style={{ width: "112px", height: "33px" }}></div>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          style={{ width: "112px", height: "33px" }}
                          onClick={() => {
                            setEditSection1Active(true);
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    </ThemeProvider>
                  )}
                </div>
              </section>
              <section className="content-container mx-8 my-8 text-xl ">
                {loading == true ? (
                  <div>
                    <Skeleton animation="wave" height={35} />
                    <Skeleton animation="wave" height={35} />
                    <Skeleton animation="wave" height={35} />
                    <Skeleton animation="wave" height={35} />
                    <Skeleton animation="wave" height={35} />
                    <Skeleton animation="wave" height={35} />
                  </div>
                ) : (
                  <div>
                    <p className="" style={{ color: "#6E6E6E" }}>
                      แก้ไขข้อมูลผู้ติดต่อ
                    </p>

                    <p className="mt-2 " style={{ color: "#6E6E6E" }}>
                      Number
                    </p>
                    {/* {editActive == true ? (

                      <input
                        type="number"
                        className="sm:mt-2 sm:ml-4 sm:font-bold"
                        value={editValue}
                        onChange={handleChangeEdit}
                      />
                    )
                      : null} */}
                    {editSection1Active == true ? (
                      <div className="mt-1 ml-3">
                        {/* <TextField
                          error={errorInputNumber}
                          id="newNumberID"
                          label="New Number"
                          type="number"
                          size="small"
                          defaultValue={userAccount.phone}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        /> */}
                        <input
                          className={
                            errorInputNumber
                              ? "shadow appearance-none border border-red-500 rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              : "shadow appearance-none border rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          }
                          id="newNumberID"
                          type="text"
                          defaultValue={userAccount.phone}
                        />
                      </div>
                    ) : (
                      userAccount.phone
                    )}
                    <p className="mt-2" style={{ color: "#6E6E6E" }}>
                      Contact
                    </p>

                    {editSection1Active ? (
                      <div className="grid grid-cols-2">
                        <div className="ml-3">
                          {/* <TextField
                            error={errorInputFacebook}
                            label="New Facebook"
                            id="newFacebookID"
                            size="small"
                            defaultValue={userAccount.facebook}
                          /> */}
                          <input
                            className={
                              errorInputFacebook
                                ? "shadow appearance-none border border-red-500 rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                : "shadow appearance-none border rounded w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            }
                            id="newFacebookID"
                            type="text"
                            defaultValue={userAccount.facebook}
                          />

                          {/* <TextField
                            error={errorInputInstagram}
                            label="New Instagram"
                            id="newInstagramID"
                            size="small"
                            defaultValue={userAccount.instagram}
                          /> */}
                          <input
                            className={
                              errorInputInstagram
                                ? "shadow appearance-none border border-red-500 rounded mt-2 w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                : "shadow appearance-none border rounded mt-2 w-56 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            }
                            id="newInstagramID"
                            type="text"
                            defaultValue={userAccount.instagram}
                          />
                          <p className="mt-3" style={{ color: "#6E6E6E" }}>
                            Mail Subscribe
                          </p>
                          <div className="flex flex-wrap ">
                            <p className="mt-1 sm:font-bold">
                              off
                            </p>
                            <Switch
                              checked={mailSubEdit}
                              onChange={mailSubChange}
                              inputProps={{ 'aria-label': 'mailSubscribe-edit' }}
                            />
                            <p className="mt-1 sm:font-bold">
                              on
                            </p>
                          </div>
                        </div>
                        <ThemeProvider theme={theme}>
                          <div>
                            <div className="sm:absolute xl:ml-24 xl:mt-28 md:ml-12 md:mt-28 sm:ml-0 sm:mt-28 ml-3 mt-52">
                              <Button
                                variant="contained"
                                color="error"
                                size="large"
                                style={{ width: "112px", height: "33px" }}
                                onClick={() => {
                                  setEditSection1Active(false);
                                }}
                              >
                                cancel
                              </Button>
                            </div>
                            <div
                              className="sm:absolute xl:ml-56 xl:mt-28 md:ml-44 md:mt-28 sm:ml-28 sm:mt-28 ml-3 mt-3"
                            // style={{ marginLeft: "220px" }}
                            >
                              <div className="sm:ml-1">
                              <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                style={{ width: "112px", height: "33px" }}
                                onClick={() => {
                                  pressEditSection1();
                                }}
                              >
                                OK
                              </Button>
                              </div>
                            </div>
                          </div>
                        </ThemeProvider>
                      </div>
                    ) : (
                      <div>
                        <p className="mt-2 ml-4 font-bold">
                          Facebook: {userAccount.facebook}
                        </p>
                        <p className="mt-2 ml-4 font-bold">
                          Instagram: {userAccount.instagram}
                        </p>
                        <p className="mt-3" style={{ color: "#6E6E6E" }}>
                          Mail Subscribe
                        </p>
                        <div className="flex flex-wrap ">
                          <p className="mt-1 font-bold">
                            off
                          </p>
                          <Switch
                            checked={userAccount.mailSubscribe}
                            disabled
                            inputProps={{ 'aria-label': 'mailSubscribe-default' }}
                          />
                          <p className="mt-1 font-bold">
                            on
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          </section>

          <section className="contact-detail-part1 flex flex-wrap justify-center ">
            <div className="container bg-white w-11/12 sm:w-4/5 lg:w-4/5 xl:w-3/5 sm:h-84 rounded-lg sm:rounded-2xl shadow-lg mt-3 mb-3">
              <section className="content-container mx-6 my-8 sm:text-xl text-lg ">
                {loading == true ? (
                  <div>
                    <Skeleton animation="wave" height={35} />
                    <Skeleton animation="wave" height={35} />
                    <Skeleton animation="wave" height={35} />
                    <Skeleton animation="wave" height={35} />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute sm:top-16 top-12 inset-y-0 sm:right-2 md:right-16 right-0">
                      <ThemeProvider theme={theme}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          // style={{ width: "112px", height: "33px" }}
                          className={classes.buttonStyle}
                          onClick={() => handleOpenModalChangeEmail()}
                        >
                          Edit
                        </Button>
                      </ThemeProvider>
                    </div>
                    <div className="absolute sm:top-32 top-24 inset-y-0 sm:right-2 md:right-16 right-0">
                      <ThemeProvider theme={theme}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          // style={{ width: "112px", height: "33px" }}
                          className={classes.buttonStyle}
                          onClick={handleOpenModalChangePassword}
                        >
                          Edit
                        </Button>
                      </ThemeProvider>
                    </div>
                    <p className="" style={{ color: "#6E6E6E" }}>
                      แก้ไขข้อมูลผู้ใช้งาน
                    </p>
                    <p className="sm:mt-2 " style={{ color: "#6E6E6E" }}>
                      E-mail
                    </p>
                    {editSection2Active ? (
                      <div className="sm:mt-2 sm:ml-4">
                        <input
                          className={
                            errorInputEmail
                              ? "shadow appearance-none border border-red-500 rounded w-80 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              : "shadow appearance-none border rounded w-80 py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          }
                          id="newEmailID"
                          type="text"
                          defaultValue={userEmail}
                        />
                      </div>
                    ) : (
                      <p className="sm:mt-2 sm:ml-4 sm:font-bold">
                        {userEmail}
                      </p>
                    )}

                    <p className="sm:mt-2" style={{ color: "#6E6E6E" }}>
                      รหัสผ่านและการยืนยันตัวตน
                    </p>
                    <p className="sm:mt-2 sm:ml-4 sm:font-bold">********</p>
                  </div>
                )}
                <div></div>
              </section>
            </div>
          </section>
        </section>

        <section className="sm:w-11/12 lg:w-9/12 mx-auto" >
          <List className={classes.list}>
            <ListItem button onClick={handleClickListMyPost}>
              <ListItemText
                primary="My Active Post"
                style={{ color: "black", margin: "14px" }}
              />
              {openListMyPost ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openListMyPost} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  onClick={handleClickListSubMyPost1}
                >
                  <ListItemText
                    primary="My found post"
                    style={{ color: "black", margin: "14px" }}
                  />
                  {openListSubMyPost1 ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={openListSubMyPost1} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem className={classes.nested}>
                      <div className="">
                        {pageFoundPost <= 1 ? (
                          <ArrowBackIosIcon
                            style={{
                              color: "#ffff",
                              width: "60px",
                              height: "60px",
                            }}
                          />
                        ) : (
                          <ArrowBackIosIcon
                            style={{
                              color: "#356053",
                              width: "60px",
                              height: "60px",
                            }}
                            onClick={() => backPage("found")}
                            className="cursor-pointer"
                          />
                        )}
                      </div>
                      <div className="mx-auto mt-5">
                        <section className="flex flex-wrap gap-20 flex-start">
                          {
                            currentFoundPost.length < 1
                              ?
                              <h1 className="text-2xl font-bold">No Post</h1>
                              :
                              currentFoundPost[0] == null
                                ?
                                <h1 className="text-2xl font-bold">Error please retry later</h1>
                                :
                                currentFoundPost.map((item, i) => (
                                  <section
                                    className="cursor-pointer"
                                    onClick={function () {
                                      setEditPostType('found');
                                      setEditPostStatus(true);
                                      setEditPostTarget(i);
                                    }} key={i}>
                                    <Carousel indicators={false} navButtonsAlwaysVisible={false}>
                                      <div className="w-72 h-72">
                                        {
                                          item.urls.length > 0
                                            ?
                                            item.urls.map((items, i) => (
                                              <Image
                                                key={i}
                                                src={items.url}
                                                alt={"previewImg-" + i}
                                                width="300px"
                                                height="300px"
                                                layout="responsive"
                                              />
                                            ))
                                            :
                                            <Image
                                              src={IMAGES.defaultImg}
                                              alt={"previewImg-default-found"}
                                              width="300px"
                                              height="300px"
                                              layout="responsive"
                                            />
                                        }
                                      </div>
                                    </Carousel>
                                    <ListItemText primary={"Date: " + convertDateFormat(item.date)} />
                                    <ListItemText primary={item.sex == 'unknow' ? 'Sex : Unknow' : item.sex == 'true' ? 'Sex : Male' : 'Sex : Female'} />
                                    <ListItemText
                                      primary={item.collar == true ? 'Collar: Have' : 'Collar: Not Have'}
                                    />
                                    <ListItemText
                                      primary={item.description ? item.description.length > 15 ? 'Description: ' + item.description.substring(0, 15) + '...' : 'Description: ' + item.description : 'Description: -'}
                                    />
                                  </section>
                                ))}
                        </section>
                      </div>
                      {pageFoundPost >= maxPageFoundPost ? (
                        <ArrowForwardIosIcon
                          style={{
                            color: "#fff",
                            width: "60px",
                            height: "60px",
                          }}
                        />
                      ) : (
                        <ArrowForwardIosIcon
                          style={{
                            color: "#356053",
                            width: "60px",
                            height: "60px",
                          }}
                          onClick={() => nextPage("found")}
                          className="cursor-pointer"
                        />
                      )}
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem
                  button
                  className={classes.nested}
                  onClick={handleClickListSubMyPost2}
                >
                  <ListItemText
                    primary="My lost post"
                    style={{ color: "black", margin: "14px" }}
                  />
                  {openListSubMyPost2 ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openListSubMyPost2} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem className={classes.nested}>
                      <div className="">
                        {pageLostPost <= 1 ? (
                          <ArrowBackIosIcon
                            style={{
                              color: "#fff",
                              width: "60px",
                              height: "60px",
                            }}
                          />
                        ) : (
                          <ArrowBackIosIcon
                            style={{
                              color: "#356053",
                              width: "60px",
                              height: "60px",
                            }}
                            onClick={() => backPage("lost")}
                            className="cursor-pointer"
                          />
                        )}
                      </div>
                      <div className="mx-auto mt-5">
                        <section className="flex flex-wrap gap-28 flex-start">
                          {
                            currentLostPost.length < 1
                              ?
                              <h1 className="text-2xl font-bold">No Post</h1>
                              :
                              currentLostPost[0] == null
                                ?
                                <h1 className="text-2xl font-bold">Error please retry later</h1>
                                :
                                currentLostPost.map((item, i) => (
                                  <section className="cursor-pointer" onClick={function () {
                                    setEditPostType('lost');
                                    setEditPostStatus(true);
                                    setEditPostTarget(i);
                                  }} key={i}>
                                    <Carousel indicators={false} navButtonsAlwaysVisible={false}>
                                      <div className="w-72 h-72">
                                        {
                                          item.urls.length > 0
                                            ?
                                            item.urls.map((items, i) => (
                                              <Image
                                                key={i}
                                                src={items.url}
                                                alt={"previewImg-" + i}
                                                width="300px"
                                                height="300px"
                                                layout="responsive"
                                              />
                                            ))
                                            :
                                            <Image
                                              src={IMAGES.defaultImg}
                                              alt={"previewImg-default-lost"}
                                              width="300px"
                                              height="300px"
                                              layout="responsive"
                                            />
                                        }
                                      </div>
                                    </Carousel>
                                    <ListItemText primary={"Date: " + convertDateFormat(item.date)} />
                                    <ListItemText primary={item.sex == 'unknow' ? 'Sex : Unknow' : item.sex == 'true' ? 'Sex : Male' : 'Sex : Female'} />
                                    <ListItemText
                                      primary={item.collar == true ? 'Collar: Have' : 'Collar: Not Have'}
                                    />
                                    <ListItemText
                                      primary={item.description ? item.description.length > 15 ? 'Description: ' + item.description.substring(0, 15) + '...' : 'Description: ' + item.description : 'Description: -'}
                                    />
                                  </section>
                                ))}
                        </section>
                      </div>
                      {pageLostPost >= maxPageLostPost ? (
                        <ArrowForwardIosIcon
                          style={{
                            color: "#fff",
                            width: "60px",
                            height: "60px",
                          }}
                        />
                      ) : (
                        <ArrowForwardIosIcon
                          style={{
                            color: "#356053",
                            width: "60px",
                            height: "60px",
                          }}
                          onClick={() => nextPage("lost")}
                          className="cursor-pointer"
                        />
                      )}
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </Collapse>
          </List>
        </section>

        <section className="sm:w-11/12 lg:w-9/12 mx-auto" >
          <List className={classes.list}>
            <ListItem button onClick={handleClickListMyInactivePost}>
              <ListItemText
                primary="My Inactive Post"
                style={{ color: "black", margin: "14px" }}
              />
              {openListMyInactivePost ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openListMyInactivePost} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  onClick={handleClickListSubMyInactivePost1}
                >
                  <ListItemText
                    primary="My found post"
                    style={{ color: "black", margin: "14px" }}
                  />
                  {openListSubMyInactivePost1 ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={openListSubMyInactivePost1} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem className={classes.nested}>
                      <div className="">
                        {pageFoundInactivePost <= 1 ? (
                          <ArrowBackIosIcon
                            style={{
                              color: "#ffff",
                              width: "60px",
                              height: "60px",
                            }}
                          />
                        ) : (
                          <ArrowBackIosIcon
                            style={{
                              color: "#356053",
                              width: "60px",
                              height: "60px",
                            }}
                            onClick={() => backInactivePage("found")}
                            className="cursor-pointer"
                          />
                        )}
                      </div>
                      <div className="sm:mx-auto sm:mt-5">
                        <section className="sm:flex sm:flex-wrap sm:gap-20 flex-start">
                          {
                            currentFoundInactivePost.length < 1
                              ?
                              <h1 className="text-2xl font-bold">No Post</h1>
                              :
                              currentFoundInactivePost[0] == null
                                ?
                                <h1 className="text-2xl font-bold">Error please retry later</h1>
                                :
                                currentFoundInactivePost.map((item, i) => (
                                  <section
                                    className="cursor-pointer"
                                    onClick={function () {
                                      setEditInactivePostType('found');
                                      setEditInactivePostStatus(true);
                                      setEditInactivePostTarget(i);
                                    }} key={i}>
                                    <Carousel indicators={false} navButtonsAlwaysVisible={false}>
                                      <div className="w-72 h-72">
                                        {
                                          item.urls.length > 0
                                            ?
                                            item.urls.map((items, i) => (
                                              <Image
                                                key={i}
                                                src={items.url}
                                                alt={"previewImg-" + i}
                                                width="300px"
                                                height="300px"
                                                layout="responsive"
                                              />
                                            ))
                                            :
                                            <Image
                                              src={IMAGES.defaultImg}
                                              alt={"previewImg-default-found"}
                                              width="300px"
                                              height="300px"
                                              layout="responsive"
                                            />
                                        }
                                      </div>
                                    </Carousel>
                                    <ListItemText primary={"Date: " + convertDateFormat(item.date)} />
                                    <ListItemText primary={item.sex == 'unknow' ? 'Sex : Unknow' : item.sex == 'true' ? 'Sex : Male' : 'Sex : Female'} />
                                    <ListItemText
                                      primary={item.collar == true ? 'Collar: Have' : 'Collar: Not Have'}
                                    />
                                    <ListItemText
                                      primary={item.description ? item.description.length > 15 ? 'Description: ' + item.description.substring(0, 15) + '...' : 'Description: ' + item.description : 'Description: -'}
                                    />
                                  </section>
                                ))}
                        </section>
                      </div>
                      {pageFoundInactivePost >= maxPageFoundInactivePost ? (
                        <ArrowForwardIosIcon
                          style={{
                            color: "#fff",
                            width: "60px",
                            height: "60px",
                          }}
                        />
                      ) : (
                        <ArrowForwardIosIcon
                          style={{
                            color: "#356053",
                            width: "60px",
                            height: "60px",
                          }}
                          onClick={() => nextInactivePage("found")}
                          className="cursor-pointer"
                        />
                      )}
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem
                  button
                  className={classes.nested}
                  onClick={handleClickListSubMyInactivePost2}
                >
                  <ListItemText
                    primary="My lost post"
                    style={{ color: "black", margin: "14px" }}
                  />
                  {openListSubMyInactivePost2 ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openListSubMyInactivePost2} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem className={classes.nested}>
                      <div className="">
                        {pageLostInactivePost <= 1 ? (
                          <ArrowBackIosIcon
                            style={{
                              color: "#fff",
                              width: "60px",
                              height: "60px",
                            }}
                          />
                        ) : (
                          <ArrowBackIosIcon
                            style={{
                              color: "#356053",
                              width: "60px",
                              height: "60px",
                            }}
                            onClick={() => backInactivePage("lost")}
                            className="cursor-pointer"
                          />
                        )}
                      </div>
                      <div className="sm:mx-auto sm:mt-5">
                        <section className="sm:flex sm:flex-wrap sm:gap-28 flex-start">
                          {
                            currentLostInactivePost.length < 1
                              ?
                              <h1 className="text-2xl font-bold">No Post</h1>
                              :
                              currentLostInactivePost[0] == null
                                ?
                                <h1 className="text-2xl font-bold">Error please retry later</h1>
                                :
                                currentLostInactivePost.map((item, i) => (
                                  <section className="cursor-pointer" onClick={function () {
                                    setEditInactivePostType('lost');
                                    setEditInactivePostStatus(true);
                                    setEditInactivePostTarget(i);
                                  }} key={i}>
                                    <Carousel indicators={false} navButtonsAlwaysVisible={false}>
                                      <div className="w-72 h-72">
                                        {
                                          item.urls.length > 0
                                            ?
                                            item.urls.map((items, i) => (
                                              <Image
                                                key={i}
                                                src={items.url}
                                                alt={"previewImg-" + i}
                                                width="300px"
                                                height="300px"
                                                layout="responsive"
                                              />
                                            ))
                                            :
                                            <Image
                                              src={IMAGES.defaultImg}
                                              alt={"previewImg-default-lost"}
                                              width="300px"
                                              height="300px"
                                              layout="responsive"
                                            />
                                        }
                                      </div>
                                    </Carousel>
                                    <ListItemText primary={"Date: " + convertDateFormat(item.date)} />
                                    <ListItemText primary={item.sex == 'unknow' ? 'Sex : Unknow' : item.sex == 'true' ? 'Sex : Male' : 'Sex : Female'} />
                                    <ListItemText
                                      primary={item.collar == true ? 'Collar: Have' : 'Collar: Not Have'}
                                    />
                                    <ListItemText
                                      primary={item.description ? item.description.length > 15 ? 'Description: ' + item.description.substring(0, 15) + '...' : 'Description: ' + item.description : 'Description: -'}
                                    />
                                  </section>
                                ))}
                        </section>
                      </div>
                      {pageLostInactivePost >= maxPageLostInactivePost ? (
                        <ArrowForwardIosIcon
                          style={{
                            color: "#fff",
                            width: "60px",
                            height: "60px",
                          }}
                        />
                      ) : (
                        <ArrowForwardIosIcon
                          style={{
                            color: "#356053",
                            width: "60px",
                            height: "60px",
                          }}
                          onClick={() => nextInactivePage("lost")}
                          className="cursor-pointer"
                        />
                      )}
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </Collapse>
          </List>
        </section>

        <section
          className="sm:w-11/12 lg:w-9/12 sm:mt-3 mx-auto">
          <List className={classes.list}>
            <Link href="/dashboard">
              <a>
                <ListItem button>
                  <ListItemText
                    primary="Monitoring My Lost Post"
                    style={{ color: "black", margin: "14px" }}
                  />
                </ListItem>
              </a>
            </Link>
          </List>
        </section>
        <section
          className="sm:w-11/12 lg:w-9/12 sm:mt-3 mx-auto mb-10">
          <List className={classes.list}>
            <Link href="/history">
              <a>
                <ListItem button>
                  <ListItemText
                    primary="My History Post"
                    style={{ color: "black", margin: "14px" }}
                  />
                </ListItem>
              </a>
            </Link>
          </List>
        </section>
        <ThemeProvider theme={theme}>
          <BasePostEdit pageFoundPost={pageFoundPost} pageLostPost={pageLostPost} setPageFoundPost={setPageFoundPost} setPageLostPost={setPageLostPost} renderFoundPost={renderFoundPost} renderLostPost={renderLostPost} setDeleteDataInState={setDeleteDataInState} setEditDataInState={setEditDataInState} setCurrentFoundPost={setCurrentFoundPost} setCurrentLostPost={setCurrentLostPost} modalStatus={editPostStatus} closeModal={closePostEditModal} post={editPostType == 'lost' ? currentLostPost : currentFoundPost} target={editPostTarget} userAccount={userAccount} editPostType={editPostType} updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger} />
          <BasePostEdit type='inactive' pageFoundPost={pageFoundInactivePost} pageLostPost={pageLostInactivePost} setPageFoundPost={setPageFoundInactivePost} setPageLostPost={setPageLostInactivePost} renderFoundPost={renderInactiveFoundPost} renderLostPost={renderInactiveLostPost} setDeleteDataInState={setDeleteInactiveDataInState} setEditDataInState={setEditInactiveDataInState} setCurrentFoundPost={setCurrentFoundInactivePost} setCurrentLostPost={setCurrentLostInactivePost} modalStatus={editInactivePostStatus} closeModal={closeInactivePostEditModal} post={editInactivePostType == 'lost' ? currentLostInactivePost : currentFoundInactivePost} target={editInactivePostTarget} userAccount={userAccount} editPostType={editInactivePostType} setActiveFoundPost={setPostFoundData} setActiveLostPost={setPostLostData} activeLostPost={postLostData} activeFoundPost={postFoundData} updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger} />
          <div className='hidden'>{updateTrigger}</div>
        </ThemeProvider>
      </main>
      <footer className="sm:mt-32">
        <Footer />
      </footer>
    </div >
  );
}
