"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Tag,
  Select,
  Image,
  InputNumber,
} from "antd";

const { Option } = Select;

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách phiếu giảm giá
  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(
        "https://api-doan-9c1f18bfacff.herokuapp.com/discount"
      );
      setDiscounts(response.data.data);
    } catch (error) {
      message.error("Không thể tải danh sách phiếu giảm giá");
    }
  };
  console.log(discounts);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingProduct) {
        await axios.post(
          `https://api-doan-9c1f18bfacff.herokuapp.com/discount/${editingProduct._id}/update`,
          values
        );
        message.success("Cập nhật phiếu giảm giá thành công");
      } else {
        await axios.post(
          "https://api-doan-9c1f18bfacff.herokuapp.com/discount/create",
          values
        );
        message.success("Thêm phiếu giảm giá thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchDiscounts();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  // Xử lý xóa phiếu giảm giá
  const handleDelete = async (productId) => {
    try {
      await axios.post(
        `https://api-doan-9c1f18bfacff.herokuapp.com/discount/${productId}/delete`
      );
      message.success("Xóa phiếu giảm giá thành công");
      fetchDiscounts();
    } catch (error) {
      message.error("Không thể xóa phiếu giảm giá");
    }
  };
  const columns = [
    {
      title: "Tên phiếu giảm giá",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (amount) => `${amount}%`,
    },
    {
      title: "Số lượng",
      dataIndex: "usageLimit",
      key: "usageLimit",
      render: (count) => `${count} phiếu`,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => {
        const colors = {
          true: "green",
          false: "red",
        };
        return (
          <Tag color={colors[isActive]}>{isActive ? "Active" : "InActive"}</Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditingProduct(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Button
          type="primary"
          onClick={() => {
            setEditingProduct(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm phiếu giảm giá mới
        </Button>
      </div>
      <Table columns={columns} dataSource={discounts} />
      <Modal
        title={
          editingProduct ? "Sửa phiếu giảm giá" : "Thêm phiếu giảm giá mới"
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const payload = {
              ...values,
              isActive: values.isActive === "true", // Chuyển đổi trạng thái thành boolean
            };
            handleSubmit(payload);
          }}
        >
          {/* Mã giảm giá */}
          <Form.Item
            name="code"
            label="Mã phiếu giảm giá"
            rules={[
              { required: true, message: "Vui lòng nhập mã phiếu giảm giá" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Mô tả */}
          <Form.Item
            name="description"
            label="Mô tả phiếu giảm giá"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả phiếu giảm giá" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          {/* Số tiền giảm */}
          <Form.Item
            name="discountAmount"
            label="Phần trăm hoặc số tiền giảm"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập phần trăm hoặc số tiền giảm",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          {/* Loại giảm giá */}
          <Form.Item
            name="discountType"
            label="Loại giảm giá"
            rules={[{ required: true, message: "Vui lòng chọn loại giảm giá" }]}
          >
            <Select>
              <Option value="percentage">Phần trăm</Option>
              <Option value="fixed">Số tiền cố định</Option>
            </Select>
          </Form.Item>

          {/* Ngày bắt đầu */}
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
          >
            <Input type="date" />
          </Form.Item>

          {/* Ngày kết thúc */}
          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
          >
            <Input type="date" />
          </Form.Item>

          {/* Số lượng phiếu */}
          <Form.Item
            name="usageLimit"
            label="Số lượng phiếu giảm giá"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số lượng phiếu giảm giá",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Số tiền tối thiểu để áp dụng */}
          <Form.Item
            name="minOrderAmount"
            label="Số tiền tối thiểu áp dụng"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số tiền tối thiểu áp dụng",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Trạng thái */}
          <Form.Item
            name="isActive"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Option value="true">Kích hoạt</Option>
              <Option value="false">Vô hiệu hóa</Option>
            </Select>
          </Form.Item>

          {/* Nút hành động */}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingProduct ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiscountManagement;
