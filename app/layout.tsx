import type { Metadata } from 'next';
import './globals.css';
import './scrapbook.css';
export const metadata: Metadata = { title: '开口日记 · say it', description: '给日常留一点开口的机会，留下喜欢的表达，也为重要的话提前准备。' };
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="zh-CN"><body>{children}</body></html> }
