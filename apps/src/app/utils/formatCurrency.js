const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0, // Không hiển thị phần thập phân
        maximumFractionDigits: 0, // Không hiển thị phần thập phân
      });
}

export default formatCurrency;

const calculateDiscountPercentage = (price, retailPrice) => {
    if (!retailPrice || retailPrice === 0) return 0;
    const discount = ((retailPrice - price) / retailPrice) * 100;
    return Math.round(discount); // Làm tròn số thập phân
  };

  export { calculateDiscountPercentage };