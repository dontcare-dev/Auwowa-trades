import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'Aurora Trades' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><style>{`
    body { background-color: #050507; color: white; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 8px; }
    .glass-card { background: rgba(18,18,22,0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
    .auth-input { background: #18181b; border: 1px solid #2a2a2e; }
    .auth-input:focus { outline: none; border-color: #4f46e5; }
  `}</style><script src="https://cdn.tailwindcss.com"></script>{children}</body></html>)
}
