'use client';
import { Button, Col, Input, InputNumber, Row, message } from 'antd';
import React, { useState } from 'react';
import Shipping from './Shipping';
import { DeleteFilled } from '@ant-design/icons';

const CartComponent = () => {
  const [productArr, setProductArr] = useState([
    {
      price: 14490000,
      nameProduct: "Smart Tivi QLED Samsung 4K 65 inch QA65Q60DAKXXV",
      quantity: 3,
      productImg: "https://cdn.nguyenkimmall.com/images/thumbnails/250/250/product/947/10057613-smart-tivi-qled-4k-65-inch-qa65q60dakxxv-1.jpg",
    },
    {
      price: 14490000,
      nameProduct: "Smart Tivi QLED Samsung 4K 65 inch QA65Q60DAKXXV",
      quantity: 2,
      productImg: "https://cdn.nguyenkimmall.com/images/thumbnails/250/250/product/947/10057613-smart-tivi-qled-4k-65-inch-qa65q60dakxxv-1.jpg",
    },
  ]);

  const [discountCode, setDiscountCode] = useState('');
  const [discountValue, setDiscountValue] = useState(50000); // Giảm giá cố định (có thể thay đổi nếu cần)

  const handleQuantityChange = (index, newQuantity) => {
    setProductArr((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].quantity = Math.max(newQuantity, 1); // Ensure minimum quantity is 1
      return updatedProducts;
    });
  };

  const handleRemoveProduct = (index) => {
    setProductArr((prevProducts) => prevProducts.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = productArr.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const shippingFee = 10000; // Phí vận chuyển cố định
    return subtotal - discountValue + shippingFee;
  };

  const handleApplyDiscount = () => {
    if (discountCode.trim() === "") {
      message.warning("Vui lòng nhập mã giảm giá!");
      return;
    }
    message.success("Mã giảm giá đã được áp dụng!");
  };

  return (
    <Row style={{ maxWidth: '1200px', background: 'white', margin: '0 auto', color: 'black', padding: '1rem' }}>
      <Col span={17} style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Chọn địa chỉ nhận hàng</h2>
        <Shipping />
      </Col>
      <Col span={7} style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Giỏ hàng của bạn</h2>
        {productArr.map((product, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '1px solid #eaeaea',
              paddingBottom: '1rem',
            }}
          >
            <img
              src={product.productImg}
              alt={product.nameProduct}
              style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            />
            <div style={{ flex: 3, fontSize: '1rem', paddingLeft: '1rem' }}>
              <h2>{product.nameProduct}</h2>
            </div>
            <div style={{ flex: 2, textAlign: 'center' }}>
              <h2 style={{ color: '#f2405d', fontSize: '1rem', marginBottom: '0.5rem' }}>
                {product.price.toLocaleString()}đ
              </h2>
              <InputNumber
                min={1}
                value={product.quantity}
                onChange={(value) => handleQuantityChange(index, value)}
                style={{ marginBottom: '0.5rem' }}
              />
              <Button type="primary" danger onClick={() => handleRemoveProduct(index)}>
                <DeleteFilled />
                Xóa
              </Button>
            </div>
          </div>
        ))}
        <div style={{ fontSize: '1rem', background: '#f3f5f7', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h2>Tạm tính</h2>
            <p>{productArr.reduce((sum, product) => sum + product.price * product.quantity, 0).toLocaleString()}đ</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f2405d', marginBottom: '0.5rem' }}>
            <h2>Khuyến mãi</h2>
            <p>-{discountValue.toLocaleString()}đ</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h2>Phí vận chuyển</h2>
            <p>10.000đ</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          <h2>Tổng tiền</h2>
          <p style={{ color: '#f2405d' }}>{calculateTotal().toLocaleString()}đ</p>
        </div>
        <div style={{ padding: '0.5em', border: '1px solid #ced4da', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
          <Input
            size="large"
            placeholder="Nhập mã khuyến mãi"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button onClick={handleApplyDiscount} style={{ marginLeft: '0.5rem' }}>
            Áp dụng
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default CartComponent;
