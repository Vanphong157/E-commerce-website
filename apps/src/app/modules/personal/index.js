"use client";
import { Col, Row, Typography } from "antd";
import React, { useState } from "react";
import InformationComponent from "./informationComponent";
import OrderHistory from "./order-history";

const PersonalPage = () => {
  const [template, setTemplate] = useState(1);

  const handleChooseTemplate = (num) => {
    return setTemplate(num);
  };

  return (
    <>
      <Row>
        <Col span={6}>
          <Row>
            <Typography onClick={() => handleChooseTemplate(1)}>
              Thông tin cá nhân
            </Typography>
          </Row>
          <Row>
            <Typography onClick={() => handleChooseTemplate(2)}>
              Xem đơn hàng
            </Typography>
          </Row>
          <Row>
            <Typography>Cái gì đó</Typography>
          </Row>
        </Col>
        <Col
          span={18}
          style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10 }}
        >
          {template == 1 ? <InformationComponent /> : <OrderHistory />}
        </Col>
      </Row>
    </>
  );
};

export default PersonalPage;
