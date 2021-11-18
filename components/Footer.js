import React from 'react';
import cn from 'classnames';

export default function Footer(prop) {
  return (
    <section
      className={cn({
        'footer-orange flex flex-col justify-center items-center bg-historyBlue': prop.color == 'blue',
        'footer-orange flex flex-col justify-center items-center bg-mainBgGreen': prop.color != 'blue',
      })}
      style={{ width: "100%", height: 'auto' }}
    >
      <div className="flex flex-wrap lg:gap-52 sm:gap-5 mt-10 ml-5">
        <div className="text-white">
          <p className="lg:text-2xl text-xl">ติดต่อเรา</p>
          <p className="mt-1">+66 6071 2203</p>
          <p>catus_helpyou@sit.kmutt.ac.th</p>
          <p className="lg:text-5xl text-4xl mt-2 font-black">Catus</p>
          <p className="text-gray-300 mb-10">© Copyright 2021 CatUs</p>
        </div>
        <div className="text-white">
          <p className="lg:text-2xl text-xl">สถานที่ทำการ</p>
          <p className="mt-1 -mb-1">
            Space Dragon 168 ซอยประชาอุทิศ 40 ถนนประชาอุทิศ แขวงบางมด
            เขตทุ่งครุ กรุงเทพมหานคร 10140
          </p>
          <p className="mt-5 lg:mt-20 text-gray-300 mb-10 md:mt-16">
            School of Information Technology, King Mongkut&apos;s University
            of Technology Thonburi
          </p>
        </div>
      </div>
    </section>
  )
};