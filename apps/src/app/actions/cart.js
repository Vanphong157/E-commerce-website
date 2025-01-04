const baseURL = "https://api-doan-9c1f18bfacff.herokuapp.com";

export const addItemToCart = async (productId) => {

    const token = localStorage.getItem("token");
  const response = await fetch(`${baseURL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    throw new Error("Không thể thêm sản phẩm vào giỏ hàng");
  }

  return await response.json();
};

export const removeItemFromCart = async (productId) => {
    const token = localStorage.getItem("token");
  const response = await fetch(`${baseURL}/cart/remove`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) {
    throw new Error("Không thể xóa sản phẩm khỏi giỏ hàng");
  }

  return await response.json();
};

export const fetchCart = async () => {
    const token = localStorage.getItem("token");
  const response = await fetch(`${baseURL}/cart`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Không thể tải giỏ hàng");
  }

  console.log(response.json());

  return await response.json();
};
