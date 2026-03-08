import React from 'react';

export default function NavbarRoot({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div role="banner" className={className}>{children}</div>;
}
