import { Inter } from 'next/font/google';
import './globals.css';
import 'tailwindcss/tailwind.css';
import { Toaster } from 'react-hot-toast';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mentify',
  description: 'Generated by create next app'
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang='en' className='light'>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Toaster position='bottom-center' toastOptions={{ className: 'text-xs', duration: 3500, style: {background: '#404040', color: '#EBEBEB'} }} />
          <link rel='icon' href='/favicon.ico' />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}