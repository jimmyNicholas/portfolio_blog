import './globals.css';
import type { Metadata } from 'next';
import Layout from './components/Layout'; 

export const metadata: Metadata = {
  title: 'Jimmy Nicholas',
  description: 'Personal portfolio of Jimmy Nicholas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen ">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
