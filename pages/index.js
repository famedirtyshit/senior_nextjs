import Head from "next/head";
import BaseButton from "@components/BaseButton";
import IMAGES from "@constants/IMAGES";
import Image from "next/dist/client/image";
import HomeStyle from "@styles/Home.module.css";
import React, { useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
// import { Link ,animateScroll as scroll } from "react-scroll";

export default function Home() {
  return (
    <div className={" mx-auto " + HomeStyle.bgImg}>
      <Head>
        <title>CatUs</title>
        <meta name="description" content="CatUs Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="2xl:flex 2xl:flex-wrap 2xl:justify-between 2xl:mx-64 pt-3">
        <h1 className="2xl:text-5xl 2xl:font-black">Catus</h1>
        <div className="account-action">
          <BaseButton value={"Login"}></BaseButton>
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
        </div>
      </header>
      <main className="2xl:mt-72 2xl:relative">
        <section className="about 2xl:ml-64 2xl:w-4/12">
          <h1 className="2xl:text-5xl 2xl:font-black">
            About <span className="text-mainOrange">CatUs</span>
          </h1>
          <p className="mt-2">
            Nulla ea enim irure Non dolore laborum cupidatat incididunt. Nostrud
            excepteur do aliqua proident mollit dolore consectetur anim
            consectetur elit eiusmod qui dolore dolore. Laboris fugiat ad irure
            dolor.
          </p>
          <div className="2xl:flex 2xl:flex-wrap 2xl:gap-5">
            <Link href="/feed">
              <a>
                <BaseButton
                  style={"color: white"}
                  fill={true}
                  fillColor={"mainBgGreen"}
                  textColor={"white"}
                  round={true}
                  roundSize={"lg"}
                  value={"Get Started"}
                  customClass={"2xl:mt-4"}
                ></BaseButton>
              </a>
            </Link>
            <Link href="/account">
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
          className="about-catUs-conatainer 2xl:w-3/4 2xl:mt-56 2xl:mt-40 2xl:mr-60 2xl:mx-auto"
          title="section1"
          id="section1"
        >
          <h1 className="2xl:text-5xl 2xl:font-black 2xl:text-white 2xl:text-center">
            Statement of the problems
          </h1>
          <div className="text 2xl:mt-10">
            <p className="text-white 2xl:text-2xl">
              <span className="2xl:mr-10" />
              จุดเริ่มต้นมากจากคณะผู้จัดทำโครงงานได้สนใจที่จะทำแพลตฟอร์มเว็บไซต์ที่จะเป็นศูนย์กลาง
              ในการตามหาหรือพบเจอแมวหาย
              เพื่อช่วยเหลือและช่วยอำนวยความสะดวกให้กับกลุ่มผู้ที่ต้องการตามหา
              แมวหาย มากยิ่งขึ้น เพราะ
              ในปัจจุบันยังไม่มีแพลตฟอร์มที่ช่วยในการตามหาแมวหาย{" "}
            </p>
            <p className="2xl:text-white 2xl:text-2xl">
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
        <section className="why-catUs-container 2xl:mt-96 2xl:mr-60 2xl:ml-52">
          <p
            className="2xl:text-black 2xl:text-4xl 2xl:font-black 2xl:text-center 2xl:mt-32" /**style={{textShadow:"-2px 4px #6B7280"}}**/
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
              <p className="2xl:text-black 2xl:text-4xl 2xl:font-black 2xl:text-center">
                เพราะช่วยเพิ่มโอกาสสำเร็จในการตามหาแมวหายให้กับผู้ใช้งาน
              </p>
              <p className="2xl:text-black 2xl:text-2xl 2xl:font-medium 2xl:mt-6">
                ผู้ใช้สามารถตามหาแมวที่หายไปได้ง่ายและสะดวกมากขึ้น
                จากการที่ระบบมีการฟิลเตอร์ข้อมูล สถานที่ในการค้นหา
                และข้อมูลที่แยกประเภท ได้สำหรับการค้นหา
              </p>
            </div>
          </section>
          <section className="2xl:flex 2xl:flex-wrap 2xl:mt-48 2xl:justify-center">
            <div className="2xl:mr-16 2xl:mt-9" style={{ width: "559px" }}>
              <p
                className="2xl:text-white 2xl:text-4xl 2xl:font-black 2xl:text-center"
                style={{ textShadow: "-2px 4px #6B7280" }}
              >
                เพื่อลดจำนวนแมวจรจัดและ <br />
                ปัญหาที่เกิดจากแมวจรจัด
              </p>
              <p
                className="2xl:text-white 2xl:text-2xl 2xl:font-medium 2xl:mt-6"
                style={{ textShadow: "-2px 4px #6B7280" }}
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
          <p className="2xl:text-5xl 2xl:font-extrabold 2xl:text-center">
            CatUs ใช้งานง่ายแค่ 4 ขั้นตอน
          </p>
          <div className="2xl:grid 2xl:grid-cols-2 gap-7 2xl:mt-52 ">
            <div className=" 2xl:mt-24 2xl:relative">
              <div className="2xl:absolute 2xl:left-96 2xl:top-20">
                <Image
                  src={IMAGES.onefor4step}
                  alt="onefor4step"
                  width="110"
                  height="253"
                />
              </div>
              <div className="2xl:absolute 2xl:ml-48 2xl:top-72 2xl:w-3/5">
                <p className="2xl:text-4xl 2xl:font-bold 2xl:ml-40 ">
                  Search Post
                </p>
                <p className="2xl:text-2xl 2xl:mt-6 2xl:text-left ">
                  คุณสามารถกรอกข้อมูลสถานที่ที่คุณพบน้องแมวหรือ
                  สถานที่ที่น้องหลุดไปได้เลยผ่าน Google map และ
                  สามารถเพิ่มขอบเขต การค้นหาได้มากสุด 5 กิโลเมตร
                </p>
              </div>
            </div>
            <div className="">
              <Image
                src={IMAGES.deviceRightfor4step}
                alt="deviceRightfor4step"
                width="1064"
                height="752"
              />
            </div>
          </div>
          <div className="2xl:grid 2xl:grid-cols-2 gap-7 2xl:mt-52 ">
            <div className="">
              <Image
                src={IMAGES.deviceLeftfor4step}
                alt="deviceLeftfor4step"
                width="1064"
                height="752"
              />
            </div>
            <div className=" 2xl:mt-24 2xl:relative">
              <div className="2xl:absolute 2xl:left-96 2xl:top-28">
                <Image
                  src={IMAGES.twofor4step}
                  alt="twofor4step"
                  width="140"
                  height="203"
                />
              </div>
              <div className="2xl:absolute 2xl:ml-48 2xl:top-72 2xl:w-3/5">
                <p className="2xl:text-4xl 2xl:font-bold 2xl:ml-40 ">
                  Function Post
                </p>
                <p className="2xl:text-2xl 2xl:mt-6 2xl:text-left ">
                  คุณสามารถโพสต์ประกาศตามหาแมวหรือโพสต์พบเจอแมวได้
                  โดยอย่าลืมระบุข้อมูลที่จำเป็น ต่อการค้นหาตามที่คุณทราบ ด้วยนะ
                </p>
              </div>
            </div>
          </div>
          <div className="2xl:grid 2xl:grid-cols-2 gap-7 2xl:mt-52 ">
            <div className=" 2xl:mt-24 2xl:relative">
              <div className="2xl:absolute 2xl:left-96 2xl:top-28">
                <Image
                  src={IMAGES.threefor4step}
                  alt="threefor4step"
                  width="140"
                  height="203"
                />
              </div>
              <div className="2xl:absolute 2xl:ml-48 2xl:top-72 2xl:w-3/5">
                <p className="2xl:text-4xl 2xl:font-bold 2xl:ml-40 ">
                  My Account
                </p>
                <p className="2xl:text-2xl 2xl:mt-6 2xl:text-left ">
                  คุณสามารถแก้ไขโปรไฟล์หรืออัพเดตข้อมูลส่วนตัวได้หากมีการเปลี่ยนแปลง
                  และยัง สามารถเรียกดูโพสต์ของตนเองได้เพื่อ แก้ไขข้อมูล และ
                  หากเมื่อพบน้องแมวแล้ว อย่าลืมกลับมาลบโพส ให้เราหน่อยน้าา
                </p>
              </div>
            </div>
            <div className="">
              <Image
                src={IMAGES.deviceRightfor4step}
                alt="deviceRightfor4step"
                width="1064"
                height="752"
              />
            </div>
          </div>
          <div className="2xl:grid 2xl:grid-cols-2 gap-7 2xl:mt-52 ">
            <div className="">
              <Image
                src={IMAGES.deviceLeftfor4step}
                alt="deviceLeftfor4step"
                width="1064"
                height="752"
              />
            </div>
            <div className=" 2xl:mt-24 2xl:relative">
              <div className="2xl:absolute 2xl:left-96 2xl:top-24">
                <Image
                  src={IMAGES.fourfor4step}
                  alt="fourfor4step"
                  width="140"
                  height="203"
                />
              </div>
              <div className="2xl:absolute 2xl:ml-48 2xl:top-72 2xl:w-3/5">
                <p className="2xl:text-4xl 2xl:font-bold 2xl:ml-20 ">
                  Finally, you succeeded
                </p>
                <p className="2xl:text-2xl 2xl:mt-6 2xl:text-left ">
                  ดีใจด้วยน้าาา....ในที่สุดคุณก็หาเจอ เมื่อคุณเจอน้อง
                  แมวที่คุณตามหาแล้วคุณสามารถกดเข้าไปเพื่อดู
                  ข้อมูลเพิ่มเติมและข้อมูลติดต่อผู้โพสต์ได้เลย
                </p>
              </div>
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
                customClass={"2xl:ml-4 2xl:w-64 2xl:h-14 2xl:mt-12"}
              ></BaseButton>
            </a>
          </Link>
        </section>
        <Footer />
      </footer>
    </div>
  );
}


