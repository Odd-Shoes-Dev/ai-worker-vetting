import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Worker Vetting',
  description: 'Adaptive AI interviews for faster hiring.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00509B] flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold tracking-tight">AI</span>
              </div>
              <span className="font-semibold text-gray-900 text-sm">AI Worker Vetting</span>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Demo</span>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="text-center py-6 text-xs text-gray-400">
          Demo system for AI-assisted recruitment.
        </footer>
      </body>
    </html>
  )
}
