import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, JetBrains_Mono, Overpass } from 'next/font/google';
import { Header } from '@/components/Header';
import { ProgressProvider } from '@/components/ProgressProvider';
import { themeScript } from '@/components/ThemeToggle';
import './globals.css';

const barlow = Barlow_Condensed({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-barlow', display: 'swap' });
const overpass = Overpass({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-overpass', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-jetbrains', display: 'swap' });

const description = 'Learn DSA from zero to dynamic programming on a metro map: 18 interactive stations, fill-the-DP-table games, and a beginner-to-advanced study guide with LeetCode, Codeforces, CSES and AtCoder problems.';

export const metadata: Metadata = {
  title: { default: 'DSA Metro', template: '%s · DSA Metro' },
  description,
  openGraph: { title: 'DSA Metro', description, type: 'website' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#151d27' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${overpass.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ProgressProvider>
          <Header />
          <main id="main">{children}</main>
          <footer className="foot wrap">
            <p>Progress is saved in this browser. Practice problems open on LeetCode, Codeforces, CSES or AtCoder in a new tab; tick them here when you get Accepted.</p>
            <p>Source on <a href="https://github.com/harshdeepsingh888-ps/dsa-metro" target="_blank" rel="noopener">GitHub</a>.</p>
          </footer>
        </ProgressProvider>
      </body>
    </html>
  );
}
