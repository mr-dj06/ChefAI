import React from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Pagination } from "swiper/modules";

export default function LandingEffect() {
  let heroImgs = [
    {
      name: "one",
      url: "https://images.unsplash.com/photo-1727796132592-fa01e4ddef98?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "two",
      url: "https://images.unsplash.com/photo-1528712306091-ed0763094c98?q=80&w=740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "three",
      url: "https://images.unsplash.com/photo-1595959524165-0d395008e55b?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "four",
      url: "https://plus.unsplash.com/premium_photo-1695297516692-82b537c62733?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "five",
      url: "https://images.unsplash.com/photo-1650977399594-504c2aa27b3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return (
    <>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        // loop={true}
        rewind={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination]}
        className="mySwiper flex-1/2"
      >
        {heroImgs.map((heroImg) => (
          <SwiperSlide
            key={heroImg.name}
            style={{ backgroundImage: `url(${heroImg.url})` }}
            className="bg-cover bg-center "
            // className={`bg-[url('${heroImg.url}')] bg-cover`}
          >
            {/* <a href={heroImg.url}>{heroImg.name}</a> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
