import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socketUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? "http://localhost:5000"
        : "https://anything-os6i.onrender.com";
        
      const newSocket = io(socketUrl, {
        query: { userId: user._id },
      });
      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
  );
};
