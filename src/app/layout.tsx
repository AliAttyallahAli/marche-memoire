import type {Metadata} from 'next';
import { Inter } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'N+',
  description: 'Un système de gestion des ressources humaines moderne.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`h-full ${inter.variable}`}>
      <body className="font-body antialiased h-full">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
