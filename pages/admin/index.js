import Head from "next/head";
import Footer from "@components/Footer";
import {
  Paper,
  Button,
  Grid,
  Accordion,

} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import utilStyles from "@styles/Util.module.css";
import IMAGES from "@constants/IMAGES";
import Image from "next/dist/client/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminStyle from "@styles/Admin.module.css";
import PropTypes from "prop-types";

// import Tab from '@material-ui/Core';
// import TabContext from '@material-ui/Core';
// import TabList from '@material-ui/Core';
// import TabPanel from '@material-ui/Core';

export default function Admin() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div
      style={{ fontFamily: "Prompt" }}
      className={" mx-auto " + AdminStyle.bgImg}
    >
      <Head>
        <title>CatUs</title>
        <meta name="description" content="CatUs Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="2xl:flex 2xl:flex-wrap 2xl:justify-between 2xl:mx-64 pt-3">
        <Link href="/">
          <a>
            <h1 className="2xl:text-5xl 2xl:font-black text-white">
              Catus<span className="2xl:text-base"> admin</span>
            </h1>
          </a>
        </Link>
      </header>
      <main>
        <section
          className="w-9/12 bg-white mx-auto  rounded-t-2xl shadow-lg 2xl:mt-20"
          style={{ height: "880px" }}
        >
          <div className="2xl:absolute 2xl:ml-12 2xl:mt-12">
            <p className="2xl:text-3xl 2xl:font-bold ">Dashboard</p>
          </div>
          {/* <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Item One" value="1" />
            <Tab label="Item Two" value="2" />
            <Tab label="Item Three" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </Box> */}
        </section>
      </main>
      <footer>
        <section
          className="footer-orange 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:bg-mainBlue"
          style={{ width: "100%", height: "259px" }}
        >
          <div className="2xl:flex 2xl:flex-wrap 2xl:gap-52">
            <div className="2xl:text-white">
              <p className="2xl:text-2xl">ติดต่อเรา</p>
              <p className="2xl:mt-1">+66 6071 2203</p>
              <p>catus_helpyou@sit.kmutt.ac.th</p>
              <p className="2xl:text-5xl 2xl:mt-2 2xl:font-black">Catus</p>
              <p className="2xl:text-gray-300">© Copyright 2021 CatUs</p>
            </div>
            <div className="2xl:text-white">
              <p className="2xl:text-2xl">สถานที่ทำการ</p>
              <p className="2xl:mt-1 2xl:-mb-1">
                Space Dragon 168 ซอยประชาอุทิศ 40 ถนนประชาอุทิศ แขวงบางมด
                เขตทุ่งครุ กรุงเทพมหานคร 10140
              </p>
              <p className="2xl:mt-20 2xl:text-gray-300">
                School of Information Technology, King Mongkut&apos;s University
                of Technology Thonburi
              </p>
            </div>
          </div>
        </section>
      </footer>
    </div>
  );
}
