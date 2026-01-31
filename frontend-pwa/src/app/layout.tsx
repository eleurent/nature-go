import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { ObservationProvider } from '@/contexts/ObservationContext';
import { QuizProvider } from '@/contexts/QuizContext';

export const metadata: Metadata = {
  title: 'Nature GO',
  description: 'A wildlife identification game — become a 19th century naturalist',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nature GO',
  },
};

export const viewport: Viewport = {
  themeColor: '#660000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <AuthProvider>
          <UserProfileProvider>
            <ObservationProvider>
              <QuizProvider>
                {children}
              </QuizProvider>
            </ObservationProvider>
          </UserProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
