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
  Select,
  Image,
} from "antd";

const { Option } = Select;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategories, setEditingCategories] = useState(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://api-doan-9c1f18bfacff.herokuapp.com/categories"
      );
      setCategories(response.data.data);
    } catch (error) {
      message.error("Không thể tải danh sách danh mục");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingCategories) {
        await axios.post(
          `https://api-doan-9c1f18bfacff.herokuapp.com/categories/${editingCategories._id}/update`,
          values
        );
        message.success("Cập nhật danh mục thành công");
      } else {
        await axios.post(
          "https://api-doan-9c1f18bfacff.herokuapp.com/categories/create",
          values
        );
        message.success("Thêm danh mục thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  // Xử lý xóa danh mục
  const handleDelete = async (CategoriesId) => {
    try {
      await axios.post(
        `https://api-doan-9c1f18bfacff.herokuapp.com/categories/${CategoriesId}/delete`
      );
      message.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (error) {
      message.error("Không thể xóa danh mục");
    }
  };
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => {
        return <Image src={image} width={50} alt="Hình ảnh" />;
      },
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditingCategories(record);
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
            setEditingCategories(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm danh mục mới
        </Button>
      </div>
      <Table columns={columns} dataSource={categories} />
      <Modal
        title={editingCategories ? "Sửa danh mục" : "Thêm danh mục mới"}
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
            };
            handleSubmit(payload);
          }}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả danh mục"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả danh mục" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="image"
            label="URL Hình ảnh (Chỉ nhập một URL)"
            rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCategories ? "Cập nhật" : "Thêm mới"}
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
export default CategoryManagement;
