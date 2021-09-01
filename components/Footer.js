import React from 'react';

export default function Footer(prop){
    return (
    <section
          className="footer-orange 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center 2xl:bg-mainBgGreen"
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
    )
};