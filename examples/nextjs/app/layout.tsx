'use client';

import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { DM_Sans as fontSans } from 'next/font/google';
import './global.css';
import { Sidebar } from '../components/sidebar';
import { CartProvider } from '../contexts/cart';

// If loading a variable font, you don't need to specify the font weight
const font = fontSans({
  subsets: ['latin']
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={font.className}
      lang='en'>
      <body>
        <CartProvider>
          <Header />
          <Sidebar />
          {children}
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
