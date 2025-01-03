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
  InputNumber,
} from "antd";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://api-doan-9c1f18bfacff.herokuapp.com/product"
      );
      setProducts(response.data.data);
    } catch (error) {
      message.error("Không thể tải danh sách sản phẩm");
    }
  };

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
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingProduct) {
        await axios.post(
          `https://api-doan-9c1f18bfacff.herokuapp.com/product/${editingProduct._id}/update`,
          values
        );
        message.success("Cập nhật sản phẩm thành công");
      } else {
        await axios.post(
          "https://api-doan-9c1f18bfacff.herokuapp.com/product/create",
          values
        );
        message.success("Thêm sản phẩm thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  // Xử lý xóa sản phẩm
  const handleDelete = async (productId) => {
    try {
      await axios.post(
        `https://api-doan-9c1f18bfacff.herokuapp.com/product/${productId}/delete`
      );
      message.success("Xóa sản phẩm thành công");
      fetchProducts();
    } catch (error) {
      message.error("Không thể xóa sản phẩm");
    }
  };
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (_, record) => {
        const firstImage =
          record.images && record.images.length > 0 ? record.images[0] : null;
        return firstImage ? (
          <Image src={firstImage} width={50} alt="Hình ảnh" />
        ) : (
          <span>Không có ảnh</span>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Giá gốc",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} VNĐ`,
    },
    {
      title: "Số lượng trong kho",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
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
          Thêm sản phẩm mới
        </Button>
      </div>
      <Table columns={columns} dataSource={products} />
      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
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
              images: values.images ? values.images : [],
            };
            handleSubmit(payload);
          }}
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả sản phẩm"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả sản phẩm" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng nhập danh mục" }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="brand"
            label="Thương hiệu"
            rules={[{ required: true, message: "Vui lòng nhập thương hiệu" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá gốc"
            rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="salePrice"
            label="Giá khuyến mãi"
            rules={[
              { required: true, message: "Vui lòng nhập giá khuyến mãi" },
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

          <Form.Item
            name="stockQuantity"
            label="Số lượng trong kho"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng trong kho" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="images"
            label="URL Hình ảnh (Chỉ nhập một URL)"
            rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh" }]}
          >
            <Input />
          </Form.Item>

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

export default AdminDashboard;
