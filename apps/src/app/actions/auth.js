// authActions.js
const baseURL = "https://api-doan-9c1f18bfacff.herokuapp.com";

export const fetchUser = async (token) => {
  const response = await fetch(`${baseURL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Không thể lấy thông tin người dùng");
  }

  const data = await response.json();
  return data.user;
};

export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${baseURL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });


  if (!response.ok) {
    throw new Error("Đăng nhập không thành công");
  }

  const data = await response.json();
  console.log(data.token);
  return data;
};

export const registerUser = async (userInfo) => {
  const response = await fetch(`${baseURL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  });

  if (!response.ok) {
    throw new Error("Đăng ký không thành công");
  }

  const data = await response.json();
  return data; // Trả về cả `user` và `token`
};
