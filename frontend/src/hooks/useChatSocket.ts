import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// Global singleton socket per userId so all components share the same connection
const globalSockets: Map<string, Socket> = new Map();
const globalListeners: Map<string, Set<(data: any) => void>> = new Map();

export const useChatSocket = (userId: string | undefined, userType: 'visitor' | 'vendor') => {
  const [connected, setConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userIdRef = useRef(userId);
  const userTypeRef = useRef(userType);

  useEffect(() => {
    userIdRef.current = userId;
    userTypeRef.current = userType;
  }, [userId, userType]);

  useEffect(() => {
    if (!userId) return;

    // Reuse existing socket if already connected for this user
    let socket = globalSockets.get(userId);

    if (!socket || !socket.connected) {
      console.log('useChatSocket: Creating new socket for', { userId, userType });

      if (socket) {
        socket.disconnect();
      }

      socket = io(`${SOCKET_URL}/chat`, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
      });

      globalSockets.set(userId, socket);

      socket.on('connect', () => {
        console.log('Socket connected:', socket!.id, 'for user:', userId, userType);
        socket!.emit('register', { userId, userType }, (response: any) => {
          console.log('Registration complete:', response);
          if (response?.success) {
            setUnreadCount(response.unreadCount || 0);
          }
          setConnected(true);
        });
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected for user:', userId);
        setConnected(false);
      });

      socket.on('unreadCount', (data: { count: number }) => {
        console.log('Received unreadCount update:', data, 'for user:', userId);
        setUnreadCount(data.count);
      });

      socket.on('newMessage', (data: any) => {
        const listeners = globalListeners.get(userId) || new Set();
        listeners.forEach(cb => cb(data));
      });
    } else {
      // Socket already exists and connected - just update state
      console.log('useChatSocket: Reusing existing socket for', userId);
      setConnected(socket.connected);
    }

    // Sync unreadCount from socket's current state when component mounts
    if (socket.connected) {
      socket.emit('getUnreadCount', { userId, userType }, (response: any) => {
        if (response?.success) setUnreadCount(response.count);
      });
    }

    return () => {
      // Don't disconnect - keep singleton alive. Other components may still use it.
    };
  }, [userId, userType]);

  // Re-sync connected state if socket already exists
  useEffect(() => {
    if (!userId) return;
    const socket = globalSockets.get(userId);
    if (socket?.connected && !connected) {
      setConnected(true);
    }
  });

  const sendMessage = useCallback((data: {
    chatId: string;
    content: string;
    senderId: string;
    senderType: 'visitor' | 'vendor';
  }) => {
    return new Promise((resolve, reject) => {
      const socket = globalSockets.get(userIdRef.current || '');
      if (socket?.connected) {
        socket.emit('sendMessage', data, (response: any) => {
          if (response.success) resolve(response.message);
          else reject(new Error(response.error));
        });
      } else {
        reject(new Error('Socket not connected'));
      }
    });
  }, []);

  const joinChat = useCallback((chatId: string) => {
    const socket = globalSockets.get(userIdRef.current || '');
    if (socket?.connected) {
      console.log('Joining chat room:', chatId);
      socket.emit('joinChat', { chatId, userId: userIdRef.current });
    }
  }, []);

  const leaveChat = useCallback((chatId: string) => {
    const socket = globalSockets.get(userIdRef.current || '');
    if (socket?.connected) {
      socket.emit('leaveChat', { chatId });
    }
  }, []);

  const markAsRead = useCallback((chatId: string) => {
    const socket = globalSockets.get(userIdRef.current || '');
    const uid = userIdRef.current;
    const utype = userTypeRef.current;
    if (socket?.connected && uid) {
      socket.emit('markAsRead', { chatId, userId: uid, userType: utype }, (response: any) => {
        console.log('Mark as read response:', response);
      });
    }
  }, []);

  const onNewMessage = useCallback((callback: (data: any) => void) => {
    const uid = userIdRef.current;
    if (!uid) return;
    if (!globalListeners.has(uid)) {
      globalListeners.set(uid, new Set());
    }
    globalListeners.get(uid)!.add(callback);
    return () => {
      globalListeners.get(uid)?.delete(callback);
    };
  }, []);

  return {
    connected,
    unreadCount,
    sendMessage,
    joinChat,
    leaveChat,
    markAsRead,
    onNewMessage,
  };
};
