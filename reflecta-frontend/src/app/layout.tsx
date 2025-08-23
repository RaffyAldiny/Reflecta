import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = { title: 'Reflecta', description: 'Your private journal' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-neutral-950 text-neutral-100 antialiased">
        {/* session-aware nav */}
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-neutral-500">
          Built with Django + Next.js · Reflecta
        </footer>
      </body>
    </html>
  );
}
