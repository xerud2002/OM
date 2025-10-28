// components/layout/Layout.tsx
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
