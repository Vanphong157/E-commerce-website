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
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth để sử dụng hàm login
import { useRouter } from "next/navigation";

const { Title } = Typography;

const inputFieldArray = [
  {
    name: "username",
    placeholder: "Tài khoản",
    prefix: <UserOutlined />,
  },
  {
    name: "password",
    type: "password",
    placeholder: "Mật khẩu",
    prefix: <LockOutlined />,
  },
];

const SigninContent = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [hover, setHover] = useState(false);
  const router = useRouter();
  const isAuthed = localStorage.getItem("token");
  const getRole = localStorage.getItem("role");

  if (isAuthed) {
    getRole === "admin" ? router.push("/pages/admin") : router.push("/");
  }

  // Hàm xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý đăng nhập
  const handleLogin = async () => {
    try {
      if (!formData.username || !formData.password) {
        message.error("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
        return;
      }
      await login({ email: formData.username, password: formData.password });
      message.success("Đăng nhập thành công!");
    } catch (error) {
      message.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
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
            <Title style={{ fontWeight: 700 }}>Sign in</Title>
          </Row>
          <Row style={{ marginTop: 10, fontWeight: 700, fontSize: 14 }}>
            {inputFieldArray.map((field) => (
              <Row style={{ width: "100%" }} key={field.name}>
                <p>{field.placeholder}</p>
                <Input
                  style={{ padding: 13, marginTop: 10, marginBottom: 10 }}
                  name={field.name}
                  placeholder={field.placeholder}
                  prefix={field.prefix}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                />
              </Row>
            ))}
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Checkbox>Lưu đăng nhập</Checkbox>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <span style={{ marginRight: 10 }}>Chưa có tài khoản?</span>
            <a
              href="/pages/signup"
              style={{ color: "#FE0000", fontWeight: 700 }}
            >
              Đăng ký tài khoản
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
              onClick={handleLogin}
              loading={loading} // Hiển thị trạng thái loading khi đăng nhập
            >
              Đăng nhập
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default SigninContent;
