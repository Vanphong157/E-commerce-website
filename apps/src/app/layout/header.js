import React, { useState } from "react";
import { Col, Avatar, Input, Row, Badge, List, message, Spin } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";

const accountDisplay = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const HeaderState = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const isAuthed = localStorage.getItem("token");

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api-doan-9c1f18bfacff.herokuapp.com/product/search",
        { keyword: value }
      );
      console.log(response.data.data.products);

      setSearchResults(response.data.data.products || []); // Giả sử API trả về mảng sản phẩm trong `data`
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      message.error("Không thể tìm kiếm sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    handleSearch(value); // Gọi API khi người dùng nhập hoặc thay đổi từ khóa
  };

  return (
    <>
      <Row style={{ backgroundColor: "#fe0000", padding: 10 }}>
        <Col span={6} style={{ maxHeight: 100 }}>
          <Col span={8} offset={8}>
            <Link href={"/"}>
              <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                src={"https://intphcm.com/data/upload/logo-dep-shell.jpg"}
              />
            </Link>
          </Col>
        </Col>
        <Col
          span={12}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Input
            style={{
              backgroundColor: "#fff",
              padding: 4,
              borderRadius: 10,
            }}
            addonBefore={<SearchOutlined style={{ backgroundColor: "#fff" }} />}
            placeholder="SEARCH"
            addonAfter={<FilterOutlined style={{ backgroundColor: "#fff" }} />}
            value={searchKeyword}
            onChange={handleInputChange}
          />
          {searchKeyword && (
            <div
              style={{
                position: "absolute",
                top: "80%",
                left: 0,
                width: "100%",
                backgroundColor: "#fff",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {loading ? (
                <Spin tip="Đang tìm kiếm..." style={{ margin: 10 }} />
              ) : searchResults.length > 0 ? (
                <List
                  size="small"
                  dataSource={searchResults}
                  renderItem={(item) => (
                    <List.Item>
                      <Link
                        href={`/pages/product/${item._id}`}
                        style={{ width: "100%" }}
                      >
                        <Row>
                          <Col span={8}>
                            {/* Lấy ảnh đầu tiên từ mảng `images` */}
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt="Hình ảnh"
                                width={100}
                                height={100}
                                style={{ objectFit: "cover", borderRadius: 5 }}
                              />
                            ) : (
                              <span>Không có ảnh</span>
                            )}
                          </Col>
                          <Col span={12}>
                            <span>{item.name}</span>
                          </Col>
                          <Col span={4}>
                            <span>{item.price?.toLocaleString()} VNĐ</span>
                          </Col>
                        </Row>
                      </Link>
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ padding: 10 }}>Không tìm thấy sản phẩm</div>
              )}
            </div>
          )}
        </Col>
        <Col span={6} style={accountDisplay}>
          <Col
            span={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Row>
              <Avatar
                src={
                  "https://png.pngtree.com/element_our/20190531/ourmid/pngtree-shopping-cart-convenient-icon-image_1287807.jpg"
                }
              />
            </Row>
            <Row>
              <Link href={`/pages/cart`}>
                <span style={{ color: "#fff", fontWeight: "bold" }}>
                  Giỏ hàng
                </span>
              </Link>
            </Row>
          </Col>
          <Col
            span={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Row>
              <Badge count={100}>
                <Avatar
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfwfzTPVw45cJcHNUp3sWUWLOkYAfQlAEBOQ&s"
                  }
                />
              </Badge>
            </Row>
            <Row>
              {isAuthed ? (
                <Link href={`/pages/personal`}>
                  <span style={{ color: "#fff", fontWeight: "bold" }}>
                    Tài khoản
                  </span>
                </Link>
              ) : (
                <Link href={`/pages/signin`}>
                  <span style={{ color: "#fff", fontWeight: "bold" }}>
                    Đăng nhập
                  </span>
                </Link>
              )}
            </Row>
          </Col>
        </Col>
      </Row>
    </>
  );
};

export default HeaderState;
