import { DM_Sans as fontSans } from 'next/font/google';
import { CartProvider } from '../context/Cart';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import './global.css';

import { CloudSDKComponent } from '../components/Cloudsdk';
import { AuthProvider } from '../context/Auth';
import { Sidebar } from '../components/Sidebar';

const font = fontSans({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={font.className}
      lang='en'>
      <body>
        <CloudSDKComponent />
        <div>
          <AuthProvider>
            <CartProvider>
              <Header />
              <Sidebar />
              {children}
              <Footer />
            </CartProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
