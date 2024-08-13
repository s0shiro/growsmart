import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { ThemeProvider } from '@/providers/ThemeProvider'
import QueryProvider from '@/providers/QueryProvider'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'GrowSmart',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={GeistSans.className}>
      <body className='bg-background text-foreground '>
        <main className='min-h-screen'>
          <QueryProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </main>
      </body>
    </html>
  )
}
