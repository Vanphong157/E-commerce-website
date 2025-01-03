"use client";
import { Col, Row, Typography, Spin, Alert } from "antd";
import React, { useEffect, useState } from "react";

const baseURL = "https://api-doan-9c1f18bfacff.herokuapp.com";

const styleImg = {
  width: "48px",
  height: "48px", // Đảm bảo hình ảnh không bị biến dạng
  objectFit: "cover",
  borderRadius: "8px",
  margin: "0 auto",
};

const styleRow = {
  color: "#1d2939",
  background: "white",
  borderRadius: "8px",
  padding: "20px", // Thêm padding để các phần tử không sát cạnh
};

const styleCol = {
  padding: "16px 10px 10px",
  textAlign: "center",
};

const styleSpan = {
  width: "auto",
  fontSize: "14px",
  height: "18px",
  margin: "2px auto",
  lineHeight: "18px",
  alignContent: "center",
  textTransform: "capitalize",
};

const Category = () => {
  const [categoryArr, setCategoryArr] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái tải
  const [error, setError] = useState(null); // Trạng thái lỗi

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${baseURL}/categories`);

      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        setCategoryArr(data.data);
        setLoading(false); // Dữ liệu đã được tải
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error.message);
      setLoading(false); // Dừng tải ngay cả khi có lỗi
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin tip="Đang tải dữ liệu..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert
          message="Lỗi"
          description={`Không thể tải dữ liệu: ${error}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <Row style={styleRow} gutter={[16, 16]}>
      {categoryArr.map((cate) => (
        <Col key={cate._id || cate.name} style={styleCol} xs={12} sm={8} md={6} lg={4} xl={3}>
          <div style={{ display: "block" }}>
            <img
              src={cate.image}
              alt={cate.name}
              style={styleImg}
            />
          </div>
          <span style={styleSpan}>{cate.name}</span>
        </Col>
      ))}
    </Row>
  );
};

export default Category;
