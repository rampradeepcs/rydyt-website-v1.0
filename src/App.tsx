import { useState, useCallback } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Intro from './components/Intro'
import HowItWorks from './components/HowItWorks'
import RideJourney from './components/RideJourney'
import Features from './components/Features'
import HudMode from './components/HudMode'
import Stats from './components/Stats'
import Community from './components/Community'
import DownloadCTA from './components/DownloadCTA'
import Footer from './components/Footer'
import BetaModal from './components/BetaModal'

export default function App() {
  const [ready, setReady] = useState(false)
  const onLoaderDone = useCallback(() => setReady(true), [])

  useSmoothScroll(ready)

  return (
    <>
      <Loader onDone={onLoaderDone} />
      <BetaModal />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Intro />
        <HowItWorks />
        <RideJourney />
        <Features />
        <HudMode />
        <Stats />
        <Community />
        <DownloadCTA />
        <Footer />
      </main>
    </>
  )
}
