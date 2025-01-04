'use client';
import { Button, Col, Input, Row, message, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { DeleteFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const CartComponent = () => {
  const [cart, setCart] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountValue, setDiscountValue] = useState(0); // Start with 0
  const router = useRouter(); 
  
  const fetchUserCart = async () => { 
    try {
      const response = await fetch("https://api-doan-9c1f18bfacff.herokuapp.com/cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải giỏ hàng");
      }

      const data = await response.json();
      console.log(data);  
      setCart(data.cart || { items: [] }); // Set to empty object if data.cart is null or undefined
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải giỏ hàng");
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, []);

  // Handle quantity increase
  const handleIncreaseQuantity = async (productId, currentQuantity) => {
    await updateCartItemQuantity(productId, currentQuantity + 1);
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = async (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      await updateCartItemQuantity(productId, currentQuantity - 1);
    }
  };

  // Update cart item quantity in backend and update state
  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      const response = await fetch(`https://api-doan-9c1f18bfacff.herokuapp.com/cart/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity, productId }),
      });

      console.log({ quantity: newQuantity, productId });

      console.log(response);

      if (!response.ok) {
        throw new Error("Cập nhật số lượng thất bại");
      }

      const updatedData = await response.json();
      fetchUserCart();
      message.success("Cập nhật số lượng thành công");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Lỗi khi cập nhật số lượng");
    }
  };

  // Handle product removal
  const handleRemoveProduct = async (productId) => {
    try {
      const payload = { "productId": productId,
        "abcid": "123"
       };

       const response = await fetch(`https://api-doan-9c1f18bfacff.herokuapp.com/cart/remove`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  productId }),
      });

      console.log(JSON.stringify({  productId }));

      console.log(response);

      if (!response.ok) {
        throw new Error("Xóa sản phẩm thất bại");
      }

      fetchUserCart();
      message.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Lỗi khi xóa sản phẩm");
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => {
      if (item.productId) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingFee = 10000; // Phí vận chuyển cố định
    return subtotal - discountValue + shippingFee;
  };

  // Handle discount code application
  const handleApplyDiscount = () => {
    if (discountCode.trim() === "") {
      message.warning("Vui lòng nhập mã giảm giá!");
      return;
    }

    // Example logic: if code is "DISCOUNT50K", apply 50,000 VND discount
    if (discountCode.trim().toUpperCase() === "DISCOUNT50K") {
      setDiscountValue(50000);
      message.success("Mã giảm giá đã được áp dụng!");
    } else {
      message.error("Mã giảm giá không hợp lệ!");
    }
  };

  // Styles (you can also move these to a separate CSS/SCSS file)
  const styles = {
    container: {
      maxWidth: '1200px',
      background: '#ffffff',
      margin: '2rem auto',
      color: '#333333',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      fontSize: '1.75rem',
      fontWeight: 700,
      marginBottom: '2rem',
      textAlign: 'center',
      color: '#f2405d',
    },
    productItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid #eaeaea',
      flexWrap: 'wrap',
    },
    productImage: {
      width: '120px',
      height: '120px',
      objectFit: 'contain',
      borderRadius: '8px',
      transition: 'transform 0.3s',
      marginRight: '1rem',
    },
    productDetails: {
      flex: 3,
      fontSize: '1.1rem',
      paddingLeft: '1.5rem',
      minWidth: '200px',
    },
    productName: {
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: '#555555',
    },
    productPrice: {
      color: '#f2405d',
      fontSize: '1.1rem',
      marginBottom: '0.5rem',
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    buttonIcon: {
      fontSize: '16px',
    },
    removeButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      backgroundColor: '#ff4d4f',
      border: 'none',
      color: '#ffffff',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginTop: '0.5rem',
    },
    removeButtonHover: {
      backgroundColor: '#d9363e',
    },
    summary: {
      background: '#f9fafb',
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '2rem',
    },
    summaryItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
      fontSize: '1.1rem',
    },
    summaryItemTotal: {
      fontSize: '1.3rem',
      fontWeight: 700,
      color: '#f2405d',
    },
    discountSection: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    discountInput: {
      flex: 1,
      minWidth: '200px',
    },
    applyButton: {
      backgroundColor: '#40a9ff',
      border: 'none',
      color: '#ffffff',
      padding: '0.5rem 1.5rem',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    applyButtonHover: {
      backgroundColor: '#1890ff',
    },
    checkoutButton: {
      width: '100%',
      padding: '1rem',
      background: '#f2405d',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.2rem',
      cursor: 'pointer',
      transition: 'background 0.3s',
    },
    checkoutButtonHover: {
      background: '#d93a4a',
    },
  };

  if (!cart) {
    return (
      <Row style={styles.container} justify="center" align="middle" >
        <Col>
          <h2 style={styles.header}>Đang tải giỏ hàng...</h2>
        </Col>
      </Row>
    );
  }

  return (
    <Row style={styles.container}>
      {/* Inline CSS for customizing Ant Design components */}
      <style jsx>{`
        /* Tùy chỉnh nút Thêm và Giảm */
        .custom-button {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .custom-remove-button:hover {
          background-color: ${styles.removeButtonHover.backgroundColor} !important;
        }

        .custom-apply-button:hover {
          background-color: ${styles.applyButtonHover.backgroundColor} !important;
        }

        .custom-checkout-button:hover {
          background-color: ${styles.checkoutButtonHover.background} !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .product-item {
            flex-direction: column;
            align-items: flex-start;
          }
          .productDetails {
            padding-left: 0;
            margin-top: 1rem;
          }
          .quantity-controls {
            width: 100%;
            justify-content: flex-start;
          }
          .discount-section {
            flex-direction: column;
            align-items: stretch;
          }
          .discount-input {
            margin-right: 0;
            margin-bottom: 1rem;
          }
        }
      `}</style>

      <Col span={24}>
        <h2 style={styles.header}>Giỏ hàng của bạn</h2>
        {cart.items.length === 0 ? (
          <p>Giỏ hàng của bạn đang trống.</p>
        ) : (
          cart.items.map((item) => {
            const product = item.productId;
            return (
              <div key={item._id} style={styles.productItem} className="product-item">
                {product ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={styles.productImage}
                  />
                ) : (
                  <div
                    style={{
                      ...styles.productImage,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f0f0f0',
                      color: '#999999',
                      fontSize: '0.9rem',
                    }}
                  >
                    Hình ảnh không có sẵn
                  </div>
                )}
                <div style={styles.productDetails} className="productDetails">
                  <h3 style={styles.productName}>
                    {product ? product.name : "Sản phẩm không xác định"}
                  </h3>
                  <p style={styles.productPrice}>
                    {item.price.toLocaleString()}đ
                  </p>
                  {product && (
                    <a href={`/products/${product._id}`} target="_blank" rel="noopener noreferrer">
                      Xem chi tiết
                    </a>
                  )}
                </div>
                <div style={{ flex: '1 2 0', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                  <div style={styles.quantityControls} className="quantity-controls">
                    <Button
                      type="default"
                      icon={<MinusOutlined style={styles.buttonIcon} />}
                      onClick={() => handleDecreaseQuantity(product._id, item.quantity)}
                      style={{ borderRadius: '4px' }}
                      aria-label="Giảm số lượng"
                    />
                    <span>{item.quantity}</span>
                    <Button
                      type="default"
                      icon={<PlusOutlined style={styles.buttonIcon} />}
                      onClick={() => handleIncreaseQuantity(product._id, item.quantity)}
                      style={{ borderRadius: '4px' }}
                      aria-label="Tăng số lượng"
                    />
                  </div>
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleRemoveProduct(product._id)}
                    style={styles.removeButton}
                    className="custom-remove-button"
                    aria-label="Xóa sản phẩm"
                  >
                    <DeleteFilled />
                    Xóa
                  </Button>
                </div>
              </div>
            );
          })
        )}
        <Divider />
        <div style={styles.summary}>
          <div style={styles.summaryItem}>
            <h3>Tạm tính</h3>
            <p>{calculateSubtotal().toLocaleString()}đ</p>
          </div>
          <div style={{ ...styles.summaryItem, color: '#f2405d' }}>
            <h3>Khuyến mãi</h3>
            <p>-{discountValue.toLocaleString()}đ</p>
          </div>
          <div style={styles.summaryItem}>
            <h3>Phí vận chuyển</h3>
            <p>10.000đ</p>
          </div>
        </div>
        <div style={{ ...styles.summaryItem, ...styles.summaryItemTotal }}>
          <h3>Tổng tiền</h3>
          <p>{calculateTotal().toLocaleString()}đ</p>
        </div>
        <div style={styles.discountSection} className="discount-section">
          <Input
            placeholder="Nhập mã giảm giá"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            style={styles.discountInput}
            aria-label="Mã giảm giá"
          />
          <Button
            type="primary"
            onClick={handleApplyDiscount}
            style={styles.applyButton}
            className="custom-apply-button"
            aria-label="Áp dụng mã giảm giá"
          >
            Áp dụng
          </Button>
        </div>
        <div>
          <Button
            type="primary"
            style={styles.checkoutButton}
            className="custom-checkout-button"
            aria-label="Thanh toán"
            onClick={() => {
              router.push("/pages/checkout");
            }}
          >
            Thanh toán
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default CartComponent;
