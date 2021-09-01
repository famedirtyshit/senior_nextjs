import Head from "next/head";
import BaseButton from "@components/BaseButton";
import IMAGES from "@constants/IMAGES";
import Image from "next/dist/client/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AccountStyle from "@styles/Account.module.css";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, Grid } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Footer from "@components/footer";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
    fontSize: "20",
  },
  carousel: {
    width: "326px",
    height: "350px",
  },
}));

export default function Account() {
  const [userName, setUserName] = useState("Gridpong Sirimungkrakul");
  const [userNumber, setUserNumber] = useState("096-071-2203");
  const [userContactFB, setUserContactFB] = useState("Gridpong Sirimungkrakul");
  const [userContactIG, setUserContactIG] = useState("tgridpong14");
  const [openListMyPost, setOpenListMyPost] = useState(false);
  const [openListSubMyPost1, setOpenListSubMyPost1] = useState(false);
  const [openListSubMyPost2, setOpenListSubMyPost2] = useState(false);
  const [openListMyLost, setOpenListMyLost] = useState(false);
  const [pageFoundPost, setPageFoundPost] = useState(1);
  const [pageLostPost, setPageLostPost] = useState(1);
  const [currentFoundPost, setCurrentFoundPost] = useState([]);
  const [currentLostPost, setCurrentLostPost] = useState([]);
  const [maxPageFoundPost, setMaxPageFoundPost] = useState(0);
  const [maxPageLostPost, setMaxPageLostPost] = useState(0);
  const [postFoundData, setPostFoundData] = useState([
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr1",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat1.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat3.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr2",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat3.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat1.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr3",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat1.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat3.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr4",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat3.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat1.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr5",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat1.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat3.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr6",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat3.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat1.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr7",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat1.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat3.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr8",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat3.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat1.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr9",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat1.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat3.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr10",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat3.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat1.jpg",
        },
      ],
      __v: 0,
    },
  ]);

  const [postLostData, setPostLostData] = useState([
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr1",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat1.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat3.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr2",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat3.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat1.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr3",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat1.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat3.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr4",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat3.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat1.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr5",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat1.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat3.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr6",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat3.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat1.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr7",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat1.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat3.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr8",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat3.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat1.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr9",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat1.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat3.jpg",
        },
      ],
      __v: 0,
    },
    {
      location: {
        type: "Point",
        coordinates: [100.4947931583359, 13.651317739545558],
      },
      postType: "lost",
      _id: "6127672bf18cc96f2a8e125e",
      date: "2021-08-12T10:00:00.000Z",
      sex: "false",
      collar: false,
      description: "arr10",
      urls: [
        {
          id: "6127672cf18cc96f2a8e125f",
          url: "/images/cat2.jpg",
        },
        {
          id: "6127672df18cc96f2a8e1260",
          url: "/images/cat3.jpg",
        },
        {
          id: "6127672ff18cc96f2a8e1261",
          url: "/images/cat1.jpg",
        },
      ],
      __v: 0,
    },
  ]);

  useEffect(() => {
    renderFoundPost();
    renderLostPost();
    console.log("pageLostPost" + pageLostPost);
    console.log("maxLostPage" + maxPageLostPost);
  }, [pageFoundPost, pageLostPost]);

  useEffect(() => {
    setMaxPageFoundPost(Math.ceil(postFoundData.length / 3));
    setMaxPageLostPost(Math.ceil(postLostData.length / 3));
    console.log(postLostData)
    console.log(currentLostPost)
  }, []);

  const classes = useStyles();

  const handleClickListMyPost = () => {
    setOpenListMyPost(!openListMyPost);
  };

  const handleClickListSubMyPost1 = () => {
    setOpenListSubMyPost1(!openListSubMyPost1);
  };

  const handleClickListSubMyPost2 = () => {
    setOpenListSubMyPost2(!openListSubMyPost2);
  };

  const handleClickListMyLost = () => {
    setOpenListMyLost(!openListMyLost);
  };

  // const nextPageLost = () =>{
  //   if (pageFoundPost >= maxPageFoundPost) {
  //           return;
  //         } else {
  //           setPageLostPost(++count);
  //         }
  // };

  // const backPageLost = () => {
  //   if (pageLostPost <= 1) {
  //           return;
  //         } else {
  //           setPageLostPost(--count);
  //         }
  // }

  const renderFoundPost = () => {
    let store = [];
    let initIndex = (pageFoundPost - 1) * 3;
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
  
  const renderLostPost = () => {
    let store = [];
    let initIndex = (pageLostPost - 1) * 3;
    for (let i = initIndex; i < initIndex + 3 && i < postLostData.length; i++) {
      store.push(postLostData[i]);
    }
    setCurrentLostPost(store);
    console.log(store);
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

  

  return (
    <div className={" mx-auto " + AccountStyle.bgImg}>
      <Head>
        <title>CatUs</title>
        <meta name="description" content="CatUs Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="2xl:flex 2xl:flex-wrap 2xl:justify-between 2xl:mx-64 pt-3">
        <Link href="/">
          <a>
            <h1 className="2xl:text-5xl 2xl:font-black text-white">Catus</h1>
          </a>
        </Link>
      </header>

      <main>
        <section
          className="w-9/12 bg-mainYellow mx-auto  rounded-2xl shadow-lg 2xl:mt-20"
          style={{ height: "776px" }}
        >
          <div className="2xl:mt-11 2xl:absolute 2xl:ml-12">
            <Link href="/">
              <a>
                <ArrowBackIosIcon
                  style={{ color: "white", width: "40px", height: "40px" }}
                />
              </a>
            </Link>
          </div>
          <div className="2xl:flex 2xl:flex-wrap 2xl:justify-center">
            <p className="2xl:text-4xl 2xl:font-bold 2xl:mt-11 ">My Account</p>
          </div>
          <div className="2xl:flex 2xl:flex-wrap 2xl:justify-center 2xl:py-16">
            <div className="">
              <Image
                src={IMAGES.user}
                alt="default-user"
                width="119"
                height="119"
              />
            </div>
            <div className="2xl:m-9">
              <p className="2xl:text-3xl 2xl:font-bold">{userName}</p>
            </div>
            <div className="2xl:mt-3">
              <BaseButton
                style={"color: white"}
                fill={true}
                fillColor={"mainGreen"}
                textColor={"white"}
                round={true}
                roundSize={"lg"}
                value={"Edit"}
                customClass={"2xl:mt-4 w-28 "}
              />
            </div>
          </div>
          <section className="contact-detail 2xl:flex 2xl:flex-wrap 2xl:justify-center ">
            <div className="2xl:bg-white 2xl:w-3/5 2xl:h-96 2xl:rounded-2xl 2xl:shadow-lg ">
              <div className="content-container 2xl:mx-8 2xl:my-8 2xl:text-xl ">
                <p className="" style={{ color: "#6E6E6E" }}>
                  แก้ไขข้อมูลผู้ติดต่อ
                </p>
                <p className="2xl:mt-2 " style={{ color: "#6E6E6E" }}>
                  Number
                </p>
                <p className="2xl:mt-2 2xl:ml-4 2xl:font-bold">{userNumber}</p>
                <p className="2xl:mt-2" style={{ color: "#6E6E6E" }}>
                  Contact
                </p>
                <p className="2xl:mt-2 2xl:ml-4 2xl:font-bold">
                  Facebook: {userContactFB}
                </p>
                <p className="2xl:mt-2 2xl:ml-4 2xl:font-bold">
                  Instagram: {userContactIG}
                </p>
                <p className="2xl:mt-2" style={{ color: "#6E6E6E" }}>
                  รหัสผ่านและการยืนยันตัวตน
                </p>
                <p className="2xl:mt-2 2xl:ml-4 2xl:font-bold">********</p>
              </div>
            </div>
          </section>
        </section>
        <section className="2xl:w-9/12 2xl:ml-60">
          <List>
            <ListItem button onClick={handleClickListMyPost}>
              <ListItemText
                primary="My Post"
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
                              color: "#828282",
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
                            // onClick={() => backPageFound()}
                          />
                        )}
                      </div>
                      <div className="2xl:mx-auto 2xl:mt-5">
                        <section className="2xl:flex 2xl:flex-wrap 2xl:gap-28 flex-start">
                          {currentFoundPost.map((item, i) => (
                            <section key={i}>
                              <Carousel navButtonsAlwaysVisible={true}>
                                {item.urls.map((items, i) => (
                                  <Image
                                    key={i}
                                    src={items.url}
                                    alt={"previewImg-" + i}
                                    width="326px"
                                    height="400px"
                                  />
                                ))}
                              </Carousel>
                              <ListItemText primary={"Date: " + item.date} />
                              <ListItemText primary={"Sex: " + item.sex} />
                              <ListItemText
                                primary={"Collar: " + item.collar}
                              />
                              <ListItemText
                                primary={"Description: " + item.description}
                              />
                            </section>
                          ))}
                        </section>
                      </div>
                      {pageFoundPost >= maxPageFoundPost ? (
                        <ArrowForwardIosIcon
                          style={{
                            color: "#828282",
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
                              color: "#828282",
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
                          />
                        )}
       
                      </div>
                      <div className="2xl:mx-auto 2xl:mt-5">
                        <section className="2xl:flex 2xl:flex-wrap 2xl:gap-28 flex-start">
                          {currentLostPost.map((item, i) => (
                            <section key={i}>
                              <Carousel navButtonsAlwaysVisible={true}>
                                {item.urls.map((items, i) => (
                                  <Image
                                    key={i}
                                    src={items.url}
                                    alt={"previewImg-" + i}
                                    width="326px"
                                    height="400px"
                                  />
                                ))}
                              </Carousel>
                              <ListItemText primary={"Date: " + item.date} />
                              <ListItemText primary={"Sex: " + item.sex} />
                              <ListItemText
                                primary={"Collar: " + item.collar}
                              />
                              <ListItemText
                                primary={"Description: " + item.description}
                              />
                            </section>
                          ))}
                        </section>
                      </div>
                      {pageLostPost >= maxPageLostPost ? (
                        <ArrowForwardIosIcon
                          style={{
                            color: "#828282",
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
                        />
                      )}
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </Collapse>
            <ListItem button onClick={handleClickListMyLost}>
              <ListItemText
                primary="My following post"
                style={{ color: "black", margin: "14px" }}
              />
              {openListMyLost ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          </List>
        </section>
      </main>
      <footer className="2xl:mt-32">
         <Footer />
      </footer>
    </div>
  );
}
