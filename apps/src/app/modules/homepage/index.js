import { Carousel, Col, Row } from 'antd'
import React from 'react'
import Banner from './Banner';
import Category from './Category';

const HomepageComponent = () => {
    {/* Khúc này làm mấy cái banner quốc toàn nge */}
      
      {/*Khúc này làm thêm mấy cái chọn category */}
      
      {/*Khúc này mình làm sp nổi bật vs  hot sales   
    (dựa vào số lượt mua vs tiền discount cao nhất mỗi cái làm 8=12 product thôi) */}
    
    const contentStyle = {
        margin: 0,
        height: '260px',
        color: '#fff',
        lineHeight: '260px',
        textAlign: 'center',
        background: '#364d79',
        borderRadius:'10px'
      };

      const contentStyleBanner = {
        margin: 0,
        height: '125px',
        color: '#fff',
        lineHeight: '125px',
        textAlign: 'center',
        background: '#364d79',
        borderRadius:'10px',
      
      };

    return (
        <>
            <Banner/>
            <Category/>
        </>
    )
}

export default HomepageComponent