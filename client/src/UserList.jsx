
import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList({ currentUserId, onSelectUser }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("https://react-chat-app-1-bz2b.onrender.com/api/users").then((res) => {
      setUsers(res.data.filter((u) => u.id !== currentUserId));
    });
  }, [currentUserId]);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id} onClick={() => onSelectUser(user)} style={{ display: "flex", alignItems: "center", cursor: "pointer", marginBottom: 8 }}>
          <img src={user.avatar} alt="avatar" style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 8 }} />
          <span>{user.username}</span>
        </div>
      ))}
    </div>
  );
}

export default UserList;
