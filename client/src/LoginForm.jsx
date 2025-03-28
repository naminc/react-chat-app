
import React, { useState } from "react";
import axios from "axios";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://react-chat-app-1-bz2b.onrender.com/api/login", { username, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      onLogin(res.data);
    } catch (err) {
      alert("Sai thông tin đăng nhập");
    }
  };

  return (
  <div className="login-container">
    <div className="login-box">
      <h2>Đăng nhập</h2>
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Đăng nhập</button>
  </div>
</div>

  );
}

export default LoginForm;
