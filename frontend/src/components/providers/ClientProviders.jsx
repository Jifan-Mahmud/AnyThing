'use client';

import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { SocketProvider } from '../../context/SocketContext';
import { CallProvider } from '../../context/CallContext';
import CallOverlay from '../messages/CallOverlay';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <CallProvider>
          {children}
          <CallOverlay />
          <ToastContainer theme="dark" position="bottom-right" />
        </CallProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
