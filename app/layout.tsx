import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { ThemeProvider } from '@/components/MyComponents/shadcn/ThemeProvider'
import NavBar from '@/components/Navbar'

export const metadata = {
  title: 'Supabase Next Auth',
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
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <NavBar />
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}
