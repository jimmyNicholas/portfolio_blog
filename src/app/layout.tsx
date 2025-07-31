import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './components/ThemeProvider';
import Layout from './components/Layout'; 
import { DynamicFavicon } from './components/DynamicFavicon';

export const metadata: Metadata = {
  title: 'Jimmy Nicholas',
  description: 'Personal portfolio of Jimmy Nicholas',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen ">
        <ThemeProvider>
          <DynamicFavicon />
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
