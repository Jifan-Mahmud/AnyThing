import './globals.css';
import ClientProviders from '../components/providers/ClientProviders';

export const metadata = {
  title: 'AnyThing - Connect, Share & Express Yourself',
  description: 'AnyThing is a modern, ultra-smooth social media platform for photos, reels, stories, real-time messaging, and calling.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-darker text-white antialiased min-h-screen">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
