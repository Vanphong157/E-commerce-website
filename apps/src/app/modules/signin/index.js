"use client";
import React from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Typography } from "antd";

const { Title } = Typography;

const SigninContent = () => {
  return (
    <Col span={12} offset={6}>
      <Row style={{ justifyContent: "center", marginTop: 10 }}>
        <Title style={{ fontWeight: 700 }}>Sign in</Title>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Input
          placeholder="default size"
          prefix={<UserOutlined />}
          style={{ padding: 10, marginTop: 10 }}
        />
        <Input.Password
          placeholder="input password"
          style={{ padding: 10, marginTop: 10 }}
          prefix={<LockOutlined />}
        />
      </Row>
      <Row style={{ marginTop: 10 }}>
        <span>Don't have an account?</span>
        <a href="/pages/signup" style={{ color: "#ED3324", fontWeight: 700 }}>
          Sign up
        </a>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Button
          style={{
            backgroundColor: "#ED3324",
            color: "#fff",
            fontWeight: 700,
            width: "100%",
            padding: 25,
            fontSize: 21,
          }}
        >
          Submit
        </Button>
      </Row>
    </Col>
  );
};

export default SigninContent;
