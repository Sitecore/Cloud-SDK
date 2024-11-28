'use client';

import Navbar from '../components/Navbar';
import './global.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <div className='flex'>
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
