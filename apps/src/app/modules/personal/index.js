import { Col, Row, Typography } from "antd";
import React from "react";
import InformationComponent from "./informationComponent";

const PersonalPage = () => {
  return (
    <>
      <Row>
        <Col span={6}>
          <Row>
            <Typography>Thông tin cá nhân</Typography>
          </Row>
          <Row>
            <Typography>Xem đơn hàng</Typography>
          </Row>
          <Row>
            <Typography>Cái gì đó</Typography>
          </Row>
        </Col>
        <Col span={18}>
          <InformationComponent />
        </Col>
      </Row>
    </>
  );
};

export default PersonalPage;
