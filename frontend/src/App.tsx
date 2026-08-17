import PortalLoader from './components/PortalLoader'
import CustomCursor from './components/CustomCursor'
import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import Skills from './components/Skills'
import Education from './components/Education'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen bg-void bg-noise">
      <Navbar />
      <CustomCursor />
      <ParticleField />

      <main className="relative z-10">
        <Hero />
        <Stats />
        <About />
        <Skills />
        <Education />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />

      <PortalLoader />
    </div>
  )
}
