import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect to socket server
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        withCredentials: true,
      });

      setSocket(newSocket);

      // Listen for events and show notifications
      newSocket.on('newFarmer', (data) => {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      });

      newSocket.on('newActivity', (data) => {
        toast.info(data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      });

      newSocket.on('newCollection', (data) => {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);