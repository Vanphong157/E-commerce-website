'use client';
import React from 'react';
import { Rate, Divider } from 'antd';
import ProductFlashSale from './ProductFlashSale';
import formatCurrency from '@/app/utils/formatCurrency';


const ProductInfo = ({ price,retailPrice,rating}) => {

  const discount = {
    discountType: 'percentage',
    value: 20,
    endDate: '2025-02-28T23:59:59.999Z',
    maxUsage: 100,
    appliedCount: 50,
    description: 'Giảm 20% cho đơn hàng đầu tiên của bạn!',
  };

  return (
    <>
        <div >
            <Rate style ={{fontSize:"16px"}} disabled defaultValue={rating}></Rate>
              </div>
              <div>
                <span style={{display:"block"}}>
                  Giá tại: <b>TP. Hồ Chí Minh</b>
                </span>
              </div>
              <Divider/>
              <ProductFlashSale 
                discount={discount}
              />
              
              <Divider/>

              <div className="price" style={{display:'flex', flexWrap:"wrap"}}>
                  <div className="l"  style={{flex:'1'}} >
                    <div className="info-online-price">
                      <div className="promotion-price" style={{display:'flex'}}>
                        <span style={{color:'white', fontSize: "14px", padding: "3px 6px", lineHeight: "16px", backgroundColor: "#ee1e25", borderRadius:'8px', margin:" 0 5px 0 0", textAlign:'center'}}> 
                           - {10} %
                        </span>
                        <div style={{    fontSize: "24px",lineHeight: "18px",color: "#a6a6a6", margin:'3px'}}>
                          <span style={{textDecoration:"line-through"}}>
                            {formatCurrency(retailPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{paddingRight: "4px",position: "relative",marginBottom: "3px", marginTop:"12px"}}>
                     <span style={{background:"#fff", color:"#ed3324", border:"1px solid #ed3324", borderRadius:'4px', padding:"4px"}}>
                      Trả góp 0%
                     </span>
                    </div>
                  </div>
                  
                  <div className="r" style={{flex:'1'}}> 
                    <div style={{fontSize:'15px', lineHeight:'120%', color:"#3f3f3f", fontWeight:700, margin:"6px 0"}}>
                      <p style={{marginBottom:'3px', fontSize:"16px"}}>
                        Giá sốc online 
                    
                      </p>
                      <p style={{ fontSize: "32px",lineHeight: "120%",color: "red",fontWeight: 700}}>
                        {formatCurrency(price)}
                      </p>
                    </div>
                  </div>
              </div>
    </>
  );
};

export default ProductInfo;
