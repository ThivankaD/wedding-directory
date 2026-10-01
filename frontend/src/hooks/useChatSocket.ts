import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const getSocketUrl = (): string => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, '');
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  const gql = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (gql) {
    try {
      const url = new URL(gql);
      return `${url.protocol}//${url.host}`;
    } catch {
      return gql.replace(/\/graphql\/?$/, '').replace(/\/+$/, '');
    }
  }
  return 'http://localhost:4000';
};

const SOCKET_URL = getSocketUrl();

// Global singleton socket per userId so all components share the same connection
const globalSockets: Map<string, Socket> = new Map();
const globalMessageListeners: Map<string, Set<(data: any) => void>> = new Map();
const globalUnreadListeners: Map<string, Set<(count: number) => void>> = new Map();
const globalStatusListeners: Map<string, Set<(connected: boolean) => void>> = new Map();
const globalUnreadCounts: Map<string, number> = new Map();
const globalConnectedStatus: Map<string, boolean> = new Map();

function getOrCreateSocket(userId: string, getUserType: () => 'visitor' | 'vendor'): Socket {
  let socket = globalSockets.get(userId);

  if (!socket) {
    socket = io(`${SOCKET_URL}/chat`, {
      transports: ['polling', 'websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
    });

    globalSockets.set(userId, socket);

    socket.on('connect', () => {
      console.log('Socket connected:', socket!.id, 'for user:', userId);
      globalConnectedStatus.set(userId, true);
      globalStatusListeners.get(userId)?.forEach((cb) => cb(true));

      socket!.emit('register', { userId, userType: getUserType() }, (response: any) => {
        if (response?.success && typeof response.unreadCount === 'number') {
          globalUnreadCounts.set(userId, response.unreadCount);
          globalUnreadListeners.get(userId)?.forEach((cb) => cb(response.unreadCount));
        }
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected for user:', userId, reason);
      globalConnectedStatus.set(userId, false);
      globalStatusListeners.get(userId)?.forEach((cb) => cb(false));
    });

    socket.on('connect_error', (err: any) => {
      // Log as warning rather than error to avoid polluting console during transient auto-reconnections
      console.warn('Chat socket connection retry for user:', userId, err?.message || err);
    });

    socket.on('unreadCount', (data: { count: number }) => {
      if (typeof data?.count === 'number') {
        globalUnreadCounts.set(userId, data.count);
        globalUnreadListeners.get(userId)?.forEach((cb) => cb(data.count));
      }
    });

    socket.on('newMessage', (data: any) => {
      const listeners = globalMessageListeners.get(userId);
      if (listeners) {
        listeners.forEach((cb) => cb(data));
      }
    });
  } else if (socket.disconnected && !socket.active) {
    socket.connect();
  }

  return socket;
}

export const useChatSocket = (userId: string | undefined, userType: 'visitor' | 'vendor') => {
  const [connected, setConnected] = useState<boolean>(() => {
    return userId ? !!globalConnectedStatus.get(userId) : false;
  });
  const [unreadCount, setUnreadCount] = useState<number>(() => {
    return userId ? globalUnreadCounts.get(userId) || 0 : 0;
  });

  const userIdRef = useRef(userId);
  const userTypeRef = useRef(userType);

  useEffect(() => {
    userIdRef.current = userId;
    userTypeRef.current = userType;
  }, [userId, userType]);

  useEffect(() => {
    if (!userId) {
      setConnected(false);
      setUnreadCount(0);
      return;
    }

    // Initialize subscriber sets if needed
    if (!globalStatusListeners.has(userId)) {
      globalStatusListeners.set(userId, new Set());
    }
    if (!globalUnreadListeners.has(userId)) {
      globalUnreadListeners.set(userId, new Set());
    }

    const statusListeners = globalStatusListeners.get(userId)!;
    const unreadListeners = globalUnreadListeners.get(userId)!;

    statusListeners.add(setConnected);
    unreadListeners.add(setUnreadCount);

    // Sync current values immediately
    if (globalConnectedStatus.has(userId)) {
      setConnected(!!globalConnectedStatus.get(userId));
    }
    if (globalUnreadCounts.has(userId)) {
      setUnreadCount(globalUnreadCounts.get(userId) || 0);
    }

    const socket = getOrCreateSocket(userId, () => userTypeRef.current);

    // If socket is already connected, fetch fresh unread count
    if (socket.connected) {
      setConnected(true);
      socket.emit('getUnreadCount', { userId, userType: userTypeRef.current }, (response: any) => {
        if (response?.success && typeof response.count === 'number') {
          globalUnreadCounts.set(userId, response.count);
          unreadListeners.forEach((cb) => cb(response.count));
        }
      });
    }

    return () => {
      statusListeners.delete(setConnected);
      unreadListeners.delete(setUnreadCount);
    };
  }, [userId]);

  const sendMessage = useCallback((data: {
    chatId: string;
    content: string;
    senderId: string;
    senderType: 'visitor' | 'vendor';
  }) => {
    return new Promise((resolve, reject) => {
      const uid = userIdRef.current;
      const socket = uid ? globalSockets.get(uid) : null;
      if (socket?.connected) {
        socket.emit('sendMessage', data, (response: any) => {
          if (response?.success) resolve(response.message);
          else reject(new Error(response?.error || 'Failed to send message'));
        });
      } else {
        reject(new Error('Socket not connected'));
      }
    });
  }, []);

  const joinChat = useCallback((chatId: string) => {
    const uid = userIdRef.current;
    const socket = uid ? globalSockets.get(uid) : null;
    if (socket?.connected) {
      socket.emit('joinChat', { chatId, userId: uid });
    }
  }, []);

  const leaveChat = useCallback((chatId: string) => {
    const uid = userIdRef.current;
    const socket = uid ? globalSockets.get(uid) : null;
    if (socket?.connected) {
      socket.emit('leaveChat', { chatId });
    }
  }, []);

  const markAsRead = useCallback((chatId: string) => {
    const uid = userIdRef.current;
    const socket = uid ? globalSockets.get(uid) : null;
    const utype = userTypeRef.current;
    if (socket?.connected && uid) {
      socket.emit('markAsRead', { chatId, userId: uid, userType: utype }, (response: any) => {
        if (response?.success && typeof response.unreadCount === 'number') {
          globalUnreadCounts.set(uid, response.unreadCount);
          globalUnreadListeners.get(uid)?.forEach((cb) => cb(response.unreadCount));
        }
      });
    }
  }, []);

  const onNewMessage = useCallback((callback: (data: any) => void) => {
    const uid = userIdRef.current;
    if (!uid) return () => {};
    if (!globalMessageListeners.has(uid)) {
      globalMessageListeners.set(uid, new Set());
    }
    const listeners = globalMessageListeners.get(uid)!;
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
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
