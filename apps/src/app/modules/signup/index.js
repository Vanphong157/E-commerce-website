"use client";
import React, { useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Row,
  Typography,
  Avatar,
  Checkbox,
  message,
} from "antd";
const { Title } = Typography;
import { useAuth } from "../../contexts/AuthContext";

const inputFieldArray = [
  {
    name: "name",
    placeholder: "Họ tên",
    className: "form-field",
    prefix: <UserOutlined />,
    type: "text",
    rules: [
      {
        required: true,
        message: "Trường này không được bỏ trống",
      },
    ],
  },
  {
    name: "email",
    placeholder: "Email",
    className: "form-field",
    prefix: <LockOutlined />,
    type: "email",
    rules: [
      {
        required: true,
        message: "Trường này không được bỏ trống",
      },
    ],
  },
  {
    name: "password",
    placeholder: "Mật khẩu",
    className: "form-field",
    prefix: <LockOutlined />,
    type: "password",
    rules: [
      {
        required: true,
        message: "Trường này không được bỏ trống",
      },
    ],
  },
];

const SignupContent = () => {
  const { register, loading } = useAuth();
  const [hover, setHover] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    const { name, email, password } = formData;

    if (!name || !password || !email) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      await register({ name, email, password });
      message.success("Đăng ký thành công!");
    } catch (error) {
      message.error("Có lỗi xảy ra khi đăng ký!");
    }
  };

  return (
    <>
      <Row style={{ justifyContent: "center" }}>
        <Col
          span={12}
          style={{
            padding: 20,
            border: "1px solid black",
            backgroundColor: "white",
            marginTop: 20,
            borderRadius: 19,
            minWidth: "300px",
            maxWidth: "600px",
          }}
        >
          <Row style={{ alignItems: "center" }}>
            <Avatar shape="square" size={50} />
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                marginLeft: 20,
                color: "#FE0000",
              }}
            >
              Logo
            </span>
          </Row>
          <Row style={{ justifyContent: "center", marginTop: 10 }}>
            <Title style={{ fontWeight: 700 }}>Sign up</Title>
          </Row>
          <Row style={{ marginTop: 10, fontWeight: 700, fontSize: 14 }}>
            {inputFieldArray.map((field) => (
              <Row style={{ width: "100%" }} key={field.name}>
                <p>{field.placeholder}</p>
                <Input
                  style={{ padding: 13, marginTop: 10, marginBottom: 10 }}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  prefix={field.prefix}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              </Row>
            ))}
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Checkbox>Lưu đăng nhập</Checkbox>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <span style={{ marginRight: 10 }}>Đã có tài khoản?</span>
            <a
              href="/pages/signin"
              style={{ color: "#FE0000", fontWeight: 700 }}
            >
              {" "}
              Đăng nhập tài khoản
            </a>
          </Row>

          <Row style={{ marginTop: 20, marginBottom: 20 }}>
            <Button
              style={{
                backgroundColor: hover ? "#f95e5e" : "#FE0000",
                border: "none",
                transition: "background-color 0.1s ease",
                color: "#fff",
                fontWeight: 700,
                width: "100%",
                padding: 25,
                fontSize: 21,
              }}
              onMouseOver={() => setHover(true)}
              onMouseOut={() => setHover(false)}
              loading={loading}
              onClick={handleRegister}
            >
              Đăng ký
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default SignupContent;
