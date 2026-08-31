"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/Navbar";

export const ClientLayout = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthProvider>
      <Navbar />
      <div className="flex-1">{children}</div>
    </AuthProvider>
  );
};
