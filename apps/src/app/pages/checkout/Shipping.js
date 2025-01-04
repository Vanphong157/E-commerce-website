"use client";
import { Button, Col, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from 'sweetalert2';

const inputStyle = {
  width: "98%",
  margin: "1rem 0 0 0",
};

// Styles for shipping selection buttons
const shippingBaseBtnStyle = {
  maxWidth: "49%",
  flex: 1,
  height: "3.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "0.5rem",
};

// Styles for payment method buttons
const paymentBaseBtnStyle = {
  maxWidth: "48%",
  flex: 1,
  height: "3.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const selectedStyle = {
  border: "2px solid #1890ff",
  boxShadow: "0 0 5px #1890ff",
};

const Shipping = ({ items }) => {
  const router = useRouter();

  // 1. Local states for each field
  const [district, setDistrict] = useState("");       // Quận / huyện
  const [street, setStreet] = useState("");           // Số nhà / tên đường
  const [phone, setPhone] = useState("");             // Số điện thoại
  const [city, setCity] = useState("");               // Tỉnh / thành phố
  const [message, setMessage] = useState("");         // Lời nhắn
  const [isShipAtHome, setIsShipAtHome] = useState(true); // true = giao tại nhà, false = nhận tại trung tâm
  const [paymentMethod, setPaymentMethod] = useState(""); // "qr" hoặc "cod"

  // 2. Toggle shipping method
  const handleShippingSelection = (isAtHome) => {
    setIsShipAtHome(isAtHome);
  };

  // 3. Payment selection
  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  // 4. Submit logic
  const handleSubmit = async () => {
    // 1. Prepare data in the desired format
    const requestBody = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      phoneNumber: phone,
      shippingAddress: {
        province: city,
        ward: district,
        addressDetail: street,
      },
      paymentMethod: paymentMethod, 
    };

    // Validate minimal fields (phone, city, paymentMethod)
    if (!phone || !city || !paymentMethod) {
      Swal.fire("Vui lòng điền đủ thông tin và chọn phương thức thanh toán!");
      return;
    }

    // Payment logic
    if (paymentMethod === "cod") {
      try {
        const response = await fetch("https://api-doan-9c1f18bfacff.herokuapp.com/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestBody),
        });
    
        const data = await response.json();
    
        console.log("Request Body:", requestBody);
        console.log("Response:", response);
        console.log("Data:", data);
    
        if (!response.ok) {
          throw new Error(data.message || "Đã xảy ra lỗi khi tạo đơn hàng");
        }

        router.push("/");
        Swal.fire({
          title: 'Success!',
          text: 'Đặt hàng thành công',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error(error);
        Swal.fire("Error", error.message, "error");
      }
    }

    if (paymentMethod === "qr") {
      // If "qr", we send "paymentMethod: online"
      const requestBodyy = {
        ...requestBody,
        paymentMethod: "online", 
      };

      try {
        const response = await fetch("https://api-doan-9c1f18bfacff.herokuapp.com/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestBodyy),
        });

        const data = await response.json();

        console.log("Request Body:", requestBodyy);
        console.log("Response:", response);
        console.log("Data:", data);

        if (!response.ok) {
          throw new Error(data.message || "Đã xảy ra lỗi khi tạo đơn hàng");
        }

        // For online payment, the server returns data.order.paymentUrl
        const paymentLink = data.order.paymentUrl; 
        router.push(paymentLink);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <div>
      {/* Buttons to select shipping method */}
      <div style={{ width: "100%", display: "flex", marginBottom: "1rem" }}>
        {/* Giao hàng tại nhà */}
        <Button
          size="large"
          style={{
            ...shippingBaseBtnStyle,
            // If isShipAtHome is TRUE, highlight this button
            ...(isShipAtHome ? selectedStyle : {}),
          }}
          onClick={() => handleShippingSelection(true)}
        >
          <img
            src="https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-black-thumb-200x200.jpg"
            alt="Delivery at Home"
            style={{ width: "2.5rem", marginRight: "0.5rem" }}
          />
          <h3 className="text-xl font-semibold">
            Nhận hàng tại nhà
          </h3>
        </Button>

        {/* Nhận hàng tại trung tâm */}
        <Button
          size="large"
          style={{
            ...shippingBaseBtnStyle,
            marginRight: 0, 
            // If isShipAtHome is FALSE, highlight this button
            ...(!isShipAtHome ? selectedStyle : {}),
          }}
          onClick={() => handleShippingSelection(false)}
        >
          <img
            src="https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-black-thumb.jpg"
            alt="Pick Up at Center"
            style={{ width: "2.5rem", marginRight: "0.5rem" }}
          />
          <h3 className="text-xl">
            Nhận hàng tại trung tâm
          </h3>
        </Button>
      </div>

      {isShipAtHome ? (
        // If the user selects "Nhận hàng tại nhà"
        <Row>
          <Col span={12}>
            <Input
              placeholder="Quận / huyện"
              size="large"
              style={inputStyle}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
            <Input
              placeholder="Số nhà / tên đường"
              size="large"
              style={inputStyle}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder="Số điện thoại"
              size="large"
              style={inputStyle}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              placeholder="Tỉnh / thành phố"
              size="large"
              style={inputStyle}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Col>

          <Col span={24}>
            <TextArea
              rows={4}
              style={{ marginTop: "1rem", maxWidth: "98%" }}
              placeholder="Để lại lời nhắn cho chúng tôi"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <h2 className="text-xl font-medium mb-5 mt-5">
              Chọn hình thức thanh toán
            </h2>
            <div style={{ width: "100%", display: "flex" }}>
              <Button
                size="large"
                style={{
                  ...paymentBaseBtnStyle,
                  marginRight: "1rem",
                  // highlight if paymentMethod = "qr"
                  ...(paymentMethod === "qr" ? selectedStyle : {}),
                }}
                onClick={() => handleSelectPaymentMethod("qr")}
              >
                Thanh toán bằng QR
              </Button>
              <Button
                size="large"
                style={{
                  ...paymentBaseBtnStyle,
                  ...(paymentMethod === "cod" ? selectedStyle : {}),
                }}
                onClick={() => handleSelectPaymentMethod("cod")}
              >
                Thanh toán khi nhận hàng
              </Button>
            </div>

            {/* Final Submit or Next Step */}
            <div style={{ marginTop: "1.5rem" }}>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                style={{ background: "red", borderColor: "red" }}
              >
                Xác nhận
              </Button>
            </div>
          </Col>
        </Row>
      ) : (
        // If the user selects "Nhận hàng tại trung tâm"
        <Row>
          <Col span={24} style={{ marginTop: "1rem" }}>
            <h2 className="text-xl font-semibold">
              Bạn đã chọn nhận hàng tại trung tâm.
            </h2>
            <p>Vui lòng mang giấy tờ tùy thân khi đến nhận hàng.</p>

            <h2 className="text-xl font-medium mb-5 mt-5">
              Chọn hình thức thanh toán
            </h2>
            <div style={{ width: "100%", display: "flex" }}>
              <Button
                size="large"
                style={{
                  ...paymentBaseBtnStyle,
                  marginRight: "1rem",
                  ...(paymentMethod === "qr" ? selectedStyle : {}),
                }}
                onClick={() => handleSelectPaymentMethod("qr")}
              >
                Thanh toán bằng QR
              </Button>
              <Button
                size="large"
                style={{
                  ...paymentBaseBtnStyle,
                  ...(paymentMethod === "cod" ? selectedStyle : {}),
                }}
                onClick={() => handleSelectPaymentMethod("cod")}
              >
                Thanh toán khi nhận hàng
              </Button>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                style={{ background: "red", borderColor: "red" }}
              >
                Xác nhận
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Shipping;

