import { DM_Sans as fontSans } from 'next/font/google';
import { CartProvider } from '../contexts/cart';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import './global.css';

import { CloudSDKComponent } from '../components/cloudsdk';

const font = fontSans({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={font.className}
      lang='en'>
      <body>
        <CloudSDKComponent />
        <div>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
