import Link from 'next/link';
import React from 'react';
interface TemplatesHeaderProps {
  prev: string;
  next: string;
}
function TemplatesHeader({ prev, next }: TemplatesHeaderProps) {
  return (
    <header style={{ marginBottom: 16 }}>
      <h2>Web Experiences Templates</h2>
      <div style={{ display: 'flex', maxWidth: '600px' }}>
        <Link href='/'>← Back to home</Link>
        <div style={{ flex: 'auto' }} />
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
          <Link href={prev}>← Prev</Link>
          <span style={{ padding: '0 8px' }}>{' | '}</span>
          <Link href={next}>Next →</Link>
        </div>
      </div>
    </header>
  );
}

export default TemplatesHeader;
