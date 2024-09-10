import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes"
import { CustomAlert } from "@/components/ui/custom-alert";
import { Toaster } from 'react-hot-toast';
import { useEffect } from "react";
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      const { theme } = JSON.parse(savedSettings)
      document.documentElement.className = theme
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'transparent',
            padding: 0,
            boxShadow: 'none',
          },
        }}
      >
        {(t) => (
          <CustomAlert
            title={t.type === 'error' ? 'Error' : 'Success'}
            description={t.message as string}
            variant={t.type === 'error' ? 'destructive' : 'default'}
          />
        )}
      </Toaster>
    </ThemeProvider>
  );
}
