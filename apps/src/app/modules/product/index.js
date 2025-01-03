"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Breadcrumb, Button, Col, Row, Typography, Spin, Alert } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import ProductRelated from "./ProductRelated";
import ProductTab from "./ProductTab";
import Review from "./Review";
import { useParams } from "next/navigation";

const { Title } = Typography;

const baseURL = "https://api-doan-9c1f18bfacff.herokuapp.com/product";

// Styled Components
const ListItem = styled.li`
  padding: 12px 0;
  width: 50%;
  display: flex;
  align-items: center;
`;

const PolicyItem = styled.div`
  margin-right: 14px;
  display: flex;
  align-items: center;
`;

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const [thumbs, setThumbs] = useState([]);
  const [technicalSpecifications, setTechnicalSpecifications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetailProduct = async () => {
    try {
      const response = await fetch(`${baseURL}/${slug}`);
      const data = await response.json();

      console.log("Product data:", data.data);
      if (!data || !data.data) throw new Error("No data found");
      setProduct(data.data);
      setThumbs(data.data.images || []);
      setTechnicalSpecifications(data.data.technicalSpecifications || []);
      setReviews(data.data.reviews || []);
    } catch (error) {
      console.log("Error fetching product details:", error);
      setError(error.message || "Có lỗi xảy ra khi lấy thông tin sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailProduct();
  }, [slug]);

  // Fake Pagination for Reviews
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const reviewsPerPage = 2; // Số đánh giá hiển thị mỗi trang

  const indexOfLastReview = currentReviewPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalReviews = reviews.length;

  const handleReviewLoadMore = () => {
    setCurrentReviewPage(currentReviewPage + 1);
  };

  const listPolicys = [
    "Giao hàng tận nhà nhanh chóng",
    "Không bảo hành, đổi trả",
  ];

  const listRelated = [
    {
      image:
        "https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-black-thumb-600x600.jpg",
      title: "iPhone 16 Pro Max 256GB",
      price: "34.990.000₫",
    },
    {
      image:
        "https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-black-thumb-600x600.jpg",
      title: "iPhone 16 Pro Max 256GB",
      price: "34.990.000₫",
    },
    {
      image:
        "https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-black-thumb-600x600.jpg",
      title: "iPhone 16 Pro Max 256GB",
      price: "34.990.000₫",
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin tip="Đang tải sản phẩm..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  const handleAddToCart = () => {
    alert("Thêm vào giỏ hàng thành công!");
  } 

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb style={{ margin: "15px 0" }} separator=">">
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Tiêu đề sản phẩm */}
      <Title level={3}>{product.name}</Title>

      {/* Nội dung chính */}
      <Row gutter={10} style={{ paddingTop: "5px", marginTop: "10px" }}>
        {/* Cột bên trái: Hình ảnh và thông tin chi tiết */}
        <Col span={15}>
          {/* Hình ảnh sản phẩm */}
          <ProductImages listImgs={thumbs} />

          {/* Các chính sách cam kết */}
          <Row
            style={{
              marginTop: "10px",
              borderRadius: "8px",
              background: "white",
              color: "black",
              paddingBottom: "10px",
            }}
          >
            <div style={{ margin: "0 16px", width: "100%" }}>
              <b
                style={{
                  paddingTop: "15px",
                  color: "#101828",
                  fontSize: "16px",
                  marginBottom: "15px",
                  display: "block",
                }}
              >
                Điện máy xanh cam kết
              </b>
              <ul style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                {listPolicys.map((policy, index) => (
                  <ListItem key={index}>
                    <PolicyItem>
                      <CheckCircleOutlined
                        style={{ fontSize: "24px", color: "blue" }}
                      />
                    </PolicyItem>
                    <p>{policy}</p>
                  </ListItem>
                ))}
              </ul>
            </div>
          </Row>

          {/* Các đặc điểm nổi bật */}
          <Row
            style={{
              marginTop: "10px",
              borderRadius: "8px",
              background: "white",
              color: "black",
              paddingBottom: "20px",
            }}
          >
            <div style={{ margin: "0 16px", width: "100%" }}>
              <b
                style={{
                  paddingTop: "15px",
                  color: "#101828",
                  fontSize: "16px",
                  marginBottom: "15px",
                  display: "block",
                }}
              >
                Đặc điểm nổi bật
              </b>
              <ul style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                {technicalSpecifications.map((spec, index) => (
                  <ListItem key={index}>
                    <PolicyItem>
                      <CheckCircleOutlined
                        style={{ fontSize: "20px", color: "blue" }}
                      />
                    </PolicyItem>
                    <p>{spec.specName}</p>
                  </ListItem>
                ))}
              </ul>
            </div>
          </Row>

          {/* Tab thông tin sản phẩm */}
          <ProductTab technicalSpecifications={technicalSpecifications} />

          {/* Đánh giá sản phẩm */}
          <Review reviews={currentReviews} rating={product.rating} />

          {/* Fake Pagination for Reviews */}
          {totalReviews > reviewsPerPage && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                type="link"
                onClick={handleReviewLoadMore}
                disabled={currentReviewPage * reviewsPerPage >= totalReviews}
              >
                Xem thêm đánh giá
              </Button>
            </div>
          )}
        </Col>

        {/* Cột bên phải: Thông tin sản phẩm và mua hàng */}
        <Col span={9}>
          <Row
            style={{
              borderRadius: "8px",
              background: "white",
              padding: "16px",
              color: "black",
            }}
          >
            <div style={{ display: "block", width: "100%" }}>
              {/* Thông tin sản phẩm */}
              <ProductInfo
                rating={product.rating}
                price={product.price}
                retailPrice={product.retailPrice}
                stock={product.stockQuantity}
                numberSold={product.numberSold}
              />

              {/* Nút Mua ngay và Thêm vào giỏ hàng */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <Button
                  onClick={() => handleBuyNow()}
                  type="primary"
                  style={{
                    backgroundColor: "#dc0021",
                    borderColor: "#dc0021",
                    color: "white",
                    fontSize: "16px",
                    height: "60px",
                    width: "200px",
                  }}
                >
                  Mua ngay
                </Button>
                <Button
                  onClick={() => handleAddToCart(product._id)}
                  type="default"
                  style={{
                    backgroundColor: "white",
                    borderColor: "#dc0021",
                    color: "#dc0021",
                    fontSize: "16px",
                    height: "60px",
                    width: "200px",
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>
          </Row>

          {/* Sản phẩm liên quan */}
          <Row
            style={{
              borderRadius: "8px",
              background: "white",
              padding: "16px",
              color: "black",
              marginTop: "10px",
            }}
          >
            <ProductRelated listRelated={listRelated} />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default ProductPage;
