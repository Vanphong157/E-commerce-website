"use client";
import React, { useState } from "react";
import { Row, Col, Input, Select, Button } from "antd";

const Option = [
  {
    value: "jack",
    label: "Jack",
  },
  {
    value: "lucy",
    label: "Lucy",
  },
  {
    value: "Yiminghe",
    label: "yiminghe",
  },
];

const CartItem = [{}];

const OrderComponents = () => {
  const [hover, setHover] = useState(false);
  return (
    <Row>
      <Col span={12} offset={2} style={{ backgroundColor: "#fff" }}>
        <span>Địa chỉ nhận hàng</span>
        <Row>
          <Col span={10} offset={1}>
            <span>Họ và tên</span>
            <Input
              style={{ width: "100%", padding: 8.2 }}
              placeholder="Họ và tên"
            />
          </Col>
          <Col span={10} offset={2}>
            <span>Số điện thoại</span>
            <Input
              style={{ width: "100%", padding: 8.2 }}
              placeholder="Số điện thoại"
            />
          </Col>
        </Row>
        <Row>
          <Col span={10} offset={1}>
            <span>E-mail</span>
            <Input
              style={{ width: "100%", padding: 8.2 }}
              placeholder="E-mail"
            />
          </Col>
          <Col span={10} offset={2}>
            <span>Tỉnh/T.Phố</span>
            <Select
              size="large"
              options={Option}
              style={{
                width: "100%",
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={10} offset={1}>
            <span>Quận/Huyện</span>
            <Select
              size="large"
              options={Option}
              style={{
                width: "100%",
              }}
            />
          </Col>
          <Col span={10} offset={2}>
            <span>Phường/Xã</span>
            <Select
              size="large"
              options={Option}
              style={{
                width: "100%",
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={22} offset={1}>
            <span>Số nhà/ Tên đường</span>
            <Input style={{ width: "100%", padding: 8.2 }} />
          </Col>
        </Row>
        <Row>
          <Col span={22} offset={1}>
            <Button
              style={{
                backgroundColor: hover ? "#f95e5e" : "#FE0000",
                border: hover ? "none" : "none",
                transition: hover ? "background-color 0.1s ease" : "none",
                color: "#fff",
                fontWeight: 700,
                width: "100%",
                padding: 25,
                fontSize: 21,
              }}
              onMouseOver={() => setHover(true)}
              onMouseOut={() => setHover(false)}
            >
              Đặt hàng
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={8} offset={2} style={{ backgroundColor: "#fff" }}>
        Giỏ hàng
        <Row>
          <Col span={6}>Image</Col>
          <Col span={10}>Title</Col>
          <Col span={8}>Cost</Col>
        </Row>
      </Col>
    </Row>
  );
};

export default OrderComponents;
