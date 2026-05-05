import axios from 'axios'

// 本地开发用 /api，生产环境用环境变量或留空
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
})

export const translate = (text, mode = 'zh2en') =>
  api.post('/translate/', { text, mode })

export const getImage = (query) =>
  api.post('/image/', { query })

export const getVoices = () =>
  api.get('/tts/voices')

export const getAudioUrl = (text, voice = 'en-US-AriaNeural') =>
  `${BASE_URL}/tts/?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}`

export default api