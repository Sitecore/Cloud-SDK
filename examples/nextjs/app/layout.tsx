import { DM_Sans as fontSans } from 'next/font/google';
import { CloudSDKComponent } from '../components/Cloudsdk';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { AuthProvider } from '../context/Auth';
import { CartProvider } from '../context/Cart';
import { SearchProvider } from '../context/Search';
import './global.css';

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
              <SearchProvider>
                <Header />
                <Sidebar />
                {children}
                <Footer />
              </SearchProvider>
            </CartProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
