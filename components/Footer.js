import React from 'react';
import cn from 'classnames';

export default function Footer(prop) {
  return (
    <section
      className={cn({
        'footer-orange lg:flex md:flex lg:flex-col md:flex-col lg:justify-center md:justify-center lg:items-center md:items-center bg-historyBlue': prop.color == 'blue',
        'footer-orange lg:flex md:flex lg:flex-col md:flex-col lg:justify-center md:justify-center lg:items-center md:items-center bg-mainBgGreen': prop.color != 'blue',
      })}
      style={{ width: "100%", height: "259px" }}
    >
      <div className="lg:flex md:flex lg:flex-wrap md:flex-wrap lg:gap-52 md:gap-24">
        <div className="text-white">
          <p className="lg:text-2xl md:text-2xl">ติดต่อเรา</p>
          <p className="lg:mt-1 md:mt-1">+66 6071 2203</p>
          <p>catus_helpyou@sit.kmutt.ac.th</p>
          <p className="lg:text-5xl md:text-5xl lg:mt-2 md:mt-2 lg:font-black md:font-black">Catus</p>
          <p className="text-gray-300">© Copyright 2021 CatUs</p>
        </div>
        <div className="text-white">
          <p className="lg:text-2xl md:text-2xl">สถานที่ทำการ</p>
          <p className="lg:mt-1 md:mt-1 lg:-mb-1 md:-mb-1">
            Space Dragon 168 ซอยประชาอุทิศ 40 ถนนประชาอุทิศ แขวงบางมด
            เขตทุ่งครุ กรุงเทพมหานคร 10140
          </p>
          <p className="lg:mt-20 md:mt-20 text-gray-300">
            School of Information Technology, King Mongkut&apos;s University
            of Technology Thonburi
          </p>
        </div>
      </div>
    </section>
  )
};