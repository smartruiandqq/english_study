import { useState } from 'react'
import { translate, getImage, getAudioUrl } from '../services/api'

const GREETINGS = [
  "Hi, Explorer! 今天你想发现什么新物种？",
  "嘿小探险家！今天想查什么词？",
  "欢迎来到词典岛！有什么想了解的？",
]

const SAMPLE_MESSAGES = [
  "Wow! 你发现了 Tiger！它看起来超酷的！",
  "太棒了！你又学会了一个新词！",
  "太厉害了，继续探索吧！",
]

export default function MagicSearch({ lastResult, lastImage, onCollect, onResultChange }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(lastResult || null)
  const [image, setImage] = useState(lastImage || null)
  const [message, setMessage] = useState(GREETINGS[0])
  const [audioUrls, setAudioUrls] = useState({})
  const [collected, setCollected] = useState(false)
  const [isListening, setIsListening] = useState(false)

  // 语音输入
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setMessage("抱歉，您的浏览器不支持语音输入")
      return
    }

    if (isListening) {
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = false
    recognition.interimResults = false

    setIsListening(true)
    setMessage("🎤 正在听...")

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
      setMessage("听到了！" + transcript)
      // 自动搜索
      setTimeout(() => handleSearchWithInput(transcript), 500)
    }

    recognition.onerror = () => {
      setIsListening(false)
      setMessage("没听清楚，再试一次吧")
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleSearchWithInput = (searchInput) => {
    if (!searchInput.trim() || loading) return
    setLoading(true)
    setResult(null)
    setImage(null)
    setCollected(false)
    setAudioUrls({})

    translate(searchInput.trim(), 'zh2en')
      .then((translateRes) => {
        setResult(translateRes.data)
        onResultChange?.(translateRes.data, null)

        getImage(searchInput.trim())
          .then((imageRes) => {
            setImage(imageRes.data)
            onResultChange?.(translateRes.data, imageRes.data)
          })
          .catch(() => {})

        setTimeout(() => {
          setMessage(SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)])
        }, 300)
      })
      .catch(() => {
        setMessage("嗯？出了点小问题，再试一次吧！")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleSearch = () => {
    if (!input.trim() || loading) return
    handleSearchWithInput(input.trim())
  }

  const playAudio = async (text, key) => {
    if (audioUrls[key]) {
      new Audio(audioUrls[key]).play()
      return
    }
    const audio = new Audio(getAudioUrl(text))
    audio.play()
    setAudioUrls((prev) => ({ ...prev, [key]: getAudioUrl(text) }))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleCollect = () => {
    if (!result || collected) return
    onCollect({
      word: result.word,
      phonetic: result.phonetic_blocks.join('-'),
      mnemonic: result.mnemonic,
      image: image?.url,
    })
    setCollected(true)
    setMessage("捕捉成功！这个单词已收入你的图鉴！")
  }

  return (
    <div className="space-y-4">
      {/* 欢迎语 */}
      <div className="text-center">
        <p className="text-white/90 text-sm">{message}</p>
      </div>

      {/* 搜索框 */}
      <div className="bg-white rounded-3xl shadow-xl p-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入中文单词，如：老虎"
          className="flex-1 px-6 py-4 rounded-2xl text-lg outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition disabled:opacity-50"
        >
          {loading ? '...' : '🔍'}
        </button>
        <button
          onClick={startVoiceInput}
          disabled={loading || isListening}
          className={`bg-pink-400 text-white px-6 py-4 rounded-2xl font-bold text-lg transition ${
            isListening ? 'animate-pulse' : 'hover:bg-pink-500'
          } disabled:opacity-50`}
        >
          {isListening ? '🎤' : '🎙️'}
        </button>
      </div>

      {/* 结果区 */}
      {(result || loading) && (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <div className="text-4xl mb-2">🌀</div>
              <p>正在发现新物种...</p>
            </div>
          ) : result ? (
            <>
              {/* 图片 */}
              {image && (
                <div className="relative h-48 bg-gray-100">
                  <img src={image.url} alt={result.word} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    📷 {image.credit.name}
                  </div>
                </div>
              )}

              {/* 单词 */}
              <div className="p-6 text-center">
                <h2 className="text-4xl font-extrabold text-primary mb-2">{result.word}</h2>

                {/* 谐音助记 */}
                {result.mnemonic && (
                  <div className="mb-4">
                    <span className="bg-pink-100 text-pink-600 font-bold px-4 py-2 rounded-full text-lg">
                      💬 {result.mnemonic}
                    </span>
                  </div>
                )}

                {/* Phonics 音节块 */}
                {result.phonetic_blocks.length > 0 && (
                  <div className="flex justify-center gap-2 flex-wrap mb-4">
                    {result.phonetic_blocks.map((block, i) => (
                      <button
                        key={i}
                        onClick={() => playAudio(block, `block-${i}`)}
                        className="bg-accent text-white font-bold text-xl px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                      >
                        {block}
                      </button>
                    ))}
                  </div>
                )}

                {/* 播放单词发音 */}
                <button
                  onClick={() => playAudio(result.word, 'word')}
                  className="bg-secondary text-white px-6 py-2 rounded-full font-bold text-sm mb-4 inline-flex items-center gap-2 hover:scale-105 transition"
                >
                  🔊 发音
                </button>

                {/* 例句 */}
                {result.sentence && (
                  <div className="bg-sky/20 rounded-2xl p-4">
                    <p className="text-primary font-semibold text-lg mb-1">{result.sentence}</p>
                    <p className="text-gray-500 text-sm mb-2">{result.sentence_translation}</p>
                    <button
                      onClick={() => playAudio(result.sentence, 'sentence')}
                      className="text-xs text-secondary font-bold"
                    >
                      🔊 听例句
                    </button>
                  </div>
                )}

                {/* 捕捉按钮 */}
                <button
                  onClick={handleCollect}
                  disabled={collected}
                  className={`mt-4 px-8 py-3 rounded-full font-bold text-lg transition-all ${
                    collected
                      ? 'bg-gray-300 text-gray-500 cursor-default'
                      : 'bg-island text-white hover:scale-105 shadow-lg'
                  }`}
                >
                  {collected ? '✅ 已捕捉' : '✨ 捕捉到图鉴'}
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}