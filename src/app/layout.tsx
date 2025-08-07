import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Young Life CRUD Admin',
  description: 'Generic Next.js CRUD application with Xano integration',
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