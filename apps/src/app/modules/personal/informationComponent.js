"use client";

import { Col, Row, Typography, Input, Button } from "antd";
import React from "react";

const inforUser = [
  {
    name: "Họ tên",
    value: "Nguyễn Văn A",
  },
  {
    name: "Sđt",
    value: "01111111111",
  },
  {
    name: "Giới tính",
    value: "Nam",
  },
  {
    name: "Địa chỉ",
    value: "Location",
  },
  { name: "E-mail", value: "vanphong150703@gmail.com" },
];

const InformationComponent = () => {
  return (
    <>
      <Row>
        <Typography style={{ fontSize: 26, fontWeight: 700 }}>
          Thông tin cá nhân
        </Typography>
      </Row>
      <Row style={{ display: "flex", flexDirection: "column" }}>
        <Row>
          <Typography style={{ fontSize: 22, fontWeight: 700 }}>
            Thông tin tài khoản
          </Typography>
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
          <Col span={8} offset={8}>
            <Row>
              <Typography>Mật khẩu: </Typography>
            </Row>
            <Row>
              <Input.Password disabled value={"hihihhehe"} />
            </Row>
          </Col>
        </Row>
        <Row
          style={{ display: "flex", justifyContent: "flex-end", margin: 10 }}
        >
          <Button> Thay đổi mật khẩu</Button>
        </Row>
      </Row>
      <Row style={{ display: "flex", flexDirection: "column" }}>
        <Row>
          <Typography style={{ fontSize: 22, fontWeight: 700 }}>
            Thông tin người dùng
          </Typography>
        </Row>
        <Row style={{ display: "flex", flexDirection: "column" }}>
          {inforUser.map((infor, index) => (
            <Row key={index} style={{ margin: 5 }}>
              <Col span={6}>
                <Typography>{infor.name}</Typography>
              </Col>
              <Col span={18}>
                <Input value={infor.value} />
              </Col>
            </Row>
          ))}
        </Row>
        <Row style={{ display: "flex", justifyContent: "flex-end", margin: 5 }}>
          <Button>Lưu thông tin</Button>
        </Row>
      </Row>
    </>
  );
};

export default InformationComponent;
