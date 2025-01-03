"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Tag, Button, message, Space, Modal, Select, Spin } from "antd";

const { Option } = Select;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch danh sách đơn hàng và thông tin khách hàng
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api-doan-9c1f18bfacff.herokuapp.com/orders"
      );
      const orders = response.data.orders;

      const userIds = [...new Set(orders.map((order) => order.userId))];
      const userResponses = await Promise.all(
        userIds.map((id) =>
          axios.get(`https://api-doan-9c1f18bfacff.herokuapp.com/user/${id}`)
        )
      );

      const usersMap = {};
      userResponses.forEach((res) => {
        const user = res.data.user;
        usersMap[user._id] = user;
      });

      setOrders(
        orders.map((order) => ({ ...order, user: usersMap[order.userId] }))
      );
    } catch (error) {
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch chi tiết sản phẩm trong đơn hàng
  const fetchOrderDetails = async (order) => {
    try {
      setModalLoading(true);
      const productResponses = await Promise.all(
        order.items.map((item) =>
          axios.get(
            `https://api-doan-9c1f18bfacff.herokuapp.com/product/${item.productId}`
          )
        )
      );

      const itemsWithDetails = order.items.map((item, index) => ({
        ...item,
        product: productResponses[index].data.data.name,
      }));

      setSelectedOrder({ ...order, items: itemsWithDetails });
    } catch (error) {
      message.error("Không thể tải chi tiết sản phẩm");
    } finally {
      setModalLoading(false);
      setIsModalVisible(true);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.post(
        `https://api-doan-9c1f18bfacff.herokuapp.com/orders/${orderId}/update`,
        { status: newStatus }
      );
      message.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (error) {
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <span>#{id.slice(-6).toUpperCase()}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      key: "user",
      render: (user) => <span>{user?.name || "Không xác định"}</span>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total) => `${total?.toLocaleString()} VNĐ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          pending: "gold",
          delivered: "cyan",
          shipped: "green",
          cancelled: "red",
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => fetchOrderDetails(record)}>Chi tiết</Button>
          <Select
            value={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleUpdateStatus(record._id, value)}
          >
            <Option value="pending">Chờ xử lý</Option>
            <Option value="delivered">Đang giao</Option>
            <Option value="shipped">Hoàn thành</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý đơn hàng</h2>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?._id
          ?.slice(-6)
          .toUpperCase()}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {modalLoading ? (
          <Spin />
        ) : (
          selectedOrder && (
            <div>
              <h3>Thông tin khách hàng</h3>
              <p>Tên: {selectedOrder.user?.name}</p>
              <p>Email: {selectedOrder.user?.email}</p>
              <p>Số điện thoại: {selectedOrder.user?.phone}</p>

              <h3>Địa chỉ giao hàng</h3>
              <p>Tỉnh/Thành phố: {selectedOrder.shippingAddress?.province}</p>
              <p>Phường/Xã: {selectedOrder.shippingAddress?.ward}</p>
              <p>Chi tiết: {selectedOrder.shippingAddress?.addressDetail}</p>

              <h3>Sản phẩm</h3>
              <Table
                dataSource={selectedOrder.items}
                columns={[
                  {
                    title: "Tên sản phẩm",
                    dataIndex: "product",
                    key: "product",
                    render: (product) => product || "Không xác định",
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                  {
                    title: "Đơn giá",
                    dataIndex: "price",
                    key: "price",
                    render: (price) => `${price?.toLocaleString()} VNĐ`,
                  },
                  {
                    title: "Thành tiền",
                    key: "total",
                    render: (_, record) =>
                      `${(
                        record.price * record.quantity
                      ).toLocaleString()} VNĐ`,
                  },
                ]}
                pagination={false}
              />
              <div style={{ marginTop: 20, textAlign: "right" }}>
                <h3>
                  Tổng cộng: {selectedOrder.totalPrice?.toLocaleString()} VNĐ
                </h3>
              </div>
            </div>
          )
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;
