import React from 'react';
import cn from 'classnames';

export default function Footer(prop) {
  return (
    <section
      className={cn({
        'footer-orange flex md:flex flex-col md:flex-col justify-center md:justify-center items-center md:items-center bg-historyBlue': prop.color == 'blue',
        'footer-orange flex md:flex flex-col md:flex-col justify-center md:justify-center items-center md:items-center bg-mainBgGreen': prop.color != 'blue',
      }) + ' md:h-64'}
      style={{ width: "100%" }}
    >
      <div className="flex md:flex flex-wrap md:flex-wrap md:gap-24">
        <div className="text-white">
          <p className="text-2xl md:text-2xl">ติดต่อเรา</p>
          <p className="mt-1 md:mt-1">+66 6071 2203</p>
          <p>catus_helpyou@sit.kmutt.ac.th</p>
          <p className="text-5xl md:text-5xl mt-4 md:mt-6 font-black md:font-black">Catus</p>
          <p className="text-gray-300">© Copyright 2021 CatUs</p>
        </div>
        <div className="text-white">
          <p className="text-2xl md:text-2xl">สถานที่ทำการ</p>
          <p className="mt-1 md:mt-1 -mb-1 md:-mb-1">
            Space Dragon 168 ซอยประชาอุทิศ 40 ถนนประชาอุทิศ แขวงบางมด
            เขตทุ่งครุ กรุงเทพมหานคร 10140
          </p>
          <p className="mt-4 md:mt-20 text-gray-300">
            School of Information Technology, King Mongkut&apos;s University
            of Technology Thonburi
          </p>
        </div>
      </div>
    </section>
  )
};