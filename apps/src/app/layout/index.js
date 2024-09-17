"use client";
import { Layout } from "antd";
import Header from "./header";
import FooterState from "./footer";

export default function DashboardLayout({ children }) {
  console.log("hello");

  return (
    <Layout>
      <Header />
      <div style={{ margin: 10, backgroundColor: "#fff" }}>{children}</div>
      <FooterState />
    </Layout>
  );
}
