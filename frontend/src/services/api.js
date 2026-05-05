import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const translate = (text, mode = 'zh2en') =>
  api.post('/translate/', { text, mode })

export const getImage = (query) =>
  api.post('/image/', { query })

export const getVoices = () =>
  api.get('/tts/voices')

export const getAudioUrl = (text, voice = 'en-US-AriaNeural') =>
  `/api/tts/?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}`

export default api