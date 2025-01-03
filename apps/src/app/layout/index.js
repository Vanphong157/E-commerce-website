"use client";
import { Layout } from "antd";
import Header from "./header";
import FooterState from "./footer";
import { AuthProvider } from "../contexts/AuthContext";

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <Layout>
        <Header />
        <div style={{ margin: "10px auto", width: "1200px" }}>{children}</div>
        <FooterState />
      </Layout>
    </AuthProvider>
  );
}
