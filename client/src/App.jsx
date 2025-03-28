import React, { useState } from "react";
import LoginForm from "./LoginForm";
import ChatForm from "./ChatForm";
import AdminPage from "./AdminPage";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  if (window.location.pathname === "https://react-chat-app-1-bz2b.onrender.com/admin") {
    const saved = localStorage.getItem("user");
    const user = saved ? JSON.parse(saved) : null;
  
    if (!user || user.role !== "admin") {
      // ✅ Redirect về trang chủ nếu không phải admin
      window.location.href = "/";
      return null;
    }
  
    return <AdminPage />;
  }
  return <div>{user ? <ChatForm user={user} /> : <LoginForm onLogin={setUser} />}</div>;
}

export default App;
