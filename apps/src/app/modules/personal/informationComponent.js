"use client";

import { Col, Row, Typography, Input } from "antd";
import React from "react";

const InformationComponent = () => {
  return (
    <>
      <Row>
        <Typography>Thông tin cá nhân</Typography>
      </Row>
      <Row style={{ display: "flex", flexDirection: "column" }}>
        <Row>
          <Typography>Thông tin tài khoản</Typography>
        </Row>
        <Row>
          <Col span={8}>
            <Row>
              <Typography>Tên đăng nhập:</Typography>
            </Row>
            <Row>
              <Input value={"hihihehe"} disabled />
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Typography>Mật khẩu: </Typography>
            </Row>
            <Row>
              <Input.Password disabled value={"hihihhehe"} />
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Typography>Email: </Typography>
            </Row>
            <Row>
              <Input value={"email "} />
            </Row>
          </Col>
        </Row>
      </Row>
    </>
  );
};

export default InformationComponent;
