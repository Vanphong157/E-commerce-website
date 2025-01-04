"use client";
import { Button, Col, Input, InputNumber, Row, message, Spin, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { DeleteFilled, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import Shipping from "./Shipping";
import DashboardLayout from "../../layout/index";

// A child component to display each cart item (unchanged)
const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const product = item.productId;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem",
        borderBottom: "1px solid #eaeaea",
        paddingBottom: "1rem",
      }}
    >
      {/* Product Image */}
      {product && product.images && product.images.length > 0 ? (
        <img
          src={product.images[0]}
          alt={product.name}
          style={{ width: "100px", height: "100px", objectFit: "contain" }}
        />
      ) : (
        <div
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "#f0f0f0",
            color: "#999999",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Không có ảnh
        </div>
      )}

      {/* Product Info */}
      <div style={{ flex: 3, fontSize: "10px", paddingLeft: "1rem" }}>
        <h2 style={{ fontSize: "1rem" }}>
          {product ? product.name : "Sản phẩm không xác định"}
        </h2>
      </div>

      {/* Quantity & Remove */}
      <div style={{ flex: 2, textAlign: "center" }}>
        <h2
          style={{
            color: "#f2405d",
            fontSize: "12px",
            marginBottom: "0.5rem",
          }}
        >
          {item.price.toLocaleString()}đ
        </h2>

        {/* Quantity Input */}
        <InputNumber
          min={1}
          value={item.quantity}
          onChange={(newQuantity) => {
            if (product && product._id) {
              onQuantityChange(item._id, newQuantity);
            } else {
              message.error("Không thể thay đổi số lượng với sản phẩm không xác định");
            }
          }}
          style={{ marginBottom: "0.5rem" }}
          disabled={!product || !product._id}
        />

        {/* Remove Button */}
        <Button
          type="primary"
          danger
          onClick={() => {
            if (product && product._id) {
              onRemove(item._id);
            } else {
              message.error("Không thể xóa sản phẩm không xác định");
            }
          }}
          disabled={!product || !product._id}
        >
          <DeleteFilled />
          Xóa
        </Button>
      </div>
    </div>
  );
};

const CartComponent = () => {
  const [cart, setCart] = useState(null); // { items: [...] }
  const [loading, setLoading] = useState(false);

  // Discount-related states
  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState(50000); // Example: 50k discount

  // Shipping data (moved to parent)
  const [shippingData, setShippingData] = useState({
    district: "",
    street: "",
    phone: "",
    city: "",
    message: "",
    isShipAtHome: true, // true = ship at home, false = pick up center
    paymentMethod: "",  // "qr" or "cod"
  });

  const handleShippingDataChange = (updatedData) => {
    setShippingData(updatedData);
  };

  // Fetch the user's cart
  const fetchUserCart = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api-doan-9c1f18bfacff.herokuapp.com/cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải giỏ hàng");
      }

      const data = await response.json();
      console.log("Fetched cart data:", data);
      setCart(data.cart || { items: [] });
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải giỏ hàng");
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, []);

  // Update item quantity in backend
  const updateItemQuantity = async (itemId, newQuantity) => {
    try {
      const response = await fetch(
        "https://api-doan-9c1f18bfacff.herokuapp.com/cart/update-item",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, quantity: newQuantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật số lượng");
      }

      const updatedData = await response.json();
      setCart(updatedData.cart);
      message.success("Cập nhật số lượng thành công");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Lỗi khi cập nhật số lượng");
    }
  };

  // Called by <CartItem> when quantity changes
  const handleQuantityChange = (itemId, newQuantity) => {
    updateItemQuantity(itemId, newQuantity);
  };

  // Remove product from cart
  const removeItemFromCart = async (itemId) => {
    try {
      const response = await fetch(
        "https://api-doan-9c1f18bfacff.herokuapp.com/cart/remove-item",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa sản phẩm");
      }

      const updatedData = await response.json();
      setCart(updatedData.cart);
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Lỗi khi xóa sản phẩm");
    }
  };

  // Calculate subtotal = sum of (price * quantity)
  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Final total = subtotal - discount + shipping
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingFee = 10000; // fixed shipping fee
    return subtotal - discountValue + shippingFee;
  };

  // Apply discount code
  const handleApplyDiscount = () => {
    if (discountCode.trim() === "") {
      message.warning("Vui lòng nhập mã giảm giá!");
      return;
    }
    // For demonstration
    message.success("Mã giảm giá đã được áp dụng!");
  };

  if (loading) {
    return (
      <Row style={{ minHeight: "80vh" }} align="middle" justify="center">
        <Spin tip="Đang tải giỏ hàng..." size="large" />
      </Row>
    );
  }

  return (
    <Row
      gutter={[16, 16]}
      style={{
        background: "white",
        margin: "0 auto",
        color: "black",
        padding: "1rem",
      }}
    >
      {/* Left Column: Shipping Info */}
      <Col span={17} style={{ padding: "1rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
          Chọn địa chỉ nhận hàng
        </h2>
        {/* 
          Pass the shippingData and a callback to change it.
          'items' prop is optional if Shipping needs the cart items for some reason.
        */}
        <Shipping
          items={cart?.items || []}
        />
      </Col>

      {/* Right Column: Cart */}
      <Col span={7} style={{ padding: "1rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
          Giỏ hàng của bạn
        </h2>

        {/* If cart is empty */}
        {cart && cart.items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h3>Giỏ hàng của bạn đang trống.</h3>
            <Button type="primary" href="/products" style={{ marginTop: "1rem" }}>
              Xem sản phẩm
            </Button>
          </div>
        ) : (
          <>
            {/* List cart items */}
            {cart?.items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={removeItemFromCart}
              />
            ))}

            {/* Subtotal, discount, shipping fee */}
            <div
              style={{
                fontSize: "12px",
                background: "#f3f5f7",
                padding: "1rem",
                borderRadius: "5px",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <h2>Tạm tính</h2>
                <p style={{ fontSize: 18, fontWeight: 600 }}>
                  {calculateSubtotal().toLocaleString()}đ
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#f2405d",
                  marginBottom: "0.5rem",
                }}
              >
                <h2>Khuyến mãi</h2>
                <p style={{ fontSize: 18, fontWeight: 600 }}>
                  -{discountValue.toLocaleString()}đ
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <h2>Phí vận chuyển</h2>
                <p style={{ fontSize: 18, fontWeight: 600 }}>10.000đ</p>
              </div>
            </div>

            {/* Total */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              <h2>Tổng tiền</h2>
              <p style={{ color: "#f2405d", fontSize: 20, fontWeight: 700 }}>
                {calculateTotal().toLocaleString()}đ
              </p>
            </div>

            {/* Discount Code */}
            <div
              style={{
                padding: "0.5em",
                border: "1px solid #ced4da",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Input
                size="large"
                placeholder="Nhập mã khuyến mãi"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button onClick={handleApplyDiscount} style={{ marginLeft: "0.5rem" }}>
                Áp dụng
              </Button>
            </div>
          </>
        )}
      </Col>
    </Row>
  );
};

const CheckoutComponent = () => {
  return (
    <DashboardLayout>
      <CartComponent />
    </DashboardLayout>
  );
};

export default CheckoutComponent;
