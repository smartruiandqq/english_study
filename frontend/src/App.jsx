import { useState } from 'react'
import MagicSearch from './pages/MagicSearch'
import Collection from './pages/Collection'

function App() {
  const [page, setPage] = useState('search')
  const [collectedWords, setCollectedWords] = useState([])
  const [lastResult, setLastResult] = useState(null)
  const [lastImage, setLastImage] = useState(null)

  return (
    <div className="min-h-screen">
      <nav className="flex justify-center gap-4 pt-6 pb-4">
        <button
          onClick={() => setPage('search')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
            page === 'search'
              ? 'bg-primary text-white shadow-lg scale-105'
              : 'bg-white/40 text-white hover:bg-white/60'
          }`}
        >
          魔法搜索
        </button>
        <button
          onClick={() => setPage('collection')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1 ${
            page === 'collection'
              ? 'bg-island text-white shadow-lg scale-105'
              : 'bg-white/40 text-white hover:bg-white/60'
          }`}
        >
          词灵图鉴
          <span className="bg-white/30 text-xs px-1.5 py-0.5 rounded-full">
            {collectedWords.length}
          </span>
        </button>
      </nav>

      <main className="max-w-2xl mx-auto px-4 pb-8">
        {page === 'search' && (
          <MagicSearch
            lastResult={lastResult}
            lastImage={lastImage}
            onCollect={(word) => setCollectedWords((prev) => [...prev, word])}
            onResultChange={(result, image) => {
              setLastResult(result)
              setLastImage(image)
            }}
          />
        )}
        {page === 'collection' && <Collection words={collectedWords} />}
      </main>
    </div>
  )
}

export default App