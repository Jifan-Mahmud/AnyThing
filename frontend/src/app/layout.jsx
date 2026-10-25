import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import ClientProviders from '../components/providers/ClientProviders';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata = {
  title: 'AnyThing - Connect, Share & Express Yourself',
  description: 'AnyThing is a modern, ultra-smooth social media platform for photos, reels, stories, real-time messaging, and calling.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakarta.variable} ${jakarta.className} bg-bg-darker text-white antialiased min-h-screen selection:bg-primary-pink selection:text-white`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
