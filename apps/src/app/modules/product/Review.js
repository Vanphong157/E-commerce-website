import React, { useState } from 'react';
import { LikeOutlined } from '@ant-design/icons';
import { Col, Divider, Rate, Row, Modal, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useAuth } from '@/app/contexts/AuthContext';

// Tooltips cho đánh giá bằng sao
const desc = ['Rất tệ', 'Tệ', 'Tạm ổn', 'Tốt', 'Rất tốt'];

/**
 * @param {Array} reviews - Mảng các đối tượng review 
 * @param {String} productName - Tên sản phẩm (ví dụ: "Điện thoại iPhone 16 Pro Max 256GB")
 * @param {String} productId - ID sản phẩm (nếu có nhu cầu xử lý thêm)
 */
const Review = ({ reviews = [], productName = 'Tên sản phẩm', productId }) => {
  // State cho Modal viết đánh giá
  const [txtValue, setTxtValue] = useState('');
  const [value, setValue] = useState(3);           // Rating mặc định
  const [open, setOpen] = useState(false);         // Điều khiển mở/tắt Modal
  const [confirmLoading, setConfirmLoading] = useState(false); // Loading khi gửi đánh giá

  // Lấy thông tin user từ context (AuthContext)
  const { user } = useAuth();

  // Mở Modal
  const showModal = () => {
    setOpen(true);
  };

  // Hàm gọi API để gửi review lên server
  const postReview = async () => {
    // Nếu chưa có user (chưa đăng nhập), có thể xử lý chặn tại đây
    if (!user || !user._id) {
      console.error('Bạn cần đăng nhập để gửi đánh giá!');
      return;
    }

    // Payload gửi lên server
    // Ở đây backend đang mong đợi: 
    //   { reviews: { user: string, rating: number, comment: string } }
    // Hoặc tuỳ chỉnh cấu trúc theo đúng API của bạn.
    const data = {
      reviews: {
        user: user._id,
        rating: value,
        comment: txtValue,
      },
    };

    try {
      // Sửa URL cho đúng (thêm / trước ${productId})
      const response = await fetch(
        `https://api-doan-9c1f18bfacff.herokuapp.com/product/${productId}/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Truyền dữ liệu dạng JSON
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log('Kết quả postReview:', result);

      // Sau khi post thành công, bạn có thể gọi thêm
      // hàm reload dữ liệu hoặc update state để hiển thị
      // review mới nhất ngay lập tức.

    } catch (error) {
      console.error('Lỗi khi postReview:', error);
    }
  };

  // Xử lý khi nhấn OK trong Modal
  const handleOk = async () => {
    setConfirmLoading(true);
    // Thực hiện gọi API postReview 
    await postReview();

    // Giả lập xong, đóng modal, tắt loading
    setOpen(false);
    setConfirmLoading(false);
  };

  // Đóng Modal
  const handleCancel = () => {
    setOpen(false);
  };

  // Tính trung bình rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <Row
      style={{
        marginTop: '10px',
        borderRadius: '8px',
        background: 'white',
        color: 'black',
        paddingBottom: '20px',
      }}
    >
      <Col style={{ padding: '10px', width: '100%' }}>
        {/* Tên sản phẩm */}
        <h2 style={{ fontSize: '16px', fontWeight: '700', padding: '10px' }}>
          Đánh giá {productName}
        </h2>

        {/* Thông tin tổng quan: Trung bình sao, tổng số đánh giá */}
        <span
          style={{
            fontSize: '26px',
            fontWeight: '700',
            margin: '0 10px',
            color: '#ff9f00',
          }}
        >
          {averageRating}{' '}
        </span>
        <Rate style={{ color: '#ff9f00' }} value={Number(averageRating)} disabled />
        <span style={{ marginLeft: '10px', color: '#0071e3' }}>
          {reviews.length} đánh giá
        </span>

        {/* Vòng lặp hiển thị từng review */}
        {reviews.map((review) => (
          <div key={review._id} style={{ width: '100%', marginLeft: '10px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>
              {/* Hiển thị user: Tuỳ theo backend trả về */}
              Người dùng {review.user?.slice(-4) || ''}
            </h3>

            {/* Rating */}
            <Rate style={{ fontSize: '14px' }} value={review.rating} disabled />

            {/* Nội dung bình luận */}
            <h4 style={{ padding: '10px', fontWeight: 400 }}>{review.comment}</h4>

            {/* Nếu muốn hiển thị ảnh đính kèm, bạn có thể bổ sung review.images... */}
            <div>
              {/* Nút like minh hoạ */}
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <LikeOutlined />
              </button>
              <span style={{ marginLeft: '10px' }}>Hữu ích</span>
              <Divider type="vertical" />
              {/* Hiển thị thời gian - tuỳ chỉnh format */}
              <span style={{ fontSize: '12px', color: '#8f9bb3' }}>
                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <Divider />
          </div>
        ))}

        {/* Khu vực nút xem thêm và nút mở Modal viết đánh giá */}
        <div style={{ display: 'flex', flex: '1', marginTop: '10px' }}>
          <button
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              alignItems: 'center',
              textAlign: 'center',
              padding: '10px',
              background: 'transparent',
              height: '50px',
              borderRadius: '4px',
              color: '#000',
              marginRight: '5px',
              border: '1px solid #000',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            className="hoverable"
          >
            <span
              style={{
                display: 'block',
                textAlign: 'center',
                fontSize: '15px',
                fontWeight: '500',
                lineHeight: '15px',
              }}
            >
              Xem tất cả {reviews.length} đánh giá
            </span>
          </button>

          <button
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              alignItems: 'center',
              textAlign: 'center',
              padding: '10px',
              background: '#0071e3',
              height: '50px',
              borderRadius: '4px',
              color: '#fff',
              marginRight: '5px',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            className="hoverable"
            onClick={showModal}
          >
            <span
              style={{
                display: 'block',
                textAlign: 'center',
                fontSize: '15px',
                fontWeight: '500',
                lineHeight: '15px',
              }}
            >
              Viết đánh giá
            </span>
          </button>
        </div>

        {/* Modal viết đánh giá */}
        <Modal
          style={{ textAlign: 'center', fontWeight: '700' }}
          title="Đánh giá sản phẩm"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          width={600}
        >
          <div>
            {/* Ảnh sản phẩm - tuỳ chỉnh hoặc bạn có thể truyền qua props */}
            <img
              src="https://cdn.tgdd.vn/Products/Images/1922/235089/cao-tan-cuckoo-crp-hus1000f-150923-102634-600x600.jpg"
              style={{ maxWidth: '100px', margin: '0 auto' }}
              alt="Product"
            />
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>
            {productName}
          </h2>

          {/* Rate với tooltip */}
          <div style={{ marginBottom: '20px' }}>
            <Rate
              tooltips={desc}
              onChange={setValue}
              value={value}
              style={{ fontSize: '3rem' }}
            />
            {value ? (
              <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                {desc[value - 1]}
              </span>
            ) : null}
          </div>

          {/* TextArea chia sẻ cảm nhận */}
          <TextArea
            value={txtValue}
            placeholder="Mời bạn chia sẻ thêm cảm nhận..."
            onChange={(e) => setTxtValue(e.target.value)}
            autoSize={{
              minRows: 4,
              maxRows: 5,
            }}
          />

          {/* Nhập tên & số điện thoại (nếu muốn) */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Input placeholder="Nhập tên" />
            <Input placeholder="Nhập số điện thoại" />
          </div>
        </Modal>
      </Col>
    </Row>
  );
};

export default Review;
