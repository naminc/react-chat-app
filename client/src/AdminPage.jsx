// AdminPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "", avatar: "" });

  const fetchUsers = async () => {
    const res = await axios.get("https://react-chat-app-1-bz2b.onrender.com/api/users");
    setUsers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("https://react-chat-app-1-bz2b.onrender.com/api/users", form);
    setForm({ username: "", password: "", avatar: "" });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: 600, alignItems: "center" }}>
        <h2>Quản lý người dùng</h2>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="Tên người dùng"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="URL Avatar"
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          />
          <select
            value={form.role || "user"}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "10px" }}
         >
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị</option>
        </select>
          <button type="submit">Thêm người dùng</button>
        </form>

        <h3 style={{ marginTop: "30px" }}>Danh sách người dùng</h3>
        <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                background: "#eee",
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={user.avatar}
                alt="avatar"
                style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 10 }}
              />
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;
