import { Carousel, Col, Row } from 'antd'
import React from 'react'

const Banner = () => {
    
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
        <Row style={{color:'red'}} gutter={10}>
            <Col span={16}>
                <Carousel arrows infinite={true} autoplay> 
                    <div>
                        <h3 style={contentStyle}>1</h3>
                    </div>
                    <div>
                         <h3 style={contentStyle}>2</h3>
                    </div>
                     <div>
                        <h3 style={contentStyle}>3</h3>
                    </div>
                 </Carousel>
            </Col>
            <Col span={8}>
                <div>
                    <div style={{marginBottom:10}}>
                        <h3 style={contentStyleBanner}>1</h3>
                    </div>
                    <div>
                        <h3 style={contentStyleBanner}>2</h3>
                    </div>
                </div>
            </Col> 
        </Row>
       
    )
}

export default Banner