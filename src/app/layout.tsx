import type { Metadata } from "next"
import { Toaster } from "sonner"
import { SessionProvider } from "@/components/layout/SessionProvider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Congo Soldes - La qualité au petit prix",
    template: "%s | Congo Soldes",
  },
  description:
    "La plateforme congolaise des bonnes affaires. Trouvez les meilleures promotions, réductions et soldes près de chez vous à Brazzaville, Pointe-Noire et partout au Congo.",
  keywords: [
    "promotions", "soldes", "Congo", "Brazzaville", "Pointe-Noire",
    "bonnes affaires", "réductions", "shopping", "magasins", "commerces",
  ],
  openGraph: {
    title: "Congo Soldes - La qualité au petit prix",
    description: "Trouvez les meilleures promotions près de chez vous au Congo",
    type: "website",
    locale: "fr_FR",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
