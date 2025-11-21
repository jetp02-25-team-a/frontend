'use client';

import React from 'react';
import { createPortal } from 'react-dom';

export function Dialog({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {children}
    </div>,
    document.body
  );
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl animate-fadeIn">
      {children}
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>;
}
