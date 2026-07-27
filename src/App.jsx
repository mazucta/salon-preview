import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Pricing from './components/Pricing'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'

export default function App() {
  const { i18n } = useTranslation()

  // Keep <html lang> in sync with the active language for a11y / SEO
  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage
  }, [i18n.resolvedLanguage])

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </MotionConfig>
  )
}
