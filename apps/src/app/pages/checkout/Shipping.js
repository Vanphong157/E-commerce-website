"use client";
import { Button, Col, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from 'sweetalert2'
// Reusable style for all text inputs
const inputStyle = {
  width: "98%",
  margin: "1rem 0 0 0",
};

const Shipping = ({items}) => {
  const router = useRouter(); 
  // 1. Local states for each field
  const [district, setDistrict] = useState("");     // Quận / huyện
  const [street, setStreet] = useState("");         // Số nhà / tên đường
  const [phone, setPhone] = useState("");           // Số điện thoại
  const [city, setCity] = useState("");             // Tỉnh / thành phố
  const [message, setMessage] = useState("");       // Lời nhắn
  const [isShipAtHome, setIsShipAtHome] = useState(true); // true = giao tại nhà, false = nhận tại trung tâm
  const [paymentMethod, setPaymentMethod] = useState(""); // e.g. "qr" or "cod"

  // 2. Toggle shipping method
  const handleShippingSelection = (isAtHome) => {
    setIsShipAtHome(isAtHome);
  };

  // 3. Payment selection
  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  // 4. Handle form submission or next step
  const handleSubmit = async () => {
    console.log("asdfsdf")
    // 1. Prepare data in the desired format
    const requestBody = {
      items: items.map((item) => ({
        productId: item.productId,  // or whatever keys your items have
        quantity: item.quantity,
      })),
      phoneNumber: phone,              // shippingData.phone, or just 'phone'
      shippingAddress: {
        province: city,               // shippingData.city
        ward: district,               // shippingData.district
        addressDetail: street,        // shippingData.street
      },
      paymentMethod: paymentMethod,    // e.g. 'cod' or 'qr'
    };
  
    if(paymentMethod == "cod"){
      try {
        // 2. Make the POST request
        const response = await fetch("https://api-doan-9c1f18bfacff.herokuapp.com/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestBody),
        });
    
        // 3. Handle response
        const data = await response.json();
    
        console.log("Request Body:", requestBody);
        console.log("Response:", response);
        console.log("Data:", data);
    
        if (!response.ok) {
          // If the response status is not OK, you can handle the error here
          throw new Error(data.message || "Đã xảy ra lỗi khi tạo đơn hàng");
        }
  

        router.push("/");
        Swal.fire({
          title: 'Success!',
          text: 'Đặt hàng thành công',
          icon: 'success',
          confirmButtonText: 'Cool'
        })

      } catch (error) {
        console.error(error);
        // Optional: show a user-friendly message
      }
    }

    if(paymentMethod == "qr"){
      console.log("asdfsdf")
      const requestBodyy = {
        items: items.map((item) => ({
          productId: item.productId,  // or whatever keys your items have
          quantity: item.quantity,
        })),
        phoneNumber: phone,              // shippingData.phone, or just 'phone'
        shippingAddress: {
          province: city,               // shippingData.city
          ward: district,               // shippingData.district
          addressDetail: street,        // shippingData.street
        },
        paymentMethod: "online",    // e.g. 'cod' or 'qr'
      };
      try {
        // 2. Make the POST request
        const response = await fetch("https://api-doan-9c1f18bfacff.herokuapp.com/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestBodyy),
        });

        console.log(response)

        // 3. Handle response
        const data = await response.json();

        const paymentLink = data.order.paymentUrl;
    
        console.log("Request Body:", requestBody);
        console.log("Response:", response);
        console.log("Data:", data);
    
        if (!response.ok) {
          // If the response status is not OK, you can handle the error here
          throw new Error(data.message || "Đã xảy ra lỗi khi tạo đơn hàng");
        }
  
        router.push(`${paymentLink}`);
  
      } catch (error) {
        console.error(error);
        // Optional: show a user-friendly message
      }
    }
  };
  

  return (
    <div>
      {/* Buttons to select shipping method */}
      <div style={{ width: "100%", display: "flex" }}>
        {/* Giao hàng tại nhà */}
        <Button
          size="large"
          style={{
            maxWidth: "49%",
            flex: 1,
            height: "3.5rem",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => handleShippingSelection(true)}
          className="mr-2"
        >
          <img
            src="https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-black-thumb-200x200.jpg"
            alt="Delivery at Home"
            style={{ width: "2.5rem" }}
          />
          <h3 className="text-xl font-semibold" style={{ marginLeft: "0.5rem" }}>
            Nhận hàng tại nhà
          </h3>
        </Button>

        {/* Nhận hàng tại trung tâm */}
        <Button
          size="large"
          style={{
            maxWidth: "49%",
            flex: 1,
            height: "3.5rem",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => handleShippingSelection(false)}
        >
          <img
            src="https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-black-thumb.jpg"
            alt="Pick Up at Center"
            style={{ width: "2.5rem" }}
          />
          <h3 className="text-xl" style={{ marginLeft: "0.5rem" }}>
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
                  maxWidth: "48%",
                  flex: 1,
                  height: "3.5rem",
                  display: "flex",
                  alignItems: "center",
                  marginRight: "1rem",
                }}
                onClick={() => handleSelectPaymentMethod("qr")}
              >
                <h3 className="text-normal">Thanh toán bằng QR</h3>
              </Button>
              <Button
                size="large"
                style={{
                  maxWidth: "48%",
                  flex: 1,
                  height: "3.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => handleSelectPaymentMethod("cod")}
              >
                <h3 className="text-normal">Thanh toán khi nhận hàng</h3>
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
                  maxWidth: "48%",
                  flex: 1,
                  height: "3.5rem",
                  display: "flex",
                  alignItems: "center",
                  marginRight: "1rem",
                }}
                onClick={() => handleSelectPaymentMethod("qr")}
              >
                <h3 className="text-normal">Thanh toán bằng QR</h3>
              </Button>
              <Button
                size="large"
                style={{
                  maxWidth: "48%",
                  flex: 1,
                  height: "3.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => handleSelectPaymentMethod("cod")}
              >
                <h3 className="text-normal">Thanh toán khi nhận hàng</h3>
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
