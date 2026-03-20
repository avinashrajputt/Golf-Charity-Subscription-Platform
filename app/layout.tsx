import '../styles/globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Golf Charity - Earn, Win, Give',
  description: 'Track your golf scores, win monthly prizes, and support charities you care about.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
