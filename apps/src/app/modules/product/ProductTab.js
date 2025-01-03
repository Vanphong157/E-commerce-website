"use client";
import { Row, Tabs, Collapse, theme } from 'antd';
import React from 'react';
import styled from 'styled-components';

const { Panel } = Collapse;
const { TabPane } = Tabs;

// Styled Components
const StyledRow = styled(Row)`
  padding: 15px;
  margin-top: 10px;
  border-radius: 8px;
  background: white;
  color: black;
  padding-bottom: 20px;
`;

// Component để hiển thị thông số kỹ thuật
const TechnicalSpecifications = ({ specifications }) => {
  const { token } = theme.useToken();

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      style={{
        background: token.colorBgContainer,
      }}
    >
      {specifications.map((spec) => (
        <Panel
          header={spec.specName}
          key={spec._id}
          style={{
            marginBottom: 12,
            background: "#f2f4f7",
            borderRadius: token.borderRadiusLG,
            border: 'none',
          }}
        >
          <p>{spec.specValue}</p>
        </Panel>
      ))}
    </Collapse>
  );
};

// Component để hiển thị đánh giá
const ProductReviews = ({ reviews, rating }) => {
  const { token } = theme.useToken();

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
      <h3>Đánh giá ({rating})</h3>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index}>
              {index < Math.floor(rating) ? '★' : '☆'}
            </span>
          ))}
        </span>
        <span style={{ marginLeft: "8px" }}>({rating})</span>
      </div>
      <Collapse
        bordered={false}
        defaultActiveKey={[]}
        style={{
          marginTop: 12,
          background: token.colorBgContainer,
        }}
      >
        {reviews.map((review) => (
          <Panel
            header={`${review.user} - ${review.rating}★`}
            key={review._id}
            style={{
              marginBottom: 12,
              background: "#f2f4f7",
              borderRadius: token.borderRadiusLG,
              border: 'none',
            }}
          >
            <p>{review.comment}</p>
            <p style={{ fontStyle: "italic", color: "#555" }}>
              Ngày: {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

// Component `ProductTab`
const ProductTab = ({ technicalSpecifications, reviews, rating }) => {
  const items = [
    {
      key: '1',
      label: 'Thông số kỹ thuật',
      children: <TechnicalSpecifications specifications={technicalSpecifications} />,
    },
    {
      key: '2',
      label: 'Đánh giá sản phẩm',
      children: <ProductReviews reviews={reviews} rating={rating} />,
    },
  ];

  return (
    <StyledRow>
      <Tabs defaultActiveKey="1" items={items} style={{ width: "100%" }} />
    </StyledRow>
  );
};

export default ProductTab;
