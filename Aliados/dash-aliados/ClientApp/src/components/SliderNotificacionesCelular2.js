import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import { Image } from "react-bootstrap";
import img1 from "../assets/img/NotificacionesModales/Modal tasas Dic 2024 cel.png";
import img2 from "../assets/img/NotificacionesModales/Modal pagos diferidos Navidad 2024 _ celular.png";


export default function SliderNotificacionesCelular2({ onClose }) {
  return (
    <>
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        <SwiperSlide>
          <div className="d-none d-md-block">
            <Image className="my-4 px-4 w-100" src={img1} fluid />
          </div>
          <div className="d-md-none d-block">
            <Image className="px-4 w-100" src={img1} fluid />
          </div>
        </SwiperSlide>
        
        
        <SwiperSlide>
          <div className="d-none d-md-block">
            <Image className="my-4 px-4 w-100" src={img2} fluid />
          </div>
          <div className="d-md-none d-block">
            <Image className=" px-4 w-100" src={img2} fluid />
            <article className="px-4 mb-4">
              <button
                className="btn-popUp lato-bold fs-18 my-2"
                type="button"
                onClick={onClose}
              >
                Cerrar
              </button>
            </article>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
