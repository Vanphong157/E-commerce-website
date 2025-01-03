"use client";

import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  OrderedListOutlined,
  LogoutOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Content, Sider } = Layout;

const AdminLayout = ({ children }) => {
  const roleUser = localStorage.getItem("role");

  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (roleUser !== "admin") {
    router.push("/");
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} style={{ background: "#fff" }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link href="/pages/admin">Quản lý sản phẩm</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link href="/pages/admin/discounts">Quản lý khuyến mãi</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<OrderedListOutlined />}>
            <Link href="/pages/admin/categories">Quản lý danh mục</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<InboxOutlined />}>
            <Link href="/pages/admin/orders">Quản lý đơn hàng</Link>
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: "#ff4d4f" }}
          >
            Đăng xuất
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: "24px" }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: "#fff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
