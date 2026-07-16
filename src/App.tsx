import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import QrGenerator from './components/QrGenerator'

function App() {
  return (
    <div className="min-h-screen bg-paper px-5 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Header />
        <main>
          <Hero />
          <QrGenerator />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
