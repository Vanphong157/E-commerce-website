"use client";

import formatCurrency, { calculateDiscountPercentage } from "@/app/utils/formatCurrency";
import Link from "next/link";
import React, { useState } from "react";
import { Spin, Alert } from "antd"; // Import Spin và Alert từ Ant Design

const styles = {
  productBox: {
    transition: ".2s",
    border: "1px solid #f2f4f7",
    borderRadius: "6px",
    padding: "5px",
    textAlign: "center",
    position: "relative", // Để chứa spinner
    background: "#fff",
  },
  productImg: {
    height: "163px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
    transition: "all 300ms ease-in-out",
    position: "relative", // Để định vị spinner
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  productTitle: {
    lineHeight: "19px",
    textAlign: "left",
    color: "#1d2939",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  productPrice: {
    color: "#dd2f2c",
    textAlign: "left",
    fontSize: "18px",
    marginBottom: "8px",
    display: "block",
    lineHeight: "18px",
    fontWeight: "bold",
  },
  oldPrice: {
    fontSize: "15px",
    lineHeight: "17px",
    textDecoration: "line-through",
    color: "#a4a4a4",
    marginRight: "7px",
    fontWeight: "lighter",
  },
  discountBadge: {
    padding: "3px",
    fontWeight: "400",
    fontSize: "14px",
    color: "#eb5757",
    borderRadius: "4px",
    marginTop: "5px",
  },
  flashSale: {
    position: "relative",
    margin: "15px 0",
    minHeight: "20px",
    overflow: "visible",
  },
  flashSaleImg: {
    position: "absolute",
    left: "0",
    top: "-3px",
    width: "20px",
    zIndex: 1,
  },
  flashSaleInfo: {
    display: "block",
    minHeight: "20px",
    paddingLeft: "21px",
    background: "#ddd",
    borderRadius: "25px",
    lineHeight: "20px",
    position: "relative",
    color: "#000",
    textAlign: "center",
    overflow: "hidden",
  },
  flashSaleGradient: {
    background: "linear-gradient(90deg, #ffecb3 0%, #ffb200 100%)",
    width: "95%",
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    transition: "width 0.3s ease-in-out",
  },
  flashSaleText: {
    zIndex: 1,
    position: "relative",
    fontWeight: "normal",
  },
  buyNowButton: {
    width: "100%",
    height: "32px",
    background: "rgba(241,248,254,1)",
    padding: "7px",
    borderRadius: "4px",
    textAlign: "center",
  },
  buyNowLink: {
    display: "block",
    fontSize: "12px",
    color: "#2a83e9",
    fontWeight: 700,
    textDecoration: "none",
    transition: "color 0.3s",
  },
};

const SaleProduct = ({ product }) => {
  const { price, images, name, retailPrice, numberSold, stockQuantity, _id } = product;
  const soldPercentage = Math.min((numberSold / stockQuantity) * 100, 100); // Đảm bảo không vượt quá 100%

  // Trạng thái tải hình ảnh
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <div style={styles.productBox}>
      <Link href={`/product/${_id}`} passHref>
        
          <div style={styles.productImg}>
            {imageLoading && (
              <div style={styles.spinner}>
                <Spin tip="Đang tải..." />
              </div>
            )}
            {imageError ? (
              <Alert
                message="Lỗi"
                description="Không thể tải hình ảnh."
                type="error"
                showIcon
              />
            ) : (
              <img
                src={images[0]}
                alt={name}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
                loading="lazy" // Lazy loading hình ảnh
                style={{
                  maxHeight: "95%",
                  objectFit: "contain",
                  display: imageLoading ? "none" : "block",
                }}
              />
            )}
          </div>
          <h3 style={styles.productTitle}>{name}</h3>
          <strong style={styles.productPrice}>
            {formatCurrency(price)}
            <span style={{ display: "flex", alignItems: "center" }}>
              <label style={styles.oldPrice}>{formatCurrency(retailPrice)}</label>
              {calculateDiscountPercentage(price, retailPrice) > 0 && (
                <small style={styles.discountBadge}>
                  {calculateDiscountPercentage(price, retailPrice)}%
                </small>
              )}
            </span>
          </strong>
        
      </Link>
      <div style={styles.flashSale}>
        <img
          style={styles.flashSaleImg}
          src="https://cdnv2.tgdd.vn/webmwg/2024/ContentMwg/images/homev2/flash-sale.png"
          alt="Flash Sale"
        />
        <span style={styles.flashSaleInfo}>
          <i
            style={{
              ...styles.flashSaleGradient,
              width: `${soldPercentage}%`,
            }}
          ></i>
          <b style={styles.flashSaleText}>Còn {stockQuantity - numberSold}/{stockQuantity} suất</b>
        </span>
      </div>
      <div style={styles.buyNowButton}>
        <a style={styles.buyNowLink} href="#">
          Mua ngay
        </a>
      </div>
    </div>
  );
};

export default SaleProduct;
