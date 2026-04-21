import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Loony Heads Vanguard',
  description: 'Zero-Knowledge AI Sales Force',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
