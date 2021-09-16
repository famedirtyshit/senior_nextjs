import Head from "next/head";
import BaseButton from "@components/BaseButton";
import IMAGES from "@constants/IMAGES";
import Image from "next/dist/client/image";
import HomeStyle from "@styles/Home.module.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@components/Footer";
import initFirebase from "@utils/initFirebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import accountUtil from "@utils/accountUtil";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

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

export default function Home() {

  const [userAccount, setUserAccount] = useState(null);
  const [accountMenu, setAccountMenu] = useState(null);

  useEffect(() => {
    let res = initFirebase();
    if (res != false) {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          let account = await accountUtil.getUser(user.uid);
          if (account.data.result === true) {
            setUserAccount(account.data.searchResult[0]);
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
        }
      });
    } else {
      console.log('init firebase error')
    }
  }, [])

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
    <div className={" mx-auto " + HomeStyle.bgImg}>
      <Head>
        <title>CatUs</title>
        <meta name="description" content="CatUs Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="2xl:flex 2xl:flex-wrap 2xl:justify-between 2xl:mx-64 pt-3">
        <h1 className="2xl:text-7xl cursor-pointer font-black">Catus</h1>
        {
          userAccount == null
            ?
            <div className="account-action">
              <Link href={{ pathname: "/authen", query: { type: 'signin' } }}>
                <a>
                  <BaseButton value={"Login"}></BaseButton>
                </a>
              </Link>
              <Link href={{ pathname: "/authen", query: { type: 'signup' } }}>
                <a>
                  <BaseButton
                    style={"color: white"}
                    fill={true}
                    fillColor={"mainGreen"}
                    textColor={"white"}
                    round={true}
                    roundSize={"lg"}
                    value={"Sign Up"}
                    customClass={"2xl:ml-4"}
                  ></BaseButton>
                </a>
              </Link>
            </div>
            :
            <div className="account-action">
              <div onClick={handleOpenAccountMenu} className='flex flex-wrap cursor-pointer'>
                <p className="text-lg text-white">
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
                <MenuItem onClick={() => { window.location.href = '/account' }}>My Account</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </div>
        }
      </header>
      <main className="2xl:mt-64 2xl:relative">
        <section className="about 2xl:ml-64 2xl:w-4/12">
          {/* <h1 className="2xl:text-7xl font-black">
            About <span className="text-mainOrange">CatUs</span>
          </h1> */}
          <svg width="455" height="56" viewBox="0 0 455 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.24 3.672H36.368L56.528 54H39.032L35.792 45.216H20.816L17.576 54H0.08L20.24 3.672ZM32.048 32.688L28.304 21.096L24.56 32.688H32.048ZM86.6566 55.08C84.5926 55.08 82.5766 54.72 80.6086 54C78.6886 53.28 77.0806 52.32 75.7846 51.12V54H60.1606V0.791998H76.3606V21.6C77.5126 20.64 79.0006 19.872 80.8246 19.296C82.6966 18.672 84.6406 18.36 86.6566 18.36C90.3526 18.36 93.5926 19.128 96.3766 20.664C99.1606 22.2 101.297 24.36 102.785 27.144C104.321 29.928 105.089 33.12 105.089 36.72C105.089 40.368 104.321 43.584 102.785 46.368C101.297 49.152 99.1606 51.312 96.3766 52.848C93.6406 54.336 90.4006 55.08 86.6566 55.08ZM82.1926 42.552C84.1126 42.552 85.6006 42.072 86.6566 41.112C87.7606 40.152 88.3126 38.712 88.3126 36.792C88.3126 34.872 87.7606 33.408 86.6566 32.4C85.6006 31.392 84.1126 30.888 82.1926 30.888C80.9446 30.888 79.7926 31.176 78.7366 31.752C77.6806 32.328 76.8886 33.12 76.3606 34.128V39.312C76.8886 40.32 77.6806 41.112 78.7366 41.688C79.7926 42.264 80.9446 42.552 82.1926 42.552ZM127.8 55.08C123.288 55.08 119.328 54.288 115.92 52.704C112.56 51.12 109.968 48.936 108.144 46.152C106.32 43.368 105.408 40.224 105.408 36.72C105.408 33.216 106.32 30.072 108.144 27.288C109.968 24.504 112.56 22.32 115.92 20.736C119.328 19.152 123.288 18.36 127.8 18.36C132.312 18.36 136.248 19.152 139.608 20.736C143.016 22.32 145.632 24.504 147.456 27.288C149.28 30.072 150.192 33.216 150.192 36.72C150.192 40.224 149.28 43.368 147.456 46.152C145.632 48.936 143.016 51.12 139.608 52.704C136.248 54.288 132.312 55.08 127.8 55.08ZM127.8 42.552C129.576 42.552 130.992 42.024 132.048 40.968C133.104 39.912 133.632 38.496 133.632 36.72C133.632 34.944 133.104 33.528 132.048 32.472C130.992 31.416 129.576 30.888 127.8 30.888C126.024 30.888 124.608 31.416 123.552 32.472C122.496 33.528 121.968 34.944 121.968 36.72C121.968 38.496 122.496 39.912 123.552 40.968C124.608 42.024 126.024 42.552 127.8 42.552ZM168.001 55.08C163.153 55.08 159.505 53.712 157.057 50.976C154.657 48.24 153.457 44.616 153.457 40.104V19.44H169.657V38.088C169.657 41.064 170.929 42.552 173.473 42.552C175.777 42.552 177.457 41.472 178.513 39.312V19.44H194.713V54H179.089V51.12C177.649 52.368 175.969 53.328 174.049 54C172.129 54.72 170.113 55.08 168.001 55.08ZM215.787 55.08C211.083 55.08 207.531 53.76 205.131 51.12C202.731 48.48 201.531 44.952 201.531 40.536V30.096H196.851V19.44H201.531V9.072H217.731V19.44H225.219V30.096H217.731V38.16C217.731 39.744 218.019 40.872 218.595 41.544C219.171 42.216 220.155 42.552 221.547 42.552C223.323 42.552 225.027 42.048 226.659 41.04V52.992C225.171 53.712 223.611 54.24 221.979 54.576C220.347 54.912 218.283 55.08 215.787 55.08Z" fill="black" />
            <path d="M276.85 55.08C271.186 55.08 266.242 54.048 262.018 51.984C257.842 49.872 254.626 46.848 252.37 42.912C250.114 38.928 248.986 34.248 248.986 28.872C248.986 23.448 250.114 18.768 252.37 14.832C254.626 10.896 257.842 7.872 262.018 5.76C266.242 3.648 271.186 2.592 276.85 2.592C280.546 2.592 283.81 2.904 286.642 3.528C289.474 4.152 292.09 5.16 294.49 6.552V22.68C292.426 21.144 290.074 20.04 287.434 19.368C284.842 18.696 281.818 18.36 278.362 18.36C274.618 18.36 271.666 19.272 269.506 21.096C267.394 22.872 266.338 25.464 266.338 28.872C266.338 32.28 267.418 34.896 269.578 36.72C271.738 38.496 274.666 39.384 278.362 39.384C281.722 39.384 284.746 39.024 287.434 38.304C290.122 37.536 292.666 36.384 295.066 34.848V50.904C290.218 53.688 284.146 55.08 276.85 55.08ZM310.998 55.08C306.486 55.08 302.886 54.096 300.198 52.128C297.51 50.112 296.166 47.184 296.166 43.344C296.166 39.456 297.462 36.504 300.054 34.488C302.694 32.472 306.582 31.464 311.718 31.464C313.254 31.464 314.934 31.656 316.758 32.04C318.582 32.376 320.094 32.784 321.294 33.264V32.688C321.294 31.44 320.502 30.456 318.918 29.736C317.334 29.016 315.246 28.656 312.654 28.656C308.478 28.656 304.662 29.52 301.206 31.248V20.952C302.79 20.184 304.878 19.56 307.47 19.08C310.062 18.6 312.918 18.36 316.038 18.36C322.95 18.36 328.254 19.632 331.95 22.176C335.646 24.72 337.494 28.32 337.494 32.976V54H322.23V51.48C321.126 52.488 319.542 53.328 317.478 54C315.462 54.72 313.302 55.08 310.998 55.08ZM316.182 46.152C317.19 46.152 318.15 45.96 319.062 45.576C320.022 45.192 320.766 44.712 321.294 44.136V41.832C319.71 40.92 318.006 40.464 316.182 40.464C315.174 40.464 314.382 40.728 313.806 41.256C313.23 41.784 312.942 42.48 312.942 43.344C312.942 44.16 313.206 44.832 313.734 45.36C314.31 45.888 315.126 46.152 316.182 46.152ZM356.412 55.08C351.708 55.08 348.156 53.76 345.756 51.12C343.356 48.48 342.156 44.952 342.156 40.536V30.096H337.476V19.44H342.156V9.072H358.356V19.44H365.844V30.096H358.356V38.16C358.356 39.744 358.644 40.872 359.22 41.544C359.796 42.216 360.78 42.552 362.172 42.552C363.948 42.552 365.652 42.048 367.284 41.04V52.992C365.796 53.712 364.236 54.24 362.604 54.576C360.972 54.912 358.908 55.08 356.412 55.08ZM393.369 55.08C387.945 55.08 383.409 54.048 379.761 51.984C376.113 49.92 373.425 47.112 371.697 43.56C369.969 40.008 369.105 35.928 369.105 31.32V3.672H386.169V30.816C386.169 33.648 386.745 35.784 387.897 37.224C389.049 38.664 390.873 39.384 393.369 39.384C395.865 39.384 397.665 38.664 398.769 37.224C399.921 35.784 400.497 33.648 400.497 30.816V3.672H417.633V31.32C417.633 35.928 416.769 40.008 415.041 43.56C413.313 47.112 410.625 49.92 406.977 51.984C403.329 54.048 398.793 55.08 393.369 55.08ZM436.081 55.08C433.057 55.08 429.913 54.816 426.649 54.288C423.433 53.76 420.865 52.992 418.945 51.984V41.04C420.961 42.192 423.433 43.176 426.361 43.992C429.289 44.808 431.905 45.216 434.209 45.216C435.313 45.216 436.105 45.168 436.585 45.072C437.065 44.976 437.305 44.76 437.305 44.424C437.305 44.184 437.089 43.992 436.657 43.848C436.225 43.704 435.649 43.56 434.929 43.416C433.201 43.08 431.665 42.72 430.321 42.336C425.953 40.992 422.857 39.456 421.033 37.728C419.257 35.952 418.369 33.456 418.369 30.24C418.369 26.208 419.953 23.232 423.121 21.312C426.289 19.344 430.657 18.36 436.225 18.36C438.817 18.36 441.673 18.648 444.793 19.224C447.961 19.8 450.289 20.544 451.777 21.456V32.4C450.337 31.392 448.297 30.528 445.657 29.808C443.017 29.04 440.665 28.656 438.601 28.656C437.641 28.656 436.849 28.728 436.225 28.872C435.601 29.016 435.289 29.208 435.289 29.448C435.289 29.688 435.553 29.904 436.081 30.096C436.609 30.288 437.449 30.48 438.601 30.672C440.857 31.104 442.129 31.368 442.417 31.464C445.585 32.28 448.009 33.24 449.689 34.344C451.417 35.4 452.593 36.648 453.217 38.088C453.889 39.528 454.225 41.352 454.225 43.56C454.225 47.064 452.665 49.872 449.545 51.984C446.425 54.048 441.937 55.08 436.081 55.08Z" fill="#F0930D" />
          </svg>

          <p className="mt-6 text-textGray font-normal text-lg">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Catus เป็นเว็บไซต์สำหรับประกาศตามหาแมวหรือประกาศตามหา
            เจ้าของแมว เพื่อช่วยให้แมวหลงสามารถกลับคืนสู่เจ้าทาสของตัวเองได้
          </p>
          <div className="2xl:flex 2xl:flex-wrap 2xl:gap-5 mt-8">
            <BaseButton
              style={"color: white"}
              fill={true}
              fillColor={"mainBgGreen"}
              textColor={"white"}
              round={true}
              roundSize={"lg"}
              value={"Get Started"}
              customClass={"2xl:mt-4"}
              onClickFunction={() => { let top = document.getElementById('statement').offsetTop; window.scrollTo(0, top); }}
            ></BaseButton>
            <Link href="/feed">
              <a>
                <BaseButton
                  style={"color: white"}
                  fill={true}
                  fillColor={"#FFFCF3"}
                  textColor={"mainOrange"}
                  round={true}
                  roundSize={"lg"}
                  value={"Looking for your cat"}
                  customClass={"2xl:mt-4 2xl:border-2 2xl:border-yellow-400"}
                ></BaseButton>
              </a>
            </Link>
          </div>
        </section>
        <section className="cat-img 2xl:absolute 2xl:-top-10 2xl:right-28">
          <Image
            src={IMAGES.catModalHomePage}
            alt="cat"
            width="878"
            height="346"
          />
        </section>
        <section className="down-botton 2xl:flex 2xl:flex-wrap 2xl:justify-end 2xl:mt-40">
          <div className="2xl:mr-28">
            <Image
              src={IMAGES.scrollDown}
              alt="scrollDown"
              width="31"
              height="154"
            />
          </div>
        </section>
        <section
          className="about-catUs-conatainer 2xl:w-3/5 2xl:mt-24 mx-auto"
          title="section1"
          id="section1"
        >
          <h1 id='statement' style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }} className="2xl:text-5xl 2xl:font-black 2xl:text-white 2xl:text-center">
            Statement of the problems
          </h1>
          <div className="text 2xl:mt-10">
            <p style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.3)' }} className="text-white 2xl:text-2xl">
              <span className="2xl:mr-10" />
              จุดเริ่มต้นมากจากคณะผู้จัดทำโครงงานได้สนใจที่จะทำแพลตฟอร์มเว็บไซต์ที่จะเป็นศูนย์กลาง
              ในการตามหาหรือพบเจอแมวหาย
              เพื่อช่วยเหลือและช่วยอำนวยความสะดวกให้กับกลุ่มผู้ที่ต้องการตามหา
              แมวหาย มากยิ่งขึ้น เพราะ
              ในปัจจุบันยังไม่มีแพลตฟอร์มที่ช่วยในการตามหาแมวหาย{" "}
            </p>
            <p style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.3)' }} className="2xl:text-white 2xl:text-2xl">
              <span className="2xl:mr-10" />
              ดังนั้นผู้ใช้งานส่วนใหญ่มักจะตามหาแมวหายโดยการประกาศหรือโพสตามหา
              ตามแพลตฟอร์มโซเชียลมีเดีย ชื่อดังต่างๆ
              ซึ่งปัญหาที่พบคือเป็นการประกาศตามหาแบบไม่มีการแยกประเภทและข้อมูลของการโพสที่ชัดเจน
              เช่น โพสเจอแมว,โพสหาแมวที่หายไป
              หรือบอกรายละเอียดของแมวที่หายไม่ครบ กำหนดพื้นที่ไม่ชัดเจน
              และบางกรณีมีการโพสซ้ำ จนเกิดความสับสน
              ทำให้ไม่สามารถค้นหาครอบคลุมโพสทั้งหมดได้ และ
              ขั้นตอนการตามหายังมีความยุ่งยากเนื่องจาก
              ไม่ใช่แพลตฟอร์มที่ออกแบบมาให้ใช้งานตามหาแมวโดยเฉพาะ
            </p>
          </div>
        </section>
        <section className="why-catUs-container 2xl:mt-60 2xl:mr-60 2xl:ml-52">
          <p
            className="2xl:text-black 2xl:text-4xl 2xl:font-black 2xl:text-center 2xl:mt-32" /**style={{textShadow:"-2px 4px #6B7280"}}**/
            style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
          >
            ทำไมต้องใช้ CatUs
          </p>
          <section className="2xl:flex 2xl:flex-wrap 2xl:justify-center 2xl:mt-32 ">
            <div
              className="2xl:shadow-2xl 2xl:rounded-3xl"
              style={{
                backgroundColor: "#FFFFFF",
                width: "673px",
                height: "534px",
              }}
            ></div>
            <div className="2xl:ml-16 2xl:mt-9" style={{ width: "559px" }}>
              <p style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }} className="2xl:text-black 2xl:text-4xl 2xl:font-black 2xl:text-center">
                เพราะช่วยเพิ่มโอกาสสำเร็จในการตามหาแมวหายให้กับผู้ใช้งาน
              </p>
              <p style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }} className="2xl:text-black 2xl:text-2xl 2xl:font-medium 2xl:mt-6">
                จากการที่ระบบมีการฟิลเตอร์ข้อมูลสถานที่ในการค้นหาและสามารถแยกประเภทข้อมูลสำหรับการ
                ค้นหาได้ ทำให้ผู้ใช้สามารถตามหาแมวที่หายไปได้ ง่ายและสะดวกยิ่งขึ้น
              </p>
            </div>
          </section>
          <section className="2xl:flex 2xl:flex-wrap 2xl:mt-48 2xl:justify-center">
            <div className="2xl:mr-16 2xl:mt-9" style={{ width: "559px" }}>
              <p
                className="2xl:text-white 2xl:text-4xl 2xl:font-black 2xl:text-center"
                style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
              >
                เพื่อลดจำนวนแมวจรจัดและ <br />
                ปัญหาที่เกิดจากแมวจรจัด
              </p>
              <p
                className="2xl:text-white 2xl:text-2xl 2xl:font-medium 2xl:mt-6"
                style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
              >
                ปัจจุบันมีอัตราการสูญหายของแมวเป็นจำนวน
                มากทำให้เมื่อมีจำนวนแมวหายมากขึ้นยิ่งทำให้
                อาจเกิดปัญหาแมวจรจัดตามมาซึ่งอาจทำให้เกิดผลกระทบอื่น ๆ
                ตามมาด้วยเช่นกัน ดังนั้นการใช้งาน CatUs ซึ่งเป็นแพลตฟอร์ม
                ที่เกิดขึ่นมาเพื่อตามหาแมว หรือ ช่วยแมวกลับคืนสู่เจ้าของโดยเฉพาะ
                จะสามารถช่วยเพิ่มอัตราการกลับคืนสู่เจ้าของ
                ของแมวทำให้ลดปัญหาแมวจรจัดและ ปัญหาที่เกิดจากแมวจรจัดได้{" "}
              </p>
            </div>
            <div
              className="2xl:shadow-2xl 2xl:rounded-3xl"
              style={{
                backgroundColor: "#FFFFFF",
                width: "673px",
                height: "534px",
              }}
            ></div>
          </section>
        </section>
        <section className="howToUse 2xl:mt-96">
          <p className="2xl:text-5xl 2xl:font-black 2xl:text-center">
            CatUs ใช้งานง่ายแค่ 4 ขั้นตอน
          </p>
          <p className="text-left mx-auto mt-8 text-2xl font-medium w-4/6">
            &nbsp;&nbsp;&nbsp;หากผู้ใช้งานต้องการดูข้อมูลของแมวที่หายไปหรือแมวที่ถูกพบเจอสามารถเริ่มต้นใช้งานได้เลย แต่หากผู้ใช้ต้องการ โพสต์ข้อมูลของตนเองจำเป็นต้องทำการล็อคอินเข้าระบบก่อน เพื่อที่จะสามารถเข้าถึงฟังก์ชั่นต่างๆของ CatUs ได้
          </p>
          <div className="2xl:grid 2xl:grid-cols-2 gap-7 2xl:mt-36 ">
            <div className=" 2xl:mt-24 2xl:relative">
              <div className="2xl:absolute 2xl:left-96 2xl:top-20">
                <Image
                  src={IMAGES.step1desc}
                  alt="step1desc"
                  width="110"
                  height="253"
                />
              </div>
              <div className="2xl:absolute 2xl:ml-48 2xl:top-72 2xl:w-3/5">
                <p className="2xl:text-4xl 2xl:font-bold text-center ">
                  Search Post
                </p>
                <p className="2xl:text-2xl 2xl:mt-6 2xl:text-left ">
                  ผู้ใช้สามารถกรอกข้อมูลสถานที่ที่คุณพบน้องแมว หรือสถานที่ที่น้องหายไปได้ผ่าน Google map และยังสามารถเพิ่มขอบเขตการค้นหา ได้อีกด้วย
                </p>
              </div>
            </div>
            <div className="">
              <Image
                src={IMAGES.step1}
                alt="step1"
                width="990"
                height="858"
              />
            </div>
          </div>
          <div className="2xl:grid 2xl:grid-cols-2 gap-7 2xl:mt-52 ">
            <div className="">
              <Image
                src={IMAGES.step2}
                alt="step2"
                width="990"
                height="719"
              />
            </div>
            <div className=" 2xl:mt-24 2xl:relative">
              <div className="2xl:absolute 2xl:left-96 2xl:top-28">
                <Image
                  src={IMAGES.step2desc}
                  alt="IMAGES.step2desc"
                  width="140"
                  height="203"
                />
              </div>
              <div className="2xl:absolute 2xl:ml-48 2xl:top-72 2xl:w-3/5">
                <p className="2xl:text-4xl 2xl:font-bold text-center ">
                  Function Post
                </p>
                <p className="2xl:text-2xl 2xl:mt-6 2xl:text-left ">
                  ผู้ใช้สามารถโพสต์ประกาศตามหาน้องแมวหรือโพสต์ตามหา
                  เจ้าของน้องแมว โดยอย่าลืมระบุข้อมูลที่จำเป็น ต่อการค้นหา เท่าที่จะพอระบุได้ด้วยนะ
                </p>
              </div>
            </div>
          </div>
          <div className="2xl:grid 2xl:grid-cols-2 gap-7 2xl:mt-52 ">
            <div className=" 2xl:mt-24 2xl:relative">
              <div className="2xl:absolute 2xl:left-96 2xl:top-28">
                <Image
                  src={IMAGES.step3desc}
                  alt="thrstep3desc"
                  width="140"
                  height="203"
                />
              </div>
              <div className="2xl:absolute 2xl:ml-48 2xl:top-72 2xl:w-3/5">
                <p className="2xl:text-4xl 2xl:font-bold text-center ">
                  Dashboard
                </p>
                <p className="2xl:text-2xl 2xl:mt-6 2xl:text-left ">
                  อีกทั้งทางเว็บไซต์ของเรายังมีระบบที่ช่วยผู้ใช้ ในการ ตามหาน้องแมวหายโดยมี ฟังก์ชั่นที่เรียกว่า Dash Board ซึ่งสามารถกลับมาดูได้ว่าหลังจากที่ เราโพสต์ตามหาน้องแมวหายไปแล้วนั้น มีโพสต์ ตามหาเจ้าของน้องแมวโพสต์ไหนบ้าง ที่ได้ถูกเพิ่ม เข้ามาในบริเวณใกล้เคียงกับโพสต์ของคุณ
                </p>
              </div>
            </div>
            <div className="">
              <Image
                src={IMAGES.step3}
                alt="step3"
                width="990"
                height="882"
              />
            </div>
          </div>
          <div className="2xl:grid 2xl:grid-cols-2 gap-7 2xl:mt-52 ">
            <div className="">
              <Image
                src={IMAGES.step4}
                alt="step4"
                width="990"
                height="874"
              />
            </div>
            <div className=" 2xl:mt-24 2xl:relative">
              <div className="2xl:absolute 2xl:left-96 2xl:top-24">
                <Image
                  src={IMAGES.step4desc}
                  alt="step4desc"
                  width="140"
                  height="203"
                />
              </div>
              <div className="2xl:absolute 2xl:ml-48 2xl:top-72 2xl:w-3/5">
                <p className="2xl:text-4xl 2xl:font-bold text-center ">
                  My Account
                </p>
                <p className="2xl:text-2xl 2xl:mt-6 2xl:text-left ">
                  ผู้ใช้สามารถแก้ไขโปรไฟล์หรืออัพเดตข้อมูล
                  ส่วนตัวได้ และยัง สามารถเรียกดูโพสต์ของ ตนเองได้เพื่อแก้ไขข้อมูล และ“หากเมื่อพบ น้องแมวแล้ว อย่าลืมกลับมาลบโพสต์ให้เรา ด้วยน้า”
                </p>
              </div>
            </div>
          </div>
          <div className="2xl:grid 2xl:grid-cols-2 gap-7 2xl:mt-52 ">
            <div className=" 2xl:mt-24 2xl:relative">
              <div className="2xl:absolute 2xl:left-96 2xl:top-28">
                <Image
                  src={IMAGES.step5desc}
                  alt="thrstep5desc"
                  width="140"
                  height="203"
                />
              </div>
              <div className="2xl:absolute 2xl:ml-48 2xl:top-72 2xl:w-3/5">
                <p className="2xl:text-4xl 2xl:font-bold text-center ">
                  Finally, you succeeded
                </p>
                <p className="2xl:text-2xl 2xl:mt-6 2xl:text-left ">
                  เมื่อคุณเจอน้องแมวที่คุณตามหาแล้ว คุณสามารถ กดเข้าไปเพื่อดู ข้อมูลเพิ่มเติมและข้อมูลติดต่อของ เจ้าของโพสต์ได้เลย<br /><br />
                  <span className="font-base text-sm w-full inline-block text-right pr-8">
                    ยินดีด้วยน้า ในที่สุดคุณก็ได้เจอน้องอีกครั้งแล้ว
                  </span>
                </p>
              </div>
            </div>
            <div className="">
              <Image
                src={IMAGES.step5}
                alt="step5"
                width="990"
                height="790"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="2xl:mt-32">
        <section
          className="footer-orange 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:bg-mainYellow"
          style={{ width: "100%", height: "259px" }}
        >
          <p className="2xl:text-white 2xl:text-4xl 2xl:font-bold ">
            Ready to get started looking for your cat?
          </p>
          <Link href="/feed">
            <a>
              <BaseButton
                style={"color: white"}
                fill={true}
                fillColor={"mainOrange"}
                textColor={"white"}
                round={true}
                roundSize={"lg"}
                value={"Looking for your cat"}
                customClass={"2xl:ml-4 2xl:w-72 2xl:h-14 2xl:mt-12"}
              ></BaseButton>
            </a>
          </Link>
        </section>
        <Footer />
      </footer>
    </div>
  );
}
