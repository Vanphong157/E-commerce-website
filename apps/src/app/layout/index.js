"use client";
import { Layout } from "antd";
import Header from "./header";
import FooterState from "./footer";

export default function DashboardLayout({ children }) {
  console.log("hello");

  return (
    <Layout>
      <Header />
      <div style={{ margin: 10 }}>{children}</div>
      <FooterState />
    </Layout>
  );
}
