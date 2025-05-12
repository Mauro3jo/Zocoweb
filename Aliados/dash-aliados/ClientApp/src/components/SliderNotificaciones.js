import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import img1 from "../assets/img/zocoRewards1.png";
import img2 from "../assets/img/zocoRewards2.png";
import img3 from "../assets/img/zocoRewards3.png";
import img4 from "../assets/img/zocoRewards4.png";
import img5 from "../assets/img/zocoRewards5.png";
import img6 from "../assets/img/zocoRewards6.png";
import { Image } from "react-bootstrap";

export default function SliderNotificaciones({ onClose }) {
  return (
    <>
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={true}
        mousewheel={true}
        keyboard={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Image className="my-4 px-4" src={img1} fluid />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Image className="my-4 px-4" src={img2} fluid />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Image className="my-4 px-4" src={img3} fluid />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Image className="my-4 px-4" src={img4} fluid />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Image className="my-4 px-4" src={img5} fluid />
        </SwiperSlide>
        <SwiperSlide>
          <article className="my-4">
            <div>
              <Image className="px-4" src={img6} fluid />{" "}
              <article className="px-4">
                <button
                  className="btn-popUp lato-bold fs-18 my-2"
                  type="button"
                  onClick={onClose}
                >
                  Cerrar
                </button>
              </article>
            </div>
          </article>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
