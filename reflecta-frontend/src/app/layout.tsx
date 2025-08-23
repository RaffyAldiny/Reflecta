// src/app/layout.tsx
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = { title: 'Reflecta', description: 'Your private journal' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased gx-bg">
        {/* put behind page-level backgrounds */}
        <div className="gx-stars -z-10" aria-hidden="true" />
        {/* @ts-expect-error Async Server Component */}
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-xs text-neutral-400">
          Built with Django + Next.js · Reflecta
        </footer>
      </body>
    </html>
  );
}
