"use client";
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Row } from 'antd';
import styled from 'styled-components';

// Styled Components

// Container for the entire image section
const ImageContainer = styled(Row)`
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
`;

// Styled Main Swiper
const MainSwiper = styled(Swiper)`
  width: 100%;
  height: 380px;

  @media (max-width: 768px) {
    height: 250px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

// Styled Thumbnail Swiper
const ThumbnailSwiper = styled(Swiper)`
  width: 100%;
  height: 80px;
  margin-top: 20px;

  .swiper-slide {
    width: 80px !important;
    height: 80px !important;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s, border 0.3s;

    &:hover,
    &.swiper-slide-thumb-active {
      opacity: 1;
      border: 2px solid #dc0021;
      border-radius: 4px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }
`;

const ProductImages = ({ listImgs }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <ImageContainer>
      {/* Main Swiper */}
      <MainSwiper
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        centeredSlides={true}
        className="mainSwiper"
      >
        {listImgs.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`Product Image ${index + 1}`} />
          </SwiperSlide>
        ))}
      </MainSwiper>

      {/* Thumbnail Swiper */}
      <ThumbnailSwiper
        onSwiper={setThumbsSwiper}
        slidesPerView={Math.min(listImgs.length, 5)} // Hiển thị tối đa 4 thumbnails
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumbnailSwiper"
        spaceBetween={10}
      >
        {listImgs.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`Thumbnail ${index + 1}`} />
          </SwiperSlide>
        ))}
      </ThumbnailSwiper>
    </ImageContainer>
  );
};

export default ProductImages;
