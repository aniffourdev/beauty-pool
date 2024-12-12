// src/components/SessionProviderWrapper.tsx
"use client"; // This directive ensures the component is treated as a client component

import { SessionProvider } from "next-auth/react";
import React from "react";

interface SessionProviderWrapperProps {
  children: React.ReactNode;
}

const SessionProviderWrapper: React.FC<SessionProviderWrapperProps> = ({
  children,
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
