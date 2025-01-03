import React from "react";
import { Col, Avatar, Input, Row, Badge } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import Link from "next/link";

const accountDisplay = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const HeaderState = () => {
  return (
    <>
      <Row style={{ backgroundColor: "#fe0000", padding: 10 }}>
        <Col span={6} style={{ maxHeight: 100 }}>
          <Col span={8} offset={8}>
            <Link href={'/'}>
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              src={
                "https://intphcm.com/data/upload/logo-dep-shell.jpg"
              }
            />
            </Link>
          </Col>
        </Col>
        <Col
          span={12}
          style={{
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
            variant="borderless"
            addonBefore={<SearchOutlined style={{ backgroundColor: "#fff" }} />}
            placeholder="SEARCH"
            addonAfter={<FilterOutlined style={{ backgroundColor: "#fff" }} />}
          />
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
              <Link href={`/pages/personal`}>
              <span style={{ color: "#fff", fontWeight: "bold" }}>
                Tài khoản
              </span>
              </Link>
            </Row>
          </Col>
        </Col>
      </Row>
    </>
  );
};
export default HeaderState;
