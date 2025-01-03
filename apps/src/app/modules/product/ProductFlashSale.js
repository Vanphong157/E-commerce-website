'use client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const styleCountDown = {
  width: '30px',
  height: '30px',
  borderRadius: '4px',
  backgroundColor: '#2e2e2e',
  margin: '0 5px',
  color: '#fff',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '30px',
};

const styleUnit = {
  fontSize: '10px',
  fontWeight: 400,
  display: 'block',
  margin: 0,
};

const StyleSpan = styled.span`
  &::before {
    content: '';
    width: 100%;
    height: 12px;
    border-radius: 8px;
    background-color: #d4d7d9;
    display: block;
  }
`;

const ProductFlashSale = ({discount }) => {
  const discountType = discount?.discountType === 'percentage' ? '%' : '₫';
  const discountValue = discount?.value;
  const endDate = discount?.endDate;
  const maxUsage = discount?.maxUsage;
  const appliedCount = discount?.appliedCount;
  const discountDescription = discount?.description;

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference > 0) {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { hours, minutes, seconds };
    }

    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <>
      {/* Flash Sale Header */}
      <div className="title-flash" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}></div>
        <div
          style={{
            height: '40px',
            background: '#fe0000',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: 'flex',
            color: '#fff',
          }}
        >
          <div style={{ margin: '0 10px 0 0', alignItems: 'center', display: 'flex' }}>
            <h4 style={{ marginLeft: '14px', fontSize: '16px', fontWeight: 500, lineHeight: '15px' }}>
              FLASH SALE
              <br />
              <small style={{ fontSize: '12px' }}>Số lượng có hạn</small>
            </h4>
          </div>

          <div style={{ margin: '0 10px 0 0', display: 'flex', alignItems: 'center' }}>
            <h4 style={{ marginRight: '10px' }}>Kết thúc sau</h4>
            <span className="hours" style={styleCountDown}>
              {String(timeLeft.hours).padStart(2, '0')}
              <span style={styleUnit}>Giờ</span>
            </span>
            <span className="minutes" style={styleCountDown}>
              {String(timeLeft.minutes).padStart(2, '0')}
              <span style={styleUnit}>Phút</span>
            </span>
            <span className="seconds" style={styleCountDown}>
              {String(timeLeft.seconds).padStart(2, '0')}
              <span style={styleUnit}>Giây</span>
            </span>
          </div>
        </div>
      </div>

      {/* Flash Sale Details */}
      <div className="ct-flash" style={{ background: '#fff3f3', padding: '12px 10px 12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StyleSpan style={{ position: 'relative', width: '250px', display: 'block' }}>
            <span
              style={{
                width: `${(appliedCount / maxUsage) * 100}%`,
                height: '12px',
                borderRadius: '8px',
                background: '#fe0000',
                position: 'absolute',
                left: 0,
                top: 0,
              }}
            ></span>
          </StyleSpan>
          <span style={{ fontSize: '14px', color: '#3f3f3f', display: 'block', marginLeft: '10px' }}>
            Đã dùng <span style={{ color: '#ee1e25' }}>{appliedCount}</span>/{maxUsage} mã
          </span>
        </div>

        {/* Discount Information */}
        {discountValue && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#3f3f3f' }}>
            <strong>Ưu đãi:</strong> {discountValue}
            {discountType}
            <br />
            <small>{discountDescription}</small>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductFlashSale;
